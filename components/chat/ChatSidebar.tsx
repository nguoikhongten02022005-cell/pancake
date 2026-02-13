interface CustomerInfo {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  avatarUrl?: string;
  firstContactDate?: string;
  lastContactDate?: string;
  tags?: string[];
  notes?: string;
}

interface ChatSidebarProps {
  customerInfo?: CustomerInfo;
  onAddNote?: (note: string) => void;
  onAddTag?: (tag: string) => void;
}

export function ChatSidebar({ customerInfo, onAddNote, onAddTag }: ChatSidebarProps) {
  if (!customerInfo) {
    return (
      <div className="w-full h-full flex items-center justify-center text-gray-500">
        <p className="text-sm">Chọn cuộc trò chuyện để xem thông tin</p>
      </div>
    );
  }

  return (
    <div className="w-full h-full flex flex-col bg-white">
      {/* Customer Profile */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex flex-col items-center text-center">
          <div className="w-20 h-20 rounded-full bg-gray-200 overflow-hidden mb-3">
            {customerInfo.avatarUrl ? (
              <img src={customerInfo.avatarUrl} alt={customerInfo.name} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-500 text-2xl font-medium">
                {customerInfo.name.charAt(0).toUpperCase()}
              </div>
            )}
          </div>
          <h3 className="font-semibold text-gray-900">{customerInfo.name}</h3>
          <p className="text-sm text-gray-500 mt-1">ID: {customerInfo.id}</p>
        </div>
      </div>

      {/* Contact Info */}
      <div className="p-4 border-b border-gray-200">
        <h4 className="font-medium text-sm text-gray-900 mb-3">Thông tin liên hệ</h4>
        <div className="space-y-2">
          {customerInfo.email && (
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <span>{customerInfo.email}</span>
            </div>
          )}
          {customerInfo.phone && (
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              <span>{customerInfo.phone}</span>
            </div>
          )}
        </div>
      </div>

      {/* Timeline */}
      <div className="p-4 border-b border-gray-200">
        <h4 className="font-medium text-sm text-gray-900 mb-3">Thời gian</h4>
        <div className="space-y-2 text-sm">
          {customerInfo.firstContactDate && (
            <div className="flex justify-between">
              <span className="text-gray-600">Liên hệ đầu:</span>
              <span className="text-gray-900">{customerInfo.firstContactDate}</span>
            </div>
          )}
          {customerInfo.lastContactDate && (
            <div className="flex justify-between">
              <span className="text-gray-600">Liên hệ cuối:</span>
              <span className="text-gray-900">{customerInfo.lastContactDate}</span>
            </div>
          )}
        </div>
      </div>

      {/* Tags */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between mb-3">
          <h4 className="font-medium text-sm text-gray-900">Tags</h4>
          {onAddTag && (
            <button
              onClick={() => {
                const tag = prompt('Nhập tên tag:');
                if (tag) onAddTag(tag);
              }}
              className="text-xs text-blue-600 hover:text-blue-700"
            >
              + Thêm
            </button>
          )}
        </div>
        <div className="flex flex-wrap gap-2">
          {customerInfo.tags && customerInfo.tags.length > 0 ? (
            customerInfo.tags.map((tag) => (
              <span key={tag} className="text-xs px-2 py-1 rounded-full bg-blue-100 text-blue-700">
                {tag}
              </span>
            ))
          ) : (
            <p className="text-xs text-gray-500">Chưa có tag</p>
          )}
        </div>
      </div>

      {/* Notes */}
      <div className="p-4 flex-1 overflow-y-auto">
        <div className="flex items-center justify-between mb-3">
          <h4 className="font-medium text-sm text-gray-900">Ghi chú</h4>
          {onAddNote && (
            <button
              onClick={() => {
                const note = prompt('Nhập ghi chú:');
                if (note) onAddNote(note);
              }}
              className="text-xs text-blue-600 hover:text-blue-700"
            >
              + Thêm
            </button>
          )}
        </div>
        {customerInfo.notes ? (
          <p className="text-sm text-gray-600 whitespace-pre-wrap">{customerInfo.notes}</p>
        ) : (
          <p className="text-sm text-gray-500">Chưa có ghi chú</p>
        )}
      </div>
    </div>
  );
}