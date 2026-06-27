const express = require('express');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = 'supersecretkey123!@#'; // Replace with a secure key in production

app.use(cors());
app.use(bodyParser.json());

const MONGODB_URI = 'mongodb+srv://ongrvin:1yjnlh24A0hWGa76@cluster0.m7xd6hn.mongodb.net/test?retryWrites=true&w=majority';

mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  mobile: String,
  birthday: Date,
  isAdmin: { type: Boolean, default: false },
  cart: [
    {
      productId: Number,
      name: String,
      price: Number,
      size: String,
      qty: Number,
      image: String,
    }
  ],
  addresses: [
    {
      id: { type: mongoose.Schema.Types.ObjectId, default: new mongoose.Types.ObjectId() },
      street: String,
      city: String,
      state: String,
      zip: String,
      country: String,
      phone: String,
    }
  ],
}, { timestamps: true });

const User = mongoose.model('User', userSchema);

// Define Stock schema and model
const stockSchema = new mongoose.Schema({
  productId: { type: Number, required: true, unique: true },
  name: { type: String, required: true },
  category: String,
  price: Number,
  sizes: [String],
  image: String,
  quantity: { type: Number, required: true, default: 0 },
}, { timestamps: true });

const Stock = mongoose.model('Stock', stockSchema);

// Define Order schema and model
const orderSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  items: [
    {
      productId: Number,
      name: String,
      price: Number,
      size: String,
      qty: Number,
      image: String,
    }
  ],
  total: Number,
  status: { type: String, default: 'Pending' },
  createdAt: { type: Date, default: Date.now },
}, { timestamps: true });

const Order = mongoose.model('Order', orderSchema);

// Middleware to authenticate JWT token
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.sendStatus(401);

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
}

