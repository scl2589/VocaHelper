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
      className={`relative flex flex-col items-center justify-center p-8 h-72 text-2xl transition-all duration-300 ${
        showDefinition ? 'bg-slate-900 text-white' : 'bg-slate-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200'
      }`}
      style={{ cursor: 'pointer' }}>
      <div className="w-full flex flex-col items-center justify-center">
        <div className="mb-3">
          <span
            className={`font-bold text-3xl ${showDefinition ? 'text-gray-100' : 'text-slate-700 dark:text-slate-400'}`}>
            {word.word}
          </span>
        </div>

        <div className="w-full flex flex-col items-center justify-center">
          {showDefinition ? (
            <div className="flex flex-col items-center w-full max-w-md">
              {word.definitions.map((def: Definition, index) => (
                <div
                  key={def.definition || index}
                  className="flex flex-row items-center justify-center text-lg mb-2 text-center">
                  {def?.partOfSpeech && (
                    <span className="inline-block bg-slate-700 text-slate-100 px-2 py-0.5 rounded text-xs mr-2">
                      {def.partOfSpeech}
                    </span>
                  )}
                  <div>{def.definition}</div>
                </div>
              ))}
            </div>
          ) : (
            <div className="h-[36px] text-lg text-gray-500 dark:text-gray-400" />
          )}
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
            <span className="text-xs font-medium">복습해요</span>
          </div>
        )}
      </button>
    </div>
  );
}
