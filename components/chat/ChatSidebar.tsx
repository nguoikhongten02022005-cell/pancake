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

export function ChatSidebar({ customerInfo }: ChatSidebarProps) {
  if (!customerInfo) {
    return (
      <div className="w-full h-full flex items-center justify-center text-gray-400 bg-white">
        <p className="text-[13px]">Chưa có thông tin khách hàng</p>
      </div>
    );
  }

  return (
    <div className="w-full h-full flex flex-col bg-white overflow-y-auto">
      {/* Customer Profile */}
      <div className="p-5 border-b border-gray-100">
        <div className="flex flex-col items-center text-center">
          <div className="w-[72px] h-[72px] rounded-full bg-gray-200 overflow-hidden mb-3">
            {customerInfo.avatarUrl ? (
              <img src={customerInfo.avatarUrl} alt={customerInfo.name} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-500 text-2xl font-medium bg-gray-200">
                {customerInfo.name.charAt(0).toUpperCase()}
              </div>
            )}
          </div>
          <h3 className="font-semibold text-[15px] text-gray-900">{customerInfo.name}</h3>
          <p className="text-[11px] text-gray-400 mt-1">ID: {customerInfo.id.length > 24 ? customerInfo.id.substring(0, 24) + '...' : customerInfo.id}</p>
        </div>
      </div>

      {/* Thông tin liên hệ */}
      <div className="px-5 py-4 border-b border-gray-100">
        <h4 className="font-medium text-[13px] text-gray-900 mb-3">Thông tin liên hệ</h4>
        <div className="space-y-2">
          {customerInfo.email && (
            <div className="flex items-center gap-2 text-[12px] text-gray-500">
              <svg className="w-3.5 h-3.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <span>{customerInfo.email}</span>
            </div>
          )}
          {customerInfo.phone && (
            <div className="flex items-center gap-2 text-[12px] text-gray-500">
              <svg className="w-3.5 h-3.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              <span>{customerInfo.phone}</span>
            </div>
          )}
        </div>
      </div>

      {/* Thời gian */}
      <div className="px-5 py-4 border-b border-gray-100">
        <h4 className="font-medium text-[13px] text-gray-900 mb-3">Thời gian</h4>
        <div className="space-y-2 text-[12px]">
          {customerInfo.firstContactDate && (
            <div className="flex justify-between">
              <span className="text-gray-500">Liên hệ đầu:</span>
              <span className="text-gray-700">{customerInfo.firstContactDate}</span>
            </div>
          )}
          {customerInfo.lastContactDate && (
            <div className="flex justify-between">
              <span className="text-gray-500">Liên hệ cuối:</span>
              <span className="text-gray-700">{customerInfo.lastContactDate}</span>
            </div>
          )}
        </div>
      </div>

      {/* Tags */}
      <div className="px-5 py-4 border-b border-gray-100">
        <h4 className="font-medium text-[13px] text-gray-900 mb-2">Tags</h4>
        <div className="flex flex-wrap gap-1.5">
          {customerInfo.tags && customerInfo.tags.length > 0 ? (
            customerInfo.tags.map((tag) => (
              <span key={tag} className="text-[11px] px-2 py-0.5 rounded bg-blue-50 text-blue-600">
                {tag}
              </span>
            ))
          ) : (
            <p className="text-[12px] text-gray-400">Chưa có tag</p>
          )}
        </div>
      </div>

      {/* Ghi chú */}
      <div className="px-5 py-4 flex-1">
        <h4 className="font-medium text-[13px] text-gray-900 mb-2">Ghi chú</h4>
        {customerInfo.notes ? (
          <p className="text-[12px] text-gray-500 whitespace-pre-wrap">{customerInfo.notes}</p>
        ) : (
          <p className="text-[12px] text-gray-400">Chưa có ghi chú</p>
        )}
      </div>
    </div>
  );
}