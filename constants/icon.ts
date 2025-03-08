import ArrowLeft from '@/assets/svg/arrowLeft.svg';
import ArrowRight from '@/assets/svg/arrowRight.svg';
import Shuffle from '@/assets/svg/shuffle.svg';
import Play from '@/assets/svg/play.svg';
import Pause from '@/assets/svg/pause.svg';
import SoundOn from '@/assets/svg/soundOn.svg';
import SoundOff from '@/assets/svg/soundOff.svg';
import Loading from '@/assets/svg/loading.svg';
import Book from '@/assets/svg/book.svg';

export const ICON_FACTORY = {
    arrowLeft: ArrowLeft,
    arrowRight: ArrowRight,
    shuffle: Shuffle,
    play: Play,
    pause: Pause,
    soundOn: SoundOn,
    soundOff: SoundOff,
    loading: Loading,
    book: Book,
};

export type Icons = keyof typeof ICON_FACTORY;
