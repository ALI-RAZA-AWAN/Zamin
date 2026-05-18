import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';

// Import our models (In Node.js with ES Modules, you must include the '.js' extension for local files)
import User from './models/User.js';
import Factory from './models/Factory.js';
import Order from './models/Order.js';

const app = express();

// Middleware 
app.use(cors()); // Allows your Vite React frontend to securely request data from this port
app.use(express.json()); // Essential middleware to read JSON body data sent by your forms

// Connect to your local MongoDB PC service instance
mongoose.connect('mongodb://127.0.0.1:27017/zaminDB')
  .then(() => console.log('🚀 Secure connection established with local MongoDB (zaminDB)'))
  .catch(err => console.error('MongoDB critical connection crash:', err));

// ==========================================
// 1. AUTHENTICATION ENGINE (SIGNUP & LOGIN)
// ==========================================

// POST: Register a new Buyer Node
app.post('/api/auth/register-buyer', async (req, res) => {
  try {
    const { username, brandName, email, password, niches } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ success: false, message: "Email already exists in database." });
    }

    const newUser = new User({
      name: username,
      email,
      passwordHash: password, // For university project tracking
      role: 'buyer',
      brandName,
      niches
    });
    await newUser.save();

    res.status(201).json({ success: true, message: "Buyer profile created successfully!" });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST: Register a new Manufacturer + Auto-Build their Sourcing Profile
app.post('/api/auth/register-manufacturer', async (req, res) => {
  try {
    const { username, factoryName, email, capacity, location, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ success: false, message: "Email already exists in database." });
    }

    // 1. Create primary User account mapping identity
    const newUser = new User({
      name: username,
      email,
      passwordHash: password,
      role: 'manufacturer'
    });
    const savedUser = await newUser.save();

    // 2. Automatically generate their interconnected Sourcing Factory Hub profile!
    const newFactory = new Factory({
      userId: savedUser._id, // References the brand new MongoDB ObjectId string
      name: factoryName,
      location,
      capacity,
      category: ['T-Shirts', 'Polo-shirts', 'Hoodies'], // Default capabilities config
      isVerified: true
    });
    await newFactory.save();

    res.status(201).json({ success: true, message: "Manufacturer and factory models synchronized successfully!" });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST: Centralized Authentication Login Portal
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user || user.passwordHash !== password) {
      return res.status(401).json({ success: false, message: "Invalid email account or password credentials." });
    }

    // If the user role is a factory manufacturer, look up their unique factory structure identifier
    let factoryId = null;
    if (user.role === 'manufacturer') {
      const factoryProfile = await Factory.findOne({ userId: user._id });
      if (factoryProfile) factoryId = factoryProfile._id;
    }

    res.json({
      success: true,
      message: "Authentication verified",
      user: {
        id: user._id,
        name: user.name,
        role: user.role,
        factoryId: factoryId
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// ==========================================
// 2. INDUSTRIAL CLUSTER HUB ROUTING
// ==========================================

// GET: Fetch verified production installations for directory lookup
app.get('/api/factories', async (req, res) => {
  try {
    const factories = await Factory.find({ isVerified: true });
    res.json({ success: true, factories });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// ==========================================
// 3. ORDER PIPELINE & STAGE CONTEXT MUTATIONS
// ==========================================

// POST: Transmit a fresh spec sheet proposal from buyer to mill floor
app.post('/api/orders/proposal', async (req, res) => {
  try {
    const { buyerId, factoryId, productTitle, orderQuantity, specifications } = req.body;
    
    const newOrder = new Order({
      buyerId,
      factoryId,
      productTitle,
      orderQuantity,
      specifications,
      status: 'pending_approval',
      currentProductionStage: 0
    });

    await newOrder.save();
    res.status(201).json({ success: true, order: newOrder });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

// GET: Pull all data logs transmitted by a specific buyer
app.get('/api/orders/buyer/:buyerId', async (req, res) => {
  try {
    const orders = await Order.find({ buyerId: req.params.buyerId });
    res.json({ success: true, orders });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET: Pull all inbound tracking rows assigned to a specific manufacturer
app.get('/api/orders/manufacturer/:factoryId', async (req, res) => {
  try {
    const orders = await Order.find({ factoryId: req.params.factoryId });
    res.json({ success: true, orders });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// PUT: Mutate an inquiry status state parameter (Accept / Decline)
app.put('/api/orders/:orderId/status', async (req, res) => {
  try {
    const { status } = req.body; // Expects values: 'active' or 'rejected'
    const updatedOrder = await Order.findByIdAndUpdate(
      req.params.orderId,
      { status },
      { new: true }
    );
    res.json({ success: true, order: updatedOrder });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

// PUT: Advance the structural physical floor line index (0 up to 4)
app.put('/api/orders/:orderId/stage', async (req, res) => {
  try {
    const { nextStage } = req.body; // Expects progressive numerical value index
    const updatedOrder = await Order.findByIdAndUpdate(
      req.params.orderId,
      { currentProductionStage: nextStage },
      { new: true }
    );
    res.json({ success: true, order: updatedOrder });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

// Initialize network port gateway 
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`📡 Zamin Full-Stack Backend executing smoothly on http://localhost:${PORT}`);
});