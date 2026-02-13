import Navbar from './Navbar';

export default function Hero() {
  return (
    <section className="relative min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 overflow-hidden">
      <Navbar />

      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-pink-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-8">
            <div className="inline-flex items-center px-4 py-2 bg-blue-100 rounded-full">
              <span className="text-blue-600 font-semibold">🍰 Kinh doanh thảnh thơi</span>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
              Giải pháp quản lý
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                hội thoại đa kênh toàn diện
              </span>
            </h1>

            <p className="text-lg md:text-xl text-gray-600 leading-relaxed max-w-xl">
              Hợp nhất mọi cuộc hội thoại khách hàng từ các kênh khác nhau trên một nền tảng duy nhất.
              Nâng cao hiệu suất và thúc đẩy tăng trưởng nhờ quản lý hội thoại thông minh.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <button className="px-8 py-4 bg-blue-600 text-white rounded-full hover:bg-blue-700 font-semibold transition-all transform hover:scale-105 shadow-lg shadow-blue-500/30">
                Đặt lịch demo
              </button>
              <button className="px-8 py-4 bg-white text-blue-600 border-2 border-blue-600 rounded-full hover:bg-blue-50 font-semibold transition-all">
                Dùng thử ngay
              </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-6 pt-8 border-t border-gray-200">
              <div>
                <div className="text-3xl font-bold text-gray-900">260K+</div>
                <div className="text-sm text-gray-600">Doanh nghiệp tin dùng</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-gray-900">50%</div>
                <div className="text-sm text-gray-600">Tăng hiệu suất</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-gray-900">30%</div>
                <div className="text-sm text-gray-600">Giảm thời gian vận hành</div>
              </div>
            </div>
          </div>

          {/* Right Content - Platforms */}
          <div className="relative">
            <div className="relative bg-white rounded-3xl shadow-2xl p-8 transform hover:scale-105 transition-transform duration-300">
              <div className="text-center mb-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Kết nối tất cả các nền tảng</h3>
                <p className="text-gray-600">Quản lý mọi hội thoại trên một giao diện</p>
              </div>

              <div className="grid grid-cols-3 gap-4">
                {[
                  { name: 'Facebook', icon: '📘', color: 'bg-blue-100' },
                  { name: 'Instagram', icon: '📷', color: 'bg-pink-100' },
                  { name: 'Zalo', icon: '💬', color: 'bg-blue-50' },
                  { name: 'WhatsApp', icon: '📱', color: 'bg-green-100' },
                  { name: 'Website', icon: '🌐', color: 'bg-purple-100' },
                  { name: 'TikTok', icon: '🎵', color: 'bg-red-100' },
                ].map((platform) => (
                  <div
                    key={platform.name}
                    className="flex flex-col items-center p-4 rounded-xl hover:shadow-lg transition-shadow cursor-pointer"
                  >
                    <div className={`w-16 h-16 ${platform.color} rounded-full flex items-center justify-center mb-2`}>
                      <span className="text-2xl">{platform.icon}</span>
                    </div>
                    <span className="text-sm font-medium text-gray-700">{platform.name}</span>
                  </div>
                ))}
              </div>

              <div className="mt-6 text-center">
                <div className="inline-flex items-center text-sm text-gray-500 bg-gray-50 px-4 py-2 rounded-full">
                  <span className="mr-2">🔗</span>
                  <span>Hơn 10+ nền tảng được kết nối</span>
                </div>
              </div>
            </div>

            {/* Floating elements */}
            <div className="absolute -top-4 -right-4 bg-yellow-400 rounded-full px-4 py-2 shadow-lg animate-bounce">
              <span className="font-semibold text-white">✨ 14 ngày dùng thử miễn phí</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}