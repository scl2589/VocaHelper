'use client';

import { useReducer, useEffect, useRef } from 'react';

import AddButton from '@/components/addButton';
import WordCard from "@/components/WordCard";
import NavigationButtons from "@/components/NavigationButtons";

import { getVocabularies } from '@/actions/vocabulary';
import { Vocabulary } from '@/types/vocabulary';

interface State {
    vocabularies: Vocabulary[];
    order: number;
    showDefinition: boolean;
}

type Action =
    | { type: 'SET_VOCABULARIES'; payload: Vocabulary[] }
    | { type: 'NEXT_WORD' }
    | { type: 'PREV_WORD' }
    | { type: 'SHUFFLE_VOCABULARIES'};

const shuffleArray = <T,>(array: T[]): T[] => {
    const shuffled = [...array]; // 원본 배열을 변경하지 않도록 복사
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1)); // 0부터 i까지의 랜덤 인덱스
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]; // swap
    }
    return shuffled;
};

const initialState: State = { vocabularies: [], order: 0, showDefinition: false };

function reducer(state: State, action: Action): State {
    switch (action.type) {
        case 'SET_VOCABULARIES':
            return { ...state, vocabularies: action.payload };
        case 'NEXT_WORD':
            return state.showDefinition
                ? { ...state, showDefinition: false, order: (state.order + 1) % state.vocabularies.length }
                : { ...state, showDefinition: true };
        case 'PREV_WORD':
            return state.showDefinition
                ? { ...state, showDefinition: false }
                : { ...state, showDefinition: true, order: (state.order - 1 + state.vocabularies.length) % state.vocabularies.length };
        case 'SHUFFLE_VOCABULARIES':
            return {...state, vocabularies: shuffleArray(state.vocabularies), order: 0, showDefinition: false }
        default:
            return state;
    }
}

export default function MemorizePage() {
    const [state, dispatch] = useReducer(reducer, initialState);
    const { vocabularies, order, showDefinition } = state;
    const currentWord = vocabularies[order];
    const handleNavigation = (direction: 'next' | 'prev') => dispatch({ type: direction === 'next' ? 'NEXT_WORD' : 'PREV_WORD' });
    const keyDownRef = useRef(handleNavigation);

    useEffect(() => {
        keyDownRef.current = handleNavigation;
    });

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'ArrowRight') keyDownRef.current('next');
            if (e.key === 'ArrowLeft') keyDownRef.current('prev');
        };
        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, []);

    useEffect(() => {
        (async () => {
            const data = await getVocabularies();
            dispatch({ type: 'SET_VOCABULARIES', payload: data });
        })();
    }, []);

    const shuffleVocabularies = () => {
        dispatch({ type: 'SHUFFLE_VOCABULARIES' });
    };

    return (
        <div>
            <div className="flex items-center justify-between w-full">
                <h3 className="text-2xl font-bold mb-6 text-blue-dark">낱말 카드</h3>
                <AddButton path="/vocabulary/add" />
            </div>
            <div className="flex justify-center mb-2 font-bold text-sm">{order + 1} / {vocabularies.length}</div>
            <WordCard word={currentWord} showDefinition={showDefinition} />
            <NavigationButtons word={currentWord} handleNavigation={handleNavigation} shuffleVocabularies={shuffleVocabularies} />
        </div>
    );
}