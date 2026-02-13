export default function Footer() {
  const footerLinks = {
    products: [
      { name: 'Pancake', href: '#' },
      { name: 'POS', href: '#' },
      { name: 'Botcake', href: '#' },
      { name: 'Webcake', href: '#' },
      { name: 'Pancake Work', href: '#' },
      { name: 'CRM', href: '#' },
    ],
    platforms: [
      { name: 'WhatsApp', href: '#' },
    ],
    documentation: [
      { name: 'Hướng dẫn sử dụng', href: '#' },
      { name: 'Tài liệu kỹ thuật', href: '#' },
    ],
    support: [
      { name: 'Liên hệ', href: '#' },
      { name: 'Cộng đồng', href: '#' },
    ],
    company: [
      { name: 'Điều khoản sử dụng', href: '#' },
      { name: 'Chính sách bảo mật', href: '/privacy-policy' },
    ],
  };

  const partners = [
    { name: 'Meta', icon: '📘' },
    { name: 'TikTok', icon: '🎵' },
    { name: 'Google', icon: '🔍' },
  ];

  const offices = [
    {
      city: 'VP Hà Nội',
      address: 'Tầng 3, F-zone (Parking Zone 4), Vinhomes Smart City, Tây Mỗ, Hà Nội',
    },
    {
      city: 'VP Hồ Chí Minh',
      address: 'The Oxygen, 628C Võ Nguyên Giáp, P. An Phú, Q. 2, TP. Hồ Chí Minh',
    },
  ];

  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-12">
          {/* Logo & Description */}
          <div className="lg:col-span-2">
            <div className="flex items-center space-x-2 mb-6">
              <span className="text-3xl">🍰</span>
              <span className="text-2xl font-bold">Pancake</span>
            </div>
            <p className="text-gray-400 mb-6 max-w-sm">
              Giải pháp quản lý hội thoại đa kênh toàn diện giúp doanh nghiệp tối ưu vận hành và tăng trưởng bền vững
            </p>
            <button className="px-6 py-3 bg-blue-600 text-white rounded-full hover:bg-blue-700 font-semibold transition-colors">
              Đặt lịch demo
            </button>
          </div>

          {/* Products */}
          <div>
            <h3 className="text-lg font-semibold mb-4">SẢN PHẨM</h3>
            <ul className="space-y-3">
              {footerLinks.products.map((link) => (
                <li key={link.name}>
                  <a href={link.href} className="text-gray-400 hover:text-white transition-colors">
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Platforms */}
          <div>
            <h3 className="text-lg font-semibold mb-4">NỀN TẢNG</h3>
            <ul className="space-y-3">
              {footerLinks.platforms.map((link) => (
                <li key={link.name}>
                  <a href={link.href} className="text-gray-400 hover:text-white transition-colors">
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Documentation */}
          <div>
            <h3 className="text-lg font-semibold mb-4">TÀI LIỆU</h3>
            <ul className="space-y-3">
              {footerLinks.documentation.map((link) => (
                <li key={link.name}>
                  <a href={link.href} className="text-gray-400 hover:text-white transition-colors">
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Support & Company */}
          <div>
            <h3 className="text-lg font-semibold mb-4">HỖ TRỢ</h3>
            <ul className="space-y-3 mb-6">
              {footerLinks.support.map((link) => (
                <li key={link.name}>
                  <a href={link.href} className="text-gray-400 hover:text-white transition-colors">
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
            <h3 className="text-lg font-semibold mb-4">CÔNG TY</h3>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.name}>
                  <a href={link.href} className="text-gray-400 hover:text-white transition-colors">
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-800 my-12"></div>

        {/* Partners & Offices */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Partners */}
          <div>
            <h3 className="text-lg font-semibold mb-4">ĐỐI TÁC CỦA CHÚNG TÔI</h3>
            <div className="flex space-x-8">
              {partners.map((partner) => (
                <div key={partner.name} className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors cursor-pointer">
                  <span className="text-2xl">{partner.icon}</span>
                  <span className="font-medium">{partner.name}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Offices */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {offices.map((office) => (
              <div key={office.city}>
                <div className="flex items-start space-x-3">
                  <span className="text-2xl">📍</span>
                  <div>
                    <h4 className="font-semibold mb-1">{office.city}</h4>
                    <p className="text-gray-400 text-sm">{office.address}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-800 my-12"></div>

        {/* Bottom */}
        <div className="flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm">
            © {new Date().getFullYear()} Pancake. All rights reserved.
          </p>
          <div className="flex items-center space-x-3 mt-4 md:mt-0">
            <span className="text-gray-400">Hotline:</span>
            <span className="font-semibold text-white">(+84) 1900-888-619</span>
          </div>
        </div>
      </div>
    </footer>
  );
}