# Hướng dẫn cấu hình Facebook Login for Business

Tài liệu này áp dụng cho project `pancake` theo hướng **Facebook Login for Business** (khuyến nghị mới của Meta cho ứng dụng business).

## 1) Chuẩn bị app trong Meta for Developers

1. Truy cập [Meta for Developers](https://developers.facebook.com/apps/)
2. Tạo app mới với loại **Business**.
3. Trong app, thêm sản phẩm **Facebook Login for Business**.
4. Vào phần Login for Business và tạo **Login Configuration**.
5. Lưu các giá trị:
   - **App ID** → dùng cho `FACEBOOK_APP_ID`
   - **App Secret** → dùng cho `FACEBOOK_APP_SECRET`
   - **Configuration ID (config_id)** → dùng cho `FACEBOOK_LOGIN_CONFIG_ID`

## 2) Cấu hình Login Configuration

Trong màn hình cấu hình Login for Business:

1. Chọn token type theo nhu cầu:
   - **User Access Token**: phù hợp giai đoạn MVP, ít phức tạp.
   - **Business Integration System User Token**: phù hợp SaaS đa doanh nghiệp, production nâng cao.
2. Thêm redirect URI hợp lệ:
   - `http://localhost:3000/api/auth/facebook/callback`
3. Cấp các quyền cần dùng cho quản lý page/inbox (ví dụ):
   - `pages_show_list`
   - `pages_manage_posts`
   - `pages_read_engagement`
   - `pages_messaging`
   - `pages_manage_metadata`
   - `read_insights`

> Lưu ý: project hiện **bắt buộc** dùng `config_id` (Facebook Login for Business), không còn fallback scope cũ.

## 3) Cấu hình biến môi trường

Copy `.env.local.example` thành `.env.local`, sau đó điền:

```env
FACEBOOK_APP_ID=123456789012345
FACEBOOK_APP_SECRET=abcdef1234567890abcdef1234567890
FACEBOOK_REDIRECT_URI=http://localhost:3000/api/auth/facebook/callback
FACEBOOK_API_VERSION=v22.0
FACEBOOK_LOGIN_CONFIG_ID=your_login_configuration_id
```

## 4) Cách project hoạt động sau khi cập nhật

- Route `app/api/auth/facebook/authorize/route.ts` hiện **bắt buộc** `FACEBOOK_LOGIN_CONFIG_ID` hợp lệ để luôn dùng Facebook Login for Business (`config_id`).
- Callback tại `app/api/auth/facebook/callback/route.ts` vẫn exchange `code` lấy access token như hiện tại.

## 5) Development vs Production

### Development
- App ở Development Mode chỉ cho Developer/Tester dùng.
- Nên test với tài khoản có quyền admin/editor trên Facebook Page.

### Production
- Các quyền page/messaging thường cần **Advanced Access** + **App Review**.
- Chuẩn bị đầy đủ:
  - Privacy Policy URL
  - Terms of Service URL
  - Data Deletion Instructions URL
  - Video/screenshot mô tả luồng xin quyền đúng use case

## 6) Checklist migration nhanh cho project này

1. Tạo Login Configuration trong Meta dashboard.
2. Điền `FACEBOOK_LOGIN_CONFIG_ID` vào `.env.local`.
3. Restart app và test login tại `/login`.
4. Xác nhận callback nhận được `code` và tạo session thành công.
5. Vào `/auth/facebook/pages`, kiểm tra lấy được danh sách page.
6. Chạy lại các flow inbox/conversations để xác nhận token dùng ổn định.

## 7) Troubleshooting

### `missing_facebook_config`
- Thiếu `FACEBOOK_APP_ID` hoặc `FACEBOOK_APP_SECRET`.

### `missing_facebook_business_config`
- Thiếu hoặc dùng placeholder cho `FACEBOOK_LOGIN_CONFIG_ID`.

### `invalid_state`
- Cookie state hết hạn hoặc trình duyệt chặn cookie.

### Không vào được màn hình consent đúng cấu hình
- Kiểm tra `FACEBOOK_LOGIN_CONFIG_ID` có đúng app và đúng môi trường không.
- Kiểm tra redirect URI trong Login Configuration khớp tuyệt đối.

### Không thấy page sau khi login
- Tài khoản chưa có quyền quản lý page.
- Chưa cấp đủ quyền page trong Login Configuration/App Review.

## 8) Tài liệu tham khảo

- [Facebook Login for Business](https://developers.facebook.com/docs/facebook-login-for-business)
- [Facebook Login for Business - Use Cases](https://developers.facebook.com/docs/facebook-login-for-business/use-cases)
- [Graph API](https://developers.facebook.com/docs/graph-api)