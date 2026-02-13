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
  const statusColors = {
    open: 'bg-green-100 text-green-700',
    closed: 'bg-gray-100 text-gray-700',
    waiting: 'bg-yellow-100 text-yellow-700'
  };

  const statusLabels = {
    open: 'Đang xử lý',
    closed: 'Đã đóng',
    waiting: 'Chờ xử lý'
  };

  return (
    <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 bg-white">
      {/* Customer Info */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden shrink-0">
          {customerAvatarUrl ? (
            <img src={customerAvatarUrl} alt={customerName} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-500 text-sm font-medium">
              {customerName.charAt(0).toUpperCase()}
            </div>
          )}
        </div>
        <div>
          <h3 className="font-semibold text-sm text-gray-900">{customerName}</h3>
          {conversationId && (
            <p className="text-xs text-gray-500">ID: {conversationId}</p>
          )}
        </div>
      </div>

      {/* Status */}
      <div className="flex items-center gap-2">
        {onStatusChange ? (
          <select
            value={status}
            onChange={(e) => onStatusChange(e.target.value as any)}
            className="text-xs px-3 py-1.5 rounded-lg border border-gray-200 outline-none focus:border-blue-500 cursor-pointer"
          >
            <option value="open">Đang xử lý</option>
            <option value="waiting">Chờ xử lý</option>
            <option value="closed">Đã đóng</option>
          </select>
        ) : (
          <span className={`text-xs px-3 py-1.5 rounded-lg ${statusColors[status]}`}>
            {statusLabels[status]}
          </span>
        )}
      </div>
    </div>
  );
}