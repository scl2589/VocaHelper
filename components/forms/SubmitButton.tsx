interface SubmitButtonProps {
    loading: boolean;
    children: React.ReactNode;
    disabled?: boolean;
}

export default function SubmitButton({ loading, children, disabled = false }: SubmitButtonProps) {
    return (
        <div className="flex items-center justify-end pt-6">
            <button
                type="submit"
                disabled={loading || disabled}
                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-medium rounded-lg transition-colors duration-200 shadow-sm hover:shadow-md disabled:cursor-not-allowed"
            >
                {loading ? (
                    <div className="flex items-center">
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        추가 중...
                    </div>
                ) : (
                    children
                )}
            </button>
        </div>
    );
}
