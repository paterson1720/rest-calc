const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  balance: { type: Number, required: true, default: 10 },
  status: { type: String, default: 'active' },
});

const User = mongoose.model('User', UserSchema);

module.exports = User;
