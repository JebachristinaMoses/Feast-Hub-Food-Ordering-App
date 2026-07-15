# Feast Hub - Next-Generation Food Ordering Platform

## Overview
Feast Hub is a revolutionary food ordering web application with unique features that set it apart from traditional food delivery apps. Built with React, TypeScript, and Tailwind CSS.

## Key Features

### 🔐 Authentication System
- **Separate Login/Registration** for Admins and Customers
- **Mock Authentication** using localStorage (simulating database)
- **Default Admin Credentials**: admin@feasthub.com / admin123

### 🏠 Home Page
- Beautiful hero section with gradient backgrounds
- Feature showcase (AR Preview, Live Kitchen View, AI Meal Planner, Gamified Rewards)
- "Why Choose Us" section with compelling benefits
- Responsive design with smooth animations
- Direct links to login/register pages

### 👨‍💼 Admin Dashboard
Features:
- **Income Analytics**: Real-time tracking of daily, monthly, and yearly revenue
- **Order Management**: View all orders, customer details, and order items
- **Status Updates**: Update order status (pending → preparing → ready → delivering → completed)
- **Menu Management**: Add new dishes with images, prices, categories
- **Dish Removal**: Delete dishes from the menu
- **Search & Filter**: Find orders by customer name or order ID
- **Visual Stats Cards**: Color-coded revenue displays

### 👤 Customer Dashboard
Features:
- **Browse Menu**: Beautiful grid layout with dish cards
- **Search**: Find dishes by name or description
- **Category Filter**: Filter by Italian, Japanese, American, Mexican, Seafood, Healthy, Dessert
- **Dish Preview**: Detailed modal with AR preview concept
- **Shopping Cart**: Add/remove items, adjust quantities
- **Checkout**: Enter delivery address and place orders
- **Order History**: View all past and current orders
- **Live Order Tracking**: 5-stage visual progress tracker:
  1. Order Placed
  2. Preparing (Kitchen)
  3. Ready
  4. Out for Delivery
  5. Delivered
- **Real-time Status Updates**: Color-coded badges for order status

### 🎨 Unique Features (Innovation)
1. **AR Food Preview** - Button to view dishes in 3D (visual concept)
2. **Live Kitchen View** - Watch your food being prepared (conceptual feature)
3. **Gamified Rewards** - Earn points and badges with every order
4. **AI Meal Planner** - Personalized recommendations
5. **5-Stage Order Tracking** - More detailed than traditional 3-stage tracking
6. **Modern UI/UX** - Gradient backgrounds, smooth animations, hover effects
7. **Category-based Navigation** - Quick access to different cuisines

## Tech Stack
- **Frontend**: React 18.3.1, TypeScript
- **Routing**: React Router 7.13.0
- **Styling**: Tailwind CSS 4.1.12
- **Animations**: Motion (Framer Motion) 12.23.24
- **UI Components**: Radix UI primitives
- **Icons**: Lucide React
- **State Management**: React Context API
- **Data Persistence**: localStorage (mock database)

## Application Structure

```
/src/app/
├── App.tsx                      # Main app with RouterProvider
├── routes.tsx                   # Route configuration
├── context/
│   └── AppContext.tsx          # Global state (users, dishes, orders)
├── pages/
│   ├── HomePage.tsx            # Landing page
│   ├── AdminLoginPage.tsx      # Admin authentication
│   ├── AdminRegisterPage.tsx   # Admin registration
│   ├── AdminDashboard.tsx      # Admin interface
│   ├── CustomerLoginPage.tsx   # Customer authentication
│   ├── CustomerRegisterPage.tsx # Customer registration
│   ├── CustomerDashboard.tsx   # Customer interface
│   └── NotFoundPage.tsx        # 404 page
└── components/
    └── ui/                     # Reusable UI components
```

## Data Models

### User
- id, email, name, role (admin/customer)

### Dish
- id, name, description, price, category, image, available, rating, prepTime

### Order
- id, customerId, customerName, items[], total, status, timestamp, deliveryAddress, trackingStage

## Navigation Flow

**Home** → Choose role → **Login/Register** → **Dashboard**

### Admin Flow:
1. Login at `/admin/login`
2. Access dashboard at `/admin/dashboard`
3. View orders, manage menu, track income

### Customer Flow:
1. Register/Login at `/customer/register` or `/customer/login`
2. Browse menu at `/customer/dashboard`
3. Add items to cart, checkout
4. Track orders in real-time

## Sample Menu Items
- Truffle Risotto (Italian) - $24.99
- Margherita Pizza (Italian) - $16.99
- Gourmet Burger (American) - $18.99
- Sushi Platter (Japanese) - $32.99
- Street Tacos (Mexican) - $11.99
- Tonkotsu Ramen (Japanese) - $15.99
- Lobster Thermidor (Seafood) - $42.99
- Buddha Bowl (Healthy) - $13.99
- Chocolate Lava Cake (Dessert) - $9.99
- Penne Arrabiata (Italian) - $14.99

## Getting Started

1. Open the application
2. **Quick Test**: Use admin credentials (admin@feasthub.com / admin123) to access admin dashboard
3. **Register** as a customer to test the full ordering experience
4. **Browse** the menu, add items to cart
5. **Track** your order through all 5 stages (admin can update status)

## Unique Selling Points

✅ **Visual Order Tracking** - 5 stages with icons and progress indicators
✅ **Separate Dashboards** - Optimized UX for admins vs customers  
✅ **Real-time Income Analytics** - Daily, monthly, yearly breakdowns
✅ **Modern Design** - Gradient backgrounds, animations, and micro-interactions
✅ **AR Preview Concept** - Next-gen food visualization
✅ **Gamification** - Rewards and points system
✅ **Live Kitchen View** - Transparency in food preparation
✅ **Category Filtering** - Easy cuisine-based navigation
✅ **Comprehensive Admin Tools** - Full control over menu and orders

---

**Note**: This is a frontend demonstration using localStorage for data persistence. For production use, integrate with a real backend database (e.g., PostgreSQL, MongoDB) and authentication service.
