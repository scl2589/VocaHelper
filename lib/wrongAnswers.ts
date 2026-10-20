export interface WrongAnswer {
  id: string;
  vocabularyId: string;
  book: string;
  question: string;
  correctAnswer: string;
  userAnswer: string;
  type: 'word-to-definition' | 'definition-to-word';
  wrongCount: number;
  lastWrongAt: string;
}

const STORAGE_KEY = 'voca-wrong-answers-v1';

export function readWrongAnswers(): WrongAnswer[] {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return [];
  const entries: unknown = JSON.parse(raw);
  if (!Array.isArray(entries) || !entries.every(entry => entry &&
    typeof entry.id === 'string' && typeof entry.vocabularyId === 'string' &&
    typeof entry.book === 'string' && typeof entry.question === 'string' &&
    typeof entry.correctAnswer === 'string' && typeof entry.userAnswer === 'string' &&
    ['word-to-definition', 'definition-to-word'].includes(entry.type) &&
    Number.isInteger(entry.wrongCount) && entry.wrongCount > 0 &&
    typeof entry.lastWrongAt === 'string' && Number.isFinite(Date.parse(entry.lastWrongAt)))) {
    throw new Error('Invalid wrong answer data');
  }
  return entries;
}

export function saveWrongAnswer(answer: Omit<WrongAnswer, 'id' | 'wrongCount' | 'lastWrongAt'>): void {
  const entries = readWrongAnswers();
  const id = JSON.stringify([answer.vocabularyId, answer.type]);
  const previous = entries.find(entry => entry.id === id);
  const updated: WrongAnswer = {
    ...answer, id, wrongCount: (previous?.wrongCount ?? 0) + 1,
    lastWrongAt: new Date().toISOString(),
  };
  localStorage.setItem(STORAGE_KEY, JSON.stringify([updated, ...entries.filter(entry => entry.id !== id)]));
}

export function removeWrongAnswer(id: string): WrongAnswer[] {
  const remaining = readWrongAnswers().filter(entry => entry.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(remaining));
  return remaining;
}
