import {Vocabulary} from "@/types/vocabulary";
import Icon from "@/components/Icon";

interface NavigationButtonsProps {
    word: Vocabulary;
    handleNavigation: (direction: 'next' | 'prev') => void;
    onUpdateVocabulary: (word: Vocabulary) => void;
    shuffleVocabularies: () => void;
}

export default function NavigationButtons({ word, handleNavigation, onUpdateVocabulary, shuffleVocabularies }: NavigationButtonsProps) {
    return (
        <div className="flex flex-row items-center justify-between w-full">
            <div>
                <button onClick={() => onUpdateVocabulary(word)}
                        className="flex flex-row justify-center items-center w-16 h-8 md:h-12 border border-solid border-gray-300 rounded-3xl">
                    ✔ {word?.count}
                </button>
            </div>
            <div className="flex flex-row items-center justify-center gap-4">
                <button onClick={() => handleNavigation('prev')}
                        className="flex flex-row justify-center items-center w-16 border border-solid border-gray-300 rounded-3xl">
                    <Icon type="arrowLeft" customClassName="text-gray-600 size-8 md:size-12"/>
                </button>
                <button onClick={() => handleNavigation('next')}
                        className="flex flex-row justify-center items-center w-16 border border-solid border-gray-300 rounded-3xl">
                    <Icon type="arrowRight" customClassName="text-gray-600 size-8 md:size-12"/>
                </button>
            </div>
            <div>
                <button onClick={shuffleVocabularies} 
                        className="flex items-center gap-2 p-2 rounded-md bg-gray-10 hover:bg-gray-20">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5}
                         stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round"
                              d="M19.5 12c0-1.232-.046-2.453-.138-3.662a4.006 4.006 0 0 0-3.7-3.7 48.678 48.678 0 0 0-7.324 0 4.006 4.006 0 0 0-3.7 3.7c-.017.22-.032.441-.046.662M19.5 12l3-3m-3 3-3-3m-12 3c0 1.232.046 2.453.138 3.662a4.006 4.006 0 0 0 3.7 3.7 48.656 48.656 0 0 0 7.324 0 4.006 4.006 0 0 0 3.7-3.7c.017-.22.032-.441.046-.662M4.5 12l3 3m-3-3-3 3"/>
                    </svg>
                    <span className="hidden md:inline">섞기</span>
                </button>
            </div>
        </div>
    );
}
