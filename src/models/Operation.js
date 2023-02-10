const mongoose = require('mongoose');

const OperationSchema = new mongoose.Schema({
  label: { type: String, required: true },
  type: { type: String, required: true },
  cost: { type: Number, required: true },
});

const Operation = mongoose.model('Operation', OperationSchema);

module.exports = Operation;
