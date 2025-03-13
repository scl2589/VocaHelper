import { useState, useEffect, useRef, useCallback } from 'react';
import { Vocabulary } from '@/types/vocabulary';

export function useWordPlayback(vocabularies: Vocabulary[], filteredVocabularies: Vocabulary[]) {
  const [order, setOrder] = useState(0);
  const [showDefinition, setShowDefinition] = useState(false);
  const [isPronounced, setIsPronounced] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
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
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, []);

  // 발음과 관련된 함수
  const speakWord = useCallback(
    (text: string, language = 'en-US') => {
      if (!isPronounced) return;

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = language;
      utterance.rate = language === 'en-US' ? 0.8 : 1.2;
      window.speechSynthesis.speak(utterance);
    },
    [isPronounced]
  );

  // 발음 켜기/끄기
  const handleClickSpeaker = useCallback(() => {
    setIsPronounced((prev) => !prev);
    if (!isPronounced && currentWord) {
      speakWord(currentWord.word);
    }
  }, [isPronounced, currentWord, speakWord]);

  // 단어 넘기기 (다음 단어/ 이전 단어)
  const handleNavigation = useCallback(
    (direction: 'next' | 'prev') => {
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
    [showDefinition, currentVocabularies.length]
  );

  // 재생/정지에 대한 함수
  const handleClickPlay = useCallback(() => {
    if (isPlaying && intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
      setIsPlaying(false);
      return;
    }

    setIsPlaying(true);
    setShowDefinition(false);

    let count = 0;

    setTimeout(() => {
      setShowDefinition(true);
      count++;
    }, 500);

    intervalRef.current = setInterval(() => {
      setShowDefinition((prev) => !prev);
      count++;

      if ([1, 5].includes(count)) {
        const currentVocab = showOnlyUnmemorizedRef.current
          ? filteredVocabulariesRef.current[orderRef.current]
          : vocabulariesRef.current[orderRef.current];

        if (currentVocab) {
          speakWord(currentVocab.word);
          currentVocab.definitions.forEach((def) => {
            speakWord(def.definition, 'ko-KR');
          });
        }
      }

      if (count >= 20) {
        count = 0;
        setShowDefinition(false);
        setOrder((current) => (current + 1) % currentVocabularies.length);
      }
    }, 500);
  }, [isPlaying, currentVocabularies.length, speakWord]);

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
