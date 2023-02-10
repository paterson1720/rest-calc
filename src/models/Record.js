const mongoose = require('mongoose');

const RecordSchema = new mongoose.Schema({
  operation: { type: mongoose.Schema.Types.ObjectId, ref: 'Operation', required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  amount: { type: Number, required: true },
  user_balance: { type: Number, required: true },
  operation_response: {
    type: {
      result: mongoose.Schema.Types.Mixed,
      remainingBalance: Number,
    },
    required: true,
  },
  deleted: { type: Boolean, default: false },
  date: { type: Date, default: Date.now },
});

const Record = mongoose.model('Record', RecordSchema);

module.exports = Record;
