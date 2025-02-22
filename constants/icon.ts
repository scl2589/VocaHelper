import ArrowLeft from '@/assets/svg/arrowLeft.svg';
import ArrowRight from '@/assets/svg/arrowRight.svg';
import Shuffle from '@/assets/svg/shuffle.svg'

export const ICON_FACTORY = {
    arrowLeft: ArrowLeft,
    arrowRight: ArrowRight,
    shuffle: Shuffle,
};

export type Icons = keyof typeof ICON_FACTORY;
