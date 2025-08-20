interface Definition {
    id: number;
    partOfSpeech: string;
    definition: string;
}

interface DefinitionFieldsProps {
    definitions: Definition[];
    onAdd: () => void;
    onRemove: () => void;
    onChange: (index: number, field: "partOfSpeech" | "definition", value: string) => void;
}

export default function DefinitionFields({ definitions, onAdd, onRemove, onChange }: DefinitionFieldsProps) {
    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    뜻
                </label>
                <div className="flex gap-2">
                    <button
                        type="button"
                        onClick={onAdd}
                        className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-md hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors text-sm font-medium"
                    >
                        + 추가
                    </button>
                    <button
                        type="button"
                        onClick={onRemove}
                        className="px-3 py-1 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded-md hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors text-sm font-medium disabled:opacity-50"
                        disabled={definitions.length <= 1}
                    >
                        - 삭제
                    </button>
                </div>
            </div>
            
            <div className="space-y-3">
                {definitions.map((item, index) => (
                    <div key={item.id} className="flex gap-3 items-start">
                        <select
                            name="partOfSpeech"
                            className="w-1/4 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-blue-500 dark:focus:border-blue-400"
                            value={item.partOfSpeech}
                            onChange={(e) => onChange(index, "partOfSpeech", e.target.value)}
                        >
                            <option value="">품사 선택</option>
                            <option value="명">명사</option>
                            <option value="동">동사</option>
                            <option value="형">형용사</option>
                            <option value="부">부사</option>
                            <option value="전치사">전치사</option>
                            <option value="접속사">접속사</option>
                        </select>
                        <input
                            type="text"
                            name="definition"
                            className="flex-1 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-blue-500 dark:focus:border-blue-400"
                            placeholder="뜻을 입력하세요"
                            value={item.definition}
                            onChange={(e) => onChange(index, "definition", e.target.value)}
                            required
                        />
                    </div>
                ))}
            </div>
        </div>
    );
}
