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
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                엑셀 파일
            </label>
            <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center hover:border-blue-400 dark:hover:border-blue-400 transition-colors">
                <input
                    type="file"
                    accept={accept}
                    name={name}
                    className="hidden"
                    id={id}
                    required={required}
                />
                <label htmlFor={id} className="cursor-pointer">
                    <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                        <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                        <span className="font-medium text-blue-600 dark:text-blue-400 hover:text-blue-500">
                            파일을 클릭하여 업로드
                        </span>
                        {' '}또는 드래그 앤 드롭
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        Excel (.xlsx, .xls) 또는 CSV 파일
                    </p>
                </label>
            </div>
        </div>
    );
}
