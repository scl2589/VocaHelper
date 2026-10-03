import type { Metadata, Viewport } from "next";
import "./globals.css";
import AppHeader from '@/components/AppHeader';

export const viewport: Viewport = { width: 'device-width', initialScale: 1 };

export const metadata: Metadata = {
  title: "Voca Helper - 스마트한 단어 학습",
  description: "개인화된 학습 경험과 과학적 암기법으로 단어 학습의 효율성을 극대화하는 Voca Helper입니다.",
  keywords: "단어 학습, 영어 단어, 단어 암기, 학습 도구, Voca Helper",
  authors: [{ name: "Voca Helper Team" }],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className="scroll-smooth" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: `(function(){var t;try{t=localStorage.getItem('voca-theme')}catch(e){}document.documentElement.classList.toggle('dark',t==='dark'||(t!=='light'&&window.matchMedia('(prefers-color-scheme: dark)').matches))})();` }} />
      </head>
      <body className="antialiased bg-white dark:bg-gray-950">
        <AppHeader />

        <main className="app-main">
          {children}
        </main>
      </body>
    </html>
  );
}
