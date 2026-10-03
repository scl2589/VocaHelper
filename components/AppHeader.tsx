'use client';
import Link from 'next/link';
import ThemeToggle from './ThemeToggle';
import { usePathname } from 'next/navigation';
const links = [['/vocabulary','단어 노트'],['/vocabulary/memorize','깜빡이 학습'],['/vocabulary/quiz','퀴즈'],['/vocabulary/books','단어장'],['/vocabulary/add','단어 추가']];
export default function AppHeader() {
 const path = usePathname();
 return <header className="app-header"><div className="app-header-inner"><Link href="/" className="app-brand"><span className="brand-mark" aria-hidden="true">V.</span><span>Voca Helper<small>나의 작은 단어 노트</small></span></Link><nav aria-label="주 메뉴" className="app-nav">{links.map(([href,label])=><Link key={href} href={href} aria-current={path===href || (href!=='/vocabulary' && path.startsWith(href+'/'))?'page':undefined}>{label}</Link>)}</nav><ThemeToggle /></div></header>;
}
