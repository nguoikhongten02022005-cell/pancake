'use client';

import Link from 'next/link';
import { useEffect, useMemo, useRef, useState } from 'react';

interface AppNavbarProps {
  activeTab?: string;
}

interface PageInfo {
  id?: string;
  name?: string;
  pictureUrl?: string | null;
}

interface FacebookPage {
  id: string;
  name: string;
  picture?: {
    data?: {
      url?: string;
    };
  };
}

export function AppNavbar({ activeTab = 'conversations' }: AppNavbarProps) {
  const [pageInfo, setPageInfo] = useState<PageInfo | null>(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [pages, setPages] = useState<FacebookPage[]>([]);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    try {
      const raw = document.cookie.split(';').find(c => c.trim().startsWith('selected_page_info='));
      if (raw) {
        const val = decodeURIComponent(raw.split('=').slice(1).join('='));
        const info = JSON.parse(val) as PageInfo;
        setPageInfo(info);
      }
    } catch {
      // ignore
    }
  }, []);

  useEffect(() => {
    const onClickOutside = (event: MouseEvent) => {
      if (!dropdownRef.current) return;
      if (!dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', onClickOutside);
    return () => document.removeEventListener('mousedown', onClickOutside);
  }, []);

  useEffect(() => {
    const loadPages = async () => {
      try {
        const response = await fetch('/api/auth/facebook/pages');
        const data = await response.json();
        if (response.ok && Array.isArray(data?.data)) {
          setPages(data.data);
        }
      } catch {
        // ignore
      }
    };

    loadPages();
  }, []);

  const tabs = [
    { id: 'conversations', label: 'Hội thoại', href: '/conversations' },
    { id: 'orders', label: 'Đơn hàng', href: '#' },
    { id: 'posts', label: 'Bài viết', href: '#' },
    { id: 'stats', label: 'Thống kê', href: '#' },
    { id: 'settings', label: 'Cài đặt', href: '#' },
  ];

  const avatarUrl = useMemo(() => {
    return pageInfo?.pictureUrl || null;
  }, [pageInfo?.pictureUrl]);

  return (
    <nav className="h-[46px] bg-[#1f2d3d] flex items-center justify-between pl-4 pr-0 shrink-0 border-b border-[#2b3b50]">
      {/* Left: Logo */}
      <Link href="/" className="flex items-center gap-2 shrink-0 pr-6">
        <svg className="w-7 h-7 text-white" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="14" cy="14" r="13" stroke="currentColor" strokeOpacity="0.8" strokeWidth="2" />
          <path d="M6 14.5h16M9 10.5h10M9 18.5h10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
        <span className="text-white font-semibold text-[30px] leading-none tracking-[-0.4px]">Pancake</span>
      </Link>

      {/* Center: Tabs */}
      <div className="flex items-center gap-[2px] mr-auto">
        {tabs.map((tab) => (
          <Link
            key={tab.id}
            href={tab.href}
            className={`h-[32px] px-4 inline-flex items-center rounded text-[16px] font-medium transition-colors ${
              activeTab === tab.id
                ? 'text-white bg-[#3f5f8e]'
                : 'text-white/85 hover:text-white hover:bg-[#2a3a50]'
            }`}
          >
            {tab.label}
          </Link>
        ))}
      </div>

      {/* Right: account section */}
      <div className="relative h-full" ref={dropdownRef}>
        <div className="h-full bg-[#162336] px-3 flex items-center gap-3 border-l border-[#22344a]">
          <button
            type="button"
            onClick={() => setDropdownOpen((v) => !v)}
            className="flex items-center gap-2 h-[34px] px-1 rounded hover:bg-white/10"
          >
            <div className="w-7 h-7 rounded-full overflow-hidden bg-white/15 shrink-0">
              {avatarUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={avatarUrl} alt={pageInfo?.name || 'Page'} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-white text-[10px] font-semibold">FB</div>
              )}
            </div>
            <span className="text-white text-[14px] max-w-[170px] truncate">{pageInfo?.name || 'Trang của bạn'}</span>
          </button>

          <button type="button" className="relative w-8 h-8 rounded-full bg-[#324866] hover:bg-[#3b5478] flex items-center justify-center">
            <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.4-1.4c-.4-.4-.6-.9-.6-1.4V11a6 6 0 10-12 0v3.2c0 .5-.2 1-.6 1.4L4 17h5m6 0a3 3 0 01-6 0" />
            </svg>
            <span className="absolute top-[2px] right-[2px] w-2.5 h-2.5 rounded-full bg-[#ff4050] border border-[#324866]" />
          </button>
        </div>

        {dropdownOpen && (
          <div className="absolute right-0 top-[46px] w-[280px] bg-white rounded-md shadow-[0_4px_18px_rgba(0,0,0,0.24)] border border-gray-200 overflow-hidden z-50">
            <div className="max-h-[520px] overflow-y-auto py-1">
              {pages.length === 0 ? (
                <div className="px-3 py-4 text-[13px] text-gray-500">Không có danh sách page.</div>
              ) : (
                pages.map((p) => {
                  const pageAvatar = p.picture?.data?.url;
                  const isSelected = pageInfo?.id === p.id;

                  return (
                    <button
                      key={p.id}
                      type="button"
                      className={`w-full px-3 py-2 flex items-center gap-2.5 text-left hover:bg-gray-50 ${isSelected ? 'bg-[#f2f7ff]' : ''}`}
                    >
                      <div className="w-8 h-8 rounded-full overflow-hidden bg-gray-200 shrink-0">
                        {pageAvatar ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={pageAvatar} alt={p.name} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-[10px] text-gray-600">FB</div>
                        )}
                      </div>
                      <span className="text-[14px] text-gray-800 truncate">{p.name}</span>
                    </button>
                  );
                })
              )}

              <div className="border-t border-gray-100 mt-1">
                <button type="button" className="w-full px-3 py-2 text-left text-[14px] text-gray-700 hover:bg-gray-50">Bảng điều khiển</button>
                <button type="button" className="w-full px-3 py-2 text-left text-[14px] text-gray-700 hover:bg-gray-50">Chế độ gộp trang</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
