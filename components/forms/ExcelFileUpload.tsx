interface ExcelFileUploadProps {
    accept?: string;
    name?: string;
    id?: string;
    required?: boolean;
}

export default function ExcelFileUpload({ 
    accept = ".xlsx,.xls,.csv", 
    name = "file", 
    id = "file-upload", 
    required = true 
}: ExcelFileUploadProps) {
    return (
        <div className="space-y-2">
            <label htmlFor={id} className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                엑셀 파일
            </label>
            <input
                type="file"
                accept={accept}
                name={name}
                id={id}
                required={required}
                className="block w-full rounded-lg border border-gray-300 p-3 text-sm text-gray-700 dark:border-gray-600 dark:text-gray-300 file:mr-4 file:rounded-md file:border-0 file:bg-blue-50 file:px-4 file:py-2 file:text-blue-700"
            />
            <p className="text-xs text-gray-500 dark:text-gray-400">
                파일을 선택한 다음 아래 ‘단어 추가하기’를 눌러주세요.
            </p>
        </div>
    );
}
