const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const ts = require('typescript');

const storage = new Map();
const context = {
  exports: {},
  localStorage: {
    getItem: key => storage.get(key) ?? null,
    setItem: (key, value) => storage.set(key, value),
  },
};
const source = ts.transpileModule(fs.readFileSync('lib/wrongAnswers.ts', 'utf8'), {
  compilerOptions: { module: ts.ModuleKind.CommonJS },
}).outputText;
const load = () => {
  const instance = { ...context, exports: {} };
  vm.runInNewContext(source, instance);
  return instance.exports;
};
const api = load();
const answer = {
  vocabularyId: 'word-1', book: 'My book', question: 'steady',
  correctAnswer: '꾸준한', userAnswer: '빠른', type: 'word-to-definition',
};
assert.equal(api.readWrongAnswers().length, 0);
api.saveWrongAnswer(answer);
api.saveWrongAnswer({ ...answer, userAnswer: '' });
let entries = load().readWrongAnswers();
assert.equal(entries.length, 1, 'Repeated mistakes must merge after a reload');
assert.equal(entries[0].wrongCount, 2);
assert.equal(entries[0].userAnswer, '', 'Timeout must preserve an empty answer');
api.saveWrongAnswer({ ...answer, type: 'definition-to-word', question: '꾸준한', correctAnswer: 'steady' });
api.saveWrongAnswer({ ...answer, vocabularyId: 'word-2' });
entries = api.readWrongAnswers();
assert.equal(entries.length, 3, 'Different directions and word IDs must stay separate');
assert.equal(entries[0].vocabularyId, 'word-2', 'Latest mistake must appear first');
api.removeWrongAnswer(entries[0].id);
assert.equal(load().readWrongAnswers().length, 2, 'Review completion must persist');
context.localStorage.setItem = () => { throw new Error('Storage full'); };
assert.throws(() => api.saveWrongAnswer(answer), /Storage full/);
assert.equal(api.readWrongAnswers()[1].wrongCount, 2, 'Failed writes must preserve saved data');
storage.set('voca-wrong-answers-v1', '{invalid');
assert.throws(() => api.readWrongAnswers());
assert.throws(() => api.saveWrongAnswer(answer), undefined, 'Unreadable history must never be overwritten');
console.log('Passed: persistence, duplicate merging, timeout, direction/word separation, ordering, review completion, and storage failures.');
