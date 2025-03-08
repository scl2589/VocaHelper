import { useCallback } from 'react';
import { Vocabulary } from '@/types/vocabulary';
import { updateVocabulary } from '@/actions/vocabulary';

export function useWordModification(
  vocabularies: Vocabulary[],
  setVocabularies: React.Dispatch<React.SetStateAction<Vocabulary[]>>,
  showOnlyUnmemorized: boolean,
  order: number,
  filteredVocabularies: Vocabulary[],
  setOrder: React.Dispatch<React.SetStateAction<number>>
) {
  // 단어 카운트 (학습 횟수) 올리기
  const handleUpdateVocabulary = useCallback(
    async (word: Vocabulary) => {
      try {
        // UI를 바로 반영하기 위해 local 상태부터 변경
        setVocabularies((prev) =>
          prev.map((vocab) => (vocab.id === word.id ? { ...vocab, count: vocab.count + 1 } : vocab))
        );

        // 데이터베이스 업데이트
        await updateVocabulary({
          ...word,
          count: word.count + 1,
        });
      } catch (error) {
        console.error('Failed to update vocabulary:', error);
      }
    },
    [setVocabularies]
  );

  // 단어 - 외운/외우지 못한 상태 업데이트
  const handleToggleMemorized = useCallback(
    async (word: Vocabulary) => {
      try {
        // UI를 바로 반영하기 위해 local 상태부터 변경
        setVocabularies((prev) =>
          prev.map((vocab) => (vocab.id === word.id ? { ...vocab, memorized: !vocab.memorized } : vocab))
        );

        // 데이터베이스 업데이트
        await updateVocabulary({
          ...word,
          memorized: !word.memorized,
        });

        if (showOnlyUnmemorized && !word.memorized) {
          if (order >= filteredVocabularies.length - 1) {
            setOrder(0);
          }
        }
      } catch (error) {
        console.error('Failed to update memorized status:', error);
        setVocabularies((prev) =>
          prev.map((vocab) => (vocab.id === word.id ? { ...vocab, memorized: word.memorized } : vocab))
        );
      }
    },
    [showOnlyUnmemorized, order, filteredVocabularies.length, setVocabularies, setOrder]
  );

  return {
    handleUpdateVocabulary,
    handleToggleMemorized,
  };
}
