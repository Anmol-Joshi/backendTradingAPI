const mongoose = require('mongoose');
const { Schema } = mongoose;

const idCounterSchema = new Schema({
  // idCounter: String,
  tradeId: { type: Number, default: 1 },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  updatedAt: {
    type: Date,
    default: Date.now(),
  },
});

module.exports = mongoose.model('IdCounter', idCounterSchema);
