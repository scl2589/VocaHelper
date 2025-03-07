import {Vocabulary} from "@/types/vocabulary";
import Icon from "@/components/Icon";

interface NavigationButtonsProps {
    word: Vocabulary;
    handleNavigation: (direction: 'next' | 'prev') => void;
    onUpdateVocabulary: (word: Vocabulary) => void;
}

export default function NavigationButtons({ word, handleNavigation, onUpdateVocabulary }: NavigationButtonsProps) {
    return (
        <div className="flex flex-row items-center justify-between w-full">
            <button 
                onClick={() => onUpdateVocabulary(word)}
                className="flex items-center gap-2 bg-white dark:bg-gray-700 py-2 px-4 rounded-lg border border-orange-200 dark:border-orange-800 shadow-sm dark:shadow-gray-900/30 hover:shadow-md transition-shadow text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-orange-50 dark:hover:bg-orange-900/20"
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-orange-500 dark:text-orange-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <span className="flex items-center gap-1">
                    모름 <span className="bg-orange-100 dark:bg-orange-900/50 text-orange-800 dark:text-orange-300 px-2 py-0.5 rounded-full text-xs">{word?.count || 0}</span>
                </span>
            </button>
            
            <div className="flex items-center gap-3">
                <button 
                    onClick={() => handleNavigation('prev')}
                    className="flex justify-center items-center h-10 w-10 bg-white dark:bg-gray-700 rounded-full shadow-sm dark:shadow-gray-900/30 hover:shadow-md border border-gray-200 dark:border-gray-600 transition-shadow hover:bg-gray-50 dark:hover:bg-gray-600"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600 dark:text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                </button>
                
                <button 
                    onClick={() => handleNavigation('next')}
                    className="flex justify-center items-center h-10 w-10 bg-indigo-600 dark:bg-indigo-700 rounded-full shadow-sm dark:shadow-gray-900/30 hover:shadow-md transition-shadow hover:bg-indigo-700 dark:hover:bg-indigo-600"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                </button>
            </div>
        </div>
    );
}
