const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
    dish: { type: Object, required: true },
    quantity: { type: Number, required: true },
});

const orderSchema = new mongoose.Schema({
    customerId: { type: String, required: true },
    customerName: { type: String, required: true },
    items: [orderItemSchema],
    total: { type: Number, required: true },
    status: {
        type: String,
        enum: ['pending', 'preparing', 'ready', 'delivering', 'completed', 'cancelled'],
        default: 'pending',
    },
    timestamp: { type: Number, default: Date.now },
    deliveryAddress: { type: String, default: '' },
    trackingStage: { type: Number, default: 0 },
    latitude: { type: Number },
    longitude: { type: Number },
    rating: { type: Number },
    feedback: { type: String },
    pointsEarned: { type: Number, default: 0 },
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);
