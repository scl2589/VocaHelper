const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const ts = require('typescript');
const source = ts.transpileModule(fs.readFileSync('app/vocabulary/memorize/hooks/useWordPlayback.tsx', 'utf8'), {
  compilerOptions: { module: ts.ModuleKind.CommonJS },
}).outputText;
function setup(repetitions) {
  const slots = [];
  let cursor = 0, timer = null, api;
  const effects = [];
  const queue = [];
  const react = {
    useState(initial) {
      const index = cursor++;
      if (!(index in slots)) slots[index] = initial;
      return [slots[index], value => { slots[index] = typeof value === 'function' ? value(slots[index]) : value; }];
    },
    useRef(initial) {
      const index = cursor++;
      return slots[index] ??= { current: initial };
    },
    useCallback(fn) { return fn; },
    useEffect(fn, deps) {
      const index = cursor++;
      if (!slots[index] || deps.some((dep, i) => dep !== slots[index][i])) effects.push(fn);
      slots[index] = deps;
    },
  };
  const synth = {
    getVoices: () => [],
    speak: utterance => queue.push(utterance),
    cancel: () => { queue.splice(0).forEach(u => u.onerror?.({ error: 'canceled' })); },
  };
  const context = {
    exports: {}, require: name => { assert.equal(name, 'react'); return react; },
    localStorage: { getItem: () => String(repetitions), setItem() {} },
    window: { speechSynthesis: synth, SpeechSynthesisUtterance: function() {} },
    SpeechSynthesisUtterance: function(text) { this.text = text; },
    setInterval: fn => { timer = fn; return 1; }, clearInterval: () => { timer = null; },
  };
  vm.runInNewContext(source, context);
  const words = [{ id: 'a', word: 'apple', definitions: [{ definition: '사과' }, { definition: '사과나무' }] },
    { id: 'b', word: 'banana', definitions: [{ definition: '바나나' }] }];
  function render() {
    cursor = 0;
    api = context.exports.useWordPlayback(words, words);
    effects.splice(0).forEach(fn => fn());
    return api;
  }
  render(); render();
  return { get api() { return api; }, queue, render,
    tick() { timer?.(); render(); }, finish() { queue.shift().onend(); },
    get running() { return timer !== null; } };
}
for (const repetitions of [1, 2, 3, 5, 7, 21]) {
  const h = setup(repetitions);
  h.api.handleClickPlay(); h.render();
  for (let cycle = 0; cycle < repetitions; cycle++) {
    assert.deepEqual(h.queue.map(u => u.text), ['apple', '사과', '사과나무']);
    // A long utterance must keep blinking without counting a repetition.
    for (let tick = 0; tick < 14; tick++) {
      const previous = h.api.showDefinition;
      h.tick();
      assert.notEqual(h.api.showDefinition, previous);
      assert.equal(h.api.order, 0);
    }
    h.finish(); h.tick(); h.finish(); h.tick();
    assert.equal(h.api.order, 0, 'All definitions must finish');
    h.finish(); h.tick();
  }
  assert.equal(h.api.order, 1);
  assert.deepEqual(h.queue.map(u => u.text), ['banana', '바나나']);
  h.api.handleClickPlay(); h.render();
  assert.equal(h.running, false);
  assert.equal(h.queue.length, 0);
}
const h = setup(3);
h.api.handleClickPlay(); h.render();
const stale = h.queue[0];
h.api.handleRepetitionChange(1); h.render();
stale.onend(); h.tick();
assert.equal(h.api.order, 0, 'Stale completion must not finish the restarted cycle');
h.finish(); h.finish(); h.finish(); h.tick();
assert.equal(h.api.order, 1);
const silent = setup(1);
silent.api.handleClickSpeaker(); silent.render();
silent.api.handleClickPlay(); silent.render();
for (let i = 0; i < 9; i++) silent.tick();
assert.equal(silent.api.order, 0);
silent.tick(); assert.equal(silent.api.order, 1);
const error = setup(1);
error.api.handleClickPlay(); error.render();
error.queue[0].onerror({ error: 'network' }); error.tick();
assert.equal(error.running, false);
assert.equal(error.api.order, 0);
assert.ok(error.api.speechError);
console.log('Passed: full reading repetitions, continuous blinking, multiple definitions, stop, restart, stale events, silent timing, and speech errors.');

const custom = setup(7);
assert.equal(custom.api.repetitionsPerWord, 7);
custom.api.handleRepetitionChange(42); custom.render();
assert.equal(custom.api.repetitionsPerWord, 42);
for (const invalid of [0, -1, 1.5, NaN, Infinity, Number.MAX_SAFE_INTEGER + 1]) {
  custom.api.handleRepetitionChange(invalid); custom.render();
  assert.equal(custom.api.repetitionsPerWord, 42);
  assert.equal(setup(invalid).api.repetitionsPerWord, 10);
}
console.log('Passed: custom repetition counts and invalid input rejection.');
