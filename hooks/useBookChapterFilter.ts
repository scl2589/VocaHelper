import { useState, useEffect } from 'react';
import { getVocabularyBooks } from '@/actions/vocabularyBook';
import { getVocabularyChapters } from '@/actions/vocabularyChapter';
import { getVocabularies, getVocabulariesByChapters, getVocabulariesByBook } from '@/actions/vocabulary';
import { Book } from '@/types/book';
import { Chapter } from '@/types/chapter';
import { Vocabulary } from '@/types/vocabulary';

export function useBookChapterFilter() {
  const [books, setBooks] = useState<Book[]>([]);
  const [book, setBook] = useState<string>('');
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [selectedChapters, setSelectedChapters] = useState<string[]>([]);
  const [vocabularies, setVocabularies] = useState<Vocabulary[]>([]);
  const [filteredVocabularies, setFilteredVocabularies] = useState<Vocabulary[]>([]);

  // Load books on mount
  useEffect(() => {
    const loadBooks = async () => {
      const booksData = await getVocabularyBooks();
      setBooks(booksData);
    };
    loadBooks();
  }, []);

  // Load chapters when book changes
  useEffect(() => {
    const loadChapters = async () => {
      if (book) {
        const chaptersData = await getVocabularyChapters(book);
        setChapters(chaptersData);
        // Reset selected chapters when book changes
        setSelectedChapters([]);
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
        // If specific chapters are selected, show only those chapters' vocabularies
        const vocabulariesData = await getVocabulariesByChapters(selectedChapters);
        setVocabularies(vocabulariesData);
        setFilteredVocabularies(vocabulariesData);
      } else if (book) {
        // If only book is selected (no specific chapters), show all vocabularies from that book
        const bookVocabularies = await getVocabulariesByBook(book);
        setVocabularies(bookVocabularies);
        setFilteredVocabularies(bookVocabularies);
      } else {
        // If no book selected, show all vocabularies
        const vocabulariesData = await getVocabularies();
        setVocabularies(vocabulariesData);
        setFilteredVocabularies(vocabulariesData);
      }
    };
    loadVocabularies();
  }, [book, selectedChapters]);

  const handleBookSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setBook(e.target.value);
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

  return {
    books,
    book,
    chapters,
    selectedChapters,
    vocabularies,
    filteredVocabularies,
    handleBookSelect,
    handleChapterToggle,
    selectAllChapters,
    clearAllChapters,
  };
}
