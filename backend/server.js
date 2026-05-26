import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import User from './models/User.js';
import Factory from './models/Factory.js';
import Order from './models/Order.js';
import Payment from './models/Payment.js'; // Ensure this path is correct
const app = express();
app.use(cors());

// Image uploads ke liye 50MB limit zaroori hai
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

mongoose.connect('mongodb://127.0.0.1:27017/zaminDB')
  .then(() => console.log('🚀 Engine Online'))
  .catch(err => console.error('DB Connection Failed:', err));

// ================= AUTH ROUTES =================

// 1. Manufacturer Registration
app.post('/api/auth/register-manufacturer', async (req, res) => {
  try {
    const { name, email, password, factoryName, location, capacity } = req.body;
    const newUser = new User({ name, email: email.toLowerCase().trim(), passwordHash: password, role: 'manufacturer' });
    const savedUser = await newUser.save();

    const newFactory = new Factory({ 
      userId: savedUser._id, 
      name: factoryName, 
      location: location || 'Lahore', 
      capacity: Number(capacity), 
      uploadedArticles: [] 
    });
    const savedFactory = await newFactory.save();

    savedUser.factoryId = savedFactory._id.toString();
    await savedUser.save();
    res.status(201).json({ success: true });
  } catch (err) { res.status(500).json({ error: err.message }); }
});
// Add this to server.js
app.get('/api/buyer/shortlist/:buyerId', async (req, res) => {
  try {
    // Assumption: User schema mein shortlist ka koi field hoga, 
    // agar aapne alag collection banayi hai toh yahan logic change karein
    const user = await User.findById(req.params.buyerId).populate('shortlistedFactories');
    res.json({ success: true, shortlisted: user.shortlistedFactories || [] });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// 2. Buyer Registration
app.post('/api/auth/register-buyer', async (req, res) => {
  try {
    const { name, email, password, brandName } = req.body;
    
    // Check if user exists
    const existing = await User.findOne({ email: email.toLowerCase().trim() });
    if (existing) return res.status(400).json({ success: false, message: "Email already exists" });

    // Save New User
    const newUser = new User({ 
      name, 
      email: email.toLowerCase().trim(), 
      passwordHash: password, 
      role: 'buyer', 
      brandName: brandName || 'N/A' // brandName ki value yahan se jati hai
    });
    
    await newUser.save();
    res.status(201).json({ success: true, message: "Buyer Registered" });
  } catch (err) { 
    console.error("DEBUG ERROR:", err); // Yeh terminal mein error dikhayega
    res.status(500).json({ success: false, message: err.message }); 
  }
});

// 3. Login
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email: email.toLowerCase().trim() });
    if (!user || user.passwordHash !== password) return res.status(401).json({ message: "Invalid credentials" });

    res.json({ success: true, user: { id: user._id, role: user.role, factoryId: user.factoryId } });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// ================= CATALOG ENGINE =================

// Publish Article
app.post('/api/factories/:factoryId/articles', async (req, res) => {
  try {
    const { factoryId } = req.params;
    const { articleName, imageUrl, moq, description } = req.body;
    const factory = await Factory.findById(factoryId);
    if (!factory) return res.status(404).json({ message: "Factory not found" });

    factory.uploadedArticles.push({ articleName, imageUrl, moq: Number(moq), description });
    await factory.save();
    res.json({ success: true });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// ================= ORDER ENGINE =================

app.post('/api/orders/proposal', async (req, res) => {
  try {
    const { buyerId, ...orderData } = req.body;
    
    // 1. Database se Buyer ka naam fetch karein
    const buyer = await User.findById(buyerId);
    
    // 2. Naya Order object banayein (brandName ke saath)
    const newOrder = new Order({
      ...orderData,
      buyerId: buyerId,
      brandName: buyer ? buyer.brandName : 'Independent Retailer' // Yahan se field set hogi
    });
    
    await newOrder.save();
    res.status(201).json({ success: true });
  } catch (err) { 
    console.error("Proposal Error:", err);
    res.status(500).json({ error: err.message }); 
  }
});
app.get('/api/factories', async (req, res) => {
  try {
    const factories = await Factory.find({});
    res.json({ success: true, factories });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// 2. GET: Specific factory ki details
app.get('/api/factories/:factoryId', async (req, res) => {
  try {
    const factory = await Factory.findById(req.params.factoryId);
    if (!factory) return res.status(404).json({ message: "Factory not found" });
    res.json({ success: true, factory });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.get('/api/orders/manufacturer/:factoryId', async (req, res) => {
  try {
    const orders = await Order.find({ factoryId: req.params.factoryId })
      .populate('buyerId', 'brandName name') // Yahan buyerId ko resolve kar rahe hain
      .exec();
    res.json({ success: true, orders });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// 2. GET: Buyer ke apne orders dekhne ke liye
app.get('/api/orders/buyer/:buyerId', async (req, res) => {
  try {
    const orders = await Order.find({ buyerId: req.params.buyerId });
    res.json({ success: true, orders });
  } catch (err) { res.status(500).json({ error: err.message }); }
});
// Ensure this route exists in your server.js under Catalog Engine
app.get('/api/factories', async (req, res) => {
  try {
    const factories = await Factory.find({}); 
    // Console log karein taake pata chale backend ne kya uthaya
    console.log("Factories found in DB:", factories.length);
    res.json({ success: true, factories });
  } catch (err) { 
    res.status(500).json({ error: err.message }); 
  }
});
// 1. Order Status Action (Accept/Reject)
app.put('/api/orders/:orderId/action', async (req, res) => {
  try {
    const { status, price } = req.body;
    const updateFields = { status };
    if (price) updateFields.negotiatedPricePerUnit = price;
    
    await Order.findByIdAndUpdate(req.params.orderId, updateFields);
    res.json({ success: true });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// 2. Production Phase Update
app.put('/api/orders/:orderId/phase', async (req, res) => {
  try {
    const { nextStage } = req.body;
    await Order.findByIdAndUpdate(req.params.orderId, { currentProductionStage: nextStage });
    res.json({ success: true });
  } catch (err) { res.status(500).json({ error: err.message }); }
});
// ✅ ADD THIS TO server.js (Under ORDER ENGINE section)

// REPLACE THIS ROUTE IN YOUR server.js (Under ORDER ENGINE)
app.put('/api/orders/:orderId/accept-price', async (req, res) => {
  try {
    // 1. Order status update
    const order = await Order.findByIdAndUpdate(
      req.params.orderId, 
      { status: 'accepted' }, 
      { new: true }
    );
    
    if (!order) return res.status(404).json({ message: "Order not found" });

    // 2. Automatically Payment document create karein
    const total = order.quantity * order.negotiatedPricePerUnit;
    const newPayment = new Payment({
      orderId: order._id,
      buyerId: order.buyerId,
      factoryId: order.factoryId,
      totalAmount: total,
      milestones: [
        { milestoneNumber: 1, description: "Advance Procurement", percentage: 30, amount: total * 0.3, status: 'unpaid' },
        { milestoneNumber: 2, description: "Mid-Production", percentage: 40, amount: total * 0.4, status: 'unpaid' },
        { milestoneNumber: 3, description: "Final Dispatch", percentage: 30, amount: total * 0.3, status: 'unpaid' }
      ]
    });
    
    await newPayment.save();

    // 3. Updated order aur generated payment dono bhejein
    res.json({ success: true, order: order, payment: newPayment });
  } catch (err) { 
    res.status(500).json({ error: err.message }); 
  }
});
// ================= PAYMENT ENGINE =================
// 1. Initialize Payment (Milestones generate karna)
app.post('/api/payments/initialize', async (req, res) => {
  try {
    const { orderId, buyerId, factoryId, totalAmount } = req.body;
    
    // 30-40-30 breakdown (Example)
    const milestones = [
      { milestoneNumber: 1, description: "Advance Procurement", percentage: 30, amount: totalAmount * 0.3, status: 'unpaid' },
      { milestoneNumber: 2, description: "Mid-Production", percentage: 40, amount: totalAmount * 0.4, status: 'unpaid' },
      { milestoneNumber: 3, description: "Final Dispatch", percentage: 30, amount: totalAmount * 0.3, status: 'unpaid' }
    ];

    const newPayment = new Payment({ orderId, buyerId, factoryId, totalAmount, milestones });
    await newPayment.save();
    
    res.status(201).json({ success: true, payment: newPayment });
  } catch (err) { res.status(500).json({ error: err.message }); }
});
// ================= PAYMENT ENGINE (Updated) =================

// 1. Initialize Payment
app.post('/api/payments/initialize', async (req, res) => {
  try {
    const { orderId, buyerId, factoryId, totalAmount } = req.body;
    const milestones = [
      { milestoneNumber: 1, description: "Advance Procurement", percentage: 30, amount: totalAmount * 0.3, status: 'unpaid' },
      { milestoneNumber: 2, description: "Mid-Production", percentage: 40, amount: totalAmount * 0.4, status: 'unpaid' },
      { milestoneNumber: 3, description: "Final Dispatch", percentage: 30, amount: totalAmount * 0.3, status: 'unpaid' }
    ];
    const newPayment = new Payment({ orderId, buyerId, factoryId, totalAmount, milestones });
    await newPayment.save();
    res.status(201).json({ success: true, payment: newPayment });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// 2. NEW: Verify Payment Milestone (Manufacturer side)
app.put('/api/payments/verify-milestone', async (req, res) => {
  try {
    const { orderId, milestoneIndex } = req.body;
    
    const payment = await Payment.findOne({ orderId });
    if (!payment) return res.status(404).json({ message: "Payment record not found" });

    // Mark milestone as paid
    payment.milestones[milestoneIndex].status = 'paid_escrow';
    payment.milestones[milestoneIndex].paidAt = new Date();
    await payment.save();

    // If it's the 1st milestone (Advance), trigger the production start
    if (milestoneIndex === 0) {
      await Order.findByIdAndUpdate(orderId, { status: 'accepted' });
    }

    res.json({ success: true, message: "Milestone verified successfully" });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// 3. GET: Fetch Payment Status for an Order
app.get('/api/payments/:orderId', async (req, res) => {
  try {
    const payment = await Payment.findOne({ orderId: req.params.orderId });
    res.json({ success: true, payment });
  } catch (err) { res.status(500).json({ error: err.message }); }
});
// Ensure this route is in server.js
app.put('/api/orders/:orderId/phase', async (req, res) => {
  try {
    const { nextStage } = req.body;
    await Order.findByIdAndUpdate(req.params.orderId, { currentProductionStage: nextStage });
    res.json({ success: true });
  } catch (err) { res.status(500).json({ error: err.message }); }
});
app.listen(5000, () => console.log('📡 Server Running on Port 5000'));