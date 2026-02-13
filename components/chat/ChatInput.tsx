interface ChatInputProps {
  value: string;
  onChange: (value: string) => void;
  onSend: () => void;
  disabled?: boolean;
  placeholder?: string;
}

export function ChatInput({
  value,
  onChange,
  onSend,
  disabled = false,
  placeholder = 'Nhập phản hồi cho khách...'
}: ChatInputProps) {
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      onSend();
    }
  };

  return (
    <div className="p-3 border-t border-gray-200 bg-white">
      <div className="flex items-end gap-2">
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          disabled={disabled}
          className="flex-1 min-h-[42px] max-h-32 border border-gray-200 rounded-xl px-3 py-2 text-sm resize-y outline-none placeholder:text-gray-400 focus:border-blue-500 disabled:bg-gray-50 disabled:text-gray-400"
          rows={1}
        />
        <button
          onClick={onSend}
          disabled={disabled || !value.trim()}
          className="px-4 py-2 rounded-xl bg-blue-600 text-white text-sm hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
        >
          Gửi
        </button>
      </div>
    </div>
  );
}