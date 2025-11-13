# API Fetching Architecture Documentation

## 📁 Struktur Folder

```
src/
├── lib/
│   ├── api/
│   │   ├── config.ts              # API configuration & endpoints
│   │   ├── client.ts              # Axios client with interceptors
│   │   ├── auth.service.ts        # Authentication services
│   │   ├── users.service.ts       # Users CRUD operations
│   │   ├── products.service.ts    # Products CRUD operations
│   │   ├── product-categories.service.ts
│   │   ├── transactions.service.ts
│   │   ├── articles.service.ts
│   │   ├── waste-locations.service.ts
│   │   ├── dashboard.service.ts   # Aggregated stats
│   │   └── index.ts               # Centralized exports
│   └── hooks/
│       └── useApi.ts              # Custom React hooks
├── types/
│   ├── auth.ts                    # Auth types
│   └── common.ts                  # All entity types
└── contexts/
    └── auth-context.tsx           # Auth context provider

```

## 🎯 Cara Penggunaan

### 1. **Menggunakan Services Langsung (Manual Fetch)**

```typescript
import { usersService, productsService, dashboardService } from '@/lib/api';

// Dalam component
const fetchData = async () => {
  try {
    // Get all users with pagination
    const users = await usersService.getAll({ page: 1, limit: 10 });
    
    // Get user by ID
    const user = await usersService.getById('user-id');
    
    // Get dashboard stats
    const stats = await dashboardService.getStats();
    
    console.log(users, user, stats);
  } catch (error) {
    console.error('Error:', error);
  }
};
```

### 2. **Menggunakan Custom Hooks (Recommended)**

Lebih mudah dan otomatis handle loading/error states:

```typescript
import { useUsers, useUser, useDashboardStats } from '@/lib/hooks/useApi';

function MyComponent() {
  // Fetch dengan automatic loading & error handling
  const { data: users, isLoading, error, refetch } = useUsers({ 
    page: 1, 
    limit: 10 
  });
  
  const { data: stats } = useDashboardStats();
  
  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  
  return (
    <div>
      <h1>Users: {users?.data.length}</h1>
      <button onClick={refetch}>Refresh</button>
    </div>
  );
}
```

## 📚 Available Services

### **Authentication**
```typescript
import { authService } from '@/lib/api';

// Login
await authService.login({ emailOrUsername: 'user@email.com', password: 'password' });

// Register
await authService.register({ ... });

// Get profile
await authService.getProfile();

// Logout
await authService.logout();
```

### **Users**
```typescript
import { usersService } from '@/lib/api';

// Get all users (with pagination)
await usersService.getAll({ page: 1, limit: 10, search: 'john' });

// Get user by ID
await usersService.getById('user-id');

// Create user
await usersService.create({ 
  nama_panggilan: 'John',
  username: 'john123',
  email: 'john@email.com',
  password: 'password',
  role: 'USER'
});

// Update user
await usersService.update('user-id', { nama_panggilan: 'John Doe' });

// Delete user
await usersService.delete('user-id');

// Get statistics
await usersService.getStats();
```

### **Products**
```typescript
import { productsService } from '@/lib/api';

// Get all products
await productsService.getAll({ page: 1, limit: 10 });

// Get product by ID
await productsService.getById('product-id');

// Create product
await productsService.create({
  name: 'Bamboo Toothbrush',
  description: 'Eco-friendly toothbrush',
  price: 25000,
  stock: 100,
  categoryId: 'category-id',
  image_url: 'https://...'
});

// Update product
await productsService.update('product-id', { stock: 150 });

// Delete product
await productsService.delete('product-id');

// Get statistics
await productsService.getStats();
```

### **Transactions**
```typescript
import { transactionsService } from '@/lib/api';

// Get all transactions
await transactionsService.getAll({ page: 1, limit: 10 });

// Get transaction by ID
await transactionsService.getById('transaction-id');

// Get user's transactions
await transactionsService.getByUserId('user-id');

// Create transaction
await transactionsService.create({
  items: [{ productId: 'product-id', quantity: 2 }],
  shippingDetail: { ... }
});

// Update transaction status
await transactionsService.updateStatus('transaction-id', 'PAID');

// Get statistics
await transactionsService.getStats();
```

### **Articles**
```typescript
import { articlesService } from '@/lib/api';

// Get all articles
await articlesService.getAll({ page: 1, limit: 10 });

// Get article by ID
await articlesService.getById('article-id');

// Get article by slug
await articlesService.getBySlug('article-slug');

// Create article
await articlesService.create({
  title: 'Green Living Tips',
  content: 'Lorem ipsum...',
  thumbnailUrl: 'https://...'
});

// Update article
await articlesService.update('article-id', { title: 'Updated Title' });

// Delete article
await articlesService.delete('article-id');
```

