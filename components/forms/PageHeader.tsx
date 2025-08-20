import Link from "next/link";
import Title from "@/components/Title";

interface PageHeaderProps {
    title: string;
    actionText: string;
    actionHref: string;
}

export default function PageHeader({ title, actionText, actionHref }: PageHeaderProps) {
    return (
        <div className="flex items-center justify-between w-full mb-6">
            <Title title={title} />
            <Link 
                href={actionHref}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors duration-200 shadow-sm hover:shadow-md"
            >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                {actionText}
            </Link>
        </div>
    );
}
