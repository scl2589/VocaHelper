import {Vocabulary} from "@/types/vocabulary";
import Icon from "@/components/Icon";

import { updateVocabulary } from '@/actions/vocabulary';


interface NavigationButtonsProps {
    word: Vocabulary;
    handleNavigation: (direction: 'next' | 'prev') => void;
    shuffleVocabularies: () => void;
    onUpdateVocabulary: (word: Vocabulary) => void;
}

export default function NavigationButtons({ word, handleNavigation, shuffleVocabularies, onUpdateVocabulary }: NavigationButtonsProps) {
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
                        className="flex flex-row justify-center items-center w-16 border border-solid border-gray-300 rounded-3xl">
                    <Icon type="shuffle" customClassName="size-8 md:size-12 fill-transparent "/>
                </button>
            </div>
        </div>

    );
}
