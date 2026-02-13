'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';

interface FacebookPage {
  id: string;
  name: string;
  access_token: string;
  picture?: {
    data: {
      url: string;
    };
  };
  category: string;
  tasks: string[];
  about?: string;
}

export default function FacebookPagesPage() {
  const router = useRouter();
  const [pages, setPages] = useState<FacebookPage[]>([]);
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [selectedPage, setSelectedPage] = useState<FacebookPage | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState('');

  const filteredPages = useMemo(() => {
    const keyword = query.trim().toLowerCase();
    if (!keyword) {
      return pages;
    }

    return pages.filter((page) => {
      const name = page.name.toLowerCase();
      const category = page.category.toLowerCase();
      return name.includes(keyword) || category.includes(keyword);
    });
  }, [pages, query]);

  const getErrorMessage = (error: unknown, fallback: string) => {
    if (error instanceof Error && error.message) {
      return error.message;
    }

    return fallback;
  };

  const fetchPages = useCallback(async () => {
    try {
      const response = await fetch('/api/auth/facebook/pages');
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch pages');
      }

      setPages(data.data || []);

      // Nếu không có page nào, hiển thị thông báo
      if (data.data && data.data.length === 0) {
        setError('Không tìm thấy Facebook Page nào. Hãy đảm bảo bạn đã cấp quyền cho ứng dụng.');
      }
    } catch (err: unknown) {
      setError(getErrorMessage(err, 'Có lỗi xảy ra khi tải danh sách Page'));
      console.error('Fetch pages error:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPages();
  }, [fetchPages]);

  const handleConnectPage = async (page: FacebookPage) => {
    setIsConnecting(true);
    setSelectedPage(page);

    try {
      const response = await fetch('/api/auth/facebook/pages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          pageId: page.id,
          pageAccessToken: page.access_token,
          pageName: page.name,
          pageCategory: page.category,
          pagePictureUrl: page.picture?.data.url,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to connect page');
      }

      // Chuyển thẳng đến màn hội thoại sau khi kết nối thành công
      router.push('/conversations');
    } catch (err: unknown) {
      setError(getErrorMessage(err, 'Có lỗi xảy ra khi kết nối Page'));
      setIsConnecting(false);
      setSelectedPage(null);
    }
  };

  const handleRefresh = () => {
    setIsLoading(true);
    setError('');
    fetchPages();
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="border-b border-gray-200 bg-white">
        <div className="mx-auto flex h-14 w-full max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="text-base font-semibold text-gray-900">Pancake</div>
          <div className="text-sm text-gray-500">Kết nối Facebook Page</div>
        </div>
      </div>

      <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="rounded-lg border border-gray-200 bg-white">
          <div className="border-b border-gray-200 p-4 sm:p-5">
            <h1 className="text-lg font-semibold text-gray-900">Chọn Page để kết nối</h1>
            <p className="mt-1 text-sm text-gray-500">
              Chọn một Facebook Page để bắt đầu quản lý tin nhắn.
            </p>
          </div>

          <div className="border-b border-gray-200 p-4 sm:p-5">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="text-sm text-gray-600">
                Tổng cộng: <span className="font-medium text-gray-900">{pages.length}</span> page
              </div>
              <div className="flex w-full gap-2 sm:w-auto">
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Tìm theo tên page..."
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 outline-none placeholder:text-gray-400 focus:border-blue-500 sm:w-64"
                />
                <button
                  onClick={handleRefresh}
                  className="rounded-md border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Làm mới
                </button>
              </div>
            </div>
          </div>

          {error && (
            <div className="border-b border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 sm:px-5">
              <div className="flex items-center justify-between gap-3">
                <span>{error}</span>
                <button onClick={handleRefresh} className="font-medium underline">
                  Thử lại
                </button>
              </div>
            </div>
          )}

          {isLoading ? (
            <div className="p-8 text-center text-sm text-gray-500">Đang tải danh sách page...</div>
          ) : (
            <div className="divide-y divide-gray-100">
              {filteredPages.map((page) => {
                const isCurrentConnecting = isConnecting && selectedPage?.id === page.id;

                return (
                  <div
                    key={page.id}
                    className={`flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5 ${
                      selectedPage?.id === page.id ? 'bg-blue-50' : 'bg-white'
                    }`}
                  >
                    <div className="flex min-w-0 items-center gap-3">
                      <div className="h-10 w-10 overflow-hidden rounded-full bg-gray-100">
                        {page.picture?.data.url ? (
                          <Image
                            src={page.picture.data.url}
                            alt={page.name}
                            width={40}
                            height={40}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center text-sm text-gray-500">
                            FB
                          </div>
                        )}
                      </div>

                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium text-gray-900">{page.name}</p>
                        <p className="truncate text-xs text-gray-500">{page.category || 'Không có danh mục'}</p>
                        {page.about && <p className="mt-1 truncate text-xs text-gray-400">{page.about}</p>}
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="rounded-md bg-gray-100 px-2 py-1 text-xs text-gray-600">
                        {page.tasks.length} quyền
                      </span>
                      <button
                        onClick={() => handleConnectPage(page)}
                        disabled={isCurrentConnecting}
                        className={`rounded-md px-3 py-2 text-sm font-medium ${
                          isCurrentConnecting
                            ? 'cursor-not-allowed bg-gray-200 text-gray-500'
                            : 'bg-blue-600 text-white hover:bg-blue-700'
                        }`}
                      >
                        {isCurrentConnecting ? 'Đang kết nối...' : 'Kết nối'}
                      </button>
                    </div>
                  </div>
                );
              })}

              {!error && filteredPages.length === 0 && (
                <div className="p-8 text-center">
                  <p className="text-sm text-gray-600">
                    {pages.length === 0
                      ? 'Không có Facebook Page nào khả dụng.'
                      : 'Không tìm thấy page phù hợp với từ khóa.'}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="mt-4">
          <Link href="/login" className="text-sm text-gray-500 hover:text-gray-700">
            ← Quay lại đăng nhập
          </Link>
        </div>
      </div>
    </div>
  );
}