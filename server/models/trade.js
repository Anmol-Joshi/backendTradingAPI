const mongoose = require('mongoose');
const { Schema } = mongoose;

const tradeSchema = new Schema({
  tickerSymbol: String,
  tradeId: Number,
  price: Number,
  quantity: Number,
  tradeType: String,
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  updatedAt: {
    type: Date,
    default: Date.now(),
  },
});

module.exports = mongoose.model('Trade', tradeSchema);
