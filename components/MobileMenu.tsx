'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function MobileMenu() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const closeMenu = () => {
    setIsOpen(false);
  };

  return (
    <>
      {/* 햄버거 버튼 */}
      <button 
        onClick={toggleMenu}
        className="md:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
        aria-label="메뉴 열기"
      >
        <svg 
          className={`w-6 h-6 text-gray-600 dark:text-gray-300 transition-transform duration-200 ${isOpen ? 'rotate-90' : ''}`} 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          {isOpen ? (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          ) : (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          )}
        </svg>
      </button>

      {/* 모바일 메뉴 오버레이 */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40 md:hidden"
          onClick={closeMenu}
        >
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
        </div>
      )}

      {/* 모바일 메뉴 */}
      {isOpen && (
        <div className="fixed top-0 right-0 z-50 w-80 h-full shadow-2xl transform transition-transform duration-300 ease-in-out md:hidden translate-x-0" style={{ backgroundColor: 'white' }}>
        <div className="flex flex-col h-full" style={{ backgroundColor: 'white' }}>
          {/* 메뉴 헤더 */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700" style={{ backgroundColor: 'white' }}>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">메뉴</h2>
            <button 
              onClick={closeMenu}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              aria-label="메뉴 닫기"
            >
              <svg className="w-5 h-5 text-gray-600 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* 메뉴 항목들 */}
          <nav className="flex-1 p-6" style={{ backgroundColor: 'white' }}>
            <div className="space-y-4">
              <Link 
                href="/vocabulary/add" 
                onClick={closeMenu}
                className="flex items-center gap-3 p-4 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200 font-medium"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                단어 추가
              </Link>
              
              <Link 
                href="/vocabulary" 
                onClick={closeMenu}
                className="flex items-center gap-3 p-4 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200 font-medium"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                단어 외우기
              </Link>
              
              <Link 
                href="/vocabulary/books" 
                onClick={closeMenu}
                className="flex items-center gap-3 p-4 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200 font-medium"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
                단어책
              </Link>
              
              <Link 
                href="/vocabulary/quiz" 
                onClick={closeMenu}
                className="flex items-center gap-3 p-4 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-green-50 dark:hover:bg-green-900/20 hover:text-green-600 dark:hover:text-green-400 transition-colors duration-200 font-medium"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                </svg>
                퀴즈 풀기
              </Link>
              
              <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                <Link 
                  href="/vocabulary/memorize" 
                  onClick={closeMenu}
                  className="flex items-center justify-center gap-3 p-4 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium transition-colors duration-200 shadow-sm hover:shadow-md"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  깜빡이 학습
                </Link>
              </div>
            </div>
          </nav>

          {/* 메뉴 푸터 */}
          <div className="p-6 border-t border-gray-200 dark:border-gray-700" style={{ backgroundColor: 'white' }}>
            <div className="text-center">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Voca Helper로 효율적인 단어 학습을 시작하세요
              </p>
            </div>
          </div>
        </div>
        </div>
      )}
    </>
  );
}
