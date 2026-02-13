'use client';

import { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
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
  const [isLoading, setIsLoading] = useState(true);
  const [selectedPage, setSelectedPage] = useState<FacebookPage | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState('');

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

      // Chuyển hướng đến dashboard sau khi kết nối thành công
      router.push('/dashboard');
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-blue-100 rounded-full mb-6">
            <span className="text-4xl">📘</span>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Chọn Facebook Page để kết nối
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Chọn Page bạn muốn quản lý với Pancake. Bạn có thể kết nối nhiều Page sau này.
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="max-w-2xl mx-auto mb-8 p-4 bg-red-50 border border-red-200 rounded-xl">
            <div className="flex items-start">
              <svg className="w-6 h-6 text-red-500 mr-3 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              <div>
                <p className="text-red-800 font-medium">{error}</p>
                <button
                  onClick={handleRefresh}
                  className="mt-2 text-sm text-red-600 hover:text-red-800 underline"
                >
                  Thử lại
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Loading State */}
        {isLoading && !error ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mb-4"></div>
            <p className="text-gray-600">Đang tải danh sách Facebook Page...</p>
          </div>
        ) : (
          <>
            {/* Pages Grid */}
            {pages.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {pages.map((page) => (
                  <div
                    key={page.id}
                    className={`bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border-2 cursor-pointer ${
                      selectedPage?.id === page.id
                        ? 'border-blue-500 ring-2 ring-blue-200'
                        : 'border-gray-100 hover:border-blue-300'
                    }`}
                    onClick={() => handleConnectPage(page)}
                  >
                    {/* Page Header */}
                    <div className="p-6 bg-gradient-to-r from-blue-500 to-blue-600">
                      <div className="flex items-center space-x-4">
                        <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center overflow-hidden">
                          {page.picture?.data.url ? (
                            <Image
                              src={page.picture.data.url}
                              alt={page.name}
                              width={64}
                              height={64}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <span className="text-3xl">📄</span>
                          )}
                        </div>
                        <div>
                          <h3 className="text-xl font-bold text-white">{page.name}</h3>
                          <p className="text-white/90 text-sm">{page.category}</p>
                        </div>
                      </div>
                    </div>

                    {/* Page Info */}
                    <div className="p-6">
                      {page.about && (
                        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                          {page.about}
                        </p>
                      )}

                      {/* Permissions */}
                      <div className="mb-4">
                        <p className="text-sm font-medium text-gray-700 mb-2">Quyền đã cấp:</p>
                        <div className="flex flex-wrap gap-2">
                          {page.tasks.slice(0, 3).map((task) => (
                            <span
                              key={task}
                              className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full"
                            >
                              {task}
                            </span>
                          ))}
                          {page.tasks.length > 3 && (
                            <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                              +{page.tasks.length - 3}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Connect Button */}
                      <button
                        className={`w-full py-3 rounded-xl font-semibold transition-all ${
                          isConnecting && selectedPage?.id === page.id
                            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                            : 'bg-blue-600 text-white hover:bg-blue-700'
                        }`}
                        disabled={isConnecting && selectedPage?.id === page.id}
                      >
                        {isConnecting && selectedPage?.id === page.id ? (
                          <span className="flex items-center justify-center">
                            <svg className="animate-spin h-5 w-5 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Đang kết nối...
                          </span>
                        ) : (
                          'Kết nối Page này'
                        )}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* No Pages State */}
            {pages.length === 0 && !error && (
              <div className="max-w-2xl mx-auto text-center py-20">
                <div className="inline-flex items-center justify-center w-24 h-24 bg-gray-100 rounded-full mb-6">
                  <span className="text-5xl">📄</span>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  Không có Facebook Page nào
                </h3>
                <p className="text-gray-600 mb-8">
                  Bạn chưa có Facebook Page nào hoặc chưa cấp quyền cho ứng dụng. Hãy tạo Page mới hoặc cấp quyền trong cài đặt Facebook.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <a
                    href="https://www.facebook.com/pages/create/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-6 py-3 bg-blue-600 text-white rounded-full hover:bg-blue-700 font-semibold transition-colors"
                  >
                    Tạo Page mới
                  </a>
                  <button
                    onClick={handleRefresh}
                    className="px-6 py-3 bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200 font-semibold transition-colors"
                  >
                        Thử lại
                  </button>
                </div>
              </div>
            )}
          </>
        )}

        {/* Back Button */}
        <div className="text-center mt-12">
          <Link href="/login" className="text-gray-600 hover:text-gray-900 flex items-center justify-center">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Quay lại trang đăng nhập
          </Link>
        </div>
      </div>
    </div>
  );
}