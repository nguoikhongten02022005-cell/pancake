'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

interface AppNavbarProps {
  activeTab?: string;
}

export function AppNavbar({ activeTab = 'conversations' }: AppNavbarProps) {
  const [pageName, setPageName] = useState('');

  useEffect(() => {
    try {
      const raw = document.cookie.split(';').find(c => c.trim().startsWith('selected_page_info='));
      if (raw) {
        const val = decodeURIComponent(raw.split('=').slice(1).join('='));
        const info = JSON.parse(val);
        setPageName(info.name || '');
      }
    } catch {
      // ignore
    }
  }, []);

  const tabs = [
    { id: 'conversations', label: 'Hội thoại', href: '/conversations' },
    { id: 'orders', label: 'Đơn hàng', href: '#' },
    { id: 'posts', label: 'Bài viết', href: '#' },
    { id: 'stats', label: 'Thống kê', href: '#' },
    { id: 'settings', label: 'Cài đặt', href: '#' },
  ];

  return (
    <nav className="h-[46px] bg-[#4267B2] flex items-center justify-between px-4 shrink-0">
      {/* Left: Logo */}
      <Link href="/" className="flex items-center gap-2 shrink-0">
        <div className="w-7 h-7 bg-white/20 rounded-full flex items-center justify-center">
          <span className="text-white text-sm">🥞</span>
        </div>
        <span className="text-white font-semibold text-[15px]">Pancake</span>
      </Link>

      {/* Center: Tabs */}
      <div className="flex items-center gap-0">
        {tabs.map((tab) => (
          <Link
            key={tab.id}
            href={tab.href}
            className={`px-4 py-[11px] text-[13px] font-medium transition-colors ${
              activeTab === tab.id
                ? 'text-white bg-white/15 rounded-md'
                : 'text-white/75 hover:text-white hover:bg-white/10 rounded-md'
            }`}
          >
            {tab.label}
          </Link>
        ))}
      </div>

      {/* Right: User info */}
      <div className="flex items-center gap-3 shrink-0">
        <span className="text-white/80 text-[13px] hidden lg:block">{pageName}</span>
        <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
          <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        </div>
        <div className="relative">
          <svg className="w-5 h-5 text-white/80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
          </svg>
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-[9px] text-white flex items-center justify-center font-medium">3</span>
        </div>
      </div>
    </nav>
  );
}
