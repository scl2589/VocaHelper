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
            if (e.key === 'ArrowRight') {
                keyDownRef.current('next');
                e.preventDefault();
            }
            if (e.key === 'ArrowLeft') {
                keyDownRef.current('prev');
                e.preventDefault();
            }
            if (e.key === ' ') {
                setIsPronounced(prev => !prev);
                e.preventDefault();
            }
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
        <div className="@container min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 dark:from-gray-900 dark:to-gray-800 px-4 py-6 md:px-8 md:py-10">
            <div className="max-w-4xl mx-auto">
                <div className="flex items-center justify-between w-full mb-6">
                    <Title title="단어 외우기"/>
                    <AddButton path="/vocabulary/add"/>
                </div>
                <div className="flex flex-col md:flex-row items-start justify-between w-full mb-6 gap-4">
                    <div className="flex flex-col w-full md:w-1/2 mb-4 md:mb-0">
                        <label htmlFor="book-select" className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">단어장 선택</label>
                        <select 
                            id="book-select" 
                            className="bg-white dark:bg-gray-700 p-3 border border-gray-300 dark:border-gray-600 rounded-lg w-full shadow-sm dark:shadow-gray-900/30 focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-indigo-500 dark:focus:border-indigo-400 dark:text-white" 
                            name="book"
                            value={book || ''}
                            onChange={handleBookSelect}
                        >
                            <option value="" disabled={books.length > 0} className="dark:bg-gray-700">
                                {books.length === 0 ? "로드 중..." : "단어장을 선택하세요"}
                            </option>
                            {books?.map((book: Book) => <option key={book.name} value={book.name} className="dark:bg-gray-700">{book.name}</option>)}
                        </select>
                    </div>
                    <div className="flex flex-col w-full md:w-1/2">
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">챕터 선택</label>
                        <div className="bg-white dark:bg-gray-700 p-3 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm dark:shadow-gray-900/30 h-[150px] md:h-[180px] flex flex-col overflow-hidden">
                            {chapters.length === 0 ? (
                                <div className="text-sm text-gray-500 dark:text-gray-400 flex items-center justify-center h-full w-full flex-grow">
                                    {book ? 
                                        <div className="flex items-center">
                                            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-indigo-500 dark:text-indigo-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            로드 중...
                                        </div> 
                                        : "단어장을 먼저 선택하세요"
                                    }
                                </div>
                            ) : (
                                <div className="h-full overflow-y-auto pr-2 space-y-1">
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
                <div className="mt-8">
                    {vocabularies.length > 0 ? (
                        <>
                            <div className="flex justify-between items-center mb-4">
                                <div className="flex items-center">
                                    <div className="bg-indigo-100 dark:bg-indigo-900 text-indigo-800 dark:text-indigo-200 py-1 px-3 rounded-full font-medium text-sm">
                                        {order + 1} / {vocabularies.length}
                                    </div>
                                    <button 
                                        onClick={shuffleVocabularies}
                                        className="ml-4 bg-white dark:bg-gray-700 p-2 rounded-full shadow-sm dark:shadow-gray-900/30 hover:shadow-md transition-shadow border border-gray-200 dark:border-gray-600 flex items-center text-sm dark:text-gray-300"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5}
                                            stroke="currentColor" className="w-4 h-4 mr-1 text-indigo-600 dark:text-indigo-400">
                                            <path strokeLinecap="round" strokeLinejoin="round"
                                                  d="M19.5 12c0-1.232-.046-2.453-.138-3.662a4.006 4.006 0 0 0-3.7-3.7 48.678 48.678 0 0 0-7.324 0 4.006 4.006 0 0 0-3.7 3.7c-.017.22-.032.441-.046.662M19.5 12l3-3m-3 3-3-3m-12 3c0 1.232.046 2.453.138 3.662a4.006 4.006 0 0 0 3.7 3.7 48.656 48.656 0 0 0 7.324 0 4.006 4.006 0 0 0 3.7-3.7c.017-.22.032-.441.046-.662M4.5 12l3 3m-3-3-3 3"/>
                                        </svg>
                                        섞기
                                    </button>
                                </div>
                                <button 
                                    onClick={handleClickSpeaker}
                                    className="bg-white dark:bg-gray-700 p-2 rounded-full shadow-sm dark:shadow-gray-900/30 hover:shadow-md transition-shadow border border-gray-200 dark:border-gray-600"
                                >
                                    {isPronounced ? (
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                            strokeWidth={1.5}
                                            stroke="currentColor" className="w-5 h-5 text-indigo-600 dark:text-indigo-400">
                                            <path strokeLinecap="round" strokeLinejoin="round"
                                                  d="M19.114 5.636a9 9 0 0 1 0 12.728M16.463 8.288a5.25 5.25 0 0 1 0 7.424M6.75 8.25l4.72-4.72a.75.75 0 0 1 1.28.53v15.88a.75.75 0 0 1-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.009 9.009 0 0 1 2.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75Z"/>
                                        </svg>
                                    ) : (
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                            strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-gray-500 dark:text-gray-400">
                                            <path strokeLinecap="round" strokeLinejoin="round"
                                                  d="M17.25 9.75 19.5 12m0 0 2.25 2.25M19.5 12l2.25-2.25M19.5 12l-2.25 2.25m-10.5-6 4.72-4.72a.75.75 0 0 1 1.28.53v15.88a.75.75 0 0 1-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.009 9.009 0 0 1 2.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75Z"/>
                                        </svg>
                                    )}
                                </button>
                            </div>
                            <div className="rounded-2xl shadow-lg dark:shadow-gray-900/30 overflow-hidden mb-6 transition-all duration-300 hover:shadow-xl bg-white dark:bg-gray-700">
                                <div onClick={() => setShowDefinition(!showDefinition)}>
                                    <WordCard
                                        word={currentWord}
                                        showDefinition={showDefinition}
                                    />
                                </div>
                            </div>
                            <NavigationButtons 
                                word={currentWord}
                                handleNavigation={handleNavigation}
                                onUpdateVocabulary={handleUpdateVocabulary}
                            />
                        </>
                    ) : (
                        <div className="flex flex-col items-center justify-center h-72 rounded-2xl shadow-md dark:shadow-gray-900/30 border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 mb-2 p-6">
                            <svg className="w-16 h-16 text-gray-300 dark:text-gray-600 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path>
                            </svg>
                            <div className="text-center text-lg font-medium text-gray-600 dark:text-gray-300">단어장과 챕터를 선택하세요</div>
                            <p className="text-center text-gray-500 dark:text-gray-400 text-sm mt-2">학습할 단어를 불러오기 위해<br/>위쪽에서 단어장과 챕터를 선택해주세요.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}