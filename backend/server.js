import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from './models/User.js';
import Factory from './models/Factory.js';
import Order from './models/Order.js';
import Payment from './models/Payment.js';
const app = express();
const JWT_SECRET = process.env.JWT_SECRET || 'zamin_university_project_secret';
const JWT_EXPIRES_IN = '7d';
app.use(cors());

// Images Base64 me aa sakti hain, is liye request size thora bara rakha hai.
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

mongoose.connect('mongodb://127.0.0.1:27017/zaminDB')
  .then(() => console.log('🚀 Engine Online'))
  .catch(err => console.error('DB Connection Failed:', err));

// Yahan auth ka complete flow hai: signup, login, password hash aur JWT token.

const createAuthToken = (user) => jwt.sign(
  {
    id: user._id.toString(),
    role: user.role,
    factoryId: user.factoryId || null
  },
  JWT_SECRET,
  { expiresIn: JWT_EXPIRES_IN }
);

// Protected route par request aane se pehle token validate karte hain.
const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization || '';
  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;

  if (!token) {
    return res.status(401).json({ success: false, message: "Authentication token missing" });
  }

  try {
    req.authUser = jwt.verify(token, JWT_SECRET);
    next();
  } catch (err) {
    res.status(401).json({ success: false, message: "Invalid or expired token" });
  }
};

// Manufacturer signup me pehle user banta hai, phir us user ki factory profile banti hai.
app.post('/api/auth/register-manufacturer', async (req, res) => {
  try {
    const { name, email, password, factoryName, location, capacity } = req.body;
    const normalizedEmail = email.toLowerCase().trim();
    const existing = await User.findOne({ email: normalizedEmail });
    if (existing) return res.status(400).json({ success: false, message: "Email already exists" });

    const passwordHash = await bcrypt.hash(password, 10);
    const newUser = new User({ name, email: normalizedEmail, passwordHash, role: 'manufacturer' });
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
    res.status(201).json({ success: true, message: "Manufacturer Registered" });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});
app.get('/api/buyer/shortlist/:buyerId', async (req, res) => {
  try {
    // Invalid id par database query chalane ke bajaye request yahin stop kar dete hain.
    if (!mongoose.Types.ObjectId.isValid(req.params.buyerId)) {
      return res.status(400).json({ success: false, shortlisted: [], message: "Invalid buyer id" });
    }

    const user = await User.findById(req.params.buyerId).populate('shortlistedFactories');
    if (!user) return res.status(404).json({ success: false, shortlisted: [], message: "Buyer not found" });

    res.json({ success: true, shortlisted: user.shortlistedFactories || [] });
  } catch (err) {
    console.error("Shortlist fetch error:", err);
    res.status(500).json({ success: false, shortlisted: [], message: err.message });
  }
});

app.post('/api/buyer/shortlist-toggle', async (req, res) => {
  try {
    const { buyerId, factoryId } = req.body;

    // Shortlist relation sirf valid buyer aur valid factory ke darmiyan banta hai.
    if (!mongoose.Types.ObjectId.isValid(buyerId) || !mongoose.Types.ObjectId.isValid(factoryId)) {
      return res.status(400).json({ success: false, message: "Invalid buyer or factory id" });
    }

    const user = await User.findById(buyerId);
    if (!user) return res.status(404).json({ success: false, message: "Buyer not found" });

    const factory = await Factory.findById(factoryId);
    if (!factory) return res.status(404).json({ success: false, message: "Factory not found" });

    // Agar factory pehle se shortlist me ho to remove, warna add kar dete hain.
    const exists = user.shortlistedFactories.some(id => id.toString() === factoryId);
    if (exists) {
      user.shortlistedFactories = user.shortlistedFactories.filter(id => id.toString() !== factoryId);
    } else {
      user.shortlistedFactories.push(factoryId);
    }

    await user.save();
    await user.populate('shortlistedFactories');

    res.json({ success: true, shortlisted: user.shortlistedFactories });
  } catch (err) {
    console.error("Shortlist toggle error:", err);
    res.status(500).json({ success: false, message: err.message });
  }
});

// Buyer signup me password hash hota hai, plain password database me save nahi hota.
app.post('/api/auth/register-buyer', async (req, res) => {
  try {
    const { name, email, password, brandName } = req.body;
    
    // Email normalize karte hain taake same email different case me duplicate na ban jaye.
    const normalizedEmail = email.toLowerCase().trim();
    const existing = await User.findOne({ email: normalizedEmail });
    if (existing) return res.status(400).json({ success: false, message: "Email already exists" });

    const passwordHash = await bcrypt.hash(password, 10);

    // Buyer ka account brand name ke sath save hota hai.
    const newUser = new User({ 
      name, 
      email: normalizedEmail, 
      passwordHash, 
      role: 'buyer', 
      brandName: brandName || 'N/A'
    });
    
    await newUser.save();
    res.status(201).json({ success: true, message: "Buyer Registered" });
  } catch (err) { 
    console.error("Buyer register error:", err);
    res.status(500).json({ success: false, message: err.message }); 
  }
});

// Login me password compare hota hai aur successful login par token return hota hai.
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email: email.toLowerCase().trim() });
    if (!user) return res.status(401).json({ success: false, message: "Invalid credentials" });

    const storedPassword = user.passwordHash || '';
    // Purane plain-password users bhi login kar saken, phir unka password hash me convert ho jaye.
    const passwordMatches = storedPassword.startsWith('$2')
      ? await bcrypt.compare(password, storedPassword)
      : storedPassword === password;

    if (!passwordMatches) {
      return res.status(401).json({ success: false, message: "Invalid credentials" });
    }

    if (!storedPassword.startsWith('$2')) {
      user.passwordHash = await bcrypt.hash(password, 10);
      await user.save();
    }

    const token = createAuthToken(user);

    res.json({
      success: true,
      token,
      user: {
        id: user._id,
        role: user.role,
        factoryId: user.factoryId,
        brandName: user.brandName,
        name: user.name
      }
    });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

