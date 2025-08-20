interface FormCardProps {
    title: string;
    description: string;
    children: React.ReactNode;
}

export default function FormCard({ title, description, children }: FormCardProps) {
    return (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {title}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    {description}
                </p>
            </div>
            <div className="p-6">
                {children}
            </div>
        </div>
    );
}
