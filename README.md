# 🌿 HijauIn Admin Dashboard - Frontend

<div align="center">

![HijauIn Logo](public/images/logo.svg)

**Admin Dashboard untuk Platform Manajemen Sampah Ramah Lingkungan**

[![Next.js](https://img.shields.io/badge/Next.js-15.5.6-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.x-38bdf8?style=flat-square&logo=tailwind-css)](https://tailwindcss.com/)

</div>

---

## 📋 Daftar Isi

- [Tentang Proyek](#-tentang-proyek)
- [Fitur Utama](#-fitur-utama)
- [Teknologi yang Digunakan](#-teknologi-yang-digunakan)
- [Prasyarat](#-prasyarat)
- [Instalasi](#-instalasi)
- [Konfigurasi](#-konfigurasi)
- [Menjalankan Aplikasi](#-menjalankan-aplikasi)
- [Build untuk Production](#-build-untuk-production)
- [Struktur Folder](#-struktur-folder)
- [Halaman dan Fitur](#-halaman-dan-fitur)
- [API Integration](#-api-integration)
- [Troubleshooting](#-troubleshooting)
- [Kontribusi](#-kontribusi)

---

## 🎯 Tentang Proyek

**HijauIn Admin Dashboard** adalah aplikasi frontend untuk mengelola platform eco-tech waste management. Dashboard ini dibangun dengan Next.js 15 dan TypeScript, menyediakan antarmuka modern untuk admin dalam mengelola:

- 👥 **User Management** - Kelola pengguna platform
- 💳 **Transactions** - Monitor transaksi marketplace
- 🛍️ **Products & Categories** - Kelola produk eco-friendly
- 📍 **Waste Locations** - Peta lokasi pembuangan sampah
- 📝 **Articles** - Konten edukasi lingkungan
- 📊 **Dashboard Analytics** - Statistik dan metrik real-time

---

## ✨ Fitur Utama

### 🎨 **Modern UI/UX**
- Dark theme dengan desain glassmorphism
- Responsive design (Mobile, Tablet, Desktop)
- Smooth animations dan transitions
- Loading states dan error handling

### 🔐 **Authentication & Authorization**
- Login dengan email/username dan password
- JWT-based authentication
- Role-based access control (ADMIN/USER)
- Protected routes
- Forgot password functionality

### 📊 **Dashboard Analytics**
- Total Revenue (IDR)
- Total Users, Transactions, Products
- Recent Transactions & Users
- Quick Stats Cards
- Real-time data refresh

### 💼 **Management Features**
- **Users**: Create, Read, Update, Delete (CRUD)
- **Transactions**: View, Update Status, Delete
- **Products**: CRUD dengan kategori dan image upload
- **Product Categories**: CRUD dengan image upload
- **Waste Locations**: CRUD dengan Google Maps integration
- **Articles**: CRUD dengan rich text editor

### 🗺️ **Google Maps Integration**
- Interactive map untuk waste locations
- Filter by category (ORGANIK, ANORGANIK, B3)
- Location markers dengan detail info
- Geolocation support

---

## 🛠️ Teknologi yang Digunakan

### **Core Framework**
- **Next.js 15.5.6** - React framework dengan App Router
- **TypeScript 5.x** - Type-safe JavaScript
- **React 19** - UI library

### **Styling & UI**
- **Tailwind CSS 3.x** - Utility-first CSS framework
- **Radix UI** - Headless UI components
- **Lucide React** - Icon library
- **Shadcn/ui** - Reusable component library

### **State Management & Data Fetching**
- **React Hooks** - useState, useEffect, useMemo
- **Custom Hooks** - useApi untuk data fetching
- **Axios** - HTTP client

### **Maps & Geolocation**
- **@vis.gl/react-google-maps** - Google Maps React components
- **Google Maps API** - Maps, Places, Geocoding

### **Build Tools**
- **Turbopack** - Next-gen bundler (faster than Webpack)
- **ESLint** - Code linting
- **PostCSS** - CSS processing

---

## 📦 Prasyarat

Pastikan Anda sudah menginstal:

- **Node.js** >= 18.x (Recommended: 20.x LTS)
- **npm** >= 9.x atau **yarn** >= 1.22.x
- **Git** untuk version control
- **Backend API** HijauIn harus running di `http://localhost:5000`

---

## 🚀 Instalasi

### **1. Clone Repository**

```bash
# Clone repository
git clone <repository-url>

# Masuk ke folder frontend
cd HijauIn/HijauIn-Fe-Website
```

### **2. Install Dependencies**

Menggunakan **npm**:
```bash
npm install
```

Atau menggunakan **yarn**:
```bash
yarn install
```

Atau menggunakan **pnpm**:
```bash
pnpm install
```

### **3. Tunggu Proses Instalasi**

Proses ini akan menginstall semua dependencies yang diperlukan:
- Next.js dan React
- Tailwind CSS
- Radix UI components
- Google Maps libraries
- Axios untuk HTTP requests
- Dan lainnya...

⏱️ **Estimasi waktu**: 2-5 menit (tergantung koneksi internet)

---

## ⚙️ Konfigurasi

### **1. Buat File Environment Variables**

Buat file `.env.local` di root folder:

```bash
# Di folder HijauIn-Fe-Website/
touch .env.local
```

### **2. Isi Environment Variables**

Buka file `.env.local` dan tambahkan:

```env
# API Backend URL
NEXT_PUBLIC_API_URL=http://localhost:5000

# Google Maps API Key (untuk fitur Waste Locations)
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_google_maps_api_key_here
```

### **3. Mendapatkan Google Maps API Key**

1. Buka [Google Cloud Console](https://console.cloud.google.com/)
2. Buat project baru atau pilih existing project
3. Enable **Maps JavaScript API**
4. Buat credentials (API Key)
5. Copy API key ke `.env.local`

**Note**: Untuk development, Anda bisa melewati Google Maps API key terlebih dahulu. Fitur maps akan error tapi aplikasi tetap berjalan.

---

## 🏃‍♂️ Menjalankan Aplikasi

### **Development Mode**

```bash
npm run dev
```

Aplikasi akan berjalan di: **http://localhost:3000**

**Fitur Development Mode:**
- ⚡ Hot Module Replacement (HMR)
- 🔄 Auto-reload on file changes
- 🐛 Detailed error messages
- 📊 React Developer Tools support

### **Production Preview (Local)**

```bash
# Build aplikasi
npm run build

# Jalankan production server
npm start
```

Aplikasi production akan berjalan di: **http://localhost:3000**

---

## 📦 Build untuk Production

### **1. Build Aplikasi**

```bash
npm run build
```

Proses build akan:
- ✅ Compile TypeScript
- ✅ Bundle assets dengan Turbopack
- ✅ Optimize images
- ✅ Generate static pages
- ✅ Skip ESLint (sudah dikonfigurasi)

Output build tersimpan di folder `.next/`

### **2. Test Production Build**

```bash
npm start
```

### **3. Deploy ke Hosting**

#### **Vercel (Recommended)**

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

#### **Manual Deploy**

Upload folder `.next/`, `public/`, `package.json`, dan `next.config.ts` ke server Anda.

---

## 📁 Struktur Folder

```
HijauIn-Fe-Website/
├── public/                      # Static assets
│   ├── images/                  # Images (logo, etc.)
│   └── ...
├── src/
│   ├── app/                     # Next.js App Router
│   │   ├── (auth)/              # Auth pages (login, forgot-password)
│   │   │   └── login/page.tsx
│   │   ├── (dashboard)/         # Dashboard pages
│   │   │   ├── page.tsx         # Dashboard utama
│   │   │   └── dashboard/       # Sub pages
│   │   │       ├── users/
│   │   │       ├── transactions/
│   │   │       ├── products/
│   │   │       ├── product-categories/
│   │   │       ├── waste-locations/
│   │   │       ├── articles/
│   │   │       └── settings/
│   │   ├── layout.tsx           # Root layout
│   │   └── globals.css          # Global styles
│   ├── components/              # Reusable components
│   │   ├── ui/                  # Shadcn/ui components
│   │   ├── dashboard-layout.tsx
│   │   └── sidebar.tsx
│   ├── contexts/                # React contexts
│   │   └── auth-context.tsx     # Authentication context
│   ├── lib/                     # Utilities & helpers
│   │   ├── api/                 # API services
│   │   │   ├── index.ts
│   │   │   ├── users.service.ts
│   │   │   ├── transactions.service.ts
│   │   │   └── ...
│   │   ├── hooks/               # Custom React hooks
│   │   │   └── useApi.ts
│   │   └── utils.ts
│   └── types/                   # TypeScript types
│       └── common.ts
├── .env.local                   # Environment variables (create this)
├── next.config.ts               # Next.js configuration
├── tailwind.config.ts           # Tailwind CSS configuration
├── tsconfig.json                # TypeScript configuration
└── package.json                 # Dependencies
```

---

## 📄 Halaman dan Fitur

### **🔐 Authentication**

#### **Login** - `/login`
- Login dengan email/username
- Password visibility toggle
- Remember me option
- Redirect ke dashboard setelah login
- Error handling untuk invalid credentials

#### **Forgot Password** - `/forgot-password`
- Reset password via email
- OTP verification
- Set new password

---

### **📊 Dashboard** - `/dashboard`

**Key Metrics:**
- 💰 Total Revenue (IDR) - dari transaksi PAID & DELIVERED
- 👥 Total Users - jumlah pengguna terdaftar
- 💳 Total Transactions - jumlah transaksi
- 📦 Products Listed - jumlah produk aktif

**Quick Stats:**
- 📍 Waste Locations
- 📝 Articles Published
- 👤 Active Users

**Recent Activity:**
- Recent Transactions (4 terakhir)
- Recent Users (4 terakhir)

---

### **👥 Users Management** - `/dashboard/users`

**Fitur:**
- ✅ Daftar semua users dengan pagination
- ✅ Search by name, email, username
- ✅ Filter by role (USER/ADMIN)
- ✅ View user detail
- ✅ Delete user (hanya PENDING/CANCELLED/FAILED)
- ✅ User statistics (Total Users, Admins, Regular Users)

**Kolom Tabel:**
- Avatar / Initial
- Name & Email
- Username
- Role (ADMIN/USER)
- Created Date
- Actions (Detail, Delete)

---

### **💳 Transactions Management** - `/dashboard/transactions`

**Fitur:**
- ✅ Daftar semua transaksi dengan pagination
- ✅ Search by order number, email
- ✅ Filter by status (ALL, PENDING, PAID, PROCESSING, SHIPPED, DELIVERED, CANCELLED, FAILED)
- ✅ View transaction detail dengan items & shipping info
- ✅ Update transaction status
- ✅ Delete transaction (hanya PENDING/FAILED/CANCELLED)
- ✅ Transaction statistics

**Transaction Stats:**
- Total Transactions
- Total Revenue (IDR) - hanya PAID & DELIVERED
- Pending Count
- Paid Count

**Transaction Status Flow:**
```
PENDING → PAID → PROCESSING → SHIPPED → DELIVERED
        ↓
    CANCELLED / FAILED
```

**Detail Modal:**
- Customer info
- Order items dengan harga
- Shipping detail (recipient, address, phone)
- Payment URL
- Update status dropdown

---

### **🛍️ Products Management** - `/dashboard/products`

**Fitur:**
- ✅ Daftar semua produk dengan pagination
- ✅ Search by product name
- ✅ Create new product dengan image upload
- ✅ Edit product
- ✅ Delete product
- ✅ Product statistics (Total Products, Total Stock Value)

**Product Form Fields:**
- Product Name
- Description
- Price (IDR)
- Stock
- Category (dropdown)
- Image Upload

---

### **🗂️ Product Categories** - `/dashboard/product-categories`

**Fitur:**
- ✅ Daftar kategori produk
- ✅ Create kategori baru dengan image
- ✅ Edit kategori
- ✅ Delete kategori
- ✅ View products in category

**Category Fields:**
- Category Name (unique)
- Description
- Image Upload

---

### **📍 Waste Locations** - `/dashboard/waste-locations`

**Fitur:**
- ✅ Google Maps integration
- ✅ Filter by category (ORGANIK, ANORGANIK, B3)
- ✅ View location markers on map
- ✅ Location info cards
- ✅ Create new waste location
- ✅ Edit location
- ✅ Delete location

**Location Form Fields:**
- Location Name
- Description
- Address
- Latitude & Longitude
- Categories (multiple select)
- Image Upload

**Map Features:**
- Interactive markers
- Info windows
- Filter by waste category
- Geolocation support

---

### **📝 Articles Management** - `/dashboard/articles`

**Fitur:**
- ✅ Daftar artikel dengan pagination
- ✅ Search by title
- ✅ Create new article
- ✅ Edit article
- ✅ Delete article
- ✅ View article detail

**Article Form Fields:**
- Title
- Slug (auto-generated)
- Thumbnail URL
- Content (rich text)
- Author (auto-set dari logged user)

---

### **⚙️ Settings** - `/dashboard/settings`

**Fitur:**
- ✅ Profile settings
- ✅ Change password
- ✅ Account preferences
- ✅ Logout

---

## 🔌 API Integration

### **Base Configuration**

File: `src/lib/api/index.ts`

```typescript
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});
```

### **Authentication**

Token JWT disimpan di `localStorage`:

```typescript
// Login
const { token } = await authService.login(credentials);
localStorage.setItem('token', token);

// Auto-attach token ke setiap request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
```

### **API Services**

Setiap modul memiliki service tersendiri:

- `users.service.ts` - User management
- `transactions.service.ts` - Transaction management
- `products.service.ts` - Product management
- `product-categories.service.ts` - Category management
- `waste-locations.service.ts` - Waste locations
- `articles.service.ts` - Articles
- `auth.service.ts` - Authentication

### **Custom Hooks**

File: `src/lib/hooks/useApi.ts`

```typescript
// Usage example
const { data, isLoading, error, refetch } = useUsers({
  page: 1,
  limit: 10,
  search: 'john'
});
```

**Available Hooks:**
- `useUsers()` - Fetch users
- `useTransactions()` - Fetch transactions
- `useProducts()` - Fetch products
- `useProductCategories()` - Fetch categories
- `useWasteLocations()` - Fetch waste locations
- `useArticles()` - Fetch articles

---

## 🐛 Troubleshooting

### **1. Build Error - ESLint**

**Error:**
```
useSearchParams() should be wrapped in a suspense boundary
```

**Solusi:**
Sudah fixed dengan konfigurasi:
```typescript
// next.config.ts
eslint: {
  ignoreDuringBuilds: true,
}
```

---

### **2. API Connection Error**

**Error:**
```
Failed to fetch users: Network Error
```

**Solusi:**
- ✅ Pastikan backend running di `http://localhost:5000`
- ✅ Check `.env.local` sudah benar
- ✅ CORS sudah enabled di backend

---

### **3. Google Maps Error**

**Error:**
```
Google Maps JavaScript API error: InvalidKeyMapError
```

**Solusi:**
- ✅ Pastikan `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` sudah diisi di `.env.local`
- ✅ Enable **Maps JavaScript API** di Google Cloud Console
- ✅ Restart development server setelah update `.env.local`

---

### **4. Token Expired**

**Error:**
```
401 Unauthorized
```

**Solusi:**
- ✅ Login ulang
- ✅ Token JWT expire setelah 24 jam (default)
- ✅ Clear localStorage: `localStorage.clear()`

---

### **5. Image Upload Failed**

**Error:**
```
Failed to upload image
```

**Solusi:**
- ✅ Pastikan backend Cloudinary sudah dikonfigurasi
- ✅ Check file size < 5MB
- ✅ Format: JPG, PNG, WEBP

---

## 👨‍💻 Kontribusi

Kami menerima kontribusi! Berikut cara berkontribusi:

1. **Fork** repository ini
2. Buat **branch** baru: `git checkout -b feature/amazing-feature`
3. **Commit** perubahan: `git commit -m 'Add amazing feature'`
4. **Push** ke branch: `git push origin feature/amazing-feature`
5. Buka **Pull Request**

---

## 📝 Changelog

### **Version 1.0.0** (Current)

**✨ Features:**
- Complete admin dashboard
- User management (CRUD)
- Transaction management dengan Midtrans
- Product & Category management
- Waste Locations dengan Google Maps
- Articles management
- Authentication & Authorization (JWT)
- Role-based access control (ADMIN/USER)

**🐛 Bug Fixes:**
- Fixed ESLint build error dengan Suspense boundary
- Fixed Total Revenue calculation (hanya PAID & DELIVERED)
- Fixed format mata uang ke Rupiah (IDR)

**🔧 Improvements:**
- Mobile-responsive design
- Loading states & error handling
- Real-time data refresh
- Optimized images dan assets

---

## 📞 Support

Jika Anda mengalami masalah atau memiliki pertanyaan:

- **Email**: support@hijauin.com
- **Issues**: Buka issue di GitHub repository
- **Documentation**: Baca dokumentasi lengkap di `/Documentation Fitur/`

---

## 📄 License

Copyright © 2025 HijauIn. All rights reserved.

---

<div align="center">

**Made with ❤️ by HijauIn Team**

🌿 Untuk Bumi yang Lebih Hijau 🌿

</div>
