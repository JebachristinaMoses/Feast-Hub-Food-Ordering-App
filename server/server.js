require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const User = require('./models/User');
const Dish = require('./models/Dish');
const Order = require('./models/Order');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/feasthub';

mongoose.connect(MONGODB_URI)
  .then(async () => {
    console.log('Successfully connected to MongoDB.');

    // Clear strict schema validators that may conflict with Mongoose (e.g. from playground script)
    try {
      await mongoose.connection.db.command({ collMod: 'users', validator: {}, validationLevel: 'off' });
      await mongoose.connection.db.command({ collMod: 'dishes', validator: {}, validationLevel: 'off' });
      await mongoose.connection.db.command({ collMod: 'orders', validator: {}, validationLevel: 'off' });
    } catch (_) { /* collections may not exist yet, ignore */ }

    // Seed default admin user into the database if not present
    const adminExists = await User.findOne({ email: 'admin@feasthub.com' });
    if (!adminExists) {
      await User.create({ email: 'admin@feasthub.com', password: 'admin123', name: 'Admin', role: 'admin', points: 0 });
      console.log('Seeded default admin user.');
    }

    // Seed initial dishes if the collection is empty
    const count = await Dish.countDocuments();
    if (count === 0) {
      await Dish.insertMany(initialDishes);
      console.log('Seeded initial dishes.');
    }
  })
  .catch((error) => console.error('Error connecting to MongoDB:', error.message));

// ─── STATUS ────────────────────────────────────────────────────────────────────
app.get('/api/status', (req, res) => {
  res.json({ status: 'Backend is running and connected to MongoDB' });
});

// ─── AUTH ──────────────────────────────────────────────────────────────────────
// Register
app.post('/api/auth/register', async (req, res) => {
  try {
    const { email, password, name, role } = req.body;
    const existing = await User.findOne({ email });
    if (existing) return res.status(409).json({ error: 'Email already registered' });
    const user = await User.create({ email, password, name, role, points: 0 });
    res.json({ id: user._id, email: user.email, name: user.name, role: user.role, points: user.points });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Login
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password, role } = req.body;

    // Look up user in MongoDB (admin is also stored there now)
    const user = await User.findOne({ email, password, role });
    if (!user) return res.status(401).json({ error: 'Invalid credentials' });
    res.json({ id: user._id, email: user.email, name: user.name, role: user.role, points: user.points });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update user points
app.patch('/api/auth/users/:id/points', async (req, res) => {
  try {
    const { points } = req.body;
    const user = await User.findByIdAndUpdate(req.params.id, { points }, { new: true });
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json({ id: user._id, email: user.email, name: user.name, role: user.role, points: user.points });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ─── DISHES ────────────────────────────────────────────────────────────────────
app.get('/api/dishes', async (req, res) => {
  try {
    const dishes = await Dish.find();
    res.json(dishes.map(d => ({ ...d.toObject(), id: d._id })));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/dishes', async (req, res) => {
  try {
    const dish = await Dish.create(req.body);
    res.json({ ...dish.toObject(), id: dish._id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.patch('/api/dishes/:id', async (req, res) => {
  try {
    const dish = await Dish.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!dish) return res.status(404).json({ error: 'Dish not found' });
    res.json({ ...dish.toObject(), id: dish._id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/dishes/:id', async (req, res) => {
  try {
    await Dish.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ─── ORDERS ────────────────────────────────────────────────────────────────────
app.get('/api/orders', async (req, res) => {
  try {
    const orders = await Order.find().sort({ timestamp: -1 });
    res.json(orders.map(o => ({ ...o.toObject(), id: o._id })));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/orders', async (req, res) => {
  try {
    const order = await Order.create(req.body);
    res.json({ ...order.toObject(), id: order._id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.patch('/api/orders/:id/status', async (req, res) => {
  try {
    const { status, trackingStage } = req.body;
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status, trackingStage },
      { new: true }
    );
    if (!order) return res.status(404).json({ error: 'Order not found' });
    res.json({ ...order.toObject(), id: order._id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.patch('/api/orders/:id/feedback', async (req, res) => {
  try {
    const { rating, feedback } = req.body;
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { rating, feedback },
      { new: true }
    );
    if (!order) return res.status(404).json({ error: 'Order not found' });
    res.json({ ...order.toObject(), id: order._id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ─── INITIAL SEED DATA ─────────────────────────────────────────────────────────
const initialDishes = [
  { name: 'Truffle Risotto', description: 'Creamy Italian risotto with black truffle and parmesan', price: 24.99, category: 'Italian', image: 'https://images.unsplash.com/photo-1761095596765-c8abe01d3aea?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400', available: true, rating: 4.8, prepTime: 25 },
  { name: 'Margherita Pizza', description: 'Classic pizza with fresh mozzarella, basil, and tomato sauce', price: 16.99, category: 'Italian', image: 'https://images.unsplash.com/photo-1667207394004-acb6aaf4790e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400', available: true, rating: 4.9, prepTime: 15 },
  { name: 'Gourmet Burger', description: 'Angus beef burger with caramelized onions, aged cheddar, and truffle mayo', price: 18.99, category: 'American', image: 'https://images.unsplash.com/photo-1631533633021-0a0a3e1ed34b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400', available: true, rating: 4.7, prepTime: 20 },
  { name: 'Sushi Platter', description: 'Assorted nigiri and maki rolls with wasabi and pickled ginger', price: 32.99, category: 'Japanese', image: 'https://images.unsplash.com/photo-1719454260877-643468a873dc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400', available: true, rating: 4.9, prepTime: 30 },
  { name: 'Penne Arrabiata', description: 'Spicy tomato sauce with garlic, red chili, and fresh basil', price: 14.99, category: 'Italian', image: 'https://images.unsplash.com/photo-1609166639722-47053ca112ea?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400', available: true, rating: 4.6, prepTime: 18 },
  { name: 'Chocolate Lava Cake', description: 'Warm chocolate cake with molten center, served with vanilla ice cream', price: 9.99, category: 'Dessert', image: 'https://images.unsplash.com/photo-1607257882338-70f7dd2ae344?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400', available: true, rating: 5.0, prepTime: 12 },
  { name: 'Buddha Bowl', description: 'Quinoa, roasted vegetables, avocado, and tahini dressing', price: 13.99, category: 'Healthy', image: 'https://images.unsplash.com/photo-1649531794884-b8bb1de72e68?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400', available: true, rating: 4.5, prepTime: 15 },
  { name: 'Street Tacos', description: 'Three soft corn tortillas with grilled chicken, cilantro, and lime', price: 11.99, category: 'Mexican', image: 'https://images.unsplash.com/photo-1619301920463-a37f1764eb83?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400', available: true, rating: 4.7, prepTime: 15 },
  { name: 'Tonkotsu Ramen', description: 'Rich pork bone broth with noodles, soft-boiled egg, and chashu', price: 15.99, category: 'Japanese', image: 'https://images.unsplash.com/photo-1627900440398-5db32dba8db1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400', available: true, rating: 4.8, prepTime: 25 },
  { name: 'Lobster Thermidor', description: 'Fresh lobster in creamy cognac sauce, topped with parmesan', price: 42.99, category: 'Seafood', image: 'https://images.unsplash.com/photo-1769611446060-e97e80d23063?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400', available: true, rating: 5.0, prepTime: 35 },
];

app.listen(PORT, () => {
  console.log(`Server is running on port: ${PORT}`);
});
