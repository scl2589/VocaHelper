import { Chapter } from '@/types/chapter';

interface ChapterCheckboxProps {
    chapter: Chapter;
    isSelected: boolean;
    onToggle: (chapterId: string, isChecked: boolean) => void;
}

const ChapterCheckbox = ({ chapter, isSelected, onToggle }: ChapterCheckboxProps) => (
    <div 
        className={`flex items-center w-full py-1.5 px-2 rounded-md transition-colors ${
            isSelected 
                ? 'bg-indigo-50 dark:bg-indigo-900/30 border border-indigo-200 dark:border-indigo-700' 
                : 'hover:bg-gray-50 dark:hover:bg-gray-600/30 border border-transparent'
        }`}
    >
        <input
            type="checkbox"
            id={`chapter-${chapter.id}`}
            value={chapter.id}
            checked={isSelected}
            onChange={(e) => onToggle(chapter.id, e.target.checked)}
            className={`mr-2 h-4 w-4 rounded border-gray-300 dark:border-gray-600 text-indigo-600 dark:text-indigo-500 focus:ring-indigo-500 dark:focus:ring-indigo-400 ${
                isSelected ? 'border-indigo-500 dark:border-indigo-400' : ''
            }`}
        />
        <label 
            htmlFor={`chapter-${chapter.id}`} 
            className={`text-sm flex-1 cursor-pointer truncate ${
                isSelected ? 'font-medium text-indigo-700 dark:text-indigo-300' : 'text-gray-700 dark:text-gray-300'
            }`}
        >
            {chapter.name}
        </label>
    </div>
);

export default ChapterCheckbox; 