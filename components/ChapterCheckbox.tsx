import { Chapter } from '@/types/chapter';

interface ChapterCheckboxProps {
    chapter: Chapter;
    isSelected: boolean;
    onToggle: (chapterId: string, isChecked: boolean) => void;
}

const ChapterCheckbox = ({ chapter, isSelected, onToggle }: ChapterCheckboxProps) => (
    <div className="flex items-center w-full hover:bg-gray-100 p-1 rounded h-7 md:h-8 mb-1">
        <input
            type="checkbox"
            id={`chapter-${chapter.id}`}
            value={chapter.id}
            checked={isSelected}
            onChange={(e) => onToggle(chapter.id, e.target.checked)}
            className="mr-2 md:mr-3 h-3 w-3 md:h-4 md:w-4 flex-shrink-0"
        />
        <label htmlFor={`chapter-${chapter.id}`} className="text-xs md:text-sm flex-1 cursor-pointer truncate">
            {chapter.name}
        </label>
    </div>
);

export default ChapterCheckbox; 