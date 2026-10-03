'use client';

import { useEffect } from 'react';

import Title from '@/components/Title';
import AddButton from '@/components/addButton';
import BookChapterSelector from '@/components/BookChapterSelector';
import MemorizeContent from './components/MemorizeContent';

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
    isShuffled,
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
    speechError,
    repetitionsPerWord,
    handleRepetitionChange,
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

  return (
    <div className="@container min-h-screen bg-background px-4 py-6 md:px-8 md:py-10">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between w-full mb-6">
          <Title title="깜빡이 학습" />
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

        {speechError && <p role="alert" className="mt-4 rounded-lg bg-amber-50 p-3 text-sm text-amber-900">{speechError}</p>}
        <div className="mt-8">
          <MemorizeContent
            currentVocabularies={currentVocabularies}
            filteredVocabularies={filteredVocabularies}
            vocabularies={vocabularies}
            order={order}
            isPlaying={isPlaying}
            isPronounced={isPronounced}
            showOnlyUnmemorized={showOnlyUnmemorized}
            isShuffled={isShuffled}
            showDefinition={showDefinition}
            currentWord={currentWord}
            repetitionsPerWord={repetitionsPerWord}
            onRepetitionChange={handleRepetitionChange}
            onShuffle={shuffleVocabularies}
            onPlay={handleClickPlay}
            onPronounce={handleClickSpeaker}
            onFilter={toggleFilter}
            onToggleDefinition={() => setShowDefinition(!showDefinition)}
            onToggleMemorized={handleToggleMemorized}
            onNavigation={handleNavigation}
            onUpdateVocabulary={handleUpdateVocabulary}
          />
        </div>
      </div>
    </div>
  );
}
