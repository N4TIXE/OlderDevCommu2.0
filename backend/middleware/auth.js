const jwt = require('jsonwebtoken');
require('dotenv').config();

module.exports = function (req, res, next) {
  // ดึง token จาก header
  const token = req.header('Authorization')?.split(' ')[1];

  // ตรวจสอบว่ามี token หรือไม่
  if (!token) {
    return res.status(401).json({ msg: 'No token, authorization denied' });
  }

  // ยืนยันความถูกต้องของ token
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded.user;
    next();
  } catch (err) {
    res.status(401).json({ msg: 'Token is not valid' });
  }
};