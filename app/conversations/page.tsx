'use client';

import { useEffect, useMemo, useState } from 'react';
import { io, type Socket } from 'socket.io-client';
import Link from 'next/link';
import { AppNavbar } from '@/components/chat/AppNavbar';
import { IconSidebar } from '@/components/chat/IconSidebar';
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
  const [searchQuery, setSearchQuery] = useState('');

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

  const activeConversation = conversations.find((c) => c.id === activeConversationId) ?? null;

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
      <div className="h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <div className="w-10 h-10 border-3 border-blue-200 border-t-blue-500 rounded-full animate-spin mx-auto mb-3"></div>
          <p className="text-[13px] text-gray-500">Đang kiểm tra phiên đăng nhập...</p>
        </div>
      </div>
    );
  }

  if (!session?.authenticated) {
    return (
      <div className="h-screen flex flex-col bg-white">
        <AppNavbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            <h1 className="text-lg font-semibold text-gray-900 mb-2">Bạn chưa kết nối Facebook Page</h1>
            <p className="text-[13px] text-gray-500 mb-5">Hãy đăng nhập Facebook và chọn Page trước khi vào màn hội thoại.</p>
            <Link href="/login" className="inline-flex px-5 py-2 bg-[#4267B2] text-white text-[13px] font-medium rounded-md hover:bg-[#365899]">
              Đi đến đăng nhập
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col overflow-hidden bg-white">
      {/* Top navigation bar - Pancake style */}
      <AppNavbar activeTab="conversations" />

      {/* Main content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left icon sidebar */}
        <IconSidebar activeTab="conversations" />

        {/* Conversation list */}
        <div className="w-[320px] border-r border-gray-200 flex flex-col shrink-0">
          {conversationsError && (
            <div className="px-3 py-2 bg-red-50 border-b border-red-100">
              <p className="text-[11px] text-red-600">{conversationsError}</p>
            </div>
          )}
          {loadingConversations ? (
            <div className="flex-1 flex items-center justify-center">
              <div className="w-8 h-8 border-3 border-blue-200 border-t-blue-500 rounded-full animate-spin"></div>
            </div>
          ) : (
            <ConversationList
              conversations={conversations.map(c => ({
                id: c.id,
                name: c.customerName,
                avatarUrl: c.customerAvatarUrl || undefined,
                lastMessage: c.lastMessagePreview || '',
                lastMessageTime: new Date(c.updatedAt).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' }),
                unreadCount: c.unreadCount,
                status: c.status === 'new' ? 'open' : c.status === 'in_progress' ? 'waiting' : 'closed',
                hasReply: true,
                tags: c.tags?.map(t => ({ label: t.label, color: t.color })),
              }))}
              selectedId={activeConversationId || undefined}
              onSelect={setActiveConversationId}
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
            />
          )}
        </div>

        {/* Chat area */}
        <div className="flex-1 flex flex-col bg-[#e4dfda]">
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

              <div className="flex-1 overflow-y-auto px-4 py-3">
                {loadingMessages ? (
                  <div className="flex items-center justify-center py-20">
                    <div className="w-8 h-8 border-3 border-white/40 border-t-white rounded-full animate-spin"></div>
                  </div>
                ) : messagesError ? (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-lg mx-auto max-w-md mt-8">
                    <p className="text-[12px] text-red-700">{messagesError}</p>
                  </div>
                ) : messages.length === 0 ? (
                  <div className="flex items-center justify-center py-20 text-gray-500">
                    <p className="text-[13px]">Chưa có tin nhắn</p>
                  </div>
                ) : (
                  messages.map((m) => (
                    <ChatMessage
                      key={m.id}
                      id={m.id}
                      content={m.content}
                      sender={m.senderType === 'AGENT' ? 'agent' : 'user'}
                      timestamp={new Date(m.createdAt).toLocaleString('vi-VN', {
                        hour: '2-digit',
                        minute: '2-digit',
                        second: '2-digit',
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric'
                      })}
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
            <div className="flex flex-col items-center justify-center h-full">
              <svg className="w-14 h-14 text-gray-400 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              <p className="text-[14px] text-gray-500">Xin chọn 1 hội thoại từ danh sách bên trái</p>
            </div>
          )}
        </div>

        {/* Right sidebar - customer info */}
        <div className="w-[320px] border-l border-[#d9dce3] shrink-0">
          <ChatSidebar
            customerInfo={activeConversation ? {
              id: activeConversation.id,
              name: activeConversation.customerName,
              avatarUrl: activeConversation.customerAvatarUrl || undefined,
              firstContactDate: new Date(activeConversation.updatedAt).toLocaleDateString('vi-VN'),
              lastContactDate: new Date().toLocaleDateString('vi-VN')
            } : undefined}
          />
        </div>
      </div>
    </div>
  );
}
