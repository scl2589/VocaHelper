import React from 'react';
import ChapterCheckbox from '@/components/ChapterCheckbox';
import Icon from '@/components/Icon';
import { Book } from '@/types/book';
import { Chapter } from '@/types/chapter';

interface BookChapterSelectorProps {
  books: Book[];
  book: string;
  chapters: Chapter[];
  selectedChapters: string[];
  handleBookSelect: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  handleChapterToggle: (chapterId: string, isChecked: boolean) => void;
  selectAllChapters?: () => void;
  clearAllChapters?: () => void;
  showQuickActions?: boolean;
}

export default function BookChapterSelector({
  books,
  book,
  chapters,
  selectedChapters,
  handleBookSelect,
  handleChapterToggle,
  selectAllChapters,
  clearAllChapters,
  showQuickActions = false,
}: BookChapterSelectorProps) {
  return (
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
          <option value="">전체 단어장</option>
          {books.map((book) => (
            <option key={book.name} value={book.name}>
              {book.name}
            </option>
          ))}
        </select>
      </div>
      
      <div className="flex flex-col w-full md:w-1/2">
        <div className="flex items-center justify-between mb-2">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">챕터 선택</label>
          {showQuickActions && chapters.length > 0 && (
            <div className="flex gap-2">
              <button
                onClick={selectAllChapters}
                className="text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-2 py-1 rounded hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors"
              >
                전체 선택
              </button>
              <button
                onClick={clearAllChapters}
                className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-2 py-1 rounded hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              >
                전체 해제
              </button>
            </div>
          )}
        </div>
        
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
  );
}
