'use client';

import { useState, useEffect, useRef, ChangeEvent, useCallback } from 'react';

import AddButton from '@/components/addButton';
import WordCard from "@/components/WordCard";
import NavigationButtons from "@/components/NavigationButtons";
import Title from "@/components/Title";
import ChapterCheckbox from '@/components/ChapterCheckbox';

import {getVocabulariesByChapters, updateVocabulary} from '@/actions/vocabulary';
import {getVocabularyBooks} from "@/actions/vocabularyBook";
import { Vocabulary } from '@/types/vocabulary';
import {Book} from "@/types/book";
import {Chapter} from '@/types/chapter';
import {getVocabularyChapters} from "@/actions/vocabularyChapter";

const shuffleArray = <T,>(array: T[]): T[] => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
};

export default function MemorizePage() {
    const [vocabularies, setVocabularies] = useState<Vocabulary[]>([]);
    const [books, setBooks] = useState<Book[]>([]);
    const [book, setBook] = useState('');
    const [order, setOrder] = useState(0);
    const [showDefinition, setShowDefinition] = useState(false);
    const [chapters, setChapters] = useState<Chapter[]>([]);
    const [selectedChapters, setSelectedChapters] = useState<string[]>([]);
    const [isPronounced, setIsPronounced] = useState(true);
    
    const currentWord = vocabularies[order];
    
    const handleNavigation = useCallback((direction: 'next' | 'prev') => {
        if (direction === 'next') {
            if (showDefinition) {
                setShowDefinition(false);
                setOrder((prevOrder) => (prevOrder + 1) % vocabularies.length);
            } else {
                setShowDefinition(true);
            }
        } else { // prev
            if (showDefinition) {
                setShowDefinition(false);
            } else {
                setShowDefinition(true);
                setOrder((prevOrder) => (prevOrder - 1 + vocabularies.length) % vocabularies.length);
            }
        }
    }, [showDefinition, vocabularies.length]);
    
    const speakWord = useCallback((text: string) => {
        if (!isPronounced) return;
        
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'en-US';
        utterance.rate = 0.8;
        window.speechSynthesis.speak(utterance);
    }, [isPronounced]);
    
    const shuffleVocabularies = useCallback(() => {
        setVocabularies(prev => shuffleArray(prev));
        setOrder(0);
        setShowDefinition(false);
    }, []);
    
    const handleClickSpeaker = useCallback(() => {
        setIsPronounced(prev => !prev);
        if (!isPronounced && currentWord) {
            speakWord(currentWord.word);
        }
    }, [isPronounced, currentWord, speakWord]);
    
    const handleUpdateVocabulary = useCallback(async (word: Vocabulary) => {
        try {
            await updateVocabulary(word);
            setVocabularies(prev => 
                prev.map(vocab => 
                    vocab.word === word.word ? { ...vocab, count: vocab.count + 1 } : vocab
                )
            );
        } catch (error) {
            console.error('Failed to update vocabulary:', error);
        }
    }, []);
    
    const handleChapterToggle = useCallback((chapterId: string, isChecked: boolean) => {
        setSelectedChapters(prev => 
            isChecked
                ? [...prev, chapterId]
                : prev.filter(id => id !== chapterId)
        );
    }, []);

    const keyDownRef = useRef(handleNavigation);
    
    useEffect(() => {
        keyDownRef.current = handleNavigation;
    }, [handleNavigation]);
    
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'ArrowRight') keyDownRef.current('next');
            if (e.key === 'ArrowLeft') keyDownRef.current('prev');
            if (e.key === ' ') setIsPronounced(prev => !prev);
        };
        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, []);

    // 새로운 단어로 이동하거나 앱이 처음 로드될 때 자동 발음
    useEffect(() => {
        if (currentWord && isPronounced && !showDefinition) {
            speakWord(currentWord.word);
        }
    }, [currentWord, isPronounced, showDefinition, speakWord]);

    const handleBookSelect = useCallback((event: ChangeEvent<HTMLSelectElement>) => {
        const selectedBook = event.target.value;
        setBook(selectedBook);
    }, []);
    
    useEffect(() => {
        (async () => {
            const books = await getVocabularyBooks();
            setBooks(books);
            
            if (books.length > 0) {
                setBook(books[0].name);
                const chapters = await getVocabularyChapters(books[0].name);
                setChapters(chapters);
            }
        })();
    }, []);
    
    useEffect(() => {
        if (!book) return;
        
        (async () => {
            const chapters = await getVocabularyChapters(book);
            setChapters(chapters);
            setSelectedChapters([]);
        })();
    }, [book]);
    
    useEffect(() => {
        if (selectedChapters.length === 0) return;
        
        (async () => {
            const data = await getVocabulariesByChapters(selectedChapters);
            setVocabularies(data);
            setVocabularies(prev => shuffleArray(prev));
            setOrder(0);
            setShowDefinition(false);
        })();
    }, [selectedChapters]);
    
    return (
        <div className="@container min-h-screen">
            <div className="flex items-center justify-between w-full mb-2">
                <Title title="단어 외우기"/>
                <AddButton path="/vocabulary/add"/>
            </div>
            <div className="flex flex-col md:flex-row items-start justify-between w-full mb-2 min-h-[140px]">
                <div className="flex flex-row mb-2 md:mb-0">
                    <label htmlFor="book-select" className="mr-2 block w-20">단어장</label>
                    <select id="book-select" className="bg-gray-10 p-2 border rounded-md w-64 md:w-80" name="book"
                            value={book || ''}
                            onChange={handleBookSelect}>
                        <option value="" disabled={books.length > 0}>
                            {books.length === 0 ? "로드 중..." : "단어장을 선택하세요"}
                        </option>
                        {books?.map((book: Book) => <option key={book.name}
                                                            value={book.name}>{book.name}</option>)}
                    </select>
                </div>
                <div className="flex flex-row">
                    <label className="mr-2 block w-20">챕터</label>
                    <div className="bg-gray-10 p-2 border rounded-md overflow-y-auto w-64 md:w-80 h-[120px] md:h-[150px] flex flex-col">
                        {chapters.length === 0 ? (
                            <div className="text-sm text-gray-500 flex items-center justify-center h-full w-full flex-grow">
                                {book ? "로드 중..." : "단어장을 먼저 선택하세요"}
                            </div>
                        ) : (
                            <div className="h-full overflow-y-auto">
                                {chapters.map((chapter) => (
                                    <ChapterCheckbox 
                                        key={chapter.id} 
                                        chapter={chapter} 
                                        isSelected={selectedChapters.includes(chapter.id)} 
                                        onToggle={handleChapterToggle}
                                    />
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
            <div>
                {vocabularies.length > 0 ? (
                    <>
                        <div className="flex justify-center items-center mb-2 relative">
                            <div className="font-bold text-sm">{order + 1} / {vocabularies.length}</div>
                            <button onClick={handleClickSpeaker}
                                    className="ml-3 p-1 rounded-md hover:bg-gray-20 absolute right-0">
                                {isPronounced ? (
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                        strokeWidth={1.5}
                                        stroke="currentColor" className="w-6 h-6">
                                        <path strokeLinecap="round" strokeLinejoin="round"
                                            d="M19.114 5.636a9 9 0 0 1 0 12.728M16.463 8.288a5.25 5.25 0 0 1 0 7.424M6.75 8.25l4.72-4.72a.75.75 0 0 1 1.28.53v15.88a.75.75 0 0 1-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.009 9.009 0 0 1 2.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75Z"/>
                                    </svg>
                                ) : (
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                        stroke-width="1.5" stroke="currentColor" className="w-6 h-6">
                                        <path stroke-linecap="round" stroke-linejoin="round"
                                            d="M17.25 9.75 19.5 12m0 0 2.25 2.25M19.5 12l2.25-2.25M19.5 12l-2.25 2.25m-10.5-6 4.72-4.72a.75.75 0 0 1 1.28.53v15.88a.75.75 0 0 1-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.009 9.009 0 0 1 2.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75Z"/>
                                    </svg>
                                )}
                            </button>
                        </div>
                    </>
                ): (
                    <div className="h-[20px]"/>
                )}
            </div>
            {vocabularies.length > 0 ? (
                <>

                    <div className="rounded-2xl shadow-lg overflow-hidden mb-2">
                        <WordCard
                            word={currentWord}
                            showDefinition={showDefinition}
                        />
                    </div>
                    <NavigationButtons 
                        word={currentWord}
                        handleNavigation={handleNavigation}
                        onUpdateVocabulary={handleUpdateVocabulary}
                        shuffleVocabularies={shuffleVocabularies}
                    />
                </>
            ) : (
                <div
                    className="flex flex-col items-center justify-center h-72 rounded-2xl shadow-lg border border-gray-10 mb-2">
                    <div className="text-center text-lg">단어장과 챕터를 선택하세요.</div>
                </div>
            )}
        </div>
    );
}