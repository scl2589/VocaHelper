import { useState, useEffect, useRef, useCallback } from 'react';
import { Vocabulary } from '@/types/vocabulary';

export function useWordPlayback(vocabularies: Vocabulary[], filteredVocabularies: Vocabulary[]) {
  const [order, setOrder] = useState(0);
  const [showDefinition, setShowDefinition] = useState(false);
  const [isPronounced, setIsPronounced] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speechError, setSpeechError] = useState<string | null>(null);
  const pronouncedRef = useRef(true);
  const [repetitionsPerWord, setRepetitionsPerWord] = useState(10);
  const repetitionsRef = useRef(10);
  const handleRepetitionChange = useCallback((seconds: number) => {
    if (![1, 3, 5, 10, 15, 20].includes(seconds)) return;
    repetitionsRef.current = seconds;
    setRepetitionsPerWord(seconds);
    try { localStorage.setItem('voca-repetitions-per-word', String(seconds)); } catch { /* Storage may be unavailable. */ }
  }, []);
  useEffect(() => {
    try {
      const saved = Number(localStorage.getItem('voca-repetitions-per-word'));
      if ([1, 3, 5, 10, 15, 20].includes(saved)) {
        repetitionsRef.current = saved;
        setRepetitionsPerWord(saved);
      }
    } catch { /* Use the default when storage is unavailable. */ }
  }, []);
  const [showOnlyUnmemorized, setShowOnlyUnmemorized] = useState(false);

  // Refs for interval and state values to avoid closure issues
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const orderRef = useRef(order);
  const vocabulariesRef = useRef(vocabularies);
  const filteredVocabulariesRef = useRef(filteredVocabularies);
  const showOnlyUnmemorizedRef = useRef(showOnlyUnmemorized);

  // 현재 보여지는 단어장
  const currentVocabularies = showOnlyUnmemorized ? filteredVocabularies : vocabularies;
  const currentWord = currentVocabularies[order];

  // 상태가 변경되면 ref 업데이트
  useEffect(() => {
    orderRef.current = order;
  }, [order]);

  useEffect(() => {
    vocabulariesRef.current = vocabularies;
  }, [vocabularies]);

  useEffect(() => {
    filteredVocabulariesRef.current = filteredVocabularies;
  }, [filteredVocabularies]);

  useEffect(() => {
    showOnlyUnmemorizedRef.current = showOnlyUnmemorized;
  }, [showOnlyUnmemorized]);

  // 단어가 바뀌거나 필터가 바뀌면 첫번째 단어로 이동하기
  useEffect(() => {
    if (currentVocabularies.length > 0 && order >= currentVocabularies.length) {
      setOrder(0);
    }
  }, [showOnlyUnmemorized, currentVocabularies.length, order]);

  // Unmount시 인터벌 정리
  useEffect(() => {
    return () => {
      if ('speechSynthesis' in window) window.speechSynthesis.cancel();
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, []);

  // Read the latest sound setting even inside an already-running timer.
  const speakWord = useCallback((text: string, language = 'en-US') => {
    if (!pronouncedRef.current) return;
    if (!('speechSynthesis' in window) || !('SpeechSynthesisUtterance' in window)) {
      setSpeechError('이 브라우저는 발음을 지원하지 않습니다. Safari에서 열어주세요.');
      return;
    }
    const synth = window.speechSynthesis;
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = language;
    utterance.rate = language === 'en-US' ? 0.8 : 1.2;
    const voices = synth.getVoices();
    const voice = voices.find(item => item.lang === language)
      || voices.find(item => item.lang.startsWith(language.split('-')[0]));
    if (voice) utterance.voice = voice;
    utterance.onstart = () => setSpeechError(null);
    utterance.onerror = event => {
      if (event.error === 'interrupted' || event.error === 'canceled') return;
      setSpeechError('발음을 재생하지 못했어요. 소리 버튼을 껐다 켜고, 아이폰 음량과 무음 모드를 확인해주세요.');
    };
    if (synth.paused) synth.resume();
    synth.speak(utterance);
  }, []);

  const handleClickSpeaker = useCallback(() => {
    const enabled = !pronouncedRef.current;
    pronouncedRef.current = enabled;
    setIsPronounced(enabled);
    if ('speechSynthesis' in window) window.speechSynthesis.cancel();
    if (enabled && currentWord) speakWord(currentWord.word);
    else setSpeechError(null);
  }, [currentWord, speakWord]);

  // 단어 넘기기 (다음 단어/ 이전 단어)
  const handleNavigation = useCallback(
    (direction: 'next' | 'prev') => {
      if (!currentVocabularies.length) return;
      const changesWord = direction === 'next' ? showDefinition : !showDefinition;
      if (changesWord) {
        const nextOrder = (order + (direction === 'next' ? 1 : -1) + currentVocabularies.length) % currentVocabularies.length;
        if ('speechSynthesis' in window) window.speechSynthesis.cancel();
        speakWord(currentVocabularies[nextOrder].word);
      }
      if (direction === 'next') {
        if (showDefinition) {
          setShowDefinition(false);
          setOrder((prevOrder) => (prevOrder + 1) % currentVocabularies.length);
        } else {
          setShowDefinition(true);
        }
      } else {
        // prev
        if (showDefinition) {
          setShowDefinition(false);
        } else {
          setShowDefinition(true);
          setOrder((prevOrder) => (prevOrder - 1 + currentVocabularies.length) % currentVocabularies.length);
        }
      }
    },
    [showDefinition, currentVocabularies, order, speakWord]
  );

  // 재생/정지에 대한 함수
  const handleClickPlay = useCallback(() => {
    if (isPlaying && intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
      if ('speechSynthesis' in window) window.speechSynthesis.cancel();
      setIsPlaying(false);
      return;
    }

    if (!currentWord) return;
    // iOS needs the first utterance synchronously inside the button gesture.
    if ('speechSynthesis' in window) window.speechSynthesis.cancel();
    speakWord(currentWord.word);
    setIsPlaying(true);
    setShowDefinition(false);

    let count = 0;
    let ticksPerWord = repetitionsRef.current * 2;

    intervalRef.current = setInterval(() => {
      const list = showOnlyUnmemorizedRef.current
        ? filteredVocabulariesRef.current : vocabulariesRef.current;
      if (!list.length) {
        if (intervalRef.current) clearInterval(intervalRef.current);
        intervalRef.current = null;
        setIsPlaying(false);
        return;
      }
      // A full show/hide cycle is one repetition. Never cut queued speech short.
      if (count >= ticksPerWord) {
        if (pronouncedRef.current && 'speechSynthesis' in window
          && (window.speechSynthesis.speaking || window.speechSynthesis.pending)) return;
        ticksPerWord = repetitionsRef.current * 2;
        count = 0;
        const next = (orderRef.current + 1) % list.length;
        orderRef.current = next;
        setOrder(next);
        setShowDefinition(false);
        speakWord(list[next].word);
        return;
      }
      count++;
      setShowDefinition(count % 2 === 1);
      if (count === 1) {
        list[orderRef.current]?.definitions.forEach(def => speakWord(def.definition, 'ko-KR'));
      }
    }, 500);
  }, [isPlaying, currentWord, speakWord]);

  const toggleFilter = useCallback(() => {
    if (isPlaying && intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
      setIsPlaying(false);
    }

    setShowOnlyUnmemorized((prev) => !prev);
    setOrder(0); // 첫 단어로 다시 이동
    setShowDefinition(false);
  }, [isPlaying]);

  // 다시 첫 단어로 이동하고, 뜻 숨기기
  const resetPosition = useCallback(() => {
    setOrder(0);
    setShowDefinition(false);
  }, []);

  return {
    order,
    setOrder,
    showDefinition,
    setShowDefinition,
    isPronounced,
    speechError,
    repetitionsPerWord,
    handleRepetitionChange,
    isPlaying,
    showOnlyUnmemorized,
    currentVocabularies,
    currentWord,
    speakWord,
    handleClickSpeaker,
    handleNavigation,
    handleClickPlay,
    toggleFilter,
    resetPosition,
  };
}
