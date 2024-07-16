const jwt = require('jsonwebtoken');
require('dotenv').config();

const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization || req.headers.Authorization;
  if (!authHeader?.startsWith('Bearer ')) return res.sendStatus(401);
  const token = authHeader.split(' ')[1];
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.sendStatus(403).json({
        error: err,
      });
    }
    req.id = decoded.id;
    req.peran = decoded.peran;
    req.nama = decoded.nama;
    next();
  });
};

const verifyRole = (role) => (req, res, next) => {
  if (req.role !== role) return res.sendStatus(403);
  next();
};

const verifyMiddleware = {
  verifyToken,
  verifyRole,
};

module.exports = verifyMiddleware;
