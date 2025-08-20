import { FEATURE_COLORS } from '@/constants/colors';

export const FEATURES = [
  {
    href: '/vocabulary/add',
    iconType: 'addWord',
    title: '단어 추가',
    description: '새로운 단어를 직접 입력하거나 엑셀 파일로 대량 추가',
    color: FEATURE_COLORS.blue
  },
  {
    href: '/vocabulary/add/excel',
    iconType: 'excel',
    title: '엑셀 가져오기',
    description: '기존 엑셀 파일의 단어를 쉽게 가져와서 활용',
    color: FEATURE_COLORS.green
  },
  {
    href: '/vocabulary',
    iconType: 'list',
    title: '단어 리스트',
    description: '저장된 모든 단어를 체계적으로 관리하고 검색',
    color: FEATURE_COLORS.purple
  },
  {
    href: '/vocabulary/books',
    iconType: 'book',
    title: '단어책',
    description: '주제별로 단어를 분류하여 체계적인 학습 진행',
    color: FEATURE_COLORS.orange
  }
] as const;
