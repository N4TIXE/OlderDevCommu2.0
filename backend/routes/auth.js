const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const auth = require('../middleware/auth');
const User = require('../models/User');
require('dotenv').config();

// Register, Login, Get Profile routes (เหมือนเดิม)
// ... (โค้ดส่วน register, login, get profile ไม่ต้องแก้ไข) ...

// @route   POST api/register
router.post('/register', async (req, res) => {
  const { name, email, password } = req.body;
  try {
    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ msg: 'User already exists' });
    user = new User({ name, email, password });
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);
    await user.save();
    const payload = { user: { id: user.id } };
    jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: 360000 }, (err, token) => {
      if (err) throw err;
      res.json({ token });
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   POST api/login
router.post('/login', async (req, res) => {
  const { name, password } = req.body;
  try {
    let user = await User.findOne({ name });
    if (!user) return res.status(400).json({ msg: 'Invalid Credentials' });
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: 'Invalid Credentials' });
    const payload = { user: { id: user.id } };
    jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: 360000 }, (err, token) => {
      if (err) throw err;
      res.json({ token });
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   GET api/profile
router.get('/profile', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});


// Route สำหรับอัปเดต Name/Email (ต้องใช้รหัสผ่าน)
router.put('/profile', auth, async (req, res) => {
  const { name, email, currentPassword } = req.body;
  if (!currentPassword) {
    return res.status(400).json({ msg: 'Please enter your password to confirm changes.' });
  }
  try {
    const user = await User.findById(req.user.id);
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(401).json({ msg: 'Incorrect password. Please try again.' });
    }
    const profileFields = {};
    if (name) profileFields.name = name;
    if (email) profileFields.email = email;
    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      { $set: profileFields },
      { new: true }
    ).select('-password');
    res.json(updatedUser);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// --- 👇 Route ใหม่: สำหรับอัปเดตรูปภาพอย่างเดียว (ไม่ต้องใช้รหัสผ่าน) ---
router.put('/profile/picture', auth, async (req, res) => {
  const { profilePicture } = req.body;

  try {
    // หา user แล้วอัปเดตเฉพาะ field 'profilePicture'
    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      { $set: { profilePicture: profilePicture } },
      { new: true }
    ).select('-password');

    if (!updatedUser) {
      return res.status(404).json({ msg: 'User not found' });
    }
    
    res.json(updatedUser);

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});


module.exports = router;