export default function SuccessStories() {
  const stories = [
    {
      company: 'Be',
      title: 'Tự động hoá - Nâng cao hiệu quả vận hành',
      description: 'Đem lại hiệu quả toàn diện trong việc quản lý thời gian và chi phí vận hành',
      image: '🏢',
      stats: '50%',
      statLabel: 'Giảm chi phí vận hành',
      products: ['Pancake', 'Botcake'],
      color: 'from-blue-500 to-blue-600',
    },
    {
      company: 'Yody',
      title: 'Tăng cường tự động hoá và tối ưu đa kênh toàn diện',
      description: 'Tối ưu vận hành góp phần thúc đẩy tăng trưởng doanh thu và nâng cao trải nghiệm khách hàng vượt trội',
      image: '👕',
      stats: '-30%',
      statLabel: 'Giảm thời gian xử lý',
      products: ['Pancake', 'Botcake', 'POS'],
      color: 'from-purple-500 to-purple-600',
    },
    {
      company: 'KangJin Beauty',
      title: 'Tối ưu giải pháp chăm sóc khách hàng',
      description: 'Giúp quản lý hiệu quả các cuộc trò chuyện và mang đến những trải nghiệm tuyệt vời tới khách hàng',
      image: '💄',
      stats: '+66%',
      statLabel: 'Tăng tỷ lệ chuyển đổi',
      products: ['Pancake', 'Botcake', 'Webcake'],
      color: 'from-pink-500 to-pink-600',
    },
    {
      company: 'Modanisa',
      title: 'Cách Modanisa thành công với WhatsApp',
      description: 'Câu hỏi của khách hàng được giải quyết mà không cần phải đến bộ phận hỗ trợ trực tiếp',
      image: '🛒',
      stats: '70%',
      statLabel: 'Tự động xử lý tin nhắn',
      products: ['WhatsApp', 'Botcake'],
      color: 'from-green-500 to-green-600',
    },
    {
      company: 'FPT Shop',
      title: 'Quản lý toàn diện trên một nền tảng duy nhất',
      description: 'Dễ dàng quản lý các hội thoại và nâng cao hiệu suất nhân viên',
      image: '📱',
      stats: '90%',
      statLabel: 'Tăng hiệu suất nhân viên',
      products: ['Pancake'],
      color: 'from-red-500 to-red-600',
    },
    {
      company: 'ILA',
      title: 'Nâng tầm quản lý và Chăm sóc khách hàng',
      description: 'Đem đến sự hài lòng cho khách hàng, đồng thời gia tăng số lượng học viên vượt trội',
      image: '📚',
      stats: '95%',
      statLabel: 'Khách hàng hài lòng',
      products: ['Pancake'],
      color: 'from-yellow-500 to-yellow-600',
    },
  ];

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-2 bg-green-100 text-green-600 rounded-full text-sm font-semibold mb-4">
            CÂU CHUYỆN THÀNH CÔNG
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            Hành trình tăng trưởng từ kinh doanh hội thoại
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Từ bán lẻ đến dịch vụ, hàng nghìn doanh nghiệp đã nâng cao trải nghiệm khách hàng, tối ưu vận hành nhờ giải pháp quản lý hội thoại đa kênh từ Pancake
          </p>
        </div>

        {/* Stories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {stories.map((story, index) => (
            <div
              key={index}
              className="group relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100"
            >
              {/* Gradient top */}
              <div className={`h-2 bg-gradient-to-r ${story.color}`}></div>

              <div className="p-8">
                {/* Company Header */}
                <div className="flex items-start justify-between mb-6">
                  <div className={`w-16 h-16 bg-gradient-to-br ${story.color} rounded-2xl flex items-center justify-center`}>
                    <span className="text-3xl">{story.image}</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {story.products.map((product) => (
                      <span
                        key={product}
                        className="px-3 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded-full"
                      >
                        {product}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Company Name */}
                <h3 className="text-lg font-bold text-gray-900 mb-2">
                  {story.company}
                </h3>

                {/* Title */}
                <h4 className="text-xl font-semibold text-gray-800 mb-3 group-hover:text-blue-600 transition-colors">
                  {story.title}
                </h4>

                {/* Description */}
                <p className="text-gray-600 mb-6 leading-relaxed">
                  {story.description}
                </p>

                {/* Stats */}
                <div className={`p-4 bg-gradient-to-r ${story.color} rounded-xl mb-6`}>
                  <div className="flex items-baseline">
                    <span className="text-4xl font-bold text-white">{story.stats}</span>
                  </div>
                  <div className="text-white/90 text-sm mt-1">{story.statLabel}</div>
                </div>

                {/* Read more link */}
                <button className="text-blue-600 font-semibold hover:text-blue-700 flex items-center group-hover:translate-x-2 transition-transform">
                  Đọc thêm
                  <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="mt-16 text-center">
          <button className="px-8 py-4 bg-white text-blue-600 border-2 border-blue-600 rounded-full hover:bg-blue-50 font-semibold transition-all transform hover:scale-105">
            Xem thêm câu chuyện thành công
          </button>
        </div>
      </div>
    </section>
  );
}