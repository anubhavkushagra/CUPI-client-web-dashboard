const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    balance: { type: Number, default: 100000 },
    // Portfolio: Key (Ticker) -> Value (Quantity)
    // Using Map for flexibility
    portfolio: {
        type: Map,
        of: Number,
        default: {}
    },
    subscriptions: [{ type: String }],
    // Transaction History
    transactions: [{
        action: String, // BUY or SELL
        ticker: String,
        quantity: Number,
        price: Number,
        date: { type: Date, default: Date.now }
    }]
});

module.exports = mongoose.model('User', UserSchema);
