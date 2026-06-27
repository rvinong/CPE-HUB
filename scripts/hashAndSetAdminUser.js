const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const MONGODB_URI = 'mongodb+srv://ongrvin:1yjnlh24A0hWGa76@cluster0.m7xd6hn.mongodb.net/test?retryWrites=true&w=majority';

const userSchema = new mongoose.Schema({}, { strict: false });
const User = mongoose.model('User', userSchema, 'users');

async function hashPasswordAndSetAdmin(email, plainPassword) {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    const hashedPassword = await bcrypt.hash(plainPassword, 10);

    const user = await User.findOne({ email });
    if (!user) {
      console.log('User not found');
      return;
    }

    user.password = hashedPassword;
    user.isAdmin = true;

    await user.save();
    console.log('User password hashed and isAdmin set to true');
  } catch (err) {
    console.error('Error:', err);
  } finally {
    await mongoose.disconnect();
  }
}

// Updated with actual admin email and plain password
const adminEmail = 'cpehub@gmail.com';
const adminPlainPassword = 'cpehub2025';

hashPasswordAndSetAdmin(adminEmail, adminPlainPassword);
