'use client';

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { getVocabularyBooks } from "@/actions/vocabularyBook";
import { getVocabularyChapters } from "@/actions/vocabularyChapter";
import { getVocabulariesByChapters, getVocabulariesByBook } from "@/actions/vocabulary";
import { Book } from '@/types/book';
import { Chapter } from '@/types/chapter';
import { Vocabulary } from '@/types/vocabulary';
import PageHeader from "@/components/forms/PageHeader";
import FormCard from "@/components/forms/FormCard";
import BookChapterSelector from "@/components/BookChapterSelector";


interface QuizSettings {
  totalQuestions: number;
  timeLimit: number; // seconds
  questionType: 'word-to-definition' | 'definition-to-word';
  answerType: 'multiple-choice' | 'text-input';
}

function QuizContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const [books, setBooks] = useState<Book[]>([]);
  const [book, setBook] = useState<string>('');
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [selectedChapters, setSelectedChapters] = useState<string[]>([]);
  const [vocabularies, setVocabularies] = useState<Vocabulary[]>([]);
  const [quizSettings, setQuizSettings] = useState<QuizSettings>({
    totalQuestions: 10,
    timeLimit: 30,
    questionType: 'word-to-definition',
    answerType: 'multiple-choice'
  });

  // Load books on mount
  useEffect(() => {
    const loadBooks = async () => {
      const booksData = await getVocabularyBooks();
      setBooks(booksData);
    };
    loadBooks();
  }, []);

  // Handle URL parameters
  useEffect(() => {
    const bookParam = searchParams.get('book');
    const chaptersParam = searchParams.get('chapters');
    
    if (bookParam) {
      setBook(bookParam);
    }
    
    if (chaptersParam) {
      const chapterIds = chaptersParam.split(',');
      setSelectedChapters(chapterIds);
    }
  }, [searchParams]);

  // Load chapters when book changes
  useEffect(() => {
    const loadChapters = async () => {
      if (book) {
        const chaptersData = await getVocabularyChapters(book);
        setChapters(chaptersData);
      } else {
        setChapters([]);
        setSelectedChapters([]);
      }
    };
    loadChapters();
  }, [book]);

  // Load vocabularies when book or selected chapters change
  useEffect(() => {
    const loadVocabularies = async () => {
      if (selectedChapters.length > 0) {
        const vocabulariesData = await getVocabulariesByChapters(selectedChapters);
        setVocabularies(vocabulariesData);
      } else if (book) {
        const bookVocabularies = await getVocabulariesByBook(book);
        setVocabularies(bookVocabularies);
      } else {
        setVocabularies([]);
      }
    };
    loadVocabularies();
  }, [book, selectedChapters]);

  const handleBookSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setBook(e.target.value);
    setSelectedChapters([]);
  };

  const handleChapterToggle = (chapterId: string, isChecked: boolean) => {
    if (isChecked) {
      setSelectedChapters(prev => [...prev, chapterId]);
    } else {
      setSelectedChapters(prev => prev.filter(id => id !== chapterId));
    }
  };

  const selectAllChapters = () => {
    setSelectedChapters(chapters.map(chapter => chapter.id));
  };

  const clearAllChapters = () => {
    setSelectedChapters([]);
  };

  const startQuiz = () => {
    if (vocabularies.length === 0) {
      alert('퀴즈를 풀 수 있는 단어가 없습니다. 단어장과 챕터를 선택해주세요.');
      return;
    }

    const availableQuestions = Math.min(quizSettings.totalQuestions, vocabularies.length);
    const params = new URLSearchParams({
      book: book,
      chapters: selectedChapters.join(','),
      totalQuestions: availableQuestions.toString(),
      timeLimit: quizSettings.timeLimit.toString(),
      questionType: quizSettings.questionType,
      answerType: quizSettings.answerType
    });

    router.push(`/vocabulary/quiz/test?${params.toString()}`);
  };

  const getFilterDescription = () => {
    if (selectedChapters.length > 0) {
      const selectedChapterNames = chapters
        .filter(chapter => selectedChapters.includes(chapter.id))
        .map(chapter => chapter.name);
      return `선택된 챕터: ${selectedChapterNames.join(', ')}`;
    } else if (book) {
      return `단어장: ${book}`;
    } else {
      return '전체 단어';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 dark:from-gray-900 dark:to-gray-800 px-4 py-6 md:px-8 md:py-10">
      <div className="max-w-4xl mx-auto">
        <PageHeader 
          title="단어 퀴즈"
          actionText="단어 목록"
          actionHref="/vocabulary"
        />

        <div className="space-y-6">
          <FormCard
            title="퀴즈 범위 선택"
            description="퀴즈를 풀 단어장과 챕터를 선택하세요"
          >
            <BookChapterSelector
              books={books}
              book={book}
              chapters={chapters}
              selectedChapters={selectedChapters}
              handleBookSelect={handleBookSelect}
              handleChapterToggle={handleChapterToggle}
              selectAllChapters={selectAllChapters}
              clearAllChapters={clearAllChapters}
              showQuickActions={true}
            />

            {vocabularies.length > 0 && (
              <div className="mt-4 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                <div className="flex items-center gap-2 text-green-700 dark:text-green-300">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="font-medium">퀴즈 준비 완료!</span>
                </div>
                <p className="text-sm text-green-600 dark:text-green-400 mt-1">
                  {getFilterDescription()}에서 총 {vocabularies.length}개의 단어로 퀴즈를 만들 수 있습니다.
                </p>
              </div>
            )}
          </FormCard>

          <FormCard
            title="퀴즈 설정"
            description="퀴즈의 난이도와 옵션을 설정하세요"
          >
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    문제 수
                  </label>
                  <select
                    value={quizSettings.totalQuestions}
                    onChange={(e) => setQuizSettings(prev => ({ ...prev, totalQuestions: parseInt(e.target.value) }))}
                    className="w-full bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-blue-500 dark:focus:border-blue-400"
                  >
                    <option value={5}>5문제</option>
                    <option value={10}>10문제</option>
                    <option value={15}>15문제</option>
                    <option value={20}>20문제</option>
                    <option value={vocabularies.length}>전체 ({vocabularies.length}문제)</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    제한 시간 (문제당)
                  </label>
                  <select
                    value={quizSettings.timeLimit}
                    onChange={(e) => setQuizSettings(prev => ({ ...prev, timeLimit: parseInt(e.target.value) }))}
                    className="w-full bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-blue-500 dark:focus:border-blue-400"
                  >
                    <option value={15}>15초</option>
                    <option value={30}>30초</option>
                    <option value={45}>45초</option>
                    <option value={60}>60초</option>
                    <option value={0}>제한 없음</option>
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  문제 유형
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <label className="flex items-center p-3 border border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700">
                    <input
                      type="radio"
                      name="questionType"
                      value="word-to-definition"
                      checked={quizSettings.questionType === 'word-to-definition'}
                      onChange={(e) => setQuizSettings(prev => ({ ...prev, questionType: e.target.value as 'word-to-definition' | 'definition-to-word' }))}
                      className="mr-3"
                    />
                    <div>
                      <div className="font-medium text-gray-900 dark:text-white">단어 → 뜻</div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">단어를 보고 맞는 뜻을 선택</div>
                    </div>
                  </label>
                  <label className="flex items-center p-3 border border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700">
                    <input
                      type="radio"
                      name="questionType"
                      value="definition-to-word"
                      checked={quizSettings.questionType === 'definition-to-word'}
                      onChange={(e) => setQuizSettings(prev => ({ ...prev, questionType: e.target.value as 'word-to-definition' | 'definition-to-word' }))}
                      className="mr-3"
                    />
                    <div>
                      <div className="font-medium text-gray-900 dark:text-white">뜻 → 단어</div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">뜻을 보고 맞는 단어를 선택</div>
                    </div>
                  </label>
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  답안 유형
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <label className="flex items-center p-3 border border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700">
                    <input
                      type="radio"
                      name="answerType"
                      value="multiple-choice"
                      checked={quizSettings.answerType === 'multiple-choice'}
                      onChange={(e) => setQuizSettings(prev => ({ ...prev, answerType: e.target.value as 'multiple-choice' | 'text-input' }))}
                      className="mr-3"
                    />
                    <div>
                      <div className="font-medium text-gray-900 dark:text-white">객관식</div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">4지선다로 답안 선택</div>
                    </div>
                  </label>
                  <label className="flex items-center p-3 border border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700">
                    <input
                      type="radio"
                      name="answerType"
                      value="text-input"
                      checked={quizSettings.answerType === 'text-input'}
                      onChange={(e) => setQuizSettings(prev => ({ ...prev, answerType: e.target.value as 'multiple-choice' | 'text-input' }))}
                      className="mr-3"
                    />
                    <div>
                      <div className="font-medium text-gray-900 dark:text-white">주관식</div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">직접 답안을 입력</div>
                    </div>
                  </label>
                </div>
              </div>
            </div>
          </FormCard>

          <div className="flex justify-center">
            <button
              onClick={startQuiz}
              disabled={vocabularies.length === 0}
              className="px-8 py-4 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-medium rounded-lg transition-colors duration-200 shadow-lg hover:shadow-xl disabled:cursor-not-allowed text-lg"
            >
              {vocabularies.length === 0 ? '단어를 선택해주세요' : '퀴즈 시작하기'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function LoadingFallback() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600 dark:text-gray-400">퀴즈 설정을 불러오는 중...</p>
      </div>
    </div>
  );
}

export default function QuizPage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <QuizContent />
    </Suspense>
  );
}
