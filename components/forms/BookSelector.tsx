import Link from "next/link";
import { Book } from '@/types/book';

interface BookSelectorProps {
    books: Book[];
    name?: string;
    required?: boolean;
}

export default function BookSelector({ books, name = "book", required = false }: BookSelectorProps) {
    return (
        <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                단어장
            </label>
            <div className="flex items-center gap-3">
                <select 
                    className="flex-1 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-blue-500 dark:focus:border-blue-400"
                    name={name}
                    required={required}
                >
                    <option value="">단어장을 선택하세요</option>
                    {books.map((book) => (
                        <option key={book.name} value={book.name}>{book.name}</option>
                    ))}
                </select>
                <Link 
                    href="/vocabulary/books/add" 
                    className="px-3 py-2 text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors whitespace-nowrap font-medium"
                >
                    + 단어책 추가
                </Link>
            </div>
        </div>
    );
}
