const mongoose = require('mongoose');

const dishSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, default: '' },
    price: { type: Number, required: true },
    category: { type: String, default: 'General' },
    image: { type: String, default: '' },
    available: { type: Boolean, default: true },
    rating: { type: Number, default: 4.5 },
    prepTime: { type: Number, default: 20 },
}, { timestamps: true });

module.exports = mongoose.model('Dish', dishSchema);
