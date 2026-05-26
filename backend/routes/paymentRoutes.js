import express from 'express';
const router = express.Router();

// Local model imports with explicit .js extension
import Factory from '../models/Factory.js';
import Order from '../models/Order.js';

// 1. Deploy New Catalog Article Node (Base64 Safe)
router.post('/:factoryId/articles', async (req, res) => {
  try {
    const { factoryId } = req.params;
    const { articleName, imageUrl, moq, description } = req.body;

    const factory = await Factory.findById(factoryId);
    if (!factory) {
      return res.status(404).json({ success: false, message: "Target factory node entity not found." });
    }

    factory.articles.push({ articleName, imageUrl, moq, description });
    await factory.save();

    res.status(201).json({ success: true, message: "New catalog item deployed successfully." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal server error saving catalog." });
  }
});

// 2. Fetch Active Inbound Manufacturing Requests
router.get('/orders/manufacturer/:factoryId', async (req, res) => {
  try {
    const { factoryId } = req.params;
    const orders = await Order.find({ factoryId });
    res.status(200).json({ success: true, orders });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed parsing tracking lines." });
  }
});

// 3. Submit Quotation Unit Price or Reject
router.put('/orders/:orderId/action', async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status, price } = req.body;

    const updatePayload = { status };
    if (price) updatePayload.negotiatedPricePerUnit = price;

    const updatedOrder = await Order.findByIdAndUpdate(orderId, updatePayload, { new: true });
    res.status(200).json({ success: true, updatedOrder });
  } catch (error) {
    res.status(500).json({ success: false, message: "Execution intercept failure." });
  }
});

// 4. Advance Production Floor Step State
router.put('/orders/:orderId/phase', async (req, res) => {
  try {
    const { orderId } = req.params;
    const { nextStage } = req.body;

    const updatedOrder = await Order.findByIdAndUpdate(orderId, { currentProductionStage: nextStage }, { new: true });
    res.status(200).json({ success: true, updatedOrder });
  } catch (error) {
    res.status(500).json({ success: false, message: "Could not shift stage state." });
  }
});

export default router;