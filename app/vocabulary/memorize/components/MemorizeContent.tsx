import WordCard from '@/components/WordCard';
import NavigationButtons from '@/components/NavigationButtons';
import WordControls from './WordControls';
import { Vocabulary } from '@/types/vocabulary';

interface MemorizeContentProps {
  currentVocabularies: Vocabulary[];
  filteredVocabularies: Vocabulary[];
  vocabularies: Vocabulary[];
  order: number;
  isPlaying: boolean;
  isPronounced: boolean;
  showOnlyUnmemorized: boolean;
  isShuffled: boolean;
  showDefinition: boolean;
  currentWord: Vocabulary | null;
  onShuffle: () => void;
  onPlay: () => void;
  onPronounce: () => void;
  onFilter: () => void;
  onToggleDefinition: () => void;
  onToggleMemorized: (word: Vocabulary) => void;
  onNavigation: (direction: 'prev' | 'next') => void;
  onUpdateVocabulary: (word: Vocabulary) => void;
}

export default function MemorizeContent({
  currentVocabularies,
  filteredVocabularies,
  vocabularies,
  order,
  isPlaying,
  isPronounced,
  showOnlyUnmemorized,
  isShuffled,
  showDefinition,
  currentWord,
  onShuffle,
  onPlay,
  onPronounce,
  onFilter,
  onToggleDefinition,
  onToggleMemorized,
  onNavigation,
  onUpdateVocabulary,
}: MemorizeContentProps) {
  if (currentVocabularies.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-72 rounded-2xl shadow-md dark:shadow-gray-900/30 border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 mb-2 p-6">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="w-16 h-16 text-gray-300 dark:text-gray-600 mb-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
          />
        </svg>
        <div className="text-center text-lg font-medium text-gray-600 dark:text-gray-300">
          단어장과 챕터를 선택하세요
        </div>
        <p className="text-center text-gray-500 dark:text-gray-400 text-sm mt-2">
          학습할 단어를 불러오기 위해
          <br />
          위쪽에서 단어장과 챕터를 선택해주세요.
        </p>
      </div>
    );
  }

  if (filteredVocabularies.length === 0 && showOnlyUnmemorized) {
    return (
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
          onClick={onFilter}
          className="mt-4 bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-lg shadow transition-colors duration-200">
          전체 단어 보기
        </button>
      </div>
    );
  }

  if (!currentWord) {
    return null;
  }

  return (
    <>
      <WordControls
        order={order}
        totalWords={currentVocabularies.length}
        isPlaying={isPlaying}
        isPronounced={isPronounced}
        showOnlyUnmemorized={showOnlyUnmemorized}
        isShuffled={isShuffled}
        onShuffle={onShuffle}
        onPlay={onPlay}
        onPronounce={onPronounce}
        onFilter={onFilter}
        filteredCount={filteredVocabularies.length}
        totalCount={vocabularies.length}
      />

      <div className="rounded-2xl shadow-lg dark:shadow-gray-900/30 overflow-hidden mb-6 transition-all duration-300 hover:shadow-xl bg-white dark:bg-gray-700">
        <div onClick={onToggleDefinition}>
          <WordCard
            word={currentWord}
            showDefinition={showDefinition}
            onToggleMemorized={onToggleMemorized}
          />
        </div>
      </div>

      <NavigationButtons
        word={currentWord}
        handleNavigation={onNavigation}
        onUpdateVocabulary={onUpdateVocabulary}
      />
    </>
  );
}
