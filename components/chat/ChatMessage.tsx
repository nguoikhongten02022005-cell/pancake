interface ChatMessageProps {
  id: string;
  content: string;
  sender: 'agent' | 'user';
  timestamp: string;
  avatarUrl?: string;
}

export function ChatMessage({ content, sender, timestamp }: ChatMessageProps) {
  const isAgent = sender === 'agent';

  return (
    <div className={`flex ${isAgent ? 'justify-end' : 'justify-start'} mb-1`}>
      <div className="max-w-[65%]">
        <div className={`rounded-lg px-3 py-[6px] ${
          isAgent
            ? 'bg-[#d9fdd3] text-gray-900'
            : 'bg-white text-gray-900 shadow-sm'
        }`}>
          <p className="text-[13px] leading-[1.4] whitespace-pre-wrap">{content}</p>
        </div>
        <p className={`text-[10px] text-gray-400 mt-[2px] ${isAgent ? 'text-right' : 'text-left'}`}>
          {timestamp}
        </p>
      </div>
    </div>
  );
}