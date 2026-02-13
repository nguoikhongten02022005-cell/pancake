export default function CTA() {
  return (
    <section className="py-20 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-white/10 rounded-full mix-blend-multiply filter blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-white/10 rounded-full mix-blend-multiply filter blur-3xl"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6">
            Cải thiện doanh nghiệp ngay hôm nay!
          </h2>
          <p className="text-xl text-white/90 mb-10 max-w-3xl mx-auto">
            Đặt lịch hẹn với chuyên gia Pancake để được tư vấn và thiết kế giải pháp phù hợp
          </p>

          <button className="px-10 py-5 bg-white text-blue-600 rounded-full hover:bg-gray-100 font-bold text-lg transition-all transform hover:scale-105 shadow-2xl">
            Đặt lịch demo
          </button>

          {/* Trust indicators */}
          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6">
              <div className="text-5xl font-bold text-white mb-2">50%</div>
              <div className="text-white/90">Hiệu suất</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6">
              <div className="text-5xl font-bold text-white mb-2">30%</div>
              <div className="text-white/90">Thời gian vận hành</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6">
              <div className="text-5xl font-bold text-white mb-2">100%</div>
              <div className="text-white/90">Bảo mật dữ liệu</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}