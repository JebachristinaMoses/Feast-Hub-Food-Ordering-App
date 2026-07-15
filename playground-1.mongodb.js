/* global use, db */
// ─────────────────────────────────────────────────────────────────────────────
// FEAST HUB - Database Reset & Rebuild Script
// Run this in the MongoDB VS Code Extension Playground
// (Ctrl+Alt+R or click ▶ Run Playground)
// ─────────────────────────────────────────────────────────────────────────────

// 1. Select database
use('feasthub');

// 2. [WARNING] These commands delete your data. Only uncomment if you want a total reset.
// db.getCollection('users').drop();
// db.getCollection('dishes').drop();
// db.getCollection('orders').drop();
// console.log('✅ Dropped all existing collections.');

// ─────────────────────────────────────────────────────────────────────────────
// 3. Create USERS collection with schema validation
// Fields: email, password, name, role, points, createdAt, updatedAt
// ─────────────────────────────────────────────────────────────────────────────
db.createCollection('users', {
    validator: {
        $jsonSchema: {
            bsonType: 'object',
            required: ['email', 'password', 'name', 'role'],
            properties: {
                email: { bsonType: 'string', description: 'Required. Must be unique.' },
                password: { bsonType: 'string', description: 'Required.' },
                name: { bsonType: 'string', description: 'Required.' },
                role: { bsonType: 'string', enum: ['admin', 'customer'], description: 'Required. admin or customer.' },
                points: { bsonType: ['int', 'double'], description: 'Reward points for customers.' },
            }
        }
    }
});
db.getCollection('users').createIndex({ email: 1 }, { unique: true });
console.log('✅ Created users collection with unique email index.');

// ─────────────────────────────────────────────────────────────────────────────
// 4. Create DISHES collection with schema validation
// Fields: name, description, price, category, image, available, rating, prepTime
// ─────────────────────────────────────────────────────────────────────────────
db.createCollection('dishes', {
    validator: {
        $jsonSchema: {
            bsonType: 'object',
            required: ['name', 'price'],
            properties: {
                name: { bsonType: 'string' },
                description: { bsonType: 'string' },
                price: { bsonType: ['double', 'int'], minimum: 0 },
                category: { bsonType: 'string' },
                image: { bsonType: 'string' },
                available: { bsonType: 'bool' },
                rating: { bsonType: ['double', 'int'], minimum: 0, maximum: 5 },
                prepTime: { bsonType: ['int', 'double'], minimum: 0 },
            }
        }
    }
});
console.log('✅ Created dishes collection.');

// ─────────────────────────────────────────────────────────────────────────────
// 5. Create ORDERS collection with schema validation
// Fields: customerId, customerName, items[], total, status, timestamp,
//         deliveryAddress, trackingStage, latitude, longitude, rating, feedback, pointsEarned
// ─────────────────────────────────────────────────────────────────────────────
db.createCollection('orders', {
    validator: {
        $jsonSchema: {
            bsonType: 'object',
            required: ['customerId', 'customerName', 'items', 'total', 'status'],
            properties: {
                customerId: { bsonType: 'string' },
                customerName: { bsonType: 'string' },
                items: {
                    bsonType: 'array',
                    items: {
                        bsonType: 'object',
                        required: ['dish', 'quantity'],
                        properties: {
                            dish: { bsonType: 'object' },
                            quantity: { bsonType: ['int', 'double'], minimum: 1 }
                        }
                    }
                },
                total: { bsonType: ['double', 'int'], minimum: 0 },
                status: { bsonType: 'string', enum: ['pending', 'preparing', 'ready', 'delivering', 'completed', 'cancelled'] },
                timestamp: { bsonType: ['long', 'int', 'double'] },
                deliveryAddress: { bsonType: 'string' },
                trackingStage: { bsonType: ['int', 'double'], minimum: 0, maximum: 4 },
                latitude: { bsonType: ['double', 'int'] },
                longitude: { bsonType: ['double', 'int'] },
                rating: { bsonType: ['double', 'int'], minimum: 1, maximum: 5 },
                feedback: { bsonType: 'string' },
                pointsEarned: { bsonType: ['int', 'double'] },
            }
        }
    }
});
db.getCollection('orders').createIndex({ customerId: 1 });
db.getCollection('orders').createIndex({ timestamp: -1 });
console.log('✅ Created orders collection with indexes.');

// ─────────────────────────────────────────────────────────────────────────────
// 6. Seed 10 initial dishes matching the website menu
// ─────────────────────────────────────────────────────────────────────────────
db.getCollection('dishes').insertMany([
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
]);
console.log('✅ Seeded 10 dishes.');

// ─────────────────────────────────────────────────────────────────────────────
// 7. Verify — list all collections and document counts
// ─────────────────────────────────────────────────────────────────────────────
console.log('Collections in feasthub:');
console.log('users: ', db.getCollection('users').countDocuments(), 'docs');
console.log('dishes:', db.getCollection('dishes').countDocuments(), 'docs');
console.log('orders:', db.getCollection('orders').countDocuments(), 'docs');
