import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { createSavesDrawer, MAX_SAVE_BYTES, createEvolutionWorld, makeSnapshot, deserialiseSnapshot } from './save-test-support.mjs';

class Element {
  constructor(tag) { this.tagName = tag; this.children = []; this.textContent = ''; this.value = ''; }
  append(...children) { this.children.push(...children); }
  replaceChildren(...children) { this.children = children; }
  click() { this.onclick?.(); }
}
globalThis.document = { createElement: tag => new Element(tag), createTextNode: text => text };
let exportedBlob;
let downloadCount = 0;
URL.createObjectURL = blob => { exportedBlob = blob; downloadCount += 1; return 'blob:local-test'; };
URL.revokeObjectURL = () => {};

const snapshot = process.argv[2]
  ? deserialiseSnapshot(await readFile(process.argv[2], 'utf8'))
  : makeSnapshot('Regression world', createEvolutionWorld({ seed: 314159, width: 96, height: 96, startingPopulation: 160, mutationIntensity: 'mid' }));
let currentWorld = snapshot.world;
const root = new Element('main');
const saved = new Map();
const storage = {
  async listSnapshots() { return [...saved].map(([id, value]) => ({ id, name: value.name, step: value.world.step, population: value.world.creatures.length })); },
  async saveSnapshot(id, value) { saved.set(id, value); },
  async loadSnapshot(id) { return saved.get(id); },
  async deleteSnapshot(id) { saved.delete(id); }
};
createSavesDrawer(root, storage, () => currentWorld, () => snapshot.interventions, () => {});
const status = root.children[1];
const [exportButton, , fileInput] = root.children[3].children;
exportButton.click();
assert.equal(downloadCount, 1, status.textContent);
assert.ok(exportedBlob.size > 10_000_000, 'Representative default world must reproduce the previous 10 MB failure.');
assert.ok(exportedBlob.size <= MAX_SAVE_BYTES);
const exportedText = await exportedBlob.text();
const validated = deserialiseSnapshot(exportedText);
assert.deepEqual(validated.world, snapshot.world);
assert.deepEqual(validated.interventions, snapshot.interventions);
fileInput.files = [new File([exportedText], 'world.json', { type: 'application/json' })];
fileInput.value = 'world.json';
await fileInput.onchange();
assert.equal(fileInput.value, '');
assert.match(status.textContent, /Imported world to slot-1/);
assert.deepEqual(saved.get('slot-1').world, snapshot.world);

fileInput.files = [new File(['{invalid'], 'invalid.json')];
fileInput.value = 'invalid.json';
await fileInput.onchange();
assert.match(status.textContent, /Could not import save: Invalid snapshot JSON/);
assert.equal(fileInput.value, '', 'The same file must be selectable again after a failure.');
assert.equal(saved.size, 1, 'Invalid JSON must not occupy a save slot.');
fileInput.files = [new File(['{"version":2,"world":{}}'], 'invalid-world.json')];
await fileInput.onchange();
assert.match(status.textContent, /Could not import save:/);
assert.equal(saved.size, 1);

fileInput.files = [{ size: MAX_SAVE_BYTES + 1, text() { throw new Error('Oversized input must not be read.'); } }];
fileInput.value = 'large.json';
await fileInput.onchange();
assert.match(status.textContent, /64 MiB limit/);
assert.equal(fileInput.value, '');
assert.equal(saved.size, 1);

currentWorld = { ...snapshot.world, testPadding: 'x'.repeat(MAX_SAVE_BYTES) };
exportButton.click();
assert.match(status.textContent, /too large to export \(64 MiB limit\)/);
assert.equal(downloadCount, 1, 'An unimportable oversized world must not be downloaded.');
console.log(JSON.stringify({ pass: true, roundtripBytes: exportedBlob.size, maxSaveBytes: MAX_SAVE_BYTES, checks: ['default-world export/import', 'full world and intervention equality', 'invalid JSON visible error', 'invalid structure rejected', 'same-file retry reset', 'oversized import rejected before read', 'oversized export blocked'] }, null, 2));
