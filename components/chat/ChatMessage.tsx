interface ChatMessageProps {
  id: string;
  content: string;
  sender: 'agent' | 'user';
  timestamp: string;
  avatarUrl?: string;
}

export function ChatMessage({ content, sender, timestamp, avatarUrl }: ChatMessageProps) {
  const isAgent = sender === 'agent';

  return (
    <div className={`flex ${isAgent ? 'justify-end' : 'justify-start'} mb-4`}>
      {!isAgent && avatarUrl && (
        <div className="w-8 h-8 rounded-full bg-gray-200 overflow-hidden shrink-0 mr-2 self-end">
          <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
        </div>
      )}
      <div className={`max-w-[80%] rounded-2xl px-4 py-2 ${
        isAgent
          ? 'bg-[#d8f8c9] text-gray-900'
          : 'bg-white text-gray-800 border border-gray-100'
      }`}>
        <p className="text-sm">{content}</p>
        <p className="text-[10px] text-gray-500 mt-1">{timestamp}</p>
      </div>
    </div>
  );
}