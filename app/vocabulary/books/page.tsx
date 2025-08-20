import { getVocabularyBooks } from "@/actions/vocabularyBook";
import React from "react";
import PageHeader from "@/components/forms/PageHeader";
import FormCard from "@/components/forms/FormCard";
import Link from "next/link";

export default async function Page() {
    const books = await getVocabularyBooks();

    return (
        <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 dark:from-gray-900 dark:to-gray-800 px-4 py-6 md:px-8 md:py-10">
            <div className="max-w-4xl mx-auto">
                <PageHeader 
                    title="단어책 목록"
                    actionText="단어책 추가"
                    actionHref="/vocabulary/books/add"
                />

                <FormCard
                    title="내 단어책들"
                    description="생성한 단어책들을 확인하고 관리하세요"
                >
                    {books && books.length > 0 ? (
                        <div className="space-y-3">
                            {books.map((book) => (
                                <Link 
                                    key={book.name} 
                                    href={`/vocabulary?book=${encodeURIComponent(book.name)}`}
                                    className="block w-full bg-white dark:bg-gray-700 p-4 rounded-lg border border-gray-200 dark:border-gray-600 hover:border-blue-300 dark:hover:border-blue-500 hover:shadow-md transition-all duration-200"
                                >
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                                                <svg className="w-5 h-5 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                                </svg>
                                            </div>
                                            <div>
                                                <h3 className="font-medium text-gray-900 dark:text-white">
                                                    {book.name}
                                                </h3>
                                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                                    단어책
                                                </p>
                                            </div>
                                        </div>
                                        <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                        </svg>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-12">
                            <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                </svg>
                            </div>
                            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                                단어책이 없습니다
                            </h3>
                            <p className="text-gray-500 dark:text-gray-400 mb-6">
                                첫 번째 단어책을 만들어보세요
                            </p>
                            <Link 
                                href="/vocabulary/books/add"
                                className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors duration-200"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                </svg>
                                단어책 만들기
                            </Link>
                        </div>
                    )}
                </FormCard>
            </div>
        </div>
    );
}