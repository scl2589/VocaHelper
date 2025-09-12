'use client';

import { deleteVocabulary } from "@/actions/vocabulary";
import AddButton from "@/components/addButton";
import Title from "@/components/Title";
import BookChapterSelector from "@/components/BookChapterSelector";
import WordListCard from "@/components/WordListCard";
import { Definition } from "@/types/vocabulary";
import { useBookChapterFilter } from "@/hooks/useBookChapterFilter";
import Link from "next/link";
import { Suspense, useState } from "react";

function VocabularyContent() {
    const {
        books,
        book,
        chapters,
        selectedChapters,
        filteredVocabularies,
        handleBookSelect,
        handleChapterToggle,
        selectAllChapters,
        clearAllChapters,
    } = useBookChapterFilter();

    const [showDefinitions, setShowDefinitions] = useState(false);

    const toggleDefinitions = () => {
        setShowDefinitions(!showDefinitions);
    };

    const handleDelete = async (id: string) => {
        const confirmed = window.confirm("정말 삭제하시겠습니까?");
        if (confirmed) {
            const formData = new FormData();
            formData.append("id", id);
            await deleteVocabulary(formData);
            window.location.reload();
        }
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
            <div className="max-w-6xl mx-auto">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
                        <Title title="단어 목록"/>
                        {book && (
                            <div className="flex items-center gap-2 px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full text-sm font-medium w-fit">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                </svg>
                                <span className="truncate">{book}</span>
                            </div>
                        )}
                    </div>
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                        <Link 
                            href="/vocabulary/quiz"
                            className="flex items-center justify-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-lg transition-colors duration-200 shadow-sm hover:shadow-md"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                            </svg>
                            <span className="whitespace-nowrap">퀴즈 풀기</span>
                        </Link>
                        <AddButton path="/vocabulary/add" />
                    </div>
                </div>

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

                {/* 헤더 정보 */}
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4 md:p-6 mb-6">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                단어 목록
                            </h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                {getFilterDescription()}
                            </p>
                        </div>
                        <div className="flex flex-col sm:flex-row sm:items-center gap-3 md:gap-4">
                            <span className="text-sm text-gray-500 dark:text-gray-400">
                                총 {filteredVocabularies.length}개 단어
                            </span>
                        </div>
                    </div>
                </div>

                {/* 단어 카드들 */}
                {filteredVocabularies.length === 0 ? (
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                        <div className="flex flex-col items-center justify-center py-12">
                            <svg
                                className="w-16 h-16 text-gray-300 dark:text-gray-600 mb-4"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                                />
                            </svg>
                            <p className="text-gray-500 dark:text-gray-400 text-center">
                                {selectedChapters.length > 0 
                                    ? '선택한 챕터에 단어가 없습니다.' 
                                    : book 
                                    ? '선택한 단어장에 단어가 없습니다.'
                                    : '단어를 추가해보세요!'}
                            </p>
                        </div>
                    </div>
                ) : (
                    <div className="space-y-3 md:space-y-4">
                        {filteredVocabularies.map((vocab) => (
                            <WordListCard
                                key={vocab.id}
                                vocab={vocab}
                                onDelete={handleDelete}
                                showDefinitions={showDefinitions}
                                onToggleDefinitions={toggleDefinitions}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

function LoadingFallback() {
    return (
        <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
            <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className="text-gray-600 dark:text-gray-400">단어 목록을 불러오는 중...</p>
            </div>
        </div>
    );
}

export default function VocabularyPage() {
    return (
        <Suspense fallback={<LoadingFallback />}>
            <VocabularyContent />
        </Suspense>
    );
}
