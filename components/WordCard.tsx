import {Definition, Vocabulary} from "@/types/vocabulary";

interface WordCardProps {
    word: Vocabulary;
    showDefinition: boolean;
}

export default function WordCard({ word, showDefinition }: WordCardProps) {
    return (
        <div
            className={`flex flex-col items-center justify-center p-8 h-72 text-2xl transition-all duration-300 ${
                showDefinition 
                    ? "bg-gradient-to-br from-slate-800 to-slate-900 text-white" 
                    : "bg-gradient-to-br from-slate-50 to-slate-100 dark:from-gray-900 dark:to-gray-800 text-gray-800 dark:text-gray-200"
            }`}
            style={{ cursor: 'pointer' }}
        >
            <div className="w-full flex flex-col items-center justify-center">
                <div className="mb-3">
                    <span className={`font-bold text-3xl ${showDefinition ? 'text-gray-100' : 'text-slate-700 dark:text-slate-400'}`}>
                        {word.word}
                    </span>
                </div>
                
                <div className="w-full flex flex-col items-center justify-center">
                    {showDefinition ? (
                        <div className="flex flex-col items-center w-full max-w-md">
                            {word.definitions.map((def: Definition, index) => (
                                <div key={def.definition || index} className="flex flex-row items-center justify-center text-lg mb-2 text-center">
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
                        <div className="h-[36px] text-lg text-gray-500 dark:text-gray-400">
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}