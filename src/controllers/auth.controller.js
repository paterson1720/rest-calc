const service = require('../services/auth.service');

async function registerUser(req, res) {
  try {
    const { username, password } = req.body;
    const { existingUser, error, message, token } = await service.registerUser({ username, password });
    if (existingUser) return res.status(400).json({ error: 'User already exists' });
    if (error) return res.status(500).json({ error });
    res.status(200).json({ message, token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

async function logUserIn(req, res) {
  try {
    const { username, password } = req.body;
    const { token, error } = await service.logUserIn({ username, password });
    if (error) return res.status(400).json({ error });
    return res.status(200).json({ token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

async function logout(req, res) {
  delete req.user;
  return res.status(201).end();
}

module.exports = { registerUser, logUserIn, logout };
