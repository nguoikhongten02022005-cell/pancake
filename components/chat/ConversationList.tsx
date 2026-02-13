'use client';

interface ConversationTag {
  label: string;
  color: string;
}

interface Conversation {
  id: string;
  name: string;
  avatarUrl?: string;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
  status?: 'open' | 'closed' | 'waiting';
  tags?: ConversationTag[];
  hasReply?: boolean;
}

interface ConversationListProps {
  conversations: Conversation[];
  selectedId?: string;
  onSelect: (id: string) => void;
  searchQuery?: string;
  onSearchChange?: (query: string) => void;
}

export function ConversationList({
  conversations,
  selectedId,
  onSelect,
  searchQuery = '',
  onSearchChange
}: ConversationListProps) {
  const filteredConversations = conversations.filter(c =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.lastMessage.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Search bar */}
      <div className="px-3 pt-3 pb-2 flex items-center gap-2">
        {onSearchChange && (
          <div className="flex-1 relative">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Tìm kiếm"
              className="w-full border border-gray-300 rounded-md pl-9 pr-3 py-[6px] text-[13px] outline-none placeholder:text-gray-400 focus:border-blue-400 bg-white"
            />
          </div>
        )}
        {/* Filter dots like Pancake */}
        <div className="flex items-center gap-[3px] shrink-0">
          <span className="w-[14px] h-[14px] rounded-full bg-pink-400 cursor-pointer" title="Kiểm hàng"></span>
          <span className="w-[14px] h-[14px] rounded-full bg-blue-400 cursor-pointer" title="Mới"></span>
          <span className="w-[14px] h-[14px] rounded-full bg-green-400 cursor-pointer" title="Mua hàng"></span>
          <span className="w-[14px] h-[14px] rounded-full bg-yellow-400 cursor-pointer" title="Chờ"></span>
          <span className="w-[14px] h-[14px] rounded-full bg-gray-300 cursor-pointer" title="Tất cả"></span>
        </div>
      </div>

      {/* Conversation list */}
      <div className="flex-1 overflow-y-auto">
        {filteredConversations.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-gray-400">
            <svg className="w-10 h-10 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            <p className="text-sm">Không tìm thấy hội thoại</p>
          </div>
        ) : (
          filteredConversations.map((conversation) => (
            <button
              key={conversation.id}
              onClick={() => onSelect(conversation.id)}
              className={`w-full text-left px-3 py-[10px] border-b border-gray-100 hover:bg-gray-50 transition-colors flex items-center gap-3 ${
                selectedId === conversation.id ? 'bg-blue-50' : ''
              }`}
            >
              {/* Avatar */}
              <div className="w-[44px] h-[44px] rounded-full bg-gray-200 overflow-hidden shrink-0">
                {conversation.avatarUrl ? (
                  <img src={conversation.avatarUrl} alt={conversation.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-500 text-[15px] font-medium bg-gray-200">
                    {conversation.name.charAt(0).toUpperCase()}
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-1">
                  <p className="font-medium text-[13px] text-gray-900 truncate">{conversation.name}</p>
                  <span className="text-[11px] text-gray-400 shrink-0">{conversation.lastMessageTime}</span>
                </div>
                <div className="flex items-center gap-1 mt-[2px]">
                  {conversation.hasReply && (
                    <svg className="w-3 h-3 text-gray-400 shrink-0 rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
                    </svg>
                  )}
                  <p className="text-[12px] text-gray-500 truncate flex-1">{conversation.lastMessage}</p>
                </div>
                {/* Tags */}
                {conversation.tags && conversation.tags.length > 0 && (
                  <div className="flex items-center gap-1 mt-[3px]">
                    {conversation.tags.map((tag, i) => (
                      <span key={i} className={`text-[10px] px-[6px] py-[1px] rounded-sm text-white font-medium ${tag.color}`}>
                        {tag.label}
                      </span>
                    ))}
                  </div>
                )}
                {(!conversation.tags || conversation.tags.length === 0) && conversation.status && (
                  <div className="mt-[3px]">
                    <span className={`text-[10px] px-[6px] py-[1px] rounded-sm font-medium ${
                      conversation.status === 'open' ? 'bg-green-500 text-white' :
                      conversation.status === 'waiting' ? 'bg-yellow-500 text-white' :
                      'bg-gray-400 text-white'
                    }`}>
                      {conversation.status === 'open' ? 'open' : conversation.status === 'waiting' ? 'waiting' : 'closed'}
                    </span>
                  </div>
                )}
              </div>

              {/* Right side: unread count + mail icon */}
              <div className="flex flex-col items-center gap-1 shrink-0">
                {conversation.unreadCount > 0 && (
                  <span className="min-w-[20px] h-[20px] flex items-center justify-center text-[11px] rounded-full bg-red-500 text-white font-medium px-1">
                    {conversation.unreadCount}
                  </span>
                )}
                <svg className="w-4 h-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
            </button>
          ))
        )}
      </div>
    </div>
  );
}