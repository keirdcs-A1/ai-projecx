"use strict";

const API_URL = "https://en.wikipedia.org/w/api.php";
const ROUND_LENGTH_MS = 180_000;
const REQUEST_TIMEOUT_MS = 20_000;
const MIN_ARTICLE_BYTES = 10_000;
const MAX_RENDERED_CHARACTERS = 90_000;

const BLOCKED_SELECTORS = [
  "script", "style", "link", "meta", "form", "input", "button", "textarea", "select",
  "iframe", "object", "embed", "audio", "video", "img", "picture", "figure", "table",
  ".mw-editsection", ".mw-empty-elt", ".shortdescription", ".hatnote", ".metadata",
  ".ambox", ".navbox", ".vertical-navbox", ".sidebar", ".infobox", ".thumb",
  ".sistersitebox", ".portal", ".reflist", ".references", ".catlinks", "sup.reference"
].join(",");

const ALLOWED_TAGS = new Set([
  "P", "H2", "H3", "H4", "UL", "OL", "LI", "B", "STRONG", "I", "EM", "SPAN",
  "SMALL", "BLOCKQUOTE", "SUP", "SUB", "DL", "DT", "DD", "CODE", "ABBR", "A", "BR"
]);

const state = {
  phase: "loading",
  startTitle: "",
  targetTitle: "",
  currentTitle: "",
  currentArticle: null,
  history: [],
  backStack: [],
  moves: 0,
  startTime: null,
  deadline: null,
  timerId: null,
  requestId: 0,
  pendingNavigation: null,
  navigationError: null
};

const elements = {
  challenge: document.querySelector("[aria-labelledby=challenge-title]"),
  startTitle: document.querySelector("#start-title"),
  targetTitle: document.querySelector("#target-title"),
  challengeMessage: document.querySelector("#challenge-message"),
  rerollButton: document.querySelector("#reroll-button"),
  startButton: document.querySelector("#start-button"),
  newGameButton: document.querySelector("#new-game-button"),
  game: document.querySelector("#game"),
  timer: document.querySelector("#timer"),
  timerFill: document.querySelector("#timer-fill"),
  progress: document.querySelector("[role='progressbar']"),
  moveCount: document.querySelector("#move-count"),
  liveTarget: document.querySelector("#live-target"),
  backButton: document.querySelector("#back-button"),
  pageStatus: document.querySelector("#page-status"),
  article: document.querySelector(".article"),
  articleTitle: document.querySelector("#article-title"),
  articleContent: document.querySelector("#article-content"),
  articleLoading: document.querySelector("#article-loading"),
  articleError: document.querySelector("#article-error"),
  articleErrorMessage: document.querySelector("#article-error-message"),
  retryPageButton: document.querySelector("#retry-page-button"),
  trailCount: document.querySelector("#trail-count"),
  routeHistory: document.querySelector("#route-history"),
  result: document.querySelector("#result"),
  resultKicker: document.querySelector("#result-kicker"),
  resultTitle: document.querySelector("#result-title"),
  resultSummary: document.querySelector("#result-summary"),
  resultTime: document.querySelector("#result-time"),
  resultMoves: document.querySelector("#result-moves"),
  resultPages: document.querySelector("#result-pages"),
  playAgainButton: document.querySelector("#play-again-button"),
  fatalError: document.querySelector("#fatal-error"),
  fatalErrorMessage: document.querySelector("#fatal-error-message"),
  tryAgainButton: document.querySelector("#try-again-button"),
  announcer: document.querySelector("#announcer")
};

function buildApiUrl(parameters) {
  const url = new URL(API_URL);
  const defaults = { format: "json", formatversion: "2", origin: "*" };
  Object.entries({ ...defaults, ...parameters }).forEach(([key, value]) => {
    url.searchParams.set(key, String(value));
  });
  return url;
}

