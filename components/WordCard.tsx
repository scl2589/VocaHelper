import { Definition, Vocabulary } from '@/types/vocabulary';

interface WordCardProps {
  word: Vocabulary;
  showDefinition: boolean;
  onToggleMemorized?: (word: Vocabulary) => void;
}

export default function WordCard({ word, showDefinition, onToggleMemorized }: WordCardProps) {
  const handleToggleMemorized = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onToggleMemorized) {
      onToggleMemorized(word);
    }
  };

  return (
    <div
      className={`relative grid grid-rows-[96px_minmax(0,1fr)] gap-4 px-5 pb-6 pt-16 h-96 text-2xl transition-colors duration-300 ${
        'bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200'
      }`}
      style={{ cursor: 'pointer' }}>
      {/* The word and meaning occupy independent fixed slots for every card. */}
      <div className="min-h-0 overflow-auto text-center" data-word-anchor>
        <span
          className={`block font-bold text-3xl leading-10 break-words ${'text-slate-900 dark:text-slate-100'}`}>
          {word.word}
        </span>
      </div>

      <div
        key={word.id}
        aria-hidden={!showDefinition}
        className={`min-h-0 overflow-y-auto overscroll-contain w-full text-center ${showDefinition ? 'visible' : 'invisible'}`}
        data-definition-slot>
        <div className="flex flex-col items-center gap-2 w-full max-w-md mx-auto">
          {word.definitions.map((def: Definition, index) => (
            <div key={index} className="flex flex-row items-baseline justify-center text-lg leading-7 text-center">
              {def.partOfSpeech && (
                <span className="shrink-0 inline-block bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-100 px-2 py-0.5 rounded text-xs mr-2">
                  {def.partOfSpeech}
                </span>
              )}
              <div className="break-words min-w-0">{def.definition}</div>
            </div>
          ))}
        </div>
      </div>

      <button
        onClick={handleToggleMemorized}
        className={`absolute top-4 right-4 transition-all duration-300 transform hover:scale-110 focus:outline-none`}>
        {word.memorized ? (
          <div className="flex items-center justify-center space-x-2 bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300 py-1 px-3 rounded-full shadow-sm border border-green-200 dark:border-green-800">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="inline-block">
              <path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20z"></path>
              <path d="m9 12 2 2 4-4"></path>
            </svg>
            <span className="text-xs font-medium">외웠어요</span>
          </div>
        ) : (
          <div className="flex items-center justify-center space-x-2 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300 py-1 px-3 rounded-full shadow-sm border border-yellow-200 dark:border-yellow-800">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="inline-block">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="8" x2="12" y2="12"></line>
              <line x1="12" y1="16" x2="12.01" y2="16"></line>
            </svg>
            <span className="text-xs font-medium">어려워요</span>
          </div>
        )}
      </button>
    </div>
  );
}
