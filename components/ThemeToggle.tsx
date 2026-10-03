'use client';

import { useEffect, useState } from 'react';

export default function ThemeToggle() {
  const [dark, setDark] = useState(false);
  useEffect(() => {
    const media = window.matchMedia('(prefers-color-scheme: dark)');
    const sync = () => {
      let saved: string | null = null;
      try { saved = localStorage.getItem('voca-theme'); } catch { /* Use system preference. */ }
      const next = saved === 'dark' || (saved !== 'light' && media.matches);
      document.documentElement.classList.toggle('dark', next);
      setDark(next);
    };
    sync();
    media.addEventListener('change', sync);
    window.addEventListener('storage', sync);
    return () => {
      media.removeEventListener('change', sync);
      window.removeEventListener('storage', sync);
    };
  }, []);

  const toggle = () => {
    const next = !dark;
    document.documentElement.classList.toggle('dark', next);
    setDark(next);
    try { localStorage.setItem('voca-theme', next ? 'dark' : 'light'); } catch { /* Still apply this session. */ }
  };

  return <button type="button" onClick={toggle} className="theme-toggle" aria-label={dark ? '라이트 모드로 전환' : '다크 모드로 전환'} title={dark ? '라이트 모드로 전환' : '다크 모드로 전환'}>
    <span aria-hidden="true">{dark ? '☀' : '☾'}</span><span>{dark ? '라이트' : '다크'}</span>
  </button>;
}
