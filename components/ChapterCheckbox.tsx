import { Chapter } from '@/types/chapter';

interface ChapterCheckboxProps {
    chapter: Chapter;
    isSelected: boolean;
    onToggle: (chapterId: string, isChecked: boolean) => void;
}

const ChapterCheckbox = ({ chapter, isSelected, onToggle }: ChapterCheckboxProps) => (
    <div className="flex items-center mb-1 md:mb-2 w-full hover:bg-gray-100 py-0.5 md:py-1 px-1 rounded">
        <input
            type="checkbox"
            id={`chapter-${chapter.id}`}
            value={chapter.id}
            checked={isSelected}
            onChange={(e) => onToggle(chapter.id, e.target.checked)}
            className="mr-2 md:mr-3 h-3 w-3 md:h-4 md:w-4"
        />
        <label htmlFor={`chapter-${chapter.id}`} className="text-xs md:text-sm flex-1 cursor-pointer truncate">
            {chapter.name}
        </label>
    </div>
);

export default ChapterCheckbox; 