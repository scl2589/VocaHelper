'use client';

import { useState, useEffect, useRef, ChangeEvent, useCallback } from 'react';

import AddButton from '@/components/addButton';
import WordCard from '@/components/WordCard';
import NavigationButtons from '@/components/NavigationButtons';
import Title from '@/components/Title';
import ChapterCheckbox from '@/components/ChapterCheckbox';
import Icon from '@/components/Icon';

import { getVocabulariesByChapters, updateVocabulary } from '@/actions/vocabulary';
import { getVocabularyBooks } from '@/actions/vocabularyBook';
import { Vocabulary } from '@/types/vocabulary';
import { Book } from '@/types/book';
import { Chapter } from '@/types/chapter';
import { getVocabularyChapters } from '@/actions/vocabularyChapter';

const shuffleArray = <T,>(array: T[]): T[] => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

export default function MemorizePage() {
  const [vocabularies, setVocabularies] = useState<Vocabulary[]>([]);
  const [filteredVocabularies, setFilteredVocabularies] = useState<Vocabulary[]>([]);
  const [books, setBooks] = useState<Book[]>([]);
  const [book, setBook] = useState('');
  const [order, setOrder] = useState(0);
  const [showDefinition, setShowDefinition] = useState(false);
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [selectedChapters, setSelectedChapters] = useState<string[]>([]);
  const [isPronounced, setIsPronounced] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showOnlyUnmemorized, setShowOnlyUnmemorized] = useState(false);

  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // 필터링된 단어 목록 또는 전체 단어 목록 사용
  const currentVocabularies = showOnlyUnmemorized ? filteredVocabularies : vocabularies;
  const currentWord = currentVocabularies[order];

  const handleNavigation = useCallback(
    (direction: 'next' | 'prev') => {
      if (direction === 'next') {
        if (showDefinition) {
          setShowDefinition(false);
          setOrder((prevOrder) => (prevOrder + 1) % currentVocabularies.length);
        } else {
          setShowDefinition(true);
        }
      } else {
        // prev
        if (showDefinition) {
          setShowDefinition(false);
        } else {
          setShowDefinition(true);
          setOrder((prevOrder) => (prevOrder - 1 + currentVocabularies.length) % currentVocabularies.length);
        }
      }
    },
    [showDefinition, currentVocabularies.length]
  );

  const speakWord = useCallback(
    (text: string) => {
      if (!isPronounced) return;

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'en-US';
      utterance.rate = 0.8;
      window.speechSynthesis.speak(utterance);
    },
    [isPronounced]
  );

  const shuffleVocabularies = useCallback(() => {
    setVocabularies((prev) => shuffleArray(prev));
    setOrder(0);
    setShowDefinition(false);
  }, []);

  const handleClickSpeaker = useCallback(() => {
    setIsPronounced((prev) => !prev);
    if (!isPronounced && currentWord) {
      speakWord(currentWord.word);
    }
  }, [isPronounced, currentWord, speakWord]);

  const handleUpdateVocabulary = useCallback(async (word: Vocabulary) => {
    try {
      // 로컬 상태 먼저 업데이트
      setVocabularies((prev) =>
        prev.map((vocab) => (vocab.id === word.id ? { ...vocab, count: vocab.count + 1 } : vocab))
      );

      // DB에 업데이트 요청
      await updateVocabulary({
        ...word,
        count: word.count + 1,
      });
    } catch (error) {
      console.error('Failed to update vocabulary:', error);
    }
  }, []);

  const handleToggleMemorized = useCallback(
    async (word: Vocabulary) => {
      try {
        // 로컬 상태 먼저 업데이트 (빠른 UI 반응을 위해)
        setVocabularies((prev) =>
          prev.map((vocab) => (vocab.id === word.id ? { ...vocab, memorized: !vocab.memorized } : vocab))
        );

        // DB에 업데이트 요청
        await updateVocabulary({
          ...word,
          memorized: !word.memorized,
        });

        // 필터링된 단어 목록에서 order 조정
        if (showOnlyUnmemorized && !word.memorized) {
          // 현재 단어가 '외웠어요'로 표시되면 필터링된 목록에서 제거됨
          // order가 마지막 단어였으면 첫 단어로 이동, 아니면 현재 위치 유지
          if (order >= filteredVocabularies.length - 1) {
            setOrder(0);
          }
        }
      } catch (error) {
        console.error('Failed to update memorized status:', error);
        // 에러 발생 시 상태 롤백
        setVocabularies((prev) =>
          prev.map((vocab) => (vocab.id === word.id ? { ...vocab, memorized: word.memorized } : vocab))
        );
      }
    },
    [showOnlyUnmemorized, order, filteredVocabularies.length]
  );

  const handleChapterToggle = useCallback((chapterId: string, isChecked: boolean) => {
    setSelectedChapters((prev) => (isChecked ? [...prev, chapterId] : prev.filter((id) => id !== chapterId)));
  }, []);

  const keyDownRef = useRef(handleNavigation);

  useEffect(() => {
    keyDownRef.current = handleNavigation;
  }, [handleNavigation]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') {
        keyDownRef.current('next');
        e.preventDefault();
      }
      if (e.key === 'ArrowLeft') {
        keyDownRef.current('prev');
        e.preventDefault();
      }
      if (e.key === ' ') {
        setIsPronounced((prev) => !prev);
        e.preventDefault();
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  // 새로운 단어로 이동하거나 앱이 처음 로드될 때 자동 발음
  useEffect(() => {
    if (currentWord && isPronounced && !showDefinition) {
      speakWord(currentWord.word);
    }
  }, [currentWord, isPronounced, showDefinition, speakWord]);

  const handleBookSelect = useCallback((event: ChangeEvent<HTMLSelectElement>) => {
    const selectedBook = event.target.value;
    setBook(selectedBook);
  }, []);

  useEffect(() => {
    (async () => {
      const books = await getVocabularyBooks();
      setBooks(books);

      if (books.length > 0) {
        setBook(books[0].name);
        const chapters = await getVocabularyChapters(books[0].name);
        setChapters(chapters);
      }
    })();
  }, []);

  useEffect(() => {
    if (!book) return;

    (async () => {
      const chapters = await getVocabularyChapters(book);
      setChapters(chapters);
      setSelectedChapters([]);
    })();
  }, [book]);

  useEffect(() => {
    if (selectedChapters.length === 0) return;

    (async () => {
      const data = await getVocabulariesByChapters(selectedChapters);
      setVocabularies(data);
      setVocabularies((prev) => shuffleArray(prev));
      setOrder(0);
      setShowDefinition(false);
    })();
  }, [selectedChapters]);

  // 필터링된 단어 목록 업데이트
  useEffect(() => {
    if (vocabularies.length > 0) {
      const filtered = vocabularies.filter((word) => !word.memorized);
      setFilteredVocabularies(filtered);
    }
  }, [vocabularies]);

  // 필터링 상태가 변경될 때마다 order가 범위를 벗어나지 않도록 조정
  useEffect(() => {
    if (currentVocabularies.length > 0 && order >= currentVocabularies.length) {
      setOrder(0);
    }
  }, [showOnlyUnmemorized, currentVocabularies.length, order]);

  // 필터 토글 함수
  const toggleFilter = useCallback(() => {
    // 토글 전에 재생 중이면 중지
    if (isPlaying && intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
      setIsPlaying(false);
    }

    setShowOnlyUnmemorized((prev) => !prev);
    setOrder(0); // 필터 변경 시 첫 단어부터 시작
    setShowDefinition(false);
  }, [isPlaying]);

  const handleClickPlay = useCallback(() => {
    if (isPlaying && intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
      setIsPlaying(false);
      return;
    }

    setIsPlaying(true);
    setShowDefinition(false);

    let count = 0;

    setTimeout(() => {
      setShowDefinition(true);
      count++;
    }, 500);

    intervalRef.current = setInterval(() => {
      setShowDefinition((prev) => !prev);
      count++;

      if (count >= 20) {
        count = 0;
        setShowDefinition(false);
        setOrder((current) => (current + 1) % currentVocabularies.length);
      }
    }, 500);
  }, [isPlaying, currentVocabularies.length]);

  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, []);

  return (
    <div className="@container min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 dark:from-gray-900 dark:to-gray-800 px-4 py-6 md:px-8 md:py-10">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between w-full mb-6">
          <Title title="단어 외우기" />
          <AddButton path="/vocabulary/add" />
        </div>
        <div className="flex flex-col md:flex-row items-start justify-between w-full mb-6 gap-4">
          <div className="flex flex-col w-full md:w-1/2 mb-4 md:mb-0">
            <label htmlFor="book-select" className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              단어장 선택
            </label>
            <select
              id="book-select"
              className="bg-white dark:bg-gray-700 p-3 border border-gray-300 dark:border-gray-600 rounded-lg w-full shadow-sm dark:shadow-gray-900/30 focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-indigo-500 dark:focus:border-indigo-400 dark:text-white"
              name="book"
              value={book || ''}
              onChange={handleBookSelect}>
              {books.map((book) => (
                <option key={book.name} value={book.name}>
                  {book.name}
                </option>
              ))}
            </select>
          </div>
          <div className="flex flex-col w-full md:w-1/2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">챕터 선택</label>
            <div className="bg-white dark:bg-gray-700 p-3 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm dark:shadow-gray-900/30 h-[150px] md:h-[180px] flex flex-col overflow-hidden">
              {chapters.length === 0 ? (
                <div className="text-sm text-gray-500 dark:text-gray-400 flex items-center justify-center h-full w-full flex-grow">
                  {book ? (
                    <div className="flex items-center">
                      <Icon
                        type="loading"
                        customClassName="animate-spin -ml-1 mr-2 h-4 w-4 text-indigo-500 dark:text-indigo-400"
                      />
                      로드 중...
                    </div>
                  ) : (
                    '단어장을 먼저 선택하세요'
                  )}
                </div>
              ) : (
                <div className="h-full overflow-y-auto pr-2 space-y-1">
                  {chapters.map((chapter) => (
                    <ChapterCheckbox
                      key={chapter.id}
                      chapter={chapter}
                      isSelected={selectedChapters.includes(chapter.id)}
                      onToggle={handleChapterToggle}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="mt-8">
          {currentVocabularies.length > 0 ? (
            <>
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center">
                  <div className="bg-indigo-100 dark:bg-indigo-900 text-indigo-800 dark:text-indigo-200 py-1 px-3 rounded-full font-medium text-sm">
                    {order + 1} / {currentVocabularies.length}
                  </div>
                  <button
                    onClick={shuffleVocabularies}
                    className="ml-4 bg-white dark:bg-gray-700 p-2 rounded-full shadow-sm dark:shadow-gray-900/30 hover:shadow-md transition-shadow border border-gray-200 dark:border-gray-600 flex items-center text-sm dark:text-gray-300">
                    <Icon type="shuffle" customClassName="w-4 h-4 mr-1 text-indigo-600 dark:text-indigo-400" />
                    섞기
                  </button>
                  <button
                    onClick={handleClickPlay}
                    className="ml-3 bg-white dark:bg-gray-700 py-2 px-3 rounded-lg shadow-sm dark:shadow-gray-900/30 hover:shadow-md transition-shadow border border-gray-200 dark:border-gray-600 flex items-center text-sm dark:text-gray-300">
                    {isPlaying ? (
                      <>
                        <Icon type="pause" customClassName="w-4 h-4 mr-1 text-indigo-600 dark:text-indigo-400" />
                        <span className="text-gray-700 dark:text-gray-300">일시정지</span>
                      </>
                    ) : (
                      <>
                        <Icon type="play" customClassName="w-4 h-4 mr-1 text-indigo-600 dark:text-indigo-400" />
                        <span className="text-gray-700 dark:text-gray-300">재생하기</span>
                      </>
                    )}
                  </button>
                  <button
                    onClick={toggleFilter}
                    className={`ml-3 py-2 px-3 rounded-lg shadow-sm flex items-center text-sm transition-colors duration-200 ${
                      showOnlyUnmemorized
                        ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300 border border-yellow-200 dark:border-yellow-800'
                        : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-600'
                    }`}>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-4 h-4 mr-1 text-current"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
                      />
                    </svg>
                    {showOnlyUnmemorized ? '전체 보기' : '복습하기'}
                  </button>
                </div>
                <button
                  onClick={handleClickSpeaker}
                  className="bg-white dark:bg-gray-700 p-2 rounded-full shadow-sm dark:shadow-gray-900/30 hover:shadow-md transition-shadow border border-gray-200 dark:border-gray-600">
                  {isPronounced ? (
                    <Icon type="soundOn" customClassName="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                  ) : (
                    <Icon type="soundOff" customClassName="w-5 h-5 text-gray-500 dark:text-gray-400" />
                  )}
                </button>
              </div>
              {filteredVocabularies.length === 0 && showOnlyUnmemorized ? (
                <div className="flex flex-col items-center justify-center h-72 rounded-2xl shadow-md dark:shadow-gray-900/30 border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 mb-6 p-6">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-16 h-16 text-green-300 dark:text-green-600 mb-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <div className="text-center text-lg font-medium text-gray-600 dark:text-gray-300">
                    모든 단어를 외웠어요!
                  </div>
                  <p className="text-center text-gray-500 dark:text-gray-400 text-sm mt-2">
                    축하합니다! 모든 단어를 외우셨습니다.
                    <br />
                    다른 챕터를 선택하거나 '전체 보기'를 눌러보세요.
                  </p>
                  <button
                    onClick={toggleFilter}
                    className="mt-4 bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-lg shadow transition-colors duration-200">
                    전체 단어 보기
                  </button>
                </div>
              ) : (
                <>
                  <div className="rounded-2xl shadow-lg dark:shadow-gray-900/30 overflow-hidden mb-6 transition-all duration-300 hover:shadow-xl bg-white dark:bg-gray-700">
                    <div onClick={() => setShowDefinition(!showDefinition)}>
                      <WordCard
                        word={currentWord}
                        showDefinition={showDefinition}
                        onToggleMemorized={handleToggleMemorized}
                      />
                    </div>
                  </div>
                  <NavigationButtons
                    word={currentWord}
                    handleNavigation={handleNavigation}
                    onUpdateVocabulary={handleUpdateVocabulary}
                  />
                </>
              )}
              {showOnlyUnmemorized && (
                <div className="mt-4 mb-2 text-sm text-center text-gray-500 dark:text-gray-400">
                  <span className="font-medium">{filteredVocabularies.length}</span>개의 단어가 복습이 필요합니다 (전체{' '}
                  <span className="font-medium">{vocabularies.length}</span>개 중)
                </div>
              )}
            </>
          ) : (
            <div className="flex flex-col items-center justify-center h-72 rounded-2xl shadow-md dark:shadow-gray-900/30 border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 mb-2 p-6">
              <Icon type="book" customClassName="w-16 h-16 text-gray-300 dark:text-gray-600 mb-4" />
              <div className="text-center text-lg font-medium text-gray-600 dark:text-gray-300">
                단어장과 챕터를 선택하세요
              </div>
              <p className="text-center text-gray-500 dark:text-gray-400 text-sm mt-2">
                학습할 단어를 불러오기 위해
                <br />
                위쪽에서 단어장과 챕터를 선택해주세요.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
