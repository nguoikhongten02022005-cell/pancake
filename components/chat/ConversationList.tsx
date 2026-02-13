interface Conversation {
  id: string;
  name: string;
  avatarUrl?: string;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
  status?: 'open' | 'closed' | 'waiting';
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

  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'open': return 'bg-green-100 text-green-600';
      case 'closed': return 'bg-gray-100 text-gray-600';
      case 'waiting': return 'bg-yellow-100 text-yellow-600';
      default: return 'bg-blue-100 text-blue-600';
    }
  };

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Search */}
      {onSearchChange && (
        <div className="p-3 border-b border-gray-200">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Tìm cuộc trò chuyện..."
            className="w-full border border-gray-300 rounded-xl px-4 py-2 text-sm outline-none placeholder:text-gray-400 focus:border-blue-500"
          />
        </div>
      )}

      {/* List */}
      <div className="flex-1 overflow-y-auto">
        {filteredConversations.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-gray-500">
            <svg className="w-12 h-12 mb-3 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            <p className="text-sm">Không tìm thấy cuộc trò chuyện</p>
          </div>
        ) : (
          filteredConversations.map((conversation) => (
            <button
              key={conversation.id}
              onClick={() => onSelect(conversation.id)}
              className={`w-full text-left px-4 py-3 border-b border-gray-100 hover:bg-blue-50 transition-colors ${
                selectedId === conversation.id ? 'bg-blue-50 border-l-4 border-l-blue-600' : ''
              }`}
            >
              <div className="flex items-start gap-3">
                {/* Avatar */}
                <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden shrink-0">
                  {conversation.avatarUrl ? (
                    <img src={conversation.avatarUrl} alt={conversation.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-500 text-sm font-medium">
                      {conversation.name.charAt(0).toUpperCase()}
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <p className="font-medium text-sm text-gray-900 truncate">{conversation.name}</p>
                    <span className="text-xs text-gray-500 shrink-0">{conversation.lastMessageTime}</span>
                  </div>
                  <div className="flex items-center justify-between gap-2 mt-1">
                    <p className="text-xs text-gray-600 truncate flex-1">{conversation.lastMessage}</p>
                    {conversation.unreadCount > 0 && (
                      <span className="text-xs px-2 py-0.5 rounded-full bg-red-100 text-red-600 shrink-0">
                        {conversation.unreadCount}
                      </span>
                    )}
                  </div>
                  {conversation.status && (
                    <div className="mt-1">
                      <span className={`text-[10px] px-2 py-0.5 rounded-full ${getStatusColor(conversation.status)}`}>
                        {conversation.status}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </button>
          ))
        )}
      </div>
    </div>
  );
}