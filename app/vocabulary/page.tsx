'use client';

import AddButton from "@/components/addButton";
import Title from "@/components/Title";
import BookChapterSelector from "@/components/BookChapterSelector";
import { useBookChapterFilter } from "@/hooks/useBookChapterFilter";
import Link from "next/link";
import { Suspense, useState, useEffect, useMemo } from "react";

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

    const [showScrollTop, setShowScrollTop] = useState(false);
    const [hideAllDefinitions, setHideAllDefinitions] = useState(false);
    const [clickedWords, setClickedWords] = useState<Set<string>>(new Set());
    const [isShuffled, setIsShuffled] = useState(false);

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    };

    const toggleHideAllDefinitions = () => {
        setHideAllDefinitions(!hideAllDefinitions);
        if (!hideAllDefinitions) {
            // 숨기기 모드로 전환할 때 클릭된 단어들 초기화
            setClickedWords(new Set());
        }
    };

    const toggleWordDefinition = (wordId: string) => {
        if (!hideAllDefinitions) return;
        
        setClickedWords(prev => {
            const newSet = new Set(prev);
            if (newSet.has(wordId)) {
                newSet.delete(wordId);
            } else {
                newSet.add(wordId);
            }
            return newSet;
        });
    };

    const shuffleWords = () => {
        setIsShuffled(!isShuffled);
        // 셔플할 때는 클릭된 단어들의 상태를 유지 (초기화하지 않음)
    };

    // 스크롤 이벤트 리스너
    useEffect(() => {
        const handleScroll = () => {
            setShowScrollTop(window.scrollY > 300);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // 셔플된 단어 목록 생성 (메모이제이션으로 안정적인 셔플)
    const displayVocabularies = useMemo(() => {
        if (!isShuffled) return filteredVocabularies;
        
        // 셔플할 때는 안정적인 셔플을 위해 현재 시간을 시드로 사용
        const shuffled = [...filteredVocabularies];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    }, [filteredVocabularies, isShuffled]);

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
                        <Title title="단어 외우기"/>
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
                                단어 외우기
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
                                <button
                                    onClick={toggleHideAllDefinitions}
                                    className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
                                        hideAllDefinitions
                                            ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300'
                                            : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                                    }`}
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                                    </svg>
                                    {hideAllDefinitions ? '의미 보이기' : '의미 숨기기'}
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
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50 dark:bg-gray-700">
                                    <tr>
                                        <th className="w-32 px-4 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white border-r border-gray-200 dark:border-gray-600">
                                            단어
                                        </th>
                                        <th className="w-80 px-4 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white border-r-2 border-gray-400 dark:border-gray-500">
                                            의미
                                        </th>
                                        <th className="w-32 px-4 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white border-r border-gray-200 dark:border-gray-600">
                                            단어
                                        </th>
                                        <th className="w-80 px-4 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">
                                            의미
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                                    {Array.from({ length: Math.ceil(displayVocabularies.length / 2) }, (_, rowIndex) => {
                                        const leftVocab = displayVocabularies[rowIndex * 2];
                                        const rightVocab = displayVocabularies[rowIndex * 2 + 1];
                                        
                                        return (
                                            <tr key={rowIndex}>
                                                {/* 왼쪽 단어 */}
                                                <td className="w-32 px-4 py-3 border-r border-gray-200 dark:border-gray-700">
                                                    {leftVocab && (
                                                        <div 
                                                            className={`text-lg font-semibold text-gray-900 dark:text-white ${
                                                                hideAllDefinitions ? 'cursor-pointer hover:text-blue-600 dark:hover:text-blue-400' : ''
                                                            }`}
                                                            onClick={() => toggleWordDefinition(leftVocab.id)}
                                                        >
                                                            {leftVocab.word}
                                                        </div>
                                                    )}
                                                </td>
                                                {/* 왼쪽 의미 */}
                                                <td 
                                                    className={`w-80 px-4 py-3 border-r-2 border-gray-400 dark:border-gray-500 ${
                                                        hideAllDefinitions ? 'cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700/30' : ''
                                                    }`}
                                                    onClick={() => toggleWordDefinition(leftVocab?.id || '')}
                                                >
                                                    {leftVocab && (
                                                        <div className="space-y-1">
                                                            {!hideAllDefinitions || clickedWords.has(leftVocab.id) ? (
                                                                leftVocab.definitions.map(({ definition, partOfSpeech }, index) => (
                                                                    <div key={index} className="text-gray-700 dark:text-gray-300 text-sm">
                                                                        {partOfSpeech && (
                                                                            <span className="inline-block bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 px-2 py-1 rounded text-xs font-medium mr-2">
                                                                                {partOfSpeech}
                                                                            </span>
                                                                        )}
                                                                        {definition}
                                                                    </div>
                                                                ))
                                                            ) : (
                                                                <div className="text-gray-400 dark:text-gray-500 text-sm italic">
                                                                    클릭하여 의미 보기
                                                                </div>
                                                            )}
                                                        </div>
                                                    )}
                                                </td>
                                                {/* 오른쪽 단어 */}
                                                <td className="w-32 px-4 py-3 border-r border-gray-200 dark:border-gray-700">
                                                    {rightVocab && (
                                                        <div 
                                                            className={`text-lg font-semibold text-gray-900 dark:text-white ${
                                                                hideAllDefinitions ? 'cursor-pointer hover:text-blue-600 dark:hover:text-blue-400' : ''
                                                            }`}
                                                            onClick={() => toggleWordDefinition(rightVocab.id)}
                                                        >
                                                            {rightVocab.word}
                                                        </div>
                                                    )}
                                                </td>
                                                {/* 오른쪽 의미 */}
                                                <td 
                                                    className={`w-80 px-4 py-3 ${
                                                        hideAllDefinitions ? 'cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700/30' : ''
                                                    }`}
                                                    onClick={() => toggleWordDefinition(rightVocab?.id || '')}
                                                >
                                                    {rightVocab && (
                                                        <div className="space-y-1">
                                                            {!hideAllDefinitions || clickedWords.has(rightVocab.id) ? (
                                                                rightVocab.definitions.map(({ definition, partOfSpeech }, index) => (
                                                                    <div key={index} className="text-gray-700 dark:text-gray-300 text-sm">
                                                                        {partOfSpeech && (
                                                                            <span className="inline-block bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 px-2 py-1 rounded text-xs font-medium mr-2">
                                                                                {partOfSpeech}
                                                                            </span>
                                                                        )}
                                                                        {definition}
                                                                    </div>
                                                                ))
                                                            ) : (
                                                                <div className="text-gray-400 dark:text-gray-500 text-sm italic">
                                                                    클릭하여 의미 보기
                                                                </div>
                                                            )}
                                                        </div>
                                                    )}
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
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
