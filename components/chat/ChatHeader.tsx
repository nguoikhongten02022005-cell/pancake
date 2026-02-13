interface ChatHeaderProps {
  customerName: string;
  customerAvatarUrl?: string;
  conversationId?: string;
  status?: 'open' | 'closed' | 'waiting';
  onStatusChange?: (status: 'open' | 'closed' | 'waiting') => void;
}

export function ChatHeader({
  customerName,
  customerAvatarUrl,
  conversationId,
  status = 'open',
  onStatusChange
}: ChatHeaderProps) {
  return (
    <div className="flex items-center justify-between px-4 py-2 border-b border-gray-200 bg-white">
      {/* Customer Info */}
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-full bg-gray-200 overflow-hidden shrink-0">
          {customerAvatarUrl ? (
            <img src={customerAvatarUrl} alt={customerName} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-500 text-sm font-medium">
              {customerName.charAt(0).toUpperCase()}
            </div>
          )}
        </div>
        <div>
          <h3 className="font-medium text-[14px] text-gray-900">{customerName}</h3>
          {conversationId && (
            <p className="text-[11px] text-gray-400">ID: {conversationId.length > 20 ? conversationId.substring(0, 20) + '...' : conversationId}</p>
          )}
        </div>
      </div>

      {/* Status dropdown */}
      <div className="flex items-center gap-2">
        {onStatusChange ? (
          <select
            value={status}
            onChange={(e) => onStatusChange(e.target.value as 'open' | 'closed' | 'waiting')}
            className="text-[12px] px-2 py-1 rounded border border-gray-200 outline-none focus:border-blue-400 cursor-pointer bg-white text-gray-600"
          >
            <option value="open">Đang xử lý</option>
            <option value="waiting">Chờ xử lý</option>
            <option value="closed">Đã đóng</option>
          </select>
        ) : (
          <span className={`text-[12px] px-2 py-1 rounded ${
            status === 'open' ? 'bg-green-50 text-green-600' :
            status === 'waiting' ? 'bg-yellow-50 text-yellow-600' :
            'bg-gray-50 text-gray-600'
          }`}>
            {status === 'open' ? 'Đang xử lý' : status === 'waiting' ? 'Chờ xử lý' : 'Đã đóng'}
          </span>
        )}
      </div>
    </div>
  );
}