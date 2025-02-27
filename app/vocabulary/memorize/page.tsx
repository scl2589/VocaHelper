'use client';

import { useReducer, useEffect, useRef, ChangeEvent } from 'react';

import AddButton from '@/components/addButton';
import WordCard from "@/components/WordCard";
import NavigationButtons from "@/components/NavigationButtons";
import Title from "@/components/Title";

import {getVocabulariesByChapters, updateVocabulary} from '@/actions/vocabulary';
import {getVocabularyBooks} from "@/actions/vocabularyBook";
import { Vocabulary } from '@/types/vocabulary';
import {Book} from "@/types/book";
import {Chapter} from '@/types/chapter';
import {getVocabularyChapters} from "@/actions/vocabularyChapter";

interface State {
    vocabularies: Vocabulary[];
    books: Book[];
    book: string;
    order: number;
    showDefinition: boolean;
    chapters: Chapter[];
    selectedChapters: string[];
    isPronounced: boolean;
}

type Action =
    | { type: 'SET_BOOKS'; payload: Book[] }
    | { type: 'SET_BOOK'; payload: string }
    | { type: 'SET_VOCABULARIES'; payload: Vocabulary[] }
    | { type: 'NEXT_WORD' }
    | { type: 'PREV_WORD' }
    | { type: 'SHUFFLE_VOCABULARIES'}
    | { type: 'INCREMENT_COUNT'; payload: string }
    | { type: 'SET_CHAPTERS'; payload: Chapter[] }
    | { type: 'SET_SELECTED_CHAPTERS'; payload: string[] }
    | { type: 'SET_IS_PRONOUNCED' };


const shuffleArray = <T,>(array: T[]): T[] => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
};

const initialState: State = { isPronounced: true, vocabularies: [], book: '', books: [], chapters: [], selectedChapters: [], order: 0, showDefinition: false };

function reducer(state: State, action: Action): State {
    switch (action.type) {
        case 'SET_BOOKS':
            return { ...state, books: action.payload };
        case 'SET_BOOK':
            return { ...state, book: action.payload };
        case 'SET_CHAPTERS':
            return { ...state, chapters: action.payload };
        case 'SET_SELECTED_CHAPTERS':
            return { ...state, selectedChapters: action.payload };
        case 'SET_VOCABULARIES':
            return { ...state, vocabularies: action.payload, order: 0 };
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
        case 'INCREMENT_COUNT':
            return {
                ...state,
                vocabularies: state.vocabularies.map(vocab =>
                    vocab.word === action.payload ? { ...vocab, count: vocab.count + 1 } : vocab
                )
            };
        case 'SET_IS_PRONOUNCED':
            return {...state, isPronounced: !state.isPronounced };
        default:
            return state;
    }
}

export default function MemorizePage() {
    const [state, dispatch] = useReducer(reducer, initialState);
    const {vocabularies, books, order, showDefinition} = state;
    const currentWord = vocabularies[order];
    const handleNavigation = (direction: 'next' | 'prev') => dispatch({type: direction === 'next' ? 'NEXT_WORD' : 'PREV_WORD'});
    const keyDownRef = useRef(handleNavigation);

    const speakWord = (text: string) => {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'en-US';
        speechSynthesis.speak(utterance);
    };

    useEffect(() => {
        if (!state.isPronounced) return;
        speakWord(currentWord?.word)
    }, [currentWord, state.showDefinition]);

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
            const books = await getVocabularyBooks();
            dispatch({type: 'SET_BOOKS', payload: books});

            if (books.length > 0) {
                dispatch({type: 'SET_BOOK', payload: books[0].name});
                const chapters = await getVocabularyChapters(books[0].name);
                dispatch({type: 'SET_CHAPTERS', payload: chapters})
            }
        })();
    }, []);

    useEffect(() => {
        if (!state.book) return;
        (async () => {
            const chapters = await getVocabularyChapters(state.book);
            dispatch({type: 'SET_CHAPTERS', payload: chapters});
            dispatch({
                type: 'SET_SELECTED_CHAPTERS',
                payload: []
            });
        })();
    }, [state.book]);

    useEffect(() => {
        if (state.selectedChapters.length === 0) return;
        (async () => {
            const data = await getVocabulariesByChapters(state.selectedChapters);
            dispatch({type: 'SET_VOCABULARIES', payload: data});
            dispatch({type: 'SHUFFLE_VOCABULARIES'});
        })();
    }, [state.selectedChapters]);

    const handleBookSelect = (event: ChangeEvent<HTMLSelectElement>) => {
        const selectedBook = event.target.value;
        dispatch({type: 'SET_BOOK', payload: selectedBook});
    };

    const shuffleVocabularies = () => {
        dispatch({type: 'SHUFFLE_VOCABULARIES'});
    };

    const handleClickSpeaker = () => {
        dispatch({ type: 'SET_IS_PRONOUNCED'});
    }

    const handleUpdateVocabulary = async (word: Vocabulary) => {
        try {
            await updateVocabulary(word);
            dispatch({type: 'INCREMENT_COUNT', payload: word.word});
        } catch (error) {
            console.error('Failed to update vocabulary:', error);
        }
    };

    const handleChapterSelect = (event: ChangeEvent<HTMLSelectElement>) => {
        const selectedValue = event.target.value;
        dispatch({
            type: 'SET_SELECTED_CHAPTERS',
            payload: state.selectedChapters.includes(selectedValue)
                ? state.selectedChapters.filter(id => id !== selectedValue)
                : [...state.selectedChapters, selectedValue],
        });
    };


    return (
        <div className="@container">
            <div className="flex items-center justify-between w-full mb-2">
                <Title title="단어 외우기"/>
                <AddButton path="/vocabulary/add"/>
            </div>
            <div className="flex flex-col md:flex-row items-start justify-between w-full mb-2">
                <div className="flex flex-row mb-2 md:mb-0">
                    <label htmlFor="book-select" className="mr-2 block w-20">단어장</label>
                    <select id="book-select" className="bg-gray-10 p-2 border rounded-md" name="book"
                            value={state.book || ''}
                            onChange={handleBookSelect}>
                        {books?.map((book: Book) => <option key={book.name}
                                                            value={book.name}>{book.name}</option>)}
                    </select>
                </div>
                <div className="flex flex-row">
                    <label htmlFor="chapter-select" className="mr-2 block w-20">챕터</label>
                    <select id="chapter-select" className="bg-gray-10 p-2 border rounded-md w-48" name="chapter"
                            value={state.selectedChapters}
                            onChange={handleChapterSelect}
                            multiple
                    >
                        {state.chapters?.map((chapter) => <option key={chapter.id}
                                                                  value={chapter.id}>{chapter.name}</option>)}
                    </select>
                </div>

            </div>
            {vocabularies.length > 0 ? (
                <>
                    <div className="flex justify-center items-center mb-2 relative">
                        <div className="font-bold text-sm">{order + 1} / {vocabularies.length}</div>
                        <button onClick={handleClickSpeaker}
                                className="absolute right-0 text-2xl text-white rounded p-1">
                            {state.isPronounced ? <span>🔊</span> : <span>🔇</span>}
                        </button>
                    </div>
                    <WordCard word={currentWord} showDefinition={showDefinition}/>
                    <NavigationButtons word={currentWord} handleNavigation={handleNavigation}
                                       shuffleVocabularies={shuffleVocabularies}
                                       onUpdateVocabulary={handleUpdateVocabulary}/>
                </>
            ) : (
                <div>해당 단어장에 속하는 단어가 없습니다. </div>
            )}

        </div>
    );
}