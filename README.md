# Pancake Clone - Facebook Page Conversation Management (MVP)

Ứng dụng Next.js mô phỏng luồng quản lý hội thoại Page Facebook kiểu Pancake:
- Đăng nhập Facebook OAuth
- Chọn và kết nối Facebook Page
- Quản lý danh sách hội thoại/tin nhắn theo trạng thái
- Realtime cập nhật hội thoại bằng Socket.IO
- Lưu dữ liệu bằng PostgreSQL + Prisma

## Yêu cầu hệ thống

- Node.js 20+
- PostgreSQL đang chạy local hoặc remote
- Facebook App đã cấu hình OAuth (xem `FACEBOOK_SETUP.md`)

## 1) Cài dependencies

```bash
npm install
```

## 2) Cấu hình biến môi trường

Tạo file `.env.local` từ mẫu:

```bash
copy .env.local.example .env.local
```

Điền các giá trị bắt buộc trong `.env.local`:

```env
FACEBOOK_APP_ID=...
FACEBOOK_APP_SECRET=...
FACEBOOK_REDIRECT_URI=http://localhost:3000/api/auth/facebook/callback
FACEBOOK_API_VERSION=v22.0
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/pancake_clone?schema=public"
```

## 3) Đồng bộ Prisma schema vào database

```bash
npm run prisma:generate
npm run prisma:push
```

## 4) Chạy ứng dụng

```bash
npm run dev
```

Mở: [http://localhost:3000](http://localhost:3000)

## 5) Luồng test MVP

1. Vào `/login` và đăng nhập Facebook.
2. Chọn Page tại `/auth/facebook/pages`.
3. Vào `/conversations` để xem màn inbox.
4. Bấm **"Tạo dữ liệu mẫu"** nếu chưa có hội thoại.
5. Thử gửi tin nhắn và đổi trạng thái (`new`, `in_progress`, `done`).

## Scripts

- `npm run dev`: chạy custom server Next.js + Socket.IO (`server.mjs`)
- `npm run build`: build production
- `npm run start`: chạy production server
- `npm run lint`: kiểm tra ESLint
- `npm run prisma:generate`: generate Prisma Client
- `npm run prisma:push`: đồng bộ schema lên DB

## Cấu trúc tính năng chính

- `app/api/auth/facebook/*`: OAuth + lấy danh sách Page
- `app/api/conversations/*`: list/create message/update status/seed
- `app/api/realtime/session`: kiểm tra session realtime
- `app/conversations/page.tsx`: giao diện inbox 3 cột kiểu Pancake
- `prisma/schema.prisma`: schema User/Page/Conversation/Message/Tag
- `server.mjs`: Socket.IO self-hosted

## Lưu ý

- Muốn dùng production cần Facebook App Review cho một số quyền.
- Không commit file `.env.local`.
