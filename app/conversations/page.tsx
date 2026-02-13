'use client';

import { useEffect, useMemo, useState } from 'react';
import { io, type Socket } from 'socket.io-client';
import Navbar from '@/components/Navbar';
import Link from 'next/link';
import Image from 'next/image';

type ConversationStatus = 'new' | 'in_progress' | 'done';

interface ConversationTag {
  id: string;
  label: string;
  color: string;
}

interface ConversationItem {
  id: string;
  customerName: string;
  customerAvatarUrl: string | null;
  lastMessagePreview: string | null;
  status: ConversationStatus;
  unreadCount: number;
  updatedAt: string;
  tags: ConversationTag[];
}

interface MessageItem {
  id: string;
  senderType: 'CUSTOMER' | 'AGENT';
  senderName: string;
  content: string;
  createdAt: string;
}

interface RealtimeSession {
  authenticated: boolean;
  pageId: string;
}

export default function ConversationsPage() {
  const [session, setSession] = useState<RealtimeSession | null>(null);
  const [loadingSession, setLoadingSession] = useState(true);
  const [conversations, setConversations] = useState<ConversationItem[]>([]);
  const [loadingConversations, setLoadingConversations] = useState(true);
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
  const [messages, setMessages] = useState<MessageItem[]>([]);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [messageText, setMessageText] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | ConversationStatus>('all');
  const [socket, setSocket] = useState<Socket | null>(null);
  const [submittingMessage, setSubmittingMessage] = useState(false);

  useEffect(() => {
    const loadSession = async () => {
      try {
        const res = await fetch('/api/realtime/session');
        if (!res.ok) {
          setLoadingSession(false);
          return;
        }

        const data = (await res.json()) as RealtimeSession;
        setSession(data);
      } finally {
        setLoadingSession(false);
      }
    };

    loadSession();
  }, []);

  useEffect(() => {
    if (!session?.pageId) return;

    const url = typeof window !== 'undefined' ? window.location.origin : '';
    const socketClient = io(url, {
      transports: ['websocket'],
    });

    socketClient.on('connect', () => {
      socketClient.emit('join:page', { pageId: session.pageId });
    });

    socketClient.on('conversation:updated', (payload: { conversation?: ConversationItem; conversationId: string }) => {
      setConversations((prev) => {
        if (payload.conversation) {
          const existed = prev.some((c) => c.id === payload.conversation!.id);
          if (!existed) return [payload.conversation, ...prev];
          return prev
            .map((c) => (c.id === payload.conversation!.id ? payload.conversation! : c))
            .sort((a, b) => Number(new Date(b.updatedAt)) - Number(new Date(a.updatedAt)));
        }
        return prev;
      });
    });

    socketClient.on('message:new', (payload: { conversationId: string; message: MessageItem }) => {
      if (payload.conversationId === activeConversationId) {
        setMessages((prev) => [...prev, payload.message]);
      }

      setConversations((prev) =>
        prev
          .map((item) => {
            if (item.id !== payload.conversationId) return item;
            const nextUnread = payload.message.senderType === 'CUSTOMER' ? item.unreadCount + 1 : item.unreadCount;
            return {
              ...item,
              lastMessagePreview: payload.message.content,
              unreadCount: nextUnread,
              updatedAt: payload.message.createdAt,
            };
          })
          .sort((a, b) => Number(new Date(b.updatedAt)) - Number(new Date(a.updatedAt)))
      );
    });

    setSocket(socketClient);

    return () => {
      socketClient.disconnect();
      setSocket(null);
    };
  }, [session?.pageId, activeConversationId]);

  useEffect(() => {
    const loadConversations = async () => {
      if (!session?.pageId) return;
      setLoadingConversations(true);
      try {
        const query = statusFilter === 'all' ? '' : `?status=${statusFilter}`;
        const res = await fetch(`/api/conversations${query}`);
        const data = await res.json();
        setConversations(data.data ?? []);

        setActiveConversationId((prev) => prev ?? data.data?.[0]?.id ?? null);
      } finally {
        setLoadingConversations(false);
      }
    };

    loadConversations();
  }, [session?.pageId, statusFilter]);

  useEffect(() => {
    if (!activeConversationId) return;

    const loadMessages = async () => {
      setLoadingMessages(true);
      try {
        const res = await fetch(`/api/conversations/${activeConversationId}/messages`);
        const data = await res.json();
        setMessages(data.data ?? []);

        socket?.emit('join:conversation', { conversationId: activeConversationId });
      } finally {
        setLoadingMessages(false);
      }
    };

    loadMessages();
  }, [activeConversationId, socket]);

  const filteredConversations = useMemo(() => {
    return conversations;
  }, [conversations]);

  const activeConversation = filteredConversations.find((c) => c.id === activeConversationId) ?? null;

  const sendMessage = async () => {
    if (!activeConversationId || !messageText.trim() || submittingMessage) return;

    setSubmittingMessage(true);
    try {
      const content = messageText.trim();
      const res = await fetch(`/api/conversations/${activeConversationId}/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content }),
      });
      const data = await res.json();
      if (res.ok) {
        setMessages((prev) => [...prev, data.data]);
        setMessageText('');
      }
    } finally {
      setSubmittingMessage(false);
    }
  };

  const updateStatus = async (status: ConversationStatus) => {
    if (!activeConversationId) return;

    const res = await fetch(`/api/conversations/${activeConversationId}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });

    const data = await res.json();
    if (!res.ok) return;

    setConversations((prev) => prev.map((c) => (c.id === data.data.id ? data.data : c)));
  };

  const createMockData = async () => {
    await fetch('/api/conversations/seed', { method: 'POST' });
    const res = await fetch('/api/conversations');
    const data = await res.json();
    setConversations(data.data ?? []);
    if (data.data?.[0]) setActiveConversationId(data.data[0].id);
  };

  if (loadingSession) {
    return (
      <div className="min-h-screen grid place-items-center">
        <p>Đang kiểm tra phiên đăng nhập...</p>
      </div>
    );
  }

  if (!session?.authenticated) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="pt-28 max-w-3xl mx-auto px-4 text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Bạn chưa kết nối Facebook Page</h1>
          <p className="text-gray-600 mb-6">Hãy đăng nhập Facebook và chọn Page trước khi vào màn hội thoại.</p>
          <Link href="/login" className="inline-flex px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700">
            Đi đến đăng nhập
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-[#f6f8fb] overflow-hidden">
      <Navbar />

      <div className="pt-16 h-full grid grid-cols-12">
        <aside className="col-span-3 border-r border-gray-200 bg-white flex flex-col">
          <div className="p-3 border-b border-gray-100">
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-semibold text-gray-900">Hội thoại</h2>
              <button onClick={createMockData} className="text-xs px-2 py-1 rounded bg-gray-100 hover:bg-gray-200 text-gray-700">
                Tạo dữ liệu mẫu
              </button>
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as 'all' | ConversationStatus)}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm"
            >
              <option value="all">Tất cả</option>
              <option value="new">Mới</option>
              <option value="in_progress">Đang xử lý</option>
              <option value="done">Hoàn tất</option>
            </select>
          </div>

          <div className="flex-1 overflow-y-auto">
            {loadingConversations ? (
              <p className="text-sm text-gray-500 p-4">Đang tải hội thoại...</p>
            ) : filteredConversations.length === 0 ? (
              <p className="text-sm text-gray-500 p-4">Chưa có hội thoại nào.</p>
            ) : (
              filteredConversations.map((c) => (
                <button
                  key={c.id}
                  onClick={() => setActiveConversationId(c.id)}
                  className={`w-full text-left px-4 py-3 border-b border-gray-100 hover:bg-blue-50 ${
                    c.id === activeConversationId ? 'bg-blue-50' : ''
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden shrink-0">
                      {c.customerAvatarUrl ? (
                        <Image src={c.customerAvatarUrl} alt={c.customerName} width={40} height={40} className="w-full h-full object-cover" />
                      ) : null}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <p className="font-medium text-sm text-gray-900 truncate">{c.customerName}</p>
                        {c.unreadCount > 0 ? (
                          <span className="text-xs px-2 py-0.5 rounded-full bg-red-100 text-red-600">{c.unreadCount}</span>
                        ) : null}
                      </div>
                      <p className="text-xs text-gray-600 truncate">{c.lastMessagePreview ?? 'Không có nội dung'}</p>
                      <div className="mt-1 flex items-center gap-1 flex-wrap">
                        {c.tags.map((tag) => (
                          <span
                            key={tag.id}
                            className="text-[10px] px-2 py-0.5 rounded-full text-white"
                            style={{ backgroundColor: tag.color || '#64748b' }}
                          >
                            {tag.label}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </button>
              ))
            )}
          </div>
        </aside>

        <section className="col-span-6 bg-[#f7f7f7] flex flex-col">
          <div className="h-14 border-b border-gray-200 bg-white px-4 flex items-center justify-between">
            <div>
              <p className="font-semibold text-gray-900">{activeConversation?.customerName ?? 'Chọn hội thoại'}</p>
              <p className="text-xs text-gray-500">Facebook Messenger</p>
            </div>
            {activeConversation ? (
              <select
                value={activeConversation.status}
                onChange={(e) => updateStatus(e.target.value as ConversationStatus)}
                className="border border-gray-200 rounded-lg px-3 py-1.5 text-sm bg-white"
              >
                <option value="new">Mới</option>
                <option value="in_progress">Đang xử lý</option>
                <option value="done">Hoàn tất</option>
              </select>
            ) : null}
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {!activeConversationId ? (
              <p className="text-sm text-gray-500">Hãy chọn một hội thoại ở bên trái.</p>
            ) : loadingMessages ? (
              <p className="text-sm text-gray-500">Đang tải tin nhắn...</p>
            ) : messages.length === 0 ? (
              <p className="text-sm text-gray-500">Chưa có tin nhắn.</p>
            ) : (
              messages.map((m) => {
                const isAgent = m.senderType === 'AGENT';
                return (
                  <div key={m.id} className={`flex ${isAgent ? 'justify-end' : 'justify-start'}`}>
                    <div
                      className={`max-w-[80%] rounded-2xl px-3 py-2 text-sm ${
                        isAgent ? 'bg-[#d8f8c9] text-gray-900' : 'bg-white text-gray-800 border border-gray-100'
                      }`}
                    >
                      <p>{m.content}</p>
                      <p className="text-[10px] text-gray-500 mt-1">{new Date(m.createdAt).toLocaleString('vi-VN')}</p>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          <div className="p-3 border-t border-gray-200 bg-white">
            <div className="flex items-end gap-2">
              <textarea
                value={messageText}
                onChange={(e) => setMessageText(e.target.value)}
                placeholder="Nhập phản hồi cho khách..."
                className="flex-1 min-h-[42px] max-h-32 border border-gray-200 rounded-xl px-3 py-2 text-sm resize-y"
              />
              <button
                onClick={sendMessage}
                disabled={submittingMessage || !activeConversationId}
                className="px-4 py-2 rounded-xl bg-blue-600 text-white text-sm hover:bg-blue-700 disabled:opacity-50"
              >
                Gửi
              </button>
            </div>
          </div>
        </section>

        <aside className="col-span-3 border-l border-gray-200 bg-white p-4">
          <h3 className="font-semibold text-gray-900 mb-3">Thông tin</h3>
          {activeConversation ? (
            <div className="space-y-3 text-sm">
              <div>
                <p className="text-gray-500">Khách hàng</p>
                <p className="font-medium text-gray-900">{activeConversation.customerName}</p>
              </div>
              <div>
                <p className="text-gray-500">Trạng thái</p>
                <p className="font-medium text-gray-900">{activeConversation.status}</p>
              </div>
              <div>
                <p className="text-gray-500">Cập nhật lần cuối</p>
                <p className="font-medium text-gray-900">{new Date(activeConversation.updatedAt).toLocaleString('vi-VN')}</p>
              </div>
              <div>
                <p className="text-gray-500 mb-2">Tag</p>
                <div className="flex flex-wrap gap-2">
                  {activeConversation.tags.map((tag) => (
                    <span key={tag.id} className="text-xs px-2 py-1 rounded-full text-white" style={{ backgroundColor: tag.color }}>
                      {tag.label}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <p className="text-sm text-gray-500">Chưa chọn hội thoại.</p>
          )}
        </aside>
      </div>
    </div>
  );
}
