import ArrowLeft from '@/assets/svg/arrowLeft.svg';
import ArrowRight from '@/assets/svg/arrowRight.svg';

export const ICON_FACTORY = {
    arrowLeft: ArrowLeft,
    arrowRight: ArrowRight,
};

export type Icons = keyof typeof ICON_FACTORY;
