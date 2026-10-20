'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import PageHeader from '@/components/forms/PageHeader';
import { readWrongAnswers, removeWrongAnswer, WrongAnswer } from '@/lib/wrongAnswers';

export default function WrongAnswersPage() {
  const [entries, setEntries] = useState<WrongAnswer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [notice, setNotice] = useState('');

  useEffect(() => {
    const load = () => {
      try {
        setEntries(readWrongAnswers());
        setError(null);
      } catch {
        setError('오답노트를 불러오지 못했어요. 브라우저 저장 공간과 설정을 확인하고 다시 열어주세요.');
      } finally {
        setLoading(false);
      }
    };
    load();
    window.addEventListener('storage', load);
    return () => window.removeEventListener('storage', load);
  }, []);

  const completeReview = (entry: WrongAnswer) => {
    try {
      setEntries(removeWrongAnswer(entry.id));
      setNotice(`“${entry.question}” 복습을 완료했어요.`);
      setError(null);
    } catch {
      setError('복습 완료를 저장하지 못했어요. 잠시 후 다시 시도해주세요.');
    }
  };
  const query = search.trim().toLocaleLowerCase();
  const filtered = entries.filter(entry =>
    [entry.question, entry.correctAnswer, entry.book].some(value => value.toLocaleLowerCase().includes(query)));

  return (
    <div className="min-h-screen bg-background px-4 py-6 md:px-8 md:py-10">
      <div className="max-w-4xl mx-auto space-y-6">
        <PageHeader title="오답노트" actionText="퀴즈 풀기" actionHref="/vocabulary/quiz" />
        <p className="text-sm text-gray-600 dark:text-gray-400">틀린 문제와 시간 초과한 문제를 자동으로 모아요. 오답은 이 기기·브라우저에 저장됩니다.</p>
        {error && <p role="alert" className="rounded-lg bg-red-50 dark:bg-red-900/20 p-4 text-red-700 dark:text-red-300">{error}</p>}
        <p role="status" className="text-sm">{notice}</p>
        {loading ? <p>오답노트를 불러오는 중...</p> : !error && entries.length === 0 ? (
          <div className="card text-center space-y-4 py-12">
            <h2 className="text-xl font-semibold">모아둔 오답이 없어요</h2>
            <p className="text-gray-600 dark:text-gray-400">퀴즈에서 틀린 문제는 여기에 자동으로 저장돼요.</p>
            <Link href="/vocabulary/quiz" className="study-primary">퀴즈 풀러 가기</Link>
          </div>
        ) : (
          <>
            <div className="flex flex-wrap items-center gap-4 justify-between">
              <p className="font-medium">복습할 문제 {entries.length}개</p>
              <label className="flex items-center gap-3 text-sm">
                검색
                <input type="search" value={search} onChange={event => setSearch(event.target.value)} placeholder="단어, 뜻, 단어장" className="min-w-0 w-52 max-w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-transparent px-3 py-2" />
              </label>
            </div>
            {filtered.length === 0 && <p className="py-8 text-center">검색 결과가 없어요.</p>}
            <ul className="space-y-4">
              {filtered.map(entry => (
                <li key={entry.id} className="card space-y-4">
                  <div className="flex flex-wrap justify-between gap-2 text-xs text-gray-600 dark:text-gray-400">
                    <span>{entry.book || '단어장 없음'} · {entry.type === 'word-to-definition' ? '단어 → 뜻' : '뜻 → 단어'}</span>
                    <span>{entry.wrongCount}회 틀림 · {new Date(entry.lastWrongAt).toLocaleDateString('ko-KR')}</span>
                  </div>
                  <h2 className="text-2xl font-semibold break-words">{entry.question}</h2>
                  <dl className="space-y-2 break-words">
                    <div><dt className="text-xs text-gray-500 dark:text-gray-400">내 답</dt><dd className="text-red-600 dark:text-red-400">{entry.userAnswer || '시간 초과'}</dd></div>
                    <div><dt className="text-xs text-gray-500 dark:text-gray-400">정답</dt><dd className="font-medium">{entry.correctAnswer}</dd></div>
                  </dl>
                  <button type="button" onClick={() => completeReview(entry)} className="study-secondary" aria-label={`${entry.question} 복습 완료`}>복습 완료</button>
                </li>
              ))}
            </ul>
          </>
        )}
      </div>
    </div>
  );
}
