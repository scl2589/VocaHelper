'use client';

import { useBookChapterFilter } from '@/hooks/useBookChapterFilter';
import Link from 'next/link';
import { Suspense, useState, useEffect, useMemo, useCallback } from 'react';
import styles from './vocabulary.module.css';

function VocabularyContent() {
    const { books, book, chapters, selectedChapters, filteredVocabularies,
        handleBookSelect, handleChapterToggle, selectAllChapters, clearAllChapters } = useBookChapterFilter();
    const [hidden, setHidden] = useState(false);
    const [revealed, setRevealed] = useState<Set<string>>(new Set());
    const [shuffled, setShuffled] = useState(false);
    const toggleMeanings = useCallback(() => {
        setHidden(value => !value);
        setRevealed(new Set());
    }, []);
    useEffect(() => {
        const onKey = (event: KeyboardEvent) => {
            const target = event.target as HTMLElement;
            if (event.code !== 'Space' || event.repeat || target.closest('input,select,textarea,button,a,[contenteditable="true"]')) return;
            event.preventDefault();
            toggleMeanings();
        };
        window.addEventListener('keydown', onKey);
        return () => window.removeEventListener('keydown', onKey);
    }, [toggleMeanings]);
    const words = useMemo(() => {
        const result = [...filteredVocabularies];
        if (shuffled) for (let i = result.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [result[i], result[j]] = [result[j], result[i]];
        }
        return result;
    }, [filteredVocabularies, shuffled]);
    const toggleWord = (id: string) => setRevealed(previous => {
        const next = new Set(previous);
        if (next.has(id)) next.delete(id); else next.add(id);
        return next;
    });
    return (
        <div className={styles.page}>
            <div className={styles.container}>
                <header className={styles.heading}>
                    <div><p className={styles.eyebrow}>MY VOCABULARY NOTE</p><h1>하나씩, 내 단어로.</h1><p className={styles.subtitle}>뜻을 읽고, 가리고, 떠올려 보세요. 오늘의 단어가 오래 남도록.</p></div>
                    <Link href="/vocabulary/add" className={styles.secondary}>＋ 단어 추가</Link>
                </header>
                <div className={styles.workspace}>
                    <aside className={styles.sidebar} aria-label="학습 범위">
                        <div className={styles.sectionTitle}><span>01</span><h2>오늘의 학습 범위</h2></div>
                        <label htmlFor="study-book" className={styles.label}>단어장</label>
                        <select id="study-book" value={book} onChange={handleBookSelect} className={styles.select}>
                            <option value="">전체 단어장</option>
                            {books.map(item => <option key={item.name} value={item.name}>{item.name}</option>)}
                        </select>
                        <div className={styles.chapterHeading}><span className={styles.label}>챕터</span><span>{selectedChapters.length ? `${selectedChapters.length}개 선택` : '전체 범위'}</span></div>
                        {chapters.length > 0 ? <>
                            <div className={styles.smallActions}><button onClick={selectAllChapters}>전체 선택</button><button onClick={clearAllChapters}>선택 해제</button></div>
                            <div className={styles.chapters}>{chapters.map(chapter => <label key={chapter.id} className={styles.chapter}>
                                <input type="checkbox" checked={selectedChapters.includes(chapter.id)} onChange={event => handleChapterToggle(chapter.id, event.target.checked)} /><span>{chapter.name}</span>
                            </label>)}</div>
                        </> : <p className={styles.hint}>{book ? '표시할 챕터가 없습니다.' : '단어장을 선택하면 챕터별로 공부할 수 있어요.'}</p>}
                        <div className={styles.practice}><p>얼마나 기억하고 있을까요?</p><Link href="/vocabulary/quiz" className={styles.primary}>퀴즈로 확인하기 <span aria-hidden="true">↗</span></Link></div>
                        <p className={styles.shortcut}><kbd>Space</kbd> 뜻 전체 숨기기 / 보이기</p>
                    </aside>
                    <section className={styles.notebook} aria-label="단어 목록">
                        <div className={styles.toolbar}>
                            <div><p className={styles.eyebrow}>WORD LIST</p><h2>{book || '전체 단어'} <span>{words.length.toLocaleString()}개</span></h2></div>
                            <div className={styles.tools}><button aria-pressed={shuffled} onClick={() => setShuffled(value => !value)}>{shuffled ? '기본 순서' : '순서 섞기'}</button><button aria-pressed={hidden} onClick={toggleMeanings}>{hidden ? '뜻 모두 보기' : '뜻 가리기'}</button></div>
                        </div>
                        <div className={styles.columnLabels}><span>단어</span><span>{hidden ? '먼저 떠올린 뒤, 눌러서 확인하세요' : '품사 · 뜻'}</span></div>
                        {words.length === 0 ? <div className={styles.empty}><h3>단어를 담을 자리예요.</h3><p>학습 범위를 바꾸거나 새로운 단어를 추가해 주세요.</p><Link href="/vocabulary/add/excel">엑셀로 단어 가져오기 →</Link></div> :
                            <ol className={styles.words}>{words.map((word, index) => {
                                const visible = !hidden || revealed.has(word.id);
                                return <li key={word.id} className={styles.wordRow}>
                                    <div className={styles.word}><span className={styles.number}>{String(index + 1).padStart(2, '0')}</span><div><h3>{word.word}</h3>{word.memorized && <span className={styles.learned}>✓ 암기 완료</span>}</div></div>
                                    <div className={styles.meanings}>
                                        {visible ? <><ul>{word.definitions.map((definition, i) => <li key={i}>{definition.partOfSpeech && <span className={styles.part}>{definition.partOfSpeech}</span>}<span>{definition.definition}</span></li>)}</ul>{hidden && <button className={styles.hideAgain} onClick={() => toggleWord(word.id)} aria-label={`${word.word} 뜻 다시 가리기`}>다시 가리기</button>}</> : <button className={styles.reveal} onClick={() => toggleWord(word.id)} aria-label={`${word.word} 뜻 보기`}>뜻 확인하기 <span aria-hidden="true">＋</span></button>}
                                    </div>
                                </li>;
                            })}</ol>}
                        <footer className={styles.footer}><span>조금씩, 꾸준히 쌓이는 나의 어휘.</span><button onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})}>맨 위로 ↑</button></footer>
                    </section>
                </div>
            </div>
        </div>
    );
}

export default function VocabularyPage() {
    return <Suspense fallback={<div className={styles.page} role="status">단어 목록을 불러오는 중...</div>}><VocabularyContent /></Suspense>;
}
