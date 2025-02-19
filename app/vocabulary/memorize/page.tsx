'use client';

import { useState, useEffect, useCallback } from 'react';
import { getVocabularies } from '@/actions/vocabulary';
import AddButton from '@/components/addButton';
import { Definition, Vocabulary } from '@/types/vocabulary';
import Icon from "@/components/Icon";

export default function MemorizePage() {
    const [vocabularies, setVocabularies] = useState<Vocabulary[]>([]);
    const [order, setOrder] = useState(0);

    useEffect(() => {
        (async () => {
            const data = await getVocabularies();
            setVocabularies(data);
        })();
    }, []);

    const handleNavigation = useCallback((direction: 'next' | 'prev') => {
        setOrder((prevOrder) => {
            const newOrder = direction === 'next'
                ? (prevOrder + 1) % vocabularies.length
                : (prevOrder - 1 + vocabularies.length) % vocabularies.length;
            return newOrder;
        });
    }, [vocabularies]);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'ArrowRight') handleNavigation('next');
            if (e.key === 'ArrowLeft') handleNavigation('prev');
        };

        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [handleNavigation]);

    const currentWord = vocabularies[order];

    return (
        <div>
            <div className="flex items-center justify-between w-full">
                <h3 className="text-2xl font-bold mb-6 text-blue-dark">낱말 카드</h3>
                <AddButton path="/vocabulary/add" />
            </div>
            <div className="flex justify-center mb-2 font-bold text-sm">{order + 1} / {vocabularies.length}</div>
            <div className="flex flex-col items-center justify-center bg-gray-100 p-3 h-72 rounded-2xl text-2xl mb-5 shadow-xl">
                <span className="mb-3">{currentWord?.word}</span>
                {currentWord?.definitions.map((def: Definition) => (
                    <div key={def.definition} className="text-lg">({def.partOfSpeech}) {def.definition}</div>
                ))}
            </div>
            <div className="flex flex-row items-center justify-center gap-4">
                <button onClick={() => handleNavigation('prev')} className="flex flex-row justify-center items-center w-16 border border-solid border-gray-300 rounded-3xl">
                    <Icon type="arrowLeft" customClassName="text-gray-600 size-12"/>
                </button>
                <button onClick={() => handleNavigation('next')} className="flex flex-row justify-center items-center w-16 border border-solid border-gray-300 rounded-3xl">
                    <Icon type="arrowRight" customClassName="text-gray-600 size-12"/>
                </button>
            </div>
        </div>
    );
}