import { useState, useEffect, useCallback } from 'react';
import { getVocabulariesByChapters } from '@/actions/vocabulary';
import { getVocabularyBooks } from '@/actions/vocabularyBook';
import { getVocabularyChapters } from '@/actions/vocabularyChapter';
import { Vocabulary } from '@/types/vocabulary';
import { Book } from '@/types/book';
import { Chapter } from '@/types/chapter';

const shuffleArray = <T,>(array: T[]): T[] => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

export function useVocabularyData() {
  const [vocabularies, setVocabularies] = useState<Vocabulary[]>([]);
  const [originalVocabularies, setOriginalVocabularies] = useState<Vocabulary[]>([]);
  const [isShuffled, setIsShuffled] = useState(false);
  const [filteredVocabularies, setFilteredVocabularies] = useState<Vocabulary[]>([]);
  const [books, setBooks] = useState<Book[]>([]);
  const [book, setBook] = useState('');
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [selectedChapters, setSelectedChapters] = useState<string[]>([]);
  const [showOnlyUnmemorized, setShowOnlyUnmemorized] = useState(false);

  // 단어책 목록 로드하기
  useEffect(() => {
    (async () => {
      const data = await getVocabularyBooks();
      setBooks(data);
      if (data.length > 0) {
        setBook(data[0].name);
      }
    })();
  }, []);

  // 단어책에 속한 챕터/단어장 로드하기
  useEffect(() => {
    if (!book) return;

    (async () => {
      const data = await getVocabularyChapters(book);
      setChapters(data);
      setSelectedChapters([]);
    })();
  }, [book]);

  // 단어장이 바뀌면 단어 로드하기
  useEffect(() => {
    if (selectedChapters.length === 0) return;

    (async () => {
      const data = await getVocabulariesByChapters(selectedChapters);
      setVocabularies(data);
      setOriginalVocabularies(data); // 원본 순서 저장
      setIsShuffled(false); // 새 데이터 로드시 섞인 상태 초기화
    })();
  }, [selectedChapters]);

  // 외우지 못한 단어만 필터링하기
  useEffect(() => {
    if (vocabularies.length > 0) {
      const filtered = vocabularies.filter((word) => !word.memorized);
      setFilteredVocabularies(filtered);
    }
  }, [vocabularies]);

  // 필터에 따른 현재 단어
  const currentVocabularies = showOnlyUnmemorized ? filteredVocabularies : vocabularies;

  // 단어책 선택
  const handleBookSelect = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    setBook(e.target.value);
  }, []);

  // 챕어/단어장 선택
  const handleChapterToggle = useCallback((chapterId: string, isChecked: boolean) => {
    setSelectedChapters((prev) => (isChecked ? [...prev, chapterId] : prev.filter((id) => id !== chapterId)));
  }, []);

  // 단어 셔플/원래 순서 토글
  const shuffleVocabularies = useCallback(() => {
    if (isShuffled) {
      // 현재 섞인 상태라면 원래 순서로 복원
      setVocabularies(originalVocabularies);
      setIsShuffled(false);
    } else {
      // 현재 원래 순서라면 섞기
      setVocabularies((prev) => shuffleArray(prev));
      setIsShuffled(true);
    }
  }, [isShuffled, originalVocabularies]);

  // 외운/외우지 못한 단어 필터
  const toggleFilter = useCallback(() => {
    setShowOnlyUnmemorized((prev) => !prev);
  }, []);

  return {
    vocabularies,
    setVocabularies,
    filteredVocabularies,
    books,
    book,
    chapters,
    selectedChapters,
    showOnlyUnmemorized,
    isShuffled,
    currentVocabularies,
    handleBookSelect,
    handleChapterToggle,
    shuffleVocabularies,
    toggleFilter,
  };
}
