'use client';

import { useEffect, useMemo, useState } from 'react';
import { io, type Socket } from 'socket.io-client';
import Navbar from '@/components/Navbar';
import Link from 'next/link';
import Image from 'next/image';
import { ConversationList } from '@/components/chat/ConversationList';
import { ChatHeader } from '@/components/chat/ChatHeader';
import { ChatMessage } from '@/components/chat/ChatMessage';
import { ChatInput } from '@/components/chat/ChatInput';
import { ChatSidebar } from '@/components/chat/ChatSidebar';

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
  const [conversationsError, setConversationsError] = useState('');
  const [loadingConversations, setLoadingConversations] = useState(true);
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
  const [messages, setMessages] = useState<MessageItem[]>([]);
  const [messagesError, setMessagesError] = useState('');
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
      setConversationsError('');
      try {
        const query = statusFilter === 'all' ? '' : `?status=${statusFilter}`;
        const res = await fetch(`/api/conversations${query}`);
        const data = await res.json();

        if (!res.ok) {
          setConversations([]);
          setActiveConversationId(null);
          setConversationsError(data?.error || 'Không tải được hội thoại từ Facebook.');
          return;
        }

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
      setMessagesError('');
      try {
        const res = await fetch(`/api/conversations/${activeConversationId}/messages`);
        const data = await res.json();

        if (!res.ok) {
          setMessages([]);
          setMessagesError(data?.error || 'Không tải được tin nhắn.');
          return;
        }

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
              <span className="text-xs text-gray-500">Dữ liệu lấy từ Facebook Page đã kết nối</span>
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
            {conversationsError ? <p className="mt-2 text-xs text-red-600">{conversationsError}</p> : null}
          </div>

          {loadingConversations ? (
            <div className="flex-1 flex items-center justify-center">
              <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
            </div>
          ) : (
            <ConversationList
              conversations={conversations.map(c => ({
                id: c.id,
                name: c.customerName,
                avatarUrl: c.customerAvatarUrl || undefined,
                lastMessage: c.lastMessagePreview || 'Không có nội dung',
                lastMessageTime: new Date(c.updatedAt).toLocaleDateString('vi-VN'),
                unreadCount: c.unreadCount,
                status: c.status === 'new' ? 'open' : c.status === 'in_progress' ? 'waiting' : 'closed'
              }))}
              selectedId={activeConversationId || undefined}
              onSelect={setActiveConversationId}
            />
          )}
        </aside>

        <section className="col-span-6 bg-[#f7f7f7] flex flex-col">
          {activeConversationId ? (
            <>
              <ChatHeader
                customerName={activeConversation?.customerName || 'Khách hàng'}
                customerAvatarUrl={activeConversation?.customerAvatarUrl || undefined}
                conversationId={activeConversationId}
                status={activeConversation?.status === 'new' ? 'open' : activeConversation?.status === 'in_progress' ? 'waiting' : 'closed'}
                onStatusChange={(status) => {
                  const statusMap: Record<string, ConversationStatus> = {
                    'open': 'new',
                    'waiting': 'in_progress',
                    'closed': 'done'
                  };
                  updateStatus(statusMap[status]);
                }}
              />

              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {loadingMessages ? (
                  <div className="flex flex-col items-center justify-center py-20">
                    <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mb-4"></div>
                    <p className="text-gray-600">Đang tải tin nhắn...</p>
                  </div>
                ) : messagesError ? (
                  <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-sm text-red-800">{messagesError}</p>
                  </div>
                ) : messages.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-20 text-gray-500">
                    <svg className="w-12 h-12 mb-3 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                    <p className="text-sm">Chưa có tin nhắn</p>
                  </div>
                ) : (
                  messages.map((m) => (
                    <ChatMessage
                      key={m.id}
                      id={m.id}
                      content={m.content}
                      sender={m.senderType === 'AGENT' ? 'agent' : 'user'}
                      timestamp={new Date(m.createdAt).toLocaleString('vi-VN')}
                    />
                  ))
                )}
              </div>

              <ChatInput
                value={messageText}
                onChange={setMessageText}
                onSend={sendMessage}
                disabled={submittingMessage}
              />
            </>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-gray-500">
              <svg className="w-12 h-12 mb-3 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
              </svg>
              <p className="text-sm">Chọn một hội thoại để bắt đầu</p>
            </div>
          )}
        </section>

        <aside className="col-span-3 border-l border-gray-200 bg-white">
          <ChatSidebar
            customerInfo={activeConversation ? {
              id: activeConversation.id,
              name: activeConversation.customerName,
              avatarUrl: activeConversation.customerAvatarUrl || undefined,
              firstContactDate: new Date(activeConversation.updatedAt).toLocaleDateString('vi-VN'),
              lastContactDate: new Date().toLocaleDateString('vi-VN')
            } : undefined}
          />
        </aside>
      </div>
    </div>
  );
}