### **Waste Locations**
```typescript
import { wasteLocationsService } from '@/lib/api';

// Get all waste locations
await wasteLocationsService.getAll({ page: 1, limit: 10 });

// Get waste location by ID
await wasteLocationsService.getById('location-id');

// Create waste location
await wasteLocationsService.create({
  name: 'TPS Kampus',
  description: 'Main waste disposal',
  latitude: -7.4291,
  longitude: 109.2320,
  address: 'Campus 1',
  categories: ['ORGANIK', 'ANORGANIK']
});

// Update waste location
await wasteLocationsService.update('location-id', { name: 'Updated Name' });

// Delete waste location
await wasteLocationsService.delete('location-id');
```

### **Dashboard**
```typescript
import { dashboardService } from '@/lib/api';

// Get aggregated dashboard statistics
const stats = await dashboardService.getStats();

// Returns:
// {
//   totalUsers: number,
//   totalProducts: number,
//   totalTransactions: number,
//   totalRevenue: number,
//   totalArticles: number,
//   totalWasteLocations: number,
//   recentTransactions: Transaction[],
//   recentUsers: User[],
//   revenueGrowth?: number,
//   userGrowth?: number
// }
```

## 🎣 Available Custom Hooks

```typescript
// Dashboard
useDashboardStats()

// Users
useUsers(params?)
useUser(id)
useUsersStats()

// Products
useProducts(params?)
useProduct(id)
useProductsStats()

// Product Categories
useProductCategories(params?)
useProductCategory(id)

// Transactions
useTransactions(params?)
useTransaction(id)
useTransactionsByUser(userId)
useTransactionsStats()

// Articles
useArticles(params?)
useArticle(id)
useArticleBySlug(slug)
useArticlesStats()

// Waste Locations
useWasteLocations(params?)
useWasteLocation(id)
useWasteLocationsStats()
```

## 🔧 Configuration

### Environment Variables
```env
# .env.local
NEXT_PUBLIC_API_BASE_URL=https://api.mentorit.my.id
```

### API Endpoints
Semua endpoints tersimpan di `src/lib/api/config.ts`:

```typescript
import { API_ENDPOINTS } from '@/lib/api/config';

// Contoh penggunaan
const endpoint = API_ENDPOINTS.USERS.BASE; // '/users'
const userEndpoint = API_ENDPOINTS.USERS.BY_ID('123'); // '/users/123'
```

## 🛡️ Authentication

Auth token otomatis disimpan di localStorage dan ditambahkan ke setiap request:

```typescript
// Token automatically added to all requests
// Location: localStorage.getItem('access_token')
```

Jika token expired (401), user otomatis di-redirect ke `/login`.

## ✨ Best Practices

1. **Gunakan Custom Hooks** untuk data fetching:
   ```typescript
   const { data, isLoading, error, refetch } = useUsers();
   ```

2. **Gunakan Services** untuk mutations (create, update, delete):
   ```typescript
   const handleCreate = async () => {
     await usersService.create({ ... });
     refetch(); // Refresh data
   };
   ```

3. **Handle Error** dengan try-catch:
   ```typescript
   try {
     await usersService.create({ ... });
   } catch (error: any) {
     console.error(error.response?.data?.message);
   }
   ```

4. **Pagination** parameters:
   ```typescript
   useUsers({ 
     page: 1, 
     limit: 10, 
     search: 'query',
     sortBy: 'createdAt',
     sortOrder: 'desc'
   });
   ```

## 📊 Example: Complete Component

```typescript
"use client";

import { useState } from 'react';
import { useUsers } from '@/lib/hooks/useApi';
import { usersService } from '@/lib/api';

export default function UsersPage() {
  const [page, setPage] = useState(1);
  const { data, isLoading, error, refetch } = useUsers({ 
    page, 
    limit: 10 
  });

  const handleDelete = async (id: string) => {
    try {
      await usersService.delete(id);
      refetch(); // Refresh list
    } catch (error) {
      console.error('Delete failed:', error);
    }
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h1>Users ({data?.meta.total})</h1>
      {data?.data.map(user => (
        <div key={user.id}>
          <p>{user.nama_panggilan} - {user.email}</p>
          <button onClick={() => handleDelete(user.id)}>
            Delete
          </button>
        </div>
      ))}
      
      <button onClick={() => setPage(p => p - 1)} disabled={page === 1}>
        Previous
      </button>
      <button onClick={() => setPage(p => p + 1)}>
        Next
      </button>
    </div>
  );
}
```

## 🚀 Fitur

- ✅ **Modular & Scalable** - Setiap module terpisah
- ✅ **Type-Safe** - Full TypeScript support
- ✅ **Auto Token Management** - Token otomatis ditambahkan
- ✅ **Error Handling** - Global error interceptor
- ✅ **Custom Hooks** - Easy data fetching dengan loading states
- ✅ **Centralized Config** - Semua endpoints di satu tempat
- ✅ **Pagination Support** - Built-in pagination
- ✅ **Real-time Dashboard** - Live data dari backend

## 📝 Notes

- Backend tidak diubah sama sekali
- Semua data fetching real-time dari backend
- Token disimpan di localStorage
- Auto redirect ke login jika unauthorized
- Semua services fully typed dengan TypeScript
