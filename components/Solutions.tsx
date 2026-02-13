export default function Solutions() {
  const solutions = [
    {
      icon: '💬',
      title: 'Hợp nhất mọi thao tác quản lý hội thoại',
      description: 'Hội thoại đa nền tảng được quản lý trên một giao diện duy nhất. Đảm bảo hiệu quả và trải nghiệm khách hàng.',
      features: ['Kết nối đa nền tảng mượt mà', 'Hiệu suất cao đa nền tảng'],
      color: 'from-blue-500 to-blue-600',
    },
    {
      icon: '🛒',
      title: 'Quản lý đơn hàng & khách hàng hiệu quả',
      description: 'Tự động hóa quy trình bán hàng. Ghi nhận đơn hàng trực tiếp từ hội thoại và livestream.',
      features: ['Tự động hóa quy trình bán hàng', 'Tối ưu hiệu suất quảng cáo với CAPI'],
      color: 'from-green-500 to-green-600',
    },
    {
      icon: '👥',
      title: 'Quản lý khách hàng toàn diện',
      description: 'Tất cả dữ liệu khách hàng được tập trung trong một giao diện linh hoạt, giúp đội ngũ nâng cao hiệu suất.',
      features: ['Dữ liệu khách hàng tập trung', 'Tăng tỷ lệ chuyển đổi'],
      color: 'from-purple-500 to-purple-600',
    },
    {
      icon: '🤖',
      title: 'Tự động hoá với chatbot tích hợp AI',
      description: 'Trả lời tin nhắn, tư vấn sản phẩm và chốt đơn tự động với hệ thống quản lý hội thoại thông minh.',
      features: ['Phản hồi 24/7', 'Trợ lý AI hỗ trợ chuyển đổi'],
      color: 'from-pink-500 to-pink-600',
    },
    {
      icon: '🎨',
      title: 'Thiết kế website dễ dàng',
      description: 'Tạo storefront chuyên nghiệp mà không cần viết code. Tương tác ngay với khách truy cập.',
      features: ['Tạo storefront chuyên nghiệp', 'Tạo landing page chỉ trong 5 phút'],
      color: 'from-orange-500 to-orange-600',
    },
  ];

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-2 bg-blue-100 text-blue-600 rounded-full text-sm font-semibold mb-4">
            GIẢI PHÁP CỦA CHÚNG TÔI
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            Giải pháp kinh doanh hội thoại toàn diện
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Thúc đẩy tăng trưởng doanh nghiệp nhờ quản lý hội thoại hợp nhất và tối ưu hóa mọi quy trình
          </p>
        </div>

        {/* Solutions Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {solutions.map((solution, index) => (
            <div
              key={index}
              className="group relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100"
            >
              {/* Gradient top border */}
              <div className={`h-2 bg-gradient-to-r ${solution.color}`}></div>

              <div className="p-8">
                {/* Icon */}
                <div className={`w-16 h-16 bg-gradient-to-br ${solution.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  <span className="text-3xl">{solution.icon}</span>
                </div>

                {/* Title */}
                <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors">
                  {solution.title}
                </h3>

                {/* Description */}
                <p className="text-gray-600 mb-6 leading-relaxed">
                  {solution.description}
                </p>

                {/* Features */}
                <ul className="space-y-2">
                  {solution.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center text-sm text-gray-700">
                      <svg className="w-5 h-5 text-green-500 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      {feature}
                    </li>
                  ))}
                </ul>

                {/* Learn more link */}
                <button className="mt-6 text-blue-600 font-semibold hover:text-blue-700 flex items-center group-hover:translate-x-2 transition-transform">
                  Tìm hiểu thêm
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
          <button className="px-8 py-4 bg-blue-600 text-white rounded-full hover:bg-blue-700 font-semibold transition-all transform hover:scale-105 shadow-lg shadow-blue-500/30">
            Khám phá tất cả tính năng
          </button>
        </div>
      </div>
    </section>
  );
}