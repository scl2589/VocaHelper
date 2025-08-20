import Link from "next/link";
import { AddWordIcon, ExcelIcon, ListIcon, BookIcon, QuizIcon } from './icons/FeatureIcons';

interface FeatureCardProps {
  href: string;
  iconType: 'addWord' | 'excel' | 'list' | 'book' | 'quiz';
  title: string;
  description: string;
  color: {
    border: string;
    background: string;
    icon: string;
  };
}

const getIcon = (iconType: string) => {
  switch (iconType) {
    case 'addWord':
      return <AddWordIcon />;
    case 'excel':
      return <ExcelIcon />;
    case 'list':
      return <ListIcon />;
    case 'book':
      return <BookIcon />;
    case 'quiz':
      return <QuizIcon />;
    default:
      return <AddWordIcon />;
  }
};

export default function FeatureCard({ href, iconType, title, description, color }: FeatureCardProps) {
  return (
    <Link href={href} className="group h-full">
      <div className={`relative bg-white/70 dark:bg-gray-900/70 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 rounded-3xl p-8 hover:border-${color.border} dark:hover:border-${color.border} transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 h-full flex flex-col`}>
        <div className={`absolute inset-0 bg-gradient-to-br from-${color.background} to-${color.background} rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500`}></div>
        <div className="relative flex flex-col h-full">
          <div className={`w-16 h-16 bg-gradient-to-br from-${color.icon} to-${color.icon} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg flex-shrink-0`}>
            {getIcon(iconType)}
          </div>
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 flex-shrink-0">{title}</h3>
          <p className="text-gray-600 dark:text-gray-400 leading-relaxed flex-grow">
            {description}
          </p>
        </div>
      </div>
    </Link>
  );
}
