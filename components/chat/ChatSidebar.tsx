"use client";

import { useState } from 'react';

interface ChatSidebarProps {
  customerInfo?: unknown;
}

export function ChatSidebar({ customerInfo: _customerInfo }: ChatSidebarProps) {
  const [activeTab, setActiveTab] = useState<'info' | 'create'>('info');

  return (
    <aside className="w-full h-full bg-[#f3f5f8] border-l border-[#d9dce3] flex flex-col">
      {/* Tabs */}
      <div className="h-[44px] bg-white border-b border-[#d9dce3] grid grid-cols-2 text-[20px]">
        <button
          type="button"
          onClick={() => setActiveTab('info')}
          className={`relative font-medium transition-colors duration-200 ${activeTab === 'info' ? 'text-[#3d78d8]' : 'text-[#3b3f45]'}`}
        >
          Thông tin
          {activeTab === 'info' && <span className="absolute left-0 right-0 bottom-0 h-[2px] bg-[#3d78d8]" />}
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('create')}
          className={`relative font-medium transition-colors duration-200 ${activeTab === 'create' ? 'text-[#3d78d8]' : 'text-[#3b3f45]'}`}
        >
          Tạo mới
          {activeTab === 'create' && <span className="absolute left-0 right-0 bottom-0 h-[2px] bg-[#3d78d8]" />}
        </button>
      </div>

      <div className="flex-1 flex flex-col px-8 pb-2 transition-all duration-200">
        {activeTab === 'info' ? (
          <>
            {/* Empty note */}
            <div className="pt-12 pb-8 flex flex-col items-center justify-center text-center text-[#6f7890]">
              <div className="w-[74px] h-[74px] rounded-full bg-[#edf1f6] flex items-center justify-center mb-3">
                <svg className="w-10 h-10 text-[#c4cad8]" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 10h8M8 14h5m-7 6h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <p className="text-[15px]">Bạn chưa có ghi chú nào</p>
            </div>

            {/* Note input */}
            <div className="h-[40px] rounded-[7px] bg-[#eaedf2] border border-[#dde2ea] flex items-center px-3 text-[#7b8396] text-[13px]">
              <span className="truncate">Nhập ghi chú (Enter để gửi)</span>
              <svg className="w-4 h-4 ml-auto text-[#8a92a8]" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>

            {/* Title */}
            <div className="mt-12 flex items-center gap-3">
              <span className="h-px bg-[#d7dbe4] flex-1" />
              <span className="text-[#4d5363] text-[23px] font-semibold">Đơn hàng</span>
              <span className="h-px bg-[#d7dbe4] flex-1" />
            </div>

            {/* Empty order */}
            <div className="flex-1 flex flex-col items-center justify-start pt-14 text-[#6f7890]">
              <div className="w-[68px] h-[68px] mb-3 text-[#c6ccda]">
                <svg viewBox="0 0 72 72" className="w-full h-full" fill="none">
                  <rect x="20" y="24" width="32" height="38" rx="4" stroke="currentColor" strokeWidth="2" />
                  <path d="M28 32h16M28 38h12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                  <circle cx="55" cy="24" r="7" fill="currentColor" opacity="0.25" />
                  <text x="53" y="27" fontSize="8" fill="#9aa3b8">0</text>
                </svg>
              </div>
              <p className="text-[29px] mb-4">Chưa có lịch sử đơn hàng</p>
              <button
                type="button"
                className="h-[32px] px-4 rounded-[6px] bg-[#b8ddff] text-[#1f73e8] text-[23px] font-medium hover:bg-[#acd5ff]"
              >
                ＋ Tạo đơn
              </button>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col pt-8 gap-4">
            <p className="text-[13px] text-[#6f7890]">Tạo nhanh nội dung mới</p>

            <button
              type="button"
              className="w-full h-[40px] rounded-[7px] bg-white border border-[#d9dce3] text-[14px] text-[#3b3f45] hover:bg-[#f7f9fc] transition-colors"
            >
              + Tạo ghi chú
            </button>

            <button
              type="button"
              className="w-full h-[40px] rounded-[7px] bg-[#b8ddff] border border-[#a8d2ff] text-[14px] text-[#1f73e8] font-medium hover:bg-[#acd5ff] transition-colors"
            >
              + Tạo đơn hàng
            </button>

            <div className="mt-2 rounded-[8px] border border-[#dde2ea] bg-white p-3 text-[12px] text-[#6f7890] leading-5">
              Tab <span className="font-semibold text-[#3b3f45]">Tạo mới</span> đã hoạt động. Bấm vào nút để thao tác nhanh.
            </div>
          </div>
        )}

        {/* Footer tiny badges */}
        <div className="h-6 flex items-center gap-2 text-[12px] text-[#6e7490]">
          <span className="px-2 h-[18px] inline-flex items-center rounded-full bg-[#7f56d9] text-white text-[11px]">2 Ads</span>
          <span className="w-2 h-2 rounded-[2px] bg-[#3b74d8]" />
          <span>1</span>
        </div>
      </div>
    </aside>
  );
}