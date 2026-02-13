'use client';

import { Suspense, useEffect, useMemo, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);

  const errorCode = searchParams.get('error');
  const errorDescription = searchParams.get('description');
  const errorMessage = useMemo(() => {
    if (!errorCode) return null;

    switch (errorCode) {
      case 'missing_facebook_config':
        return 'Thiếu cấu hình Facebook App ID/App Secret. Vui lòng kiểm tra file .env.local.';
      case 'missing_facebook_business_config':
        return 'Thiếu FACEBOOK_LOGIN_CONFIG_ID hợp lệ. Vui lòng cập nhật .env.local rồi khởi động lại app.';
      case 'invalid_state':
        return 'Phiên đăng nhập không hợp lệ hoặc đã hết hạn. Vui lòng thử lại.';
      case 'token_exchange_failed':
        return `Facebook từ chối đổi token. ${errorDescription ? `Chi tiết: ${errorDescription}` : 'Vui lòng kiểm tra App Secret, Redirect URI và cấu hình app trong Meta.'}`;
      default:
        return 'Đăng nhập Facebook chưa thành công. Vui lòng thử lại.';
    }
  }, [errorCode, errorDescription]);

  useEffect(() => {
    if (errorCode) {
      setIsLoading(false);
    }
  }, [errorCode]);

  const handleFacebookLogin = () => {
    setIsLoading(true);
    router.push('/api/auth/facebook/authorize');
  };

  return (
    <div className="min-h-screen bg-[#f7f9fc] text-[#1f2a37]">
      <div className="grid min-h-screen lg:grid-cols-2">
        <aside className="hidden lg:flex flex-col justify-between bg-[#eaf6f4] p-10 xl:p-14 border-r border-[#e3ecef]">
          <div className="flex items-center gap-2">
            <span className="text-3xl">🍰</span>
            <span className="text-4xl font-bold tracking-tight">Pancake</span>
          </div>

          <div>
            <h2 className="text-4xl font-semibold mb-5">Start now ✨</h2>
            <p className="text-lg text-[#516072] mb-6">Free trial - begin smart and efficient customer care</p>
            <ul className="space-y-4 text-[22px] leading-tight font-medium">
              <li>✅ Centralized, efficient multi-platform conversation management</li>
              <li>✅ Automated customer care and order closing with AI Agent</li>
              <li>✅ Order management and automated ad optimization with CAPI</li>
              <li>✅ Omnichannel customer management with CRM</li>
              <li>✅ Landing page design - Website</li>
            </ul>
          </div>

          <p className="text-sm text-[#667788]">© 2026 Pancake</p>
        </aside>

        <main className="flex items-center justify-center p-6 sm:p-10">
          <div className="w-full max-w-[540px] rounded-2xl bg-white border border-[#e5eaf1] p-7 sm:p-9 shadow-sm">
            <div className="flex items-start justify-between mb-8">
              <h1 className="text-[40px] font-semibold leading-none tracking-tight">Login or Register</h1>
              <button className="w-9 h-9 rounded-full border border-[#dde4ec] text-xs">🇺🇸</button>
            </div>

            <div className="mb-7 flex gap-6 border-b border-[#e5eaf1]">
              <button className="pb-3 text-[#2563eb] font-semibold border-b-2 border-[#2563eb]">Login</button>
            </div>

            {errorMessage && (
              <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {errorMessage}
              </div>
            )}

            <p className="mb-6 text-[#5f6e81]">
              Đăng nhập nhanh bằng Facebook để kết nối Page và quản lý hội thoại.
            </p>

            <div className="grid grid-cols-1 gap-3">
              <button
                onClick={handleFacebookLogin}
                disabled={isLoading}
                className="h-12 rounded-xl bg-[#1877F2] text-white text-lg font-semibold hover:bg-[#166FE5] disabled:opacity-75 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Đang xử lý...' : 'Facebook'}
              </button>
            </div>

            <p className="mt-6 text-sm text-[#6f7d8f]">
              By continuing, you agree to our{' '}
              <Link href="/privacy-policy" className="text-[#2563eb] hover:underline">
                Terms and Policies
              </Link>
              .
            </p>

            <div className="mt-7 pt-5 border-t border-[#e5eaf1] text-center text-sm text-[#6f7d8f]">
              Copyright © 2026 Pancake ·{' '}
              <Link href="/privacy-policy" className="text-[#2563eb] hover:underline">
                Privacy Policy
              </Link>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#f7f9fc] flex items-center justify-center">
          <div className="w-full max-w-[540px] rounded-2xl bg-white border border-[#e5eaf1] p-9 shadow-sm flex items-center justify-center">
            <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
          </div>
        </div>
      }
    >
      <LoginContent />
    </Suspense>
  );
}