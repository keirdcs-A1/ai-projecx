#!/usr/bin/env python3
"""Build a public, static feed snapshot. Python 3.11+, standard library only.

Run from any working directory. No credentials, cookies or visitor data are used.
Only sources explicitly enabled in reuse-policy.json can publish headline text.
"""
import concurrent.futures
import datetime as dt
import email.utils
import hashlib
import html
import json
import re
import urllib.error
import urllib.parse
import urllib.request
import xml.etree.ElementTree as ET
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
MAX_BYTES = 1_000_000
NOW = dt.datetime.now(dt.timezone.utc)
STAMP = NOW.isoformat().replace('+00:00', 'Z')
TERMS = [(r'\biran(?:ian)?s?\b', 'Iran', 'iran'), (r'\btehran\b', 'Tehran', 'iran'),
         (r'\birgc\b', 'IRGC', 'iran'), (r'\bkhamenei\b', 'Khamenei', 'iran'),
         (r'\bpezeshkian\b', 'Pezeshkian', 'iran'), (r'\baraghchi\b', 'Araghchi', 'iran'),
         (r'\bhormuz\b', 'Hormuz', 'regional'), (r'\bhezbollah\b', 'Hezbollah', 'regional'),
         (r'\bhouthis?\b', 'Houthis', 'regional')]
TOPICS = [
    ('Nuclear', r'\b(nuclear|uranium|IAEA|enrich\w*)\b'),
    ('War & security', r'\b(strikes?|airstrikes?|attacks?|missiles?|military|war|killed|drones?|ceasefire|weapons?|defen[cs]e|explosives?|bombs?|troops?)\b'),
    ('Economy & energy', r'\b(oil|gas|energy|econom\w*|inflation|markets?|currenc\w*|crude|invest\w*|OPEC)\b'),
    ('Shipping & trade', r'\b(ships?|shipping|Hormuz|trade|tankers?|maritime|cargo|ports?|fleets?)\b'),
    ('Diplomacy & sanctions', r'\b(talks|diploma\w*|negotiat\w*|sanctions?|envoys?|ambassadors?|bilateral|treaties|treaty)\b|foreign (minister|ministry|affairs)|secretary of state|security council'),
    ('Humanitarian & rights', r'\b(civilians?|aid|humanitarian|displac\w*|hospitals?|rights|execut\w*|detain\w*|prison\w*|refugees?)\b'),
    ('Domestic politics', r'regime change|\b(protests?|elections?|parliament\w*|domestic|reform\w*|activists?)\b')]


def clean(value, limit=2000):
    return re.sub(r'\s+', ' ', html.unescape(re.sub(r'<[^>]*>', ' ', value or ''))).strip()[:limit]


def date(value):
    value = value.strip()
    if not re.search(r'(Z|[+-]\d{2}:?\d{2}|GMT|UTC)$', value, re.I):
        return None
    try:
        result = dt.datetime.fromisoformat(value.replace('Z', '+00:00'))
    except ValueError:
        try:
            result = email.utils.parsedate_to_datetime(value)
        except (ValueError, TypeError):
            return None
    return result.astimezone(dt.timezone.utc) if result.tzinfo else None


def safe_url(raw, hosts):
    try:
        url = urllib.parse.urlsplit(raw.strip())
        if url.scheme != 'https' or url.hostname not in hosts or url.username or url.password or url.port:
            return None
        query = [(k, v) for k, v in urllib.parse.parse_qsl(url.query) if not re.match(r'^(utm_|at_)|^(fbclid|gclid|cmpid|ocid|ref)$', k, re.I)]
        return urllib.parse.urlunsplit((url.scheme, url.netloc, url.path, urllib.parse.urlencode(query), ''))
    except ValueError:
        return None


class NoRedirect(urllib.request.HTTPRedirectHandler):
    def redirect_request(self, req, fp, code, msg, headers, newurl):
        return None


def retrieve(source):
    opener = urllib.request.build_opener(NoRedirect)
    url = source['url']
    for hop in range(3):
        request = urllib.request.Request(url, headers={'Accept': 'application/rss+xml, application/atom+xml, application/xml, text/xml', 'User-Agent': 'StaticFeedSnapshot/1.0'})
        try:
            response = opener.open(request, timeout=12)
        except urllib.error.HTTPError as error:
            if error.code in (301, 302, 303, 307, 308):
                target = urllib.parse.urljoin(url, error.headers.get('Location', ''))
                error.close()
                if hop == 2 or not safe_url(target, source['feedHosts']):
                    raise ValueError('redirect_rejected')
                url = target
                continue
            raise
        with response:
            raw = response.read(MAX_BYTES + 1)
        if len(raw) > MAX_BYTES or re.search(br'<!DOCTYPE|<!ENTITY', raw, re.I):
            raise ValueError('invalid_feed')
        return raw
    raise ValueError('redirect_rejected')


