'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <span className="text-2xl">🍰</span>
            <span className="text-xl font-bold text-gray-900">Pancake</span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            <Link href="/features" className="text-gray-700 hover:text-blue-600 transition-colors">
              Tính năng
            </Link>
            <Link href="/pricing" className="text-gray-700 hover:text-blue-600 transition-colors">
              Bảng giá
            </Link>
            <Link href="/success-stories" className="text-gray-700 hover:text-blue-600 transition-colors">
              Câu chuyện thành công
            </Link>
            <Link href="/contact" className="text-gray-700 hover:text-blue-600 transition-colors">
              Liên hệ
            </Link>
            <Link href="/login" className="px-4 py-2 text-blue-600 hover:text-blue-700 font-medium transition-colors">
              Đăng nhập
            </Link>
            <button className="px-6 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 font-medium transition-colors">
              Dùng thử ngay
            </button>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 rounded-md hover:bg-gray-100"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {isMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden pb-4">
            <div className="flex flex-col space-y-4">
              <Link href="/features" className="text-gray-700 hover:text-blue-600 transition-colors">
                Tính năng
              </Link>
              <Link href="/pricing" className="text-gray-700 hover:text-blue-600 transition-colors">
                Bảng giá
              </Link>
              <Link href="/success-stories" className="text-gray-700 hover:text-blue-600 transition-colors">
                Câu chuyện thành công
              </Link>
              <Link href="/contact" className="text-gray-700 hover:text-blue-600 transition-colors">
                Liên hệ
              </Link>
              <Link href="/login" className="px-4 py-2 text-blue-600 hover:text-blue-700 font-medium transition-colors">
                Đăng nhập
              </Link>
              <button className="px-6 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 font-medium transition-colors">
                Dùng thử ngay
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}