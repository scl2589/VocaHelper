interface FormCardProps {
    title: string;
    description: string;
    children: React.ReactNode;
}

export default function FormCard({ title, description, children }: FormCardProps) {
    return (
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
            <div className="px-6 py-6 border-b border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {title}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-300 mt-2 leading-relaxed">
                    {description}
                </p>
            </div>
            <div className="p-5 sm:p-7">
                {children}
            </div>
        </div>
    );
}
