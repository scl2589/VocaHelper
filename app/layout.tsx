import type { Metadata } from "next";
import "./globals.css";
import Logo from '@/components/Logo'
import Link from 'next/link'
import MobileMenu from '@/components/MobileMenu'

export const metadata: Metadata = {
  title: "Voca Helper - 스마트한 단어 학습",
  description: "개인화된 학습 경험과 과학적 암기법으로 단어 학습의 효율성을 극대화하는 Voca Helper입니다.",
  keywords: "단어 학습, 영어 단어, 단어 암기, 학습 도구, Voca Helper",
  authors: [{ name: "Voca Helper Team" }],
  viewport: "width=device-width, initial-scale=1",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className="scroll-smooth">
      <body className="antialiased bg-white dark:bg-gray-950">
        <header className="sticky top-0 z-50 bg-white/95 dark:bg-gray-950/95 backdrop-blur-md border-b border-gray-200 dark:border-gray-800">
          <div className="container mx-auto px-6 py-4">
            <div className="flex justify-between items-center">
              <Logo />
              <nav className="hidden md:flex items-center gap-8">
                <Link href="/vocabulary/add" className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200 font-medium">
                  단어 추가
                </Link>
                <Link href="/vocabulary/books" className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200 font-medium">
                  단어책
                </Link>
                <Link href="/vocabulary" className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200 font-medium">
                  단어 외우기
                </Link>
                <Link href="/vocabulary/memorize" className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors duration-200 shadow-sm hover:shadow-md">
                  깜빡이 학습
                </Link>
              </nav>
              
              <MobileMenu />
            </div>
          </div>
        </header>
        
        <main className="m-5">
          {children}
        </main>
      </body>
    </html>
  );
}
