#  Chatty

**Chatty** is a minimalistic real-time chat application that allows users to send messages, share media, receive notifications, and see online status.  
Built with **Next.js + NestJS**, using **WebSocket**, **Redis**, and **PostgreSQL** for scalability and real-time performance. Also using Cloudinary for saving media.

---

## 🚀 Features

- 💬 Send, edit, and delete messages  
- 🖼️ Share images and videos in chats  
- 👤 Edit your profile information  
- 🟢 See online/offline status of users  
- 🔔 Real-time notifications for new messages  
- 🔒 Authentication with **Access** + **Refresh** tokens  
- ⚡ Real-time updates using **WebSocket**  
- 🐳 Full Dockerized setup  
- 🧱 HTTPS, compressing, caching and reverse proxy via **Nginx**

---

## 🧩 Technology Stack

### Frontend
- [Next.js](https://nextjs.org/) 
- [React Hook Form](https://react-hook-form.com/)  
- [TanStack React Query](https://tanstack.com/query/latest)  
- [Zustand](https://zustand-demo.pmnd.rs/)  
- [Tailwind CSS](https://tailwindcss.com/)  
- [Axios](https://axios-http.com/)

### Backend
- [NestJS](https://nestjs.com/)  
- [PostgreSQL](https://www.postgresql.org/) + [Prisma ORM](https://www.prisma.io/)  
- [Redis](https://redis.io/)  
- [Socket.IO](https://socket.io/)  
- JWT Authentication (Access + Refresh tokens)  
- [Nginx](https://nginx.org/)  
- Docker & Docker Compose

---

###  Before using it, you need to create `.env` files with these field

**Backend** (`.env`)
DATABASE_URL=postgresql://postgres:password@db:5432/db
JWT_SECRET=your_jwt_secret
FRONTEND_URL=URL
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
REDIS_URL=redis-URL


**Frontend** (`.env.local`)
NEXT_PUBLIC_API_URL=BACK_END_URL

