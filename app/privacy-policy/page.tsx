import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-16">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
          Chính sách quyền riêng tư
        </h1>

        <p className="text-gray-600 mb-8">
          Cập nhật lần cuối: 13/02/2026
        </p>

        <div className="prose prose-gray max-w-none">
          <h2>1. Phạm vi áp dụng</h2>
          <p>
            Chính sách này mô tả cách ứng dụng Pancake thu thập, sử dụng, lưu trữ và bảo vệ thông tin
            khi bạn sử dụng nền tảng quản lý hội thoại và trang Facebook.
          </p>

          <h2>2. Dữ liệu chúng tôi thu thập</h2>
          <ul>
            <li>Thông tin tài khoản Facebook được cấp quyền truy cập qua Facebook Login for Business.</li>
            <li>Thông tin trang (Page) và hội thoại cần thiết để cung cấp tính năng quản lý.</li>
            <li>Dữ liệu kỹ thuật cơ bản như nhật ký truy cập để đảm bảo an toàn hệ thống.</li>
          </ul>

          <h2>3. Mục đích sử dụng dữ liệu</h2>
          <ul>
            <li>Xác thực đăng nhập và duy trì phiên làm việc của người dùng.</li>
            <li>Hiển thị, quản lý và phản hồi hội thoại trên các kênh đã được cấp quyền.</li>
            <li>Cải thiện chất lượng sản phẩm, hiệu năng và bảo mật dịch vụ.</li>
          </ul>

          <h2>4. Chia sẻ dữ liệu</h2>
          <p>
            Chúng tôi không bán dữ liệu cá nhân. Dữ liệu chỉ được chia sẻ với bên thứ ba khi cần thiết để
            vận hành dịch vụ, tuân thủ pháp luật hoặc theo yêu cầu hợp lệ từ cơ quan có thẩm quyền.
          </p>

          <h2>5. Lưu trữ và bảo mật</h2>
          <p>
            Chúng tôi áp dụng các biện pháp kỹ thuật và tổ chức phù hợp để bảo vệ dữ liệu khỏi truy cập
            trái phép, mất mát hoặc lạm dụng.
          </p>

          <h2>6. Quyền của người dùng</h2>
          <p>
            Bạn có quyền yêu cầu truy cập, chỉnh sửa hoặc xóa dữ liệu liên quan đến tài khoản của mình theo
            quy định pháp luật hiện hành.
          </p>

          <h2>7. Liên hệ</h2>
          <p>
            Nếu có câu hỏi về chính sách quyền riêng tư, vui lòng liên hệ:
            <br />
            Email: support@pancake.vn
            <br />
            Hotline: (+84) 1900-888-619
          </p>
        </div>
      </main>

      <Footer />
    </div>
  );
}