async function fetchJson(url) {
  const controller = new AbortController();
  const timeout = window.setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
  try {
    const response = await fetch(url, { credentials: "omit", referrerPolicy: "no-referrer", signal: controller.signal, headers: { Accept: "application/json" } });
    if (!response.ok) throw new Error(`Wikipedia returned HTTP ${response.status}.`);
    const reader = response.body?.getReader();
    if (!reader) throw new Error("Wikipedia returned an empty response.");
    const chunks = []; let bytes = 0;
    try { while (true) { const {done, value} = await reader.read(); if (done) break; bytes += value.length; if (bytes > 2_000_000) { await reader.cancel(); throw new Error("This Wikipedia article is too large for the sprint."); } chunks.push(value); } } finally { reader.releaseLock(); }
    const buffer = new Uint8Array(bytes); let offset = 0; for (const chunk of chunks) { buffer.set(chunk, offset); offset += chunk.length; }
    const data = JSON.parse(new TextDecoder().decode(buffer));
    if (!data || typeof data !== "object" || data.error) {
      throw new Error(data?.error?.info || "Wikipedia returned an invalid response.");
    }
    return data;
  } catch (error) {
    if (error.name === "AbortError") throw new Error("Wikipedia took too long to respond.");
    throw error;
  } finally {
    window.clearTimeout(timeout);
  }
}

function isDisambiguation(page) {
  return Boolean(page.pageprops && Object.prototype.hasOwnProperty.call(page.pageprops, "disambiguation"));
}

async function fetchRandomPair() {
  for (let attempt = 0; attempt < 3; attempt += 1) {
    const data = await fetchJson(buildApiUrl({
      action: "query",
      generator: "random",
      grnnamespace: 0,
      grnfilterredir: "nonredirects",
      grnminsize: MIN_ARTICLE_BYTES,
      grnlimit: 10,
      prop: "info|pageprops"
    }));

    const candidates = (data.query?.pages || []).filter(page => (
      page && page.ns === 0 && !page.missing && !page.redirect && !isDisambiguation(page)
    ));

    const unique = [...new Map(candidates.map(page => [page.title, page])).values()];
    if (unique.length >= 2) return [unique[0].title, unique[1].title];
  }
  throw new Error("Wikipedia did not return two suitable random articles.");
}

async function fetchArticle(title) {
  const data = await fetchJson(buildApiUrl({
    action: "parse",
    page: title,
    redirects: 1,
    prop: "text|links|displaytitle",
    disableeditsection: 1
  }));

  const parsed = data.parse;
  if (!parsed || typeof parsed.title !== "string" || typeof parsed.text !== "string") {
    throw new Error("Wikipedia returned an incomplete article.");
  }

  const allowedLinks = new Map();
  for (const link of parsed.links || []) {
    const exists = Object.prototype.hasOwnProperty.call(link, "exists");
    if (link.ns === 0 && exists && typeof link.title === "string") {
      allowedLinks.set(link.title, link.title);
    }
  }

  return {
    title: parsed.title,
    displayTitle: stripMarkup(parsed.displaytitle || parsed.title),
    html: parsed.text,
    allowedLinks
  };
}

function stripMarkup(value) {
  const doc = new DOMParser().parseFromString(String(value), "text/html");
  return doc.body.textContent?.trim() || String(value);
}

