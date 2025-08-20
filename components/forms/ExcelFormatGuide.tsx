export default function ExcelFormatGuide() {
    return (
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
            <h4 className="text-sm font-medium text-blue-800 dark:text-blue-200 mb-2">
                📋 엑셀 파일 형식
            </h4>
            <div className="text-xs text-blue-700 dark:text-blue-300 space-y-1">
                <p>• 첫 번째 행: 헤더 (단어, 의미1, 품사1, 의미2, 품사2, ...)</p>
                <p>• 단어 열: 반드시 &quot;단어&quot;라는 이름으로 첫 번째 열에 위치</p>
                <p>• 의미/품사: &quot;의미1&quot;, &quot;품사1&quot;, &quot;의미2&quot;, &quot;품사2&quot; 형식으로 작성</p>
                <p>• 예시: 단어 | 의미1 | 품사1 | 의미2 | 품사2</p>
            </div>
        </div>
    );
}
