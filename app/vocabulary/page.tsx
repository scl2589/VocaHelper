'use client';

import { useState, useEffect } from "react";
import { deleteVocabulary } from "@/actions/vocabulary";
import AddButton from "@/components/addButton";
import Title from "@/components/Title";
import BookChapterSelector from "@/components/BookChapterSelector";
import { Vocabulary, Definition } from "@/types/vocabulary";
import { useBookChapterFilter } from "@/hooks/useBookChapterFilter";

export default function VocabularyPage() {
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
                <div className="flex items-center justify-between w-full mb-6">
                    <Title title="단어 목록"/>
                    <AddButton path="/vocabulary/add" />
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

                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                    단어 목록
                                </h3>
                                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                    {getFilterDescription()}
                                </p>
                            </div>
                            <span className="text-sm text-gray-500 dark:text-gray-400">
                                총 {filteredVocabularies.length}개 단어
                            </span>
                        </div>
                    </div>

                    {filteredVocabularies.length === 0 ? (
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
                    ) : (
                        <div className="divide-y divide-gray-200 dark:divide-gray-700">
                            {filteredVocabularies.map((vocab) => (
                                <div key={vocab.id} className="p-6 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                                    <div className="flex flex-col md:flex-row md:items-center gap-4">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-3 mb-2">
                                                <h4 className="text-xl font-semibold text-gray-900 dark:text-white">
                                                    {vocab.word}
                                                </h4>
                                                <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                                                    vocab.memorized 
                                                        ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
                                                        : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300'
                                                }`}>
                                                    {vocab.memorized ? '외웠어요' : '어려워요'}
                                                </span>
                                            </div>
                                            
                                            <div className="space-y-1">
                                                {vocab.definitions.map(({ definition, partOfSpeech }: Definition, index) => (
                                                    <div key={index} className="text-gray-600 dark:text-gray-300">
                                                        {partOfSpeech && (
                                                            <span className="inline-block bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 px-2 py-0.5 rounded text-xs mr-2">
                                                                {partOfSpeech}
                                                            </span>
                                                        )}
                                                        {definition}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                        
                                        <div className="flex items-center gap-2">
                                            <button
                                                onClick={() => handleDelete(vocab.id)}
                                                className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                                                title="삭제"
                                            >
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                </svg>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
