const jwt = require('jsonwebtoken');

const requireAuth = (req, res, next) => {
  const token = req.header('Authorization');
  if (!token) return res.status(401).json({ error: 'Authorization token not provided' });

  try {
    const { user } = jwt.verify(token, process.env.JWT_SECRET);
    req.user = user;
    next();
  } catch (error) {
    console.error('ERR', error);
    return res.status(401).json({ error: 'Token not valid.' });
  }
};

module.exports = { requireAuth };
