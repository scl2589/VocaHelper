import React from 'react';
import Icon from '@/components/Icon';

interface WordControlsProps {
  order: number;
  totalWords: number;
  isPlaying: boolean;
  isPronounced: boolean;
  showOnlyUnmemorized: boolean;
  isShuffled: boolean;
  onShuffle: () => void;
  onPlay: () => void;
  onPronounce: () => void;
  onFilter: () => void;
  filteredCount?: number;
  totalCount?: number;
}

export default function WordControls({
  order,
  totalWords,
  isPlaying,
  isPronounced,
  showOnlyUnmemorized,
  isShuffled,
  onShuffle,
  onPlay,
  onPronounce,
  onFilter,
  filteredCount,
  totalCount,
}: WordControlsProps) {
  return (
    <>
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center">
          <div className="min-w-[40px] md-min-w-[80px] text-center bg-indigo-100 dark:bg-indigo-900 text-indigo-800 dark:text-indigo-200 py-1 px-3 rounded-full font-medium text-sm">
            {order + 1} / {totalWords}
          </div>
          <button
            onClick={onShuffle}
            className="ml-4 bg-white dark:bg-gray-700 p-2 rounded-full shadow-sm dark:shadow-gray-900/30 hover:shadow-md transition-shadow border border-gray-200 dark:border-gray-600 flex items-center text-sm dark:text-gray-300">
            <Icon type={isShuffled ? "arrowLeft" : "shuffle"} customClassName="w-4 h-4 mr-1 text-indigo-600 dark:text-indigo-400" />
            <span className="hidden sm:inline">{isShuffled ? '원복' : '섞기'}</span>
          </button>
          <button
            onClick={onPlay}
            className="ml-3 bg-white dark:bg-gray-700 py-2 px-3 rounded-lg shadow-sm dark:shadow-gray-900/30 hover:shadow-md transition-shadow border border-gray-200 dark:border-gray-600 flex items-center text-sm dark:text-gray-300">
            {isPlaying ? (
              <>
                <Icon type="pause" customClassName="w-4 h-4 mr-1 text-indigo-600 dark:text-indigo-400" />
                <span className="text-gray-700 dark:text-gray-300">정지</span>
              </>
            ) : (
              <>
                <Icon type="play" customClassName="w-4 h-4 mr-1 text-indigo-600 dark:text-indigo-400" />
                <span className="text-gray-700 dark:text-gray-300">재생</span>
              </>
            )}
          </button>
          <button
            onClick={onFilter}
            className={`ml-3 py-2 px-3 rounded-lg shadow-sm flex items-center text-sm transition-colors duration-200 ${
              showOnlyUnmemorized
                ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300 border border-yellow-200 dark:border-yellow-800'
                : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-600'
            }`}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-4 h-4 mr-1 text-current"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
              />
            </svg>
            {showOnlyUnmemorized ? '전체' : '복습'}
          </button>
        </div>
        <button
          onClick={onPronounce}
          className="bg-white dark:bg-gray-700 p-2 rounded-full shadow-sm dark:shadow-gray-900/30 hover:shadow-md transition-shadow border border-gray-200 dark:border-gray-600">
          {isPronounced ? (
            <Icon type="soundOn" customClassName="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
          ) : (
            <Icon type="soundOff" customClassName="w-5 h-5 text-gray-500 dark:text-gray-400" />
          )}
        </button>
      </div>

      {showOnlyUnmemorized && filteredCount !== undefined && totalCount !== undefined && (
        <div className="mt-4 mb-2 text-sm text-center text-gray-500 dark:text-gray-400">
          <span className="font-medium">{filteredCount}</span>개의 단어가 복습이 필요합니다 (전체{' '}
          <span className="font-medium">{totalCount}</span>개 중)
        </div>
      )}
    </>
  );
}
