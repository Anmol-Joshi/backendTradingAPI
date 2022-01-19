const mongoose = require('mongoose');
const { Schema } = mongoose;

const portfolioSchema = new Schema({
  tickerSymbol: { type: String, required: true },
  // tradeId: Number,
  averagePrice: { type: Number, default: 0 },
  quantity: { type: Number, default: 0 },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  updatedAt: {
    type: Date,
    default: Date.now(),
  },
});

module.exports = mongoose.model('Portfolio', portfolioSchema);
