'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
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

        router.push('/conversations');
      } catch (error) {
        console.error('Check page connection error:', error);
        router.push('/login');
      } finally {
        setIsLoading(false);
      }
    };

    checkPageConnection();
  }, [router]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32">
        <div className="flex flex-col items-center justify-center py-20">
          <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mb-4"></div>
          <p className="text-gray-600">
            {isLoading ? 'Đang mở màn hội thoại...' : 'Đang chuyển hướng...'}
          </p>
        </div>
      </div>
    </div>
  );
}