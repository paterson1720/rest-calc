const service = require('../services/auth.service');
const logger = require('../utils/logger');

const validateCredentials = ({ username, password }) => {
  if (typeof username !== 'string') {
    return { error: 'username should be a string' };
  }

  if (typeof password !== 'string') {
    return { error: 'password should be a string' };
  }

  if (username?.trim().length < 2) {
    return { error: 'username should be at least 2 characters' };
  }

  if (password?.trim().length < 6) {
    return { error: 'Password should be at least 6 characters' };
  }

  return { error: null };
};

async function registerUser(req, res) {
  try {
    const { username, password } = req.body;
    const validation = validateCredentials({ username, password });
    if (validation.error) return res.status(400).json({ error: validation.error });
    const { existingUser, error, message, token } = await service.registerUser({ username, password });
    if (existingUser) return res.status(400).json({ error: 'User already exists' });
    if (error) return res.status(500).json({ error });
    res.status(200).json({ message, token });
  } catch (error) {
    logger.error(error);
    res.status(500).json({ error: error.message });
  }
}

async function logUserIn(req, res) {
  try {
    const { username, password } = req.body;
    const { token, error } = await service.logUserIn({ username, password });
    if (error) return res.status(400).json({ error });
    return res.status(200).json({ token });
  } catch (error) {
    logger.error(error);
    res.status(500).json({ error: error.message });
  }
}

async function logout(req, res) {
  delete req.user;
  return res.status(201).end();
}

module.exports = { registerUser, logUserIn, logout };