// Get user orders or all orders if admin
app.get('/api/orders', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    console.log(`GET /api/orders called by user ${req.user.id}, isAdmin: ${user ? user.isAdmin : 'user not found'}`);
    if (!user) return res.sendStatus(404);

    let orders;
    if (user.isAdmin) {
      orders = await Order.find({}).populate('userId', 'name email');
    } else {
      orders = await Order.find({ userId: req.user.id });
    }
    res.json(orders);
  } catch (err) {
    console.error('Error in POST /api/orders:', err.stack || err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get user addresses
app.get('/api/addresses', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('addresses');
    if (!user) return res.sendStatus(404);
    res.json(user.addresses);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Add new address
app.post('/api/addresses', authenticateToken, async (req, res) => {
  try {
    const { street, city, state, zip, country, phone } = req.body;
    const user = await User.findById(req.user.id);
    if (!user) return res.sendStatus(404);
    user.addresses.push({ street, city, state, zip, country, phone });
    await user.save();
    res.status(201).json(user.addresses);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update address
app.put('/api/addresses/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { street, city, state, zip, country, phone } = req.body;
    const user = await User.findById(req.user.id);
    if (!user) return res.sendStatus(404);
    const address = user.addresses.id(id);
    if (!address) return res.sendStatus(404);
    address.street = street;
    address.city = city;
    address.state = state;
    address.zip = zip;
    address.country = country;
    address.phone = phone;
    await user.save();
    res.json(user.addresses);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete address
app.delete('/api/addresses/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(req.user.id);
    if (!user) return res.sendStatus(404);
    user.addresses.id(id).remove();
    await user.save();
    res.json(user.addresses);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Signup endpoint
app.post('/api/signup', async (req, res) => {
  const { name, email, password, mobile, birthday } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ message: 'Name, email and password are required' });
  }
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: 'User already exists' });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ name, email, password: hashedPassword, mobile, birthday, cart: [] });
    await user.save();
    res.status(201).json({ message: 'User created successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all users (admin only)
app.get('/api/users', authenticateToken, async (req, res) => {
  try {
    // Here you might want to add admin role check, for now assuming all authenticated users can access
    const users = await User.find().select('-password');
    res.json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Login endpoint
app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }
  try {
    const user = await User.findOne({ email });
    if (!user) {
      console.log(`Login failed: user not found for email ${email}`);
      return res.status(400).json({ message: 'Invalid email or password' });
    }
    console.log(`Stored password hash for user ${email}: ${user.password}`);
    const match = await bcrypt.compare(password, user.password);
    console.log(`Password match result for user ${email}: ${match}`);
    if (!match) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }
    const token = jwt.sign({ id: user._id.toString(), email: user.email }, JWT_SECRET, { expiresIn: '1h' });
    res.json({ token, user: { id: user._id.toString(), name: user.name, email: user.email, mobile: user.mobile, birthday: user.birthday, isAdmin: user.isAdmin } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Protected route example
app.get('/api/profile', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) return res.sendStatus(404);
    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get stock data
app.get('/api/stock', async (req, res) => {
  try {
    const stocks = await Stock.find({});
    res.json(stocks);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update stock quantity (admin or protected route)
app.put('/api/stock/:productId', async (req, res) => {
  const { productId } = req.params;
  const { quantity, name, category, price, sizes, image } = req.body;
  try {
    let stock = await Stock.findOne({ productId: Number(productId) });
    if (!stock) {
      // Create new stock item if not found
      stock = new Stock({
        productId: Number(productId),
        name,
        category,
        price,
        sizes,
        image,
        quantity,
      });
    } else {
      // Update existing stock item
      stock.name = name || stock.name;
      stock.category = category || stock.category;
      stock.price = price || stock.price;
      stock.sizes = sizes || stock.sizes;
      stock.image = image || stock.image;
      stock.quantity = quantity !== undefined ? quantity : stock.quantity;
    }
    await stock.save();
    res.json(stock);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create new product (stock item)
app.post('/api/products', async (req, res) => {
  const { productId, name, category, price, sizes, image, quantity } = req.body;
  if (!productId || !name || price === undefined) {
    return res.status(400).json({ message: 'productId, name, and price are required' });
  }
  try {
    const existing = await Stock.findOne({ productId: Number(productId) });
    if (existing) {
      return res.status(409).json({ message: 'Product with this productId already exists' });
    }
    const product = new Stock({
      productId: Number(productId),
      name,
      category,
      price,
      sizes,
      image,
      quantity: quantity || 0,
    });
    await product.save();
    res.status(201).json(product);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all products
app.get('/api/products', async (req, res) => {
  try {
    const products = await Stock.find({});
    res.json(products);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get product by productId
app.get('/api/products/:productId', async (req, res) => {
  try {
    const product = await Stock.findOne({ productId: Number(req.params.productId) });
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json(product);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete product by productId
app.delete('/api/products/:productId', async (req, res) => {
  try {
    const product = await Stock.findOneAndDelete({ productId: Number(req.params.productId) });
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json({ message: 'Product deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create new order
app.post('/api/orders', authenticateToken, async (req, res) => {
  const { items, total } = req.body;
  if (!items || !Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ message: 'Order items are required' });
  }
  try {
    // Check stock availability and update quantities
    for (const item of items) {
      const stockItem = await Stock.findOne({ productId: item.productId });
      if (!stockItem || stockItem.quantity < item.qty) {
        return res.status(400).json({ message: `Insufficient stock for productId ${item.productId}` });
      }
    }
    // Deduct stock quantities
    for (const item of items) {
      await Stock.updateOne(
        { productId: item.productId },
        { $inc: { quantity: -item.qty } }
      );
    }
    // Validate userId
    let userId;
    try {
      userId = new mongoose.Types.ObjectId(req.user.id.toString());
    } catch (e) {
      console.error('Invalid user ID in token:', req.user.id);
      return res.status(400).json({ message: 'Invalid user ID' });
    }
    // Create order
    const order = new Order({
      userId,
      items,
      total,
      status: 'Pending',
    });
    await order.save();
    res.status(201).json(order);
  } catch (err) {
    console.error('Error creating order:', err.stack || err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update order status (admin or user)
app.put('/api/orders/:orderId', authenticateToken, async (req, res) => {
  const { status } = req.body;
  try {
    const order = await Order.findById(req.params.orderId);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    order.status = status || order.status;
    await order.save();
    res.json(order);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get user cart
app.get('/api/cart', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.sendStatus(404);
    res.json(user.cart);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update user cart
app.put('/api/cart', authenticateToken, async (req, res) => {
  const { cart } = req.body;
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.sendStatus(404);
    user.cart = cart;
    await user.save();
    res.json(user.cart);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Root route to confirm server is running
app.get('/', (req, res) => {
  res.send('Backend server is running');
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
