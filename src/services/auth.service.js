const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

async function registerUser({ username, password }) {
  const existingUser = await User.findOne({ username });
  if (existingUser) return { existingUser };

  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(password, salt);
  await User.create({ username, password: hash });
  const { token } = await logUserIn({ username, password });
  return { token, message: 'User registered successfully' };
}

async function logUserIn({ username, password }) {
  const user = await User.findOne({ username });
  if (!user) return { error: 'User does not exist' };

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return { error: 'Invalid credentials' };

  const payload = { user: { id: user.id } };

  return new Promise((resolve, reject) => {
    jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '30d' }, (error, jwtToken) => {
      if (error) reject(error);
      resolve({ token: jwtToken });
    });
  });
}

module.exports = { registerUser, logUserIn };
