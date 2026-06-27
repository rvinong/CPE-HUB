dconst mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const MONGODB_URI = 'mongodb+srv://ongrvin:1yjnlh24A0hWGa76@cluster0.m7xd6hn.mongodb.net/test?retryWrites=true&w=majority';

const userSchema = new mongoose.Schema({}, { strict: false });
const User = mongoose.model('User', userSchema, 'users');

async function resetAdminUser(email, plainPassword, name) {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    // Delete existing user
    await User.deleteMany({ email });
    console.log(`Deleted existing user(s) with email: ${email}`);

    // Hash password
    const hashedPassword = await bcrypt.hash(plainPassword, 10);

    // Create new user with hashed password and isAdmin true
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      isAdmin: true,
      cart: [],
      addresses: [],
    });

    await newUser.save();
    console.log('Admin user recreated with hashed password and isAdmin set to true');
  } catch (err) {
    console.error('Error:', err);
  } finally {
    await mongoose.disconnect();
  }
}

// Update with actual admin details
const adminEmail = 'cpehub@gmail.com';
const adminPlainPassword = 'cpehub2025';
const adminName = 'Rvin Ong';

resetAdminUser(adminEmail, adminPlainPassword, adminName);
