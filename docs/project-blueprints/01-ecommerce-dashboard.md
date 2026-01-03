# E-Commerce Dashboard Blueprint

## Overview
A comprehensive admin dashboard for e-commerce platforms with real-time analytics, inventory management, and order tracking.

## Tech Stack
- **Frontend**: React, TypeScript, TailwindCSS, shadcn/ui
- **Charts**: Recharts (already in Lovable)
- **Backend**: Lovable Cloud (Supabase)
- **Auth**: Supabase Auth with email/password

---

## Features

### 1. Authentication
- Email/password login and signup
- Protected routes (dashboard only accessible when logged in)
- Session persistence

### 2. Dashboard Overview (Home)
- **Revenue Cards**: Total revenue, orders, customers, avg order value
- **Revenue Chart**: Line/area chart showing revenue over time (7 days, 30 days, 12 months)
- **Recent Orders**: Table showing latest 5-10 orders
- **Top Products**: Bar chart of best-selling products
- **Real-time Updates**: Live order notifications

### 3. Orders Management
- **Orders Table**: Sortable, filterable, paginated
  - Columns: Order ID, Customer, Date, Status, Total, Actions
- **Order Status**: Pending, Processing, Shipped, Delivered, Cancelled
- **Order Details Modal**: Full order info, items, customer details
- **Actions**: Update status, view details, cancel order

### 4. Products/Inventory
- **Products Grid/Table**: View toggle
- **Product Card**: Image, name, price, stock, category
- **CRUD Operations**: Add, edit, delete products
- **Stock Alerts**: Low stock warnings
- **Categories**: Filter by category

### 5. Customers
- **Customers Table**: Name, email, total orders, total spent
- **Customer Details**: Order history, contact info
- **Search**: Find customers by name/email

### 6. Analytics
- **Sales Analytics**: Revenue trends, growth rates
- **Product Performance**: Best/worst sellers
- **Customer Analytics**: New vs returning, acquisition
- **Date Range Picker**: Custom date ranges

---

## Database Schema

```sql
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Products table
CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  cost DECIMAL(10,2),
  sku TEXT UNIQUE,
  stock INTEGER NOT NULL DEFAULT 0,
  category TEXT,
  image_url TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Customers table
CREATE TABLE customers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  first_name TEXT,
  last_name TEXT,
  phone TEXT,
  address JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Orders table
CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_number TEXT UNIQUE NOT NULL,
  customer_id UUID REFERENCES customers(id),
  status TEXT NOT NULL DEFAULT 'pending',
  subtotal DECIMAL(10,2) NOT NULL,
  tax DECIMAL(10,2) DEFAULT 0,
  shipping DECIMAL(10,2) DEFAULT 0,
  total DECIMAL(10,2) NOT NULL,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Order items table
CREATE TABLE order_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id),
  quantity INTEGER NOT NULL,
  unit_price DECIMAL(10,2) NOT NULL,
  total DECIMAL(10,2) NOT NULL
);

-- Create indexes for performance
CREATE INDEX idx_orders_customer ON orders(customer_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_created ON orders(created_at);
CREATE INDEX idx_order_items_order ON order_items(order_id);
CREATE INDEX idx_products_category ON products(category);
```

### RLS Policies
```sql
-- Enable RLS
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

-- Authenticated users can read all data
CREATE POLICY "Authenticated users can read products" ON products
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Authenticated users can manage products" ON products
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Similar policies for other tables...
```

---

## Pages & Routes

```
/auth              - Login/Signup page
/                  - Dashboard overview
/orders            - Orders management
/orders/:id        - Order details
/products          - Product inventory
/products/new      - Add product
/products/:id/edit - Edit product
/customers         - Customer list
/customers/:id     - Customer details
/analytics         - Analytics dashboard
/settings          - Account settings
```

---

## UI Components to Build

1. **StatCard** - Displays metric with icon, value, change percentage
2. **RevenueChart** - Area/line chart for revenue over time
3. **OrdersTable** - Data table with sorting, filtering
4. **ProductCard** - Grid card for product display
5. **StatusBadge** - Colored badge for order status
6. **DateRangePicker** - Select date ranges for analytics
7. **Sidebar** - Navigation sidebar with collapsible menu
8. **Header** - Top bar with search, notifications, user menu

---

## Sample Data (Insert after creating tables)

```sql
-- Sample Products
INSERT INTO products (name, description, price, cost, stock, category, image_url) VALUES
('Wireless Headphones', 'Premium noise-canceling headphones', 299.99, 150.00, 45, 'Electronics', 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400'),
('Smart Watch', 'Fitness tracking smartwatch', 199.99, 80.00, 120, 'Electronics', 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400'),
('Running Shoes', 'Lightweight running shoes', 129.99, 45.00, 78, 'Footwear', 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400'),
('Backpack', 'Water-resistant laptop backpack', 79.99, 25.00, 200, 'Accessories', 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400'),
('Coffee Maker', 'Automatic drip coffee maker', 89.99, 35.00, 55, 'Home', 'https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?w=400');

-- Sample Customers
INSERT INTO customers (email, first_name, last_name, phone) VALUES
('john.doe@email.com', 'John', 'Doe', '+1234567890'),
('jane.smith@email.com', 'Jane', 'Smith', '+1234567891'),
('bob.wilson@email.com', 'Bob', 'Wilson', '+1234567892');

-- Sample Orders (you'd generate order_number dynamically in real app)
INSERT INTO orders (order_number, customer_id, status, subtotal, tax, shipping, total)
SELECT 
  'ORD-' || LPAD(ROW_NUMBER() OVER ()::TEXT, 5, '0'),
  c.id,
  (ARRAY['pending', 'processing', 'shipped', 'delivered'])[floor(random() * 4 + 1)],
  (random() * 500 + 50)::DECIMAL(10,2),
  ((random() * 500 + 50) * 0.08)::DECIMAL(10,2),
  9.99,
  ((random() * 500 + 50) * 1.08 + 9.99)::DECIMAL(10,2)
FROM customers c
CROSS JOIN generate_series(1, 5);
```

---

## Key Implementation Notes

1. **Use Recharts** for all charts (already installed in Lovable)
2. **Use shadcn/ui Table** component for data tables
3. **Add real-time subscriptions** for live order updates
4. **Implement proper loading states** with Skeleton components
5. **Use React Query** for data fetching and caching
6. **Mobile responsive** - sidebar collapses on mobile

---

## Estimated Build Time
- **Basic MVP**: 2-3 hours with Lovable
- **Full Featured**: 4-6 hours with Lovable
