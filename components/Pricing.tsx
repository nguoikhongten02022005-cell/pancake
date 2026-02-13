export default function Pricing() {
  const plans = [
    {
      name: 'Pancake',
      description: 'Bảng giá gói cước Pancake',
      price: '3000đ',
      period: '/ngày',
      features: [
        '14 ngày dùng thử',
        'Quản lý hội thoại đa kênh',
        'Tích hợp với mọi nền tảng',
        'Báo cáo và phân tích',
        'Hỗ trợ 24/7',
      ],
      color: 'from-blue-500 to-blue-600',
      isPopular: true,
    },
    {
      name: 'WhatsApp',
      description: 'Bảng giá tin nhắn WhatsApp',
      price: '65đ',
      period: '/tin nhắn',
      features: [
        'Phí gửi tin từ Meta',
        'Phí duy trì hệ thống Pancake',
        'Tích hợp WhatsApp Business',
        'Quản lý khách hàng',
        'Tự động hóa tin nhắn',
      ],
      color: 'from-green-500 to-green-600',
      isPopular: false,
    },
  ];

  const additionalFeatures = [
    { icon: '🚀', title: 'Tăng hiệu suất', description: 'Tối ưu quy trình làm việc và tăng năng suất đội ngũ' },
    { icon: '⏱️', title: 'Giảm thời gian vận hành', description: 'Tự động hóa các tác vụ lặp lại' },
    { icon: '🔒', title: 'Bảo mật dữ liệu', description: 'Đảm bảo an toàn thông tin khách hàng' },
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-2 bg-orange-100 text-orange-600 rounded-full text-sm font-semibold mb-4">
            BẢNG GIÁ
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            Tìm hiểu bảng giá của chúng tôi
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Từ doanh nghiệp vừa và nhỏ cho đến tập đoàn lớn, chúng tôi luôn có giải pháp phù hợp với mọi loại hình doanh nghiệp
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto mb-16">
          {plans.map((plan, index) => (
            <div
              key={index}
              className={`relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border-2 ${
                plan.isPopular ? 'border-blue-500' : 'border-gray-100'
              }`}
            >
              {/* Popular Badge */}
              {plan.isPopular && (
                <div className="absolute top-0 right-0 bg-blue-600 text-white px-4 py-1 text-sm font-semibold rounded-bl-xl">
                  Phổ biến nhất
                </div>
              )}

              {/* Gradient Header */}
              <div className={`p-8 bg-gradient-to-r ${plan.color}`}>
                <h3 className="text-2xl font-bold text-white mb-2">{plan.name}</h3>
                <p className="text-white/90">{plan.description}</p>
              </div>

              {/* Price */}
              <div className="p-8">
                <div className="flex items-baseline mb-6">
                  <span className="text-5xl font-bold text-gray-900">{plan.price}</span>
                  <span className="text-gray-600 ml-2">{plan.period}</span>
                </div>

                {/* Features */}
                <ul className="space-y-4 mb-8">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start">
                      <svg className="w-6 h-6 text-green-500 mr-3 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>

                {/* CTA Button */}
                <button
                  className={`w-full py-4 rounded-xl font-semibold transition-all transform hover:scale-105 ${
                    plan.isPopular
                      ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-500/30'
                      : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                  }`}
                >
                  {plan.isPopular ? 'Bắt đầu dùng thử' : 'Tìm hiểu thêm'}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Additional Features */}
        <div className="max-w-4xl mx-auto">
          <h3 className="text-2xl font-bold text-gray-900 text-center mb-12">
            Pancake có thể giúp gì cho doanh nghiệp của bạn 💫
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {additionalFeatures.map((feature, index) => (
              <div key={index} className="text-center">
                <div className="w-20 h-20 bg-white rounded-2xl shadow-lg flex items-center justify-center mx-auto mb-4 hover:scale-110 transition-transform">
                  <span className="text-4xl">{feature.icon}</span>
                </div>
                <h4 className="text-lg font-bold text-gray-900 mb-2">{feature.title}</h4>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}