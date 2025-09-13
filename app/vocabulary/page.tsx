'use client';

import { deleteVocabulary } from "@/actions/vocabulary";
import AddButton from "@/components/addButton";
import Title from "@/components/Title";
import BookChapterSelector from "@/components/BookChapterSelector";
import WordListCard from "@/components/WordListCard";
import { useBookChapterFilter } from "@/hooks/useBookChapterFilter";
import Link from "next/link";
import { Suspense, useState, useEffect } from "react";

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
    const [isShuffled, setIsShuffled] = useState(false);
    const [showScrollTop, setShowScrollTop] = useState(false);

    const toggleDefinitions = () => {
        setShowDefinitions(!showDefinitions);
    };

    const shuffleWords = () => {
        setIsShuffled(!isShuffled);
    };

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    };

    // 스크롤 이벤트 리스너
    useEffect(() => {
        const handleScroll = () => {
            setShowScrollTop(window.scrollY > 300);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // 셔플된 단어 목록 생성
    const displayVocabularies = isShuffled 
        ? [...filteredVocabularies].sort(() => Math.random() - 0.5)
        : filteredVocabularies;

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
                            <div className="flex items-center gap-3">
                                <button
                                    onClick={shuffleWords}
                                    className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
                                        isShuffled
                                            ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300'
                                            : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                                    }`}
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                    </svg>
                                    {isShuffled ? '섞기 해제' : '단어 섞기'}
                                </button>
                            </div>
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
                        {displayVocabularies.map((vocab) => (
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

            {/* 맨 위로 이동 버튼 */}
            {showScrollTop && (
                <button
                    onClick={scrollToTop}
                    className="fixed bottom-4 right-4 md:bottom-6 md:right-6 z-50 bg-blue-600 hover:bg-blue-700 text-white p-3 md:p-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105 touch-manipulation"
                    aria-label="맨 위로 이동"
                >
                    <svg className="w-6 h-6 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                    </svg>
                </button>
            )}
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
