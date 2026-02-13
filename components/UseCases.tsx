export default function UseCases() {
  const useCases = [
    {
      title: 'Thương mại điện tử',
      description: 'Giải pháp toàn diện giúp tự động hóa vận hành, đơn giản hóa quy trình xử lý đơn hàng và tăng trưởng doanh thu bền vững.',
      icon: '🛍️',
      color: 'bg-orange-50 border-orange-200',
      linkText: 'Xem案例 Modanisa',
    },
    {
      title: 'Ngành thời trang',
      description: 'Pancake hỗ trợ doanh nghiệp thời trang tự động hóa quy trình vận hành, từ thiết kế, sản xuất đến bán hàng.',
      icon: '👗',
      color: 'bg-pink-50 border-pink-200',
      linkText: 'Xem案例 Yody',
    },
    {
      title: 'Ngành công nghệ giáo dục',
      description: 'Giải pháp Pancake hỗ trợ doanh nghiệp giáo dục hợp nhất, tự động hoá quy trình quản lý đến tối ưu vận hành.',
      icon: '📚',
      color: 'bg-blue-50 border-blue-200',
      linkText: 'Xem案例 ILA',
    },
    {
      title: 'Ngành dịch vụ',
      description: 'Pancake có bộ giải pháp tối ưu hóa quy trình cho doanh nghiệp dịch vụ chuyên nghiệp, giúp tăng năng suất và hiệu quả vận hành.',
      icon: '💼',
      color: 'bg-purple-50 border-purple-200',
      linkText: 'Xem案例 Be',
    },
    {
      title: 'Ngành làm đẹp',
      description: 'Pancake cung cấp các giải pháp chuyên biệt cho ngành làm đẹp, giúp tối ưu hóa quy trình từ đặt lịch hẹn, chăm sóc đến quản lý khách hàng.',
      icon: '💄',
      color: 'bg-rose-50 border-rose-200',
      linkText: 'Xem案例 KangJin Beauty',
    },
    {
      title: 'Ngành bán lẻ',
      description: 'Với Pancake, doanh nghiệp dễ dàng quản lý quy trình chăm sóc khách hàng, tự động hóa phản hồi và duy trì mối quan hệ bền vững với khách hàng.',
      icon: '🏪',
      color: 'bg-green-50 border-green-200',
      linkText: 'Xem案例 FPT Shop',
    },
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-2 bg-purple-100 text-purple-600 rounded-full text-sm font-semibold mb-4">
            NỀN TẢNG QUẢN LÝ HỘI THOẠI ĐA KÊNH TOÀN DIỆN
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            Phát triển doanh nghiệp bền vững
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Kết nối, chăm sóc và quản lý khách hàng hiệu quả trên mọi nền tảng, tất cả trên một hệ thống quản lý hội thoại đa kênh hợp nhất
          </p>
        </div>

        {/* Use Cases Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {useCases.map((useCase, index) => (
            <div
              key={index}
              className={`group relative bg-white rounded-2xl p-8 border-2 ${useCase.color} hover:shadow-xl transition-all duration-300 cursor-pointer`}
            >
              {/* Icon */}
              <div className={`w-16 h-16 ${useCase.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                <span className="text-3xl">{useCase.icon}</span>
              </div>

              {/* Title */}
              <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors">
                {useCase.title}
              </h3>

              {/* Description */}
              <p className="text-gray-600 mb-6 leading-relaxed">
                {useCase.description}
              </p>

              {/* Link */}
              <button className="text-blue-600 font-semibold hover:text-blue-700 flex items-center group-hover:translate-x-2 transition-transform">
                {useCase.linkText}
                <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
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