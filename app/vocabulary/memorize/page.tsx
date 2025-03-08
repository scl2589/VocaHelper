'use client';

import { useEffect } from 'react';

import Title from '@/components/Title';
import AddButton from '@/components/addButton';
import WordCard from '@/components/WordCard';
import NavigationButtons from '@/components/NavigationButtons';
import BookChapterSelector from './components/BookChapterSelector';
import WordControls from './components/WordControls';
import Icon from '@/components/Icon';

import { useVocabularyData } from './hooks/useVocabularyData';
import { useWordPlayback } from './hooks/useWordPlayback';
import { useWordModification } from './hooks/useWordModification';
import { useKeyboardNavigation } from './hooks/useKeyboardNavigation';

export default function MemorizePage() {
  // Data management hooks
  const {
    vocabularies,
    setVocabularies,
    filteredVocabularies,
    books,
    book,
    chapters,
    selectedChapters,
    showOnlyUnmemorized,
    currentVocabularies,
    handleBookSelect,
    handleChapterToggle,
    shuffleVocabularies,
    toggleFilter,
  } = useVocabularyData();

  // Word playback hooks
  const {
    order,
    setOrder,
    showDefinition,
    setShowDefinition,
    isPronounced,
    isPlaying,
    currentWord,
    speakWord,
    handleClickSpeaker,
    handleNavigation,
    handleClickPlay,
    resetPosition,
  } = useWordPlayback(vocabularies, filteredVocabularies);

  // Word modification hooks
  const { handleUpdateVocabulary, handleToggleMemorized } = useWordModification(
    vocabularies,
    setVocabularies,
    showOnlyUnmemorized,
    order,
    filteredVocabularies,
    setOrder
  );

  // Setup keyboard navigation
  useKeyboardNavigation(currentVocabularies.length > 0, handleNavigation, handleClickPlay);

  // Reset position when filter changes
  useEffect(() => {
    resetPosition();
  }, [showOnlyUnmemorized, resetPosition]);

  // Speak word when navigation changes
  useEffect(() => {
    if (currentWord && isPronounced && !isPlaying) {
      speakWord(currentWord.word);
    }
  }, [currentWord, isPronounced, speakWord, isPlaying]);

  return (
    <div className="@container min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 dark:from-gray-900 dark:to-gray-800 px-4 py-6 md:px-8 md:py-10">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between w-full mb-6">
          <Title title="단어 외우기" />
          <AddButton path="/vocabulary/add" />
        </div>

        <BookChapterSelector
          books={books}
          book={book}
          chapters={chapters}
          selectedChapters={selectedChapters}
          handleBookSelect={handleBookSelect}
          handleChapterToggle={handleChapterToggle}
        />

        <div className="mt-8">
          {currentVocabularies.length > 0 ? (
            <>
              <WordControls
                order={order}
                totalWords={currentVocabularies.length}
                isPlaying={isPlaying}
                isPronounced={isPronounced}
                showOnlyUnmemorized={showOnlyUnmemorized}
                onShuffle={shuffleVocabularies}
                onPlay={handleClickPlay}
                onPronounce={handleClickSpeaker}
                onFilter={toggleFilter}
                filteredCount={filteredVocabularies.length}
                totalCount={vocabularies.length}
              />

              {filteredVocabularies.length === 0 && showOnlyUnmemorized ? (
                <div className="flex flex-col items-center justify-center h-72 rounded-2xl shadow-md dark:shadow-gray-900/30 border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 mb-6 p-6">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-16 h-16 text-green-300 dark:text-green-600 mb-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <div className="text-center text-lg font-medium text-gray-600 dark:text-gray-300">
                    모든 단어를 외웠어요!
                  </div>
                  <p className="text-center text-gray-500 dark:text-gray-400 text-sm mt-2">
                    축하합니다! 모든 단어를 외우셨습니다.
                    <br />
                    다른 챕터를 선택하거나 &apos;전체 보기&apos;를 눌러보세요.
                  </p>
                  <button
                    onClick={toggleFilter}
                    className="mt-4 bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-lg shadow transition-colors duration-200">
                    전체 단어 보기
                  </button>
                </div>
              ) : (
                <>
                  <div className="rounded-2xl shadow-lg dark:shadow-gray-900/30 overflow-hidden mb-6 transition-all duration-300 hover:shadow-xl bg-white dark:bg-gray-700">
                    <div onClick={() => setShowDefinition(!showDefinition)}>
                      <WordCard
                        word={currentWord}
                        showDefinition={showDefinition}
                        onToggleMemorized={(word) => handleToggleMemorized(word)}
                      />
                    </div>
                  </div>
                  <NavigationButtons
                    word={currentWord}
                    handleNavigation={handleNavigation}
                    onUpdateVocabulary={handleUpdateVocabulary}
                  />
                </>
              )}
            </>
          ) : (
            <div className="flex flex-col items-center justify-center h-72 rounded-2xl shadow-md dark:shadow-gray-900/30 border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 mb-2 p-6">
              <Icon type="book" customClassName="w-16 h-16 text-gray-300 dark:text-gray-600 mb-4" />
              <div className="text-center text-lg font-medium text-gray-600 dark:text-gray-300">
                단어장과 챕터를 선택하세요
              </div>
              <p className="text-center text-gray-500 dark:text-gray-400 text-sm mt-2">
                학습할 단어를 불러오기 위해
                <br />
                위쪽에서 단어장과 챕터를 선택해주세요.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
