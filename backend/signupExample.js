const express = require('express');
const bcrypt = require('bcrypt');
const router = express.Router();
const User = require('./models/User'); // Adjust path to your User model

// POST /api/signup
router.post('/signup', async (req, res) => {
  try {
    const { name, birthday, cellphone, email, password } = req.body;

    if (!name || !birthday || !cellphone || !email || !password) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: 'User already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const newUser = new User({
      name,
      birthday,
      cellphone,
      email,
      password: hashedPassword,
    });

    await newUser.save();

    res.status(201).json({ message: 'User created successfully' });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;
