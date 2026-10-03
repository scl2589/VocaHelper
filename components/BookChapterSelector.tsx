import React from 'react';
import { Book } from '@/types/book';
import { Chapter } from '@/types/chapter';
interface BookChapterSelectorProps {
 books: Book[]; book: string; chapters: Chapter[]; selectedChapters: string[];
 handleBookSelect: (event: React.ChangeEvent<HTMLSelectElement>) => void;
 handleChapterToggle: (id: string, checked: boolean) => void;
 selectAllChapters?: () => void; clearAllChapters?: () => void; showQuickActions?: boolean;
}
export default function BookChapterSelector({books,book,chapters,selectedChapters,handleBookSelect,handleChapterToggle,selectAllChapters,clearAllChapters,showQuickActions=false}:BookChapterSelectorProps) {
 return <section aria-label="학습 범위" className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-5 mb-6">
  <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6"><label htmlFor="book-select" className="text-sm font-semibold whitespace-nowrap text-gray-800 dark:text-gray-100">학습할 단어장</label><select id="book-select" name="book" value={book || ''} onChange={handleBookSelect} className="w-full min-w-0 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-gray-900 dark:text-white"><option value="">전체 단어장</option>{books.map(item=><option key={item.name} value={item.name}>{item.name}</option>)}</select></div>
  <details className="mt-4 border-t border-gray-200 dark:border-gray-700 pt-4" open={undefined}><summary className="cursor-pointer text-sm font-medium text-gray-700 dark:text-gray-200">챕터 선택 <span className="ml-2 text-xs text-gray-500 dark:text-gray-400">{selectedChapters.length ? `${selectedChapters.length}개 선택됨` : '눌러서 학습 범위 선택'}</span></summary>
   {showQuickActions && chapters.length>0 && <div className="flex gap-4 mt-4 text-sm text-blue-600 dark:text-blue-300"><button onClick={selectAllChapters}>전체 선택</button><button onClick={clearAllChapters}>선택 해제</button></div>}
   {chapters.length ? <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 mt-4 max-h-52 overflow-y-auto">{chapters.map(chapter=><label key={chapter.id} className={`flex items-center gap-2 rounded-lg border p-3 cursor-pointer text-sm ${selectedChapters.includes(chapter.id)?'border-blue-300 bg-blue-50 text-blue-800 dark:bg-blue-900 dark:text-blue-100':'border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-200'}`}><input type="checkbox" checked={selectedChapters.includes(chapter.id)} onChange={event=>handleChapterToggle(chapter.id,event.target.checked)}/><span>{chapter.name}</span></label>)}</div>:<p className="text-sm text-gray-500 dark:text-gray-400 mt-4">{book?'표시할 챕터가 없습니다.':'단어장을 선택하면 챕터를 볼 수 있어요.'}</p>}
  </details>
 </section>;
}