function sanitiseArticle(article) {
  const sourceDocument = new DOMParser().parseFromString(article.html, "text/html");
  sourceDocument.querySelectorAll(BLOCKED_SELECTORS).forEach(node => node.remove());
  const sourceRoot = sourceDocument.querySelector(".mw-parser-output") || sourceDocument.body;
  const fragment = document.createDocumentFragment();
  let characterCount = 0;
  let nodeCount = 0;

  function copyNode(node, parent, depth = 0) {
    nodeCount += 1;
    if (characterCount >= MAX_RENDERED_CHARACTERS || nodeCount > 30000 || depth > 60) return;

    if (node.nodeType === Node.TEXT_NODE) {
      const text = node.textContent || "";
      const remaining = MAX_RENDERED_CHARACTERS - characterCount;
      const clipped = text.slice(0, remaining);
      parent.append(document.createTextNode(clipped));
      characterCount += clipped.length;
      return;
    }

    if (node.nodeType !== Node.ELEMENT_NODE) return;
    const tagName = node.tagName.toUpperCase();

    if (!ALLOWED_TAGS.has(tagName)) {
      [...node.childNodes].forEach(child => copyNode(child, parent, depth + 1));
      return;
    }

    if (tagName === "A") {
      const title = node.getAttribute("title");
      const canonicalLink = title ? article.allowedLinks.get(title) : null;
      if (canonicalLink) {
        const button = document.createElement("button");
        button.type = "button";
        button.className = "article-link";
        button.dataset.articleTitle = canonicalLink;
        button.textContent = node.textContent || canonicalLink;
        parent.append(button);
        characterCount += button.textContent.length;
      } else {
        [...node.childNodes].forEach(child => copyNode(child, parent, depth + 1));
      }
      return;
    }

    const clean = document.createElement(tagName.toLowerCase());
    if (tagName === "ABBR") {
      const label = node.getAttribute("title");
      if (label) clean.setAttribute("title", label);
    }
    parent.append(clean);
    [...node.childNodes].forEach(child => copyNode(child, clean, depth + 1));
  }

  [...sourceRoot.childNodes].forEach(node => copyNode(node, fragment));
  return fragment;
}

function setPhase(phase) {
  state.phase = phase;
  const isPlaying = phase === "playing";
  elements.articleContent.querySelectorAll(".article-link").forEach(link => { link.disabled = !isPlaying; });
  elements.backButton.disabled = !isPlaying || state.backStack.length === 0 || Boolean(state.pendingNavigation);
}

function announce(message) {
  elements.announcer.textContent = "";
  window.setTimeout(() => { elements.announcer.textContent = message; }, 30);
}

