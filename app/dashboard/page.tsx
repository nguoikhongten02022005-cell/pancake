'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Link from 'next/link';

export default function DashboardPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Kiểm tra xem đã kết nối Page chưa
    // Trong thực tế, bạn sẽ get từ API hoặc session
    const checkPageConnection = async () => {
      try {
        const response = await fetch('/api/realtime/session');
        if (!response.ok) {
          router.push('/login');
          return;
        }

        const data = await response.json();
        if (!data?.authenticated) {
          router.push('/login');
          return;
        }
        setIsLoading(false);
      } catch (error) {
        console.error('Check page connection error:', error);
        router.push('/login');
      }
    };

    checkPageConnection();
  }, [router]);

  const handleDisconnect = () => {
    fetch('/api/auth/logout', { method: 'POST' }).finally(() => {
      router.push('/login');
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mb-4"></div>
            <p className="text-gray-600">Đang tải...</p>
          </div>
        ) : (
          <>
            {/* Success Header */}
            <div className="text-center mb-12">
              <div className="inline-flex items-center justify-center w-24 h-24 bg-green-100 rounded-full mb-6">
                <svg className="w-12 h-12 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h1 className="text-4xl font-bold text-gray-900 mb-4">
                Kết nối thành công! 🎉
              </h1>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Facebook Page của bạn đã được kết nối thành công với Pancake. Bạn có thể bắt đầu quản lý hội thoại và đăng bài ngay bây giờ.
              </p>
            </div>

            {/* Info Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 max-w-5xl mx-auto">
              <div className="bg-white rounded-2xl shadow-lg p-6 text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl">💬</span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Hội thoại</h3>
                <p className="text-gray-600">Quản lý tin nhắn từ Facebook Messenger</p>
              </div>

              <div className="bg-white rounded-2xl shadow-lg p-6 text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl">📝</span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Đăng bài</h3>
                <p className="text-gray-600">Đăng bài viết lên Facebook Page</p>
              </div>

              <div className="bg-white rounded-2xl shadow-lg p-6 text-center">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl">📊</span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Thống kê</h3>
                <p className="text-gray-600">Theo dõi hiệu quả và tương tác</p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Link
                href="/conversations"
                className="px-8 py-4 bg-blue-600 text-white rounded-full hover:bg-blue-700 font-semibold transition-all transform hover:scale-105 shadow-lg"
              >
                Bắt đầu quản lý hội thoại
              </Link>
              <Link
                href="/auth/facebook/pages"
                className="px-8 py-4 bg-white border border-gray-300 text-gray-800 rounded-full hover:bg-gray-50 font-semibold transition-all"
              >
                Chọn lại Facebook Page
              </Link>
              <button
                onClick={handleDisconnect}
                className="px-8 py-4 bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200 font-semibold transition-all"
              >
                Ngắt kết nối
              </button>
            </div>

            {/* Info Box */}
            <div className="max-w-3xl mx-auto bg-blue-50 border border-blue-200 rounded-2xl p-6">
              <div className="flex items-start">
                <svg className="w-6 h-6 text-blue-600 mr-3 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
                <div>
                  <h4 className="font-bold text-blue-900 mb-2">Thông tin quan trọng</h4>
                  <p className="text-blue-800 text-sm">
                    Page access token của bạn đã được lưu an toàn. Token này cho phép Pancake tương tác với Facebook Page của bạn.
                    Bạn có thể ngắt kết nối bất cứ lúc nào. Token sẽ hết hạn sau 60 ngày nếu không được sử dụng.
                  </p>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}