/* global use, db */
// ─────────────────────────────────────────────────────────────────────────────
// FEAST HUB - Safe Data Viewer
// Run this to see your data WITHOUT deleting anything
// ─────────────────────────────────────────────────────────────────────────────

use('feasthub');

console.log('--- USERS ---');
const users = db.getCollection('users').find({}, { password: 0 }).toArray();
console.table(users);

console.log('--- DISHES (Count) ---');
console.log(db.getCollection('dishes').countDocuments());

console.log('--- RECENT ORDERS ---');
const orders = db.getCollection('orders').find().sort({ timestamp: -1 }).limit(5).toArray();
console.table(orders);