def parse(raw, source):
    root = ET.fromstring(raw)
    if root.tag.split('}')[-1] not in ('rss', 'RDF', 'feed'):
        raise ValueError('invalid_feed')
    rows = [row for row in root.iter() if row.tag.split('}')[-1] in ('item', 'entry')]
    if len(rows) > 500:
        raise ValueError('invalid_feed')
    items, seen, undated, future = [], set(), 0, 0
    for row in rows:
        fields = {}
        for child in row:
            key = child.tag.split('}')[-1]
            if key == 'link' and child.attrib.get('href') and child.attrib.get('rel', 'alternate') == 'alternate':
                fields['link'] = child.attrib['href']
            elif key not in fields:
                fields[key] = ''.join(child.itertext())
        title = clean(fields.get('title', ''), 300)
        text = title + ' ' + clean(fields.get('description', fields.get('summary', '')))
        matches = [term for term in TERMS if re.search(term[0], text, re.I)]
        if not matches:
            continue
        url = safe_url(fields.get('link', fields.get('guid', fields.get('id', ''))), source['hosts'])
        if not url or not title:
            continue
        primary = fields.get('pubDate', fields.get('published', fields.get('date')))
        published = date(primary or fields.get('updated', ''))
        if not published:
            undated += 1
            continue
        if published > NOW + dt.timedelta(minutes=5):
            future += 1
            continue
        if published < NOW - dt.timedelta(days=7) or url in seen:
            continue
        seen.add(url)
        topics = [name for name, pattern in TOPICS if re.search(pattern, title, re.I)]
        topics += [name for name, pattern in TOPICS if name not in topics and re.search(pattern, text, re.I)]
        items.append({'id': source['id'] + ':' + hashlib.sha256(url.encode()).hexdigest()[:20], 'title': title,
                      'url': url, 'publishedAt': published.isoformat().replace('+00:00', 'Z'),
                      'timestampKind': 'published' if primary else 'updated', 'source': source['id'],
                      'topics': topics or ['General'], 'scope': 'iran' if any(m[2] == 'iran' for m in matches) else 'regional',
                      'matchedTerms': [m[1] for m in matches]})
    return sorted(items, key=lambda item: item['publishedAt'], reverse=True)[:80], len(rows), undated, future


def build():
    sources = json.loads((ROOT / 'sources.json').read_text())
    policy = json.loads((ROOT / 'reuse-policy.json').read_text())
    try:
        old = json.loads((ROOT / 'snapshot.json').read_text())
    except (OSError, ValueError):
        old = {'sources': [], 'items': []}
    previous = {s['id']: s for s in old['sources']}

    def load(source):
        enabled = policy[source['id']]['publishHeadlines']
        state = {key: source[key] for key in ('id', 'name', 'home', 'kind', 'affiliationNote')}
        state.update(status='unavailable', fetchedAt=None, attemptedAt=STAMP, matchingItems=0, feedEntries=0,
                     skippedUndated=0, skippedFuture=0, publishHeadlines=enabled)
        items = []
        try:
            parsed, count, undated, future = parse(retrieve(source), source)
            state.update(status='current', fetchedAt=STAMP, matchingItems=len(parsed), feedEntries=count,
                         skippedUndated=undated, skippedFuture=future)
            items = parsed if enabled else []
        except Exception as error:
            # Public reports contain stable categories only, never exception strings or machine paths.
            issue = str(error) if str(error) in ('invalid_feed', 'redirect_rejected') else 'upstream_unavailable'
            state['issue'] = issue
            prior = previous.get(source['id'])
            success = date(prior.get('fetchedAt') or '') if prior else None
            if enabled and success and NOW - success <= dt.timedelta(hours=24):
                state.update(status='stale', fetchedAt=prior['fetchedAt'])
                items = [item for item in old['items'] if item['source'] == source['id'] and date(item['publishedAt']) and NOW - date(item['publishedAt']) <= dt.timedelta(days=7)]
                state['matchingItems'] = len(items)
        state['publishedItems'] = len(items)
        state['withheldItems'] = state['matchingItems'] if not enabled else 0
        return state, items

    with concurrent.futures.ThreadPoolExecutor(max_workers=5) as pool:
        results = list(pool.map(load, sources))
    snapshot = {'checkedAt': STAMP, 'retryAfterSeconds': 3600,
                'sources': [state for state, _ in results],
                'items': sorted([item for _, items in results for item in items], key=lambda item: item['publishedAt'], reverse=True)}
    target = ROOT / 'snapshot.json'
    temporary = target.with_suffix('.json.tmp')
    temporary.write_text(json.dumps(snapshot, ensure_ascii=False, indent=2) + '\n')
    temporary.replace(target)
    for state in snapshot['sources']:
        print(state['id'], state['status'], 'entries=' + str(state['feedEntries']), 'published=' + str(state['publishedItems']), 'withheld=' + str(state['withheldItems']))
    return snapshot


if __name__ == '__main__':
    build()
