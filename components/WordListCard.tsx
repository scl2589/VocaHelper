'use client';

import { useState, useEffect } from 'react';
import { Vocabulary, Definition } from '@/types/vocabulary';

interface WordListCardProps {
  vocab: Vocabulary;
  onDelete: (id: string) => void;
  showDefinitions: boolean;
  onToggleDefinitions: () => void;
}

export default function WordListCard({ 
  vocab, 
  onDelete, 
  showDefinitions, 
  onToggleDefinitions 
}: WordListCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  // 스페이스바 키 이벤트 처리
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.code === 'Space' && isHovered) {
        event.preventDefault();
        event.stopPropagation();
        onToggleDefinitions();
      }
    };

    if (isHovered) {
      document.addEventListener('keydown', handleKeyDown, { passive: false });
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isHovered, onToggleDefinitions]);

  return (
    <div 
      className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-all duration-200 cursor-pointer active:scale-[0.98] md:active:scale-100"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onToggleDefinitions}
    >
      <div className="p-5 md:p-6">
        {/* 모바일: 세로 레이아웃, 데스크톱: 가로 레이아웃 */}
        <div className="flex flex-col md:flex-row md:items-start gap-5 md:gap-6">
          {/* 상단: 단어와 삭제 버튼 */}
          <div className="flex items-start justify-between md:w-64 md:flex-shrink-0">
            <div className="flex-1 min-w-0 pr-3">
              <div className="flex flex-col gap-3">
                <h3 className="text-2xl md:text-2xl font-bold text-gray-900 dark:text-white leading-tight">
                  {vocab.word}
                </h3>
                {/* 데스크톱에서만 상태 표시 */}
                <span className={`hidden md:inline-block px-4 py-2 text-sm font-medium rounded-full w-fit ${
                  vocab.memorized 
                    ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
                    : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300'
                }`}>
                  {vocab.memorized ? '외웠어요' : '어려워요'}
                </span>
              </div>
            </div>

            {/* 삭제 버튼 - 데스크톱에서만 표시 */}
            <div className="hidden md:block flex-shrink-0">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(vocab.id);
                }}
                className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                title="삭제"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          </div>

          {/* 하단: 품사와 의미 */}
          <div className="w-full md:flex-1">
            {showDefinitions ? (
              <div className="space-y-3 w-full">
                {vocab.definitions.map(({ definition, partOfSpeech }: Definition, index) => (
                  <div key={index} className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 border border-blue-100 dark:border-blue-800/30">
                    <div className="flex items-start gap-3">
                      {partOfSpeech && (
                        <span className="inline-block bg-blue-200 dark:bg-blue-800/40 text-blue-800 dark:text-blue-200 px-3 py-1 rounded-full text-sm font-medium whitespace-nowrap flex-shrink-0">
                          {partOfSpeech}
                        </span>
                      )}
                      <p className="text-gray-800 dark:text-gray-200 leading-relaxed text-base">
                        {definition}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex items-center justify-center w-full h-20 md:h-24 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-100 dark:border-blue-800/30">
                <div className="text-center">
                  <div className="w-8 h-8 mx-auto mb-2 bg-gray-200 dark:bg-gray-600 rounded-full flex items-center justify-center">
                    <svg className="w-4 h-4 text-gray-500 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  </div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">
                    터치하여 의미 보기
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