app.get('/api/auth/me', verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.authUser.id).select('-passwordHash');
    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    res.json({ success: true, user });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Factory catalog ka data buyer side par public showcase me dikhaya jata hai.
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

app.delete('/api/factories/:factoryId/articles/:articleId', async (req, res) => {
  try {
    const { factoryId, articleId } = req.params;
    const factory = await Factory.findById(factoryId);
    if (!factory) return res.status(404).json({ success: false, message: "Factory not found" });

    factory.uploadedArticles = factory.uploadedArticles.filter(
      article => article._id.toString() !== articleId
    );
    await factory.save();

    res.json({ success: true, uploadedArticles: factory.uploadedArticles });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Order engine me buyer proposal, manufacturer quote aur production tracking handle hoti hai.

app.post('/api/orders/proposal', async (req, res) => {
  try {
    const { buyerId, ...orderData } = req.body;
    const sampleImage = orderData.buyerArticleUrl?.trim();

    if (!sampleImage) {
      return res.status(400).json({ success: false, message: "Buyer sample image or link is required." });
    }
    
    // Buyer se brand name uthate hain taake manufacturer ko proposal me identity dikhe.
    const buyer = await User.findById(buyerId);
    
    // Buyer ki submitted image/link aur quantity ke sath naya order save hota hai.
    const newOrder = new Order({
      ...orderData,
      buyerArticleUrl: sampleImage,
      buyerId: buyerId,
      brandName: buyer ? buyer.brandName : 'Independent Retailer'
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

// Buyer jab factory profile open karta hai to specific factory ka catalog bhi milta hai.
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
      .populate('buyerId', 'brandName name')
      .exec();
    res.json({ success: true, orders });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// Buyer dashboard me newest proposals pehle dikhane ke liye orders sort hote hain.
app.get('/api/orders/buyer/:buyerId', async (req, res) => {
  try {
    const orders = await Order.find({ buyerId: req.params.buyerId })
      .sort({ createdAt: -1 })
      .populate('factoryId', 'name location')
      .exec();
    res.json({ success: true, orders });
  } catch (err) { res.status(500).json({ error: err.message }); }
});
// Factory list buyer explore page aur search feature ke liye use hoti hai.
app.get('/api/factories', async (req, res) => {
  try {
    const factories = await Factory.find({}); 
    console.log("Factories found in DB:", factories.length);
    res.json({ success: true, factories });
  } catch (err) { 
    res.status(500).json({ error: err.message }); 
  }
});
// Manufacturer yahan se quote submit karta hai ya order reject karta hai.
app.put('/api/orders/:orderId/action', async (req, res) => {
  try {
    const { status, price } = req.body;
    const updateFields = { status };
    if (price) updateFields.negotiatedPricePerUnit = price;
    
    await Order.findByIdAndUpdate(req.params.orderId, updateFields);
    res.json({ success: true });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// Accepted order ki production stage manufacturer dashboard se update hoti hai.
app.put('/api/orders/:orderId/phase', async (req, res) => {
  try {
    const { nextStage } = req.body;
    await Order.findByIdAndUpdate(req.params.orderId, { currentProductionStage: nextStage });
    res.json({ success: true });
  } catch (err) { res.status(500).json({ error: err.message }); }
});
// Buyer quote accept kare to order accepted hota hai aur contract/payment record ban jata hai.
app.put('/api/orders/:orderId/accept-price', async (req, res) => {
  try {
    const order = await Order.findByIdAndUpdate(
      req.params.orderId, 
      { status: 'accepted' }, 
      { new: true }
    );
    
    if (!order) return res.status(404).json({ message: "Order not found" });

    // Total amount quantity aur negotiated unit price se calculate hota hai.
    const total = Number(order.quantity || 0) * Number(order.negotiatedPricePerUnit || 0);
    let payment = await Payment.findOne({ orderId: order._id });

    if (!payment) {
      const installmentPlan = total >= 500000
        ? [
            { milestoneNumber: 1, description: "Advance payment on contract signing", percentage: 30, daysAfterContract: 0 },
            { milestoneNumber: 2, description: "Mid-production payment", percentage: 40, daysAfterContract: 15 },
            { milestoneNumber: 3, description: "Final payment before dispatch", percentage: 30, daysAfterContract: 30 }
          ]
        : [
            { milestoneNumber: 1, description: "Advance payment on contract signing", percentage: 50, daysAfterContract: 0 },
            { milestoneNumber: 2, description: "Final payment before dispatch", percentage: 50, daysAfterContract: 20 }
          ];

      payment = new Payment({
        orderId: order._id,
        buyerId: order.buyerId,
        factoryId: order.factoryId,
        receiptNumber: `ZMN-${Date.now().toString().slice(-6)}-${order._id.toString().slice(-4).toUpperCase()}`,
        totalAmount: total,
        paymentStatus: 'receipt_generated',
        milestones: installmentPlan.map((step) => {
          const dueDate = new Date();
          dueDate.setDate(dueDate.getDate() + step.daysAfterContract);

          return {
            milestoneNumber: step.milestoneNumber,
            description: step.description,
            percentage: step.percentage,
            amount: Math.round(total * (step.percentage / 100)),
            status: 'unpaid',
            dueDate
          };
        })
      });
      await payment.save();
    }

    res.json({ success: true, order: order, payment });
  } catch (err) { 
    res.status(500).json({ error: err.message }); 
  }
});
// Payment plan milestones me save hota hai, real gateway yahan use nahi ho raha.
app.post('/api/payments/initialize', async (req, res) => {
  try {
    const { orderId, buyerId, factoryId, totalAmount } = req.body;
    
    const milestones = [
      { milestoneNumber: 1, description: "Advance Procurement", percentage: 30, amount: totalAmount * 0.3, status: 'unpaid' },
      { milestoneNumber: 2, description: "Mid-Production", percentage: 40, amount: totalAmount * 0.4, status: 'unpaid' },
      { milestoneNumber: 3, description: "Final Dispatch", percentage: 30, amount: totalAmount * 0.3, status: 'unpaid' }
    ];

    const newPayment = new Payment({
      orderId,
      buyerId,
      factoryId,
      receiptNumber: `ZMN-${Date.now().toString().slice(-6)}`,
      totalAmount,
      milestones
    });
    await newPayment.save();
    
    res.status(201).json({ success: true, payment: newPayment });
  } catch (err) { res.status(500).json({ error: err.message }); }
});
// Ye initialize route same payment plan ko create karta hai jab frontend direct call kare.
app.post('/api/payments/initialize', async (req, res) => {
  try {
    const { orderId, buyerId, factoryId, totalAmount } = req.body;
    const milestones = [
      { milestoneNumber: 1, description: "Advance Procurement", percentage: 30, amount: totalAmount * 0.3, status: 'unpaid' },
      { milestoneNumber: 2, description: "Mid-Production", percentage: 40, amount: totalAmount * 0.4, status: 'unpaid' },
      { milestoneNumber: 3, description: "Final Dispatch", percentage: 30, amount: totalAmount * 0.3, status: 'unpaid' }
    ];
    const newPayment = new Payment({
      orderId,
      buyerId,
      factoryId,
      receiptNumber: `ZMN-${Date.now().toString().slice(-6)}`,
      totalAmount,
      milestones
    });
    await newPayment.save();
    res.status(201).json({ success: true, payment: newPayment });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// Milestone verify karne se installment ka status update hota hai.
app.put('/api/payments/verify-milestone', async (req, res) => {
  try {
    const { orderId, milestoneIndex } = req.body;
    
    const payment = await Payment.findOne({ orderId });
    if (!payment) return res.status(404).json({ message: "Payment record not found" });

    payment.milestones[milestoneIndex].status = 'paid_escrow';
    payment.milestones[milestoneIndex].paidAt = new Date();
    await payment.save();

    // Pehli installment verify ho to order production flow me accepted rahega.
    if (milestoneIndex === 0) {
      await Order.findByIdAndUpdate(orderId, { status: 'accepted' });
    }

    res.json({ success: true, message: "Milestone verified successfully" });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// Buyer contract modal me payment/contract data isi route se fetch hota hai.
app.get('/api/payments/:orderId', async (req, res) => {
  try {
    const payment = await Payment.findOne({ orderId: req.params.orderId });
    res.json({ success: true, payment });
  } catch (err) { res.status(500).json({ error: err.message }); }
});
app.put('/api/orders/:orderId/phase', async (req, res) => {
  try {
    const { nextStage } = req.body;
    await Order.findByIdAndUpdate(req.params.orderId, { currentProductionStage: nextStage });
    res.json({ success: true });
  } catch (err) { res.status(500).json({ error: err.message }); }
});
app.listen(5000, () => console.log('📡 Server Running on Port 5000'));