function formatDuration(milliseconds, countdown = false) {
  const totalSeconds = countdown ? Math.ceil(milliseconds / 1000) : Math.floor(milliseconds / 1000);
  const safeSeconds = Math.max(0, totalSeconds);
  const minutes = Math.floor(safeSeconds / 60);
  const seconds = safeSeconds % 60;
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

function renderTimer(now = performance.now()) {
  const remaining = state.deadline === null ? ROUND_LENGTH_MS : Math.max(0, state.deadline - now);
  elements.timer.textContent = formatDuration(remaining, true);
  const seconds = Math.ceil(remaining / 1000);
  const ratio = Math.max(0, Math.min(1, remaining / ROUND_LENGTH_MS));
  elements.timerFill.style.width = `${ratio * 100}%`;
  elements.timerFill.classList.toggle("urgent", remaining <= 30_000);
  elements.progress.setAttribute("aria-valuenow", String(seconds));
  return remaining;
}

function startTimer() {
  stopTimer();
  state.startTime = performance.now();
  state.deadline = state.startTime + ROUND_LENGTH_MS;
  renderTimer(state.startTime);
  state.timerId = window.setInterval(() => {
    if (state.phase !== "playing") return;
    const remaining = renderTimer();
    if (remaining <= 0) finishRound(false);
  }, 100);
}

function stopTimer() {
  if (state.timerId !== null) window.clearInterval(state.timerId);
  state.timerId = null;
}

function renderHistory() {
  elements.routeHistory.replaceChildren();
  state.history.forEach(title => {
    const item = document.createElement("li");
    item.textContent = title;
    elements.routeHistory.append(item);
  });
  const pageLabel = state.history.length === 1 ? "page" : "pages";
  elements.trailCount.textContent = `${state.history.length} ${pageLabel}`;
  elements.moveCount.textContent = String(state.moves);
}

function renderArticle(article) {
  const source = `https://en.wikipedia.org/wiki/${encodeURIComponent(article.title.replaceAll(" ", "_"))}`;
  document.querySelector("#article-source").href = source;
  document.querySelector("#article-history").href = source + "?action=history";
  state.currentArticle = article;
  state.currentTitle = article.title;
  elements.articleTitle.textContent = article.displayTitle;
  elements.articleContent.replaceChildren(sanitiseArticle(article));
  elements.articleContent.hidden = false;
  elements.articleLoading.hidden = true;
  elements.articleError.hidden = true;
  elements.article.setAttribute("aria-busy", "false");
  elements.articleContent.querySelectorAll(".article-link").forEach(link => {
    link.disabled = state.phase !== "playing";
  });
}

function showArticleLoading(title) {
  elements.article.setAttribute("aria-busy", "true");
  elements.articleContent.hidden = true;
  elements.articleError.hidden = true;
  elements.articleLoading.hidden = false;
  elements.articleTitle.textContent = title;
  elements.pageStatus.textContent = `Loading ${title}…`;
}

function showNavigationError(error) {
  state.navigationError = error;
  elements.article.setAttribute("aria-busy", "false");
  elements.articleLoading.hidden = true;
  elements.articleContent.hidden = true;
  elements.articleError.hidden = false;
  elements.articleErrorMessage.textContent = error.message || "This article could not be loaded.";
  elements.pageStatus.textContent = "Article failed to load. The clock is still running.";
  announce("Article failed to load. Retry is available and the clock is still running.");
}

async function loadChallenge() {
  document.querySelector("#live-intro").hidden = true;
  stopTimer();
  state.requestId += 1;
  const requestId = state.requestId;
  state.phase = "loading";
  state.startTitle = "";
  state.targetTitle = "";
  state.currentTitle = "";
  state.currentArticle = null;
  state.history = [];
  state.backStack = [];
  state.moves = 0;
  state.startTime = null;
  state.deadline = null;
  state.pendingNavigation = null;
  state.navigationError = null;

  elements.challenge.hidden = false;
  elements.game.hidden = true;
  elements.result.hidden = true;
  elements.fatalError.hidden = true;
  elements.newGameButton.hidden = true;
  elements.startTitle.textContent = "Finding an article…";
  elements.targetTitle.textContent = "Finding an article…";
  elements.challengeMessage.textContent = "Loading a live Wikipedia challenge.";
  elements.rerollButton.disabled = true;
  elements.startButton.disabled = true;
  elements.startButton.textContent = "Start sprint";

  try {
    const [startTitle, targetTitle] = await fetchRandomPair();
    if (requestId !== state.requestId) return;
    state.startTitle = startTitle;
    state.targetTitle = targetTitle;
    elements.startTitle.textContent = startTitle;
    elements.targetTitle.textContent = targetTitle;
    elements.challengeMessage.textContent = "Preparing the starting article…";

    const article = await fetchArticle(startTitle);
    if (requestId !== state.requestId) return;
    state.startTitle = article.title;
    renderArticle(article);
    setPhase("ready");
    elements.startTitle.textContent = article.title;
    elements.challengeMessage.textContent = "Your starting article is ready. Reroll or begin when you are ready.";
    elements.rerollButton.disabled = false;
    elements.startButton.disabled = false;
    announce(`Challenge ready. Start at ${article.title} and reach ${targetTitle}.`);
  } catch (error) {
    if (requestId !== state.requestId) return;
    state.phase = "error";
    elements.challenge.hidden = true;
    elements.fatalError.hidden = false;
    elements.fatalErrorMessage.textContent = error.message || "The live challenge could not be loaded.";
  }
}

function beginRound() {
  if (state.phase !== "ready" || !state.currentArticle) return;
  state.history = [state.currentTitle];
  state.backStack = [];
  state.moves = 0;
  state.pendingNavigation = null;
  state.navigationError = null;

  elements.challenge.hidden = true;
  elements.game.hidden = false;
  elements.result.hidden = true;
  elements.newGameButton.hidden = false;
  elements.liveTarget.textContent = state.targetTitle;
  elements.pageStatus.textContent = "Choose a link in the article.";
  renderHistory();
  setPhase("playing");
  renderArticle(state.currentArticle);
  startTimer();
  announce(`Sprint started. You have three minutes to reach ${state.targetTitle}.`);
  elements.articleTitle.scrollIntoView({ behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth", block: "start" });
}

async function navigateTo(title, mode = "forward") {
  if (state.phase !== "playing" || state.pendingNavigation) return;
  const navigation = { title, mode, fromTitle: state.currentTitle };
  state.pendingNavigation = navigation;
  state.navigationError = null;
  setPhase("playing");
  showArticleLoading(title);

  try {
    const article = await fetchArticle(title);
    if (state.phase !== "playing" || state.pendingNavigation !== navigation) return;

    if (mode === "back") state.backStack.pop();
    else state.backStack.push(navigation.fromTitle);

    state.pendingNavigation = null;
    state.moves += 1;
    state.history.push(article.title);
    renderArticle(article);
    renderHistory();
    elements.pageStatus.textContent = `On ${article.title}`;
    setPhase("playing");

    if (normaliseTitle(article.title) === normaliseTitle(state.targetTitle)) {
      finishRound(true);
      return;
    }

    announce(`Loaded ${article.title}. ${state.moves} moves used.`);
    elements.articleTitle.scrollIntoView({ behavior: "auto", block: "start" });
  } catch (error) {
    if (state.phase !== "playing" || state.pendingNavigation !== navigation) return;
    showNavigationError(error);
  }
}

function normaliseTitle(title) {
  return String(title).replaceAll("_", " ").trim().toLocaleLowerCase("en-GB");
}

function retryNavigation() {
  if (state.phase !== "playing" || !state.pendingNavigation) return;
  const pending = state.pendingNavigation;
  state.pendingNavigation = null;
  navigateTo(pending.title, pending.mode);
}

function goBack() {
  if (state.phase !== "playing" || state.pendingNavigation || state.backStack.length === 0) return;
  navigateTo(state.backStack[state.backStack.length - 1], "back");
}

function finishRound(won) {
  if (state.phase !== "playing") return;
  const now = performance.now();
  const elapsed = won ? Math.min(ROUND_LENGTH_MS, now - state.startTime) : ROUND_LENGTH_MS;
  stopTimer();
  state.pendingNavigation = null;
  setPhase(won ? "won" : "timed_out");
  renderTimer(won ? now : state.deadline);

  elements.game.hidden = true;
  elements.result.hidden = false;
  elements.result.classList.toggle("is-timeout", !won);
  elements.resultKicker.textContent = won ? "Sprint complete" : "Time is up";
  elements.resultTitle.textContent = won ? "You made it" : "Route unfinished";
  elements.resultSummary.textContent = won
    ? `You reached ${state.targetTitle} from ${state.startTitle}.`
    : `You reached ${state.currentTitle}, with ${state.targetTitle} still to find.`;
  elements.resultTime.textContent = formatDuration(elapsed);
  elements.resultMoves.textContent = String(state.moves);
  elements.resultPages.textContent = String(state.history.length);
  announce(won ? `Success. Target reached in ${state.moves} moves.` : `Time is up after ${state.moves} moves.`);
  elements.resultTitle.focus?.();
}

elements.rerollButton.addEventListener("click", loadChallenge);
elements.startButton.addEventListener("click", beginRound);
elements.newGameButton.addEventListener("click", loadChallenge);
elements.playAgainButton.addEventListener("click", loadChallenge);
elements.tryAgainButton.addEventListener("click", loadChallenge);
elements.retryPageButton.addEventListener("click", retryNavigation);
elements.backButton.addEventListener("click", goBack);
elements.articleContent.addEventListener("click", event => {
  const link = event.target.closest(".article-link");
  if (!link || link.disabled) return;
  navigateTo(link.dataset.articleTitle, "forward");
});

document.addEventListener("visibilitychange", () => {
  if (state.phase !== "playing") return;
  const remaining = renderTimer();
  if (remaining <= 0) finishRound(false);
});

document.querySelector("#load-live").addEventListener("click", loadChallenge);
