import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { getVocabularyBooks } from '@/actions/vocabularyBook';
import { getVocabularyChapters } from '@/actions/vocabularyChapter';
import { getVocabularies, getVocabulariesByChapters, getVocabulariesByBook } from '@/actions/vocabulary';
import { Book } from '@/types/book';
import { Chapter } from '@/types/chapter';
import { Vocabulary } from '@/types/vocabulary';

export function useBookChapterFilter() {
  const searchParams = useSearchParams();
  const [books, setBooks] = useState<Book[]>([]);
  const [book, setBook] = useState<string>('');
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [selectedChapters, setSelectedChapters] = useState<string[]>([]);
  const [vocabularies, setVocabularies] = useState<Vocabulary[]>([]);
  const [filteredVocabularies, setFilteredVocabularies] = useState<Vocabulary[]>([]);

  useEffect(() => {
    const loadBooks = async () => {
      const booksData = await getVocabularyBooks();
      setBooks(booksData);
    };
    loadBooks();
  }, []);

  useEffect(() => {
    const bookParam = searchParams.get('book');
    if (bookParam && bookParam !== book) {
      setBook(bookParam);
    }
  }, [searchParams, book]);

  useEffect(() => {
    const loadChapters = async () => {
      if (book) {
        const chaptersData = await getVocabularyChapters(book);
        setChapters(chaptersData);
        setSelectedChapters([]);
      } else {
        setChapters([]);
        setSelectedChapters([]);
      }
    };
    loadChapters();
  }, [book]);

  useEffect(() => {
    const loadVocabularies = async () => {
      if (selectedChapters.length > 0) {
        const vocabulariesData = await getVocabulariesByChapters(selectedChapters);
        setVocabularies(vocabulariesData);
        setFilteredVocabularies(vocabulariesData);
      } else if (book) {
        const bookVocabularies = await getVocabulariesByBook(book);
        setVocabularies(bookVocabularies);
        setFilteredVocabularies(bookVocabularies);
      } else {
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
