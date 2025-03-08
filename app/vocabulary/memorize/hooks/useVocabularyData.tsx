import { useState, useEffect, useCallback } from 'react';
import { getVocabulariesByChapters } from '@/actions/vocabulary';
import { getVocabularyBooks } from '@/actions/vocabularyBook';
import { getVocabularyChapters } from '@/actions/vocabularyChapter';
import { Vocabulary } from '@/types/vocabulary';
import { Book } from '@/types/book';
import { Chapter } from '@/types/chapter';

// Helper function for shuffling arrays
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
      setVocabularies(shuffleArray(data));
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

  // 단어 셔플
  const shuffleVocabularies = useCallback(() => {
    setVocabularies((prev) => shuffleArray(prev));
  }, []);

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
    currentVocabularies,
    handleBookSelect,
    handleChapterToggle,
    shuffleVocabularies,
    toggleFilter,
  };
}
