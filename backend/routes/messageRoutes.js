import express from 'express';
const router = express.Router();
import Message from '../models/Message.js';

// 1. GET: Fetch conversation thread between two user entity nodes
router.get('/thread/:userId/:partnerId', async (req, res) => {
  try {
    const { userId, partnerId } = req.params;

    // Dono side ki chats filter out karne k liye logic queries mapping
    const conversation = await Message.find({
      $or: [
        { senderId: userId, receiverId: partnerId },
        { senderId: partnerId, receiverId: userId }
      ]
    }).sort({ createdAt: 1 }); // Sorted raw sequentially 

    res.status(200).json({ success: true, conversation });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Chat logs sequence retrieval failure." });
  }
});

// 2. POST: Dispatch/Save new chat string record
router.post('/send', async (req, res) => {
  try {
    const { senderId, receiverId, messageText } = req.body;

    if (!messageText.trim()) {
      return res.status(400).json({ success: false, message: "Empty data node context." });
    }

    const newMessage = new Message({ senderId, receiverId, messageText });
    await newMessage.save();

    res.status(201).json({ success: true, message: newMessage });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Message routing broadcast failure." });
  }
});

export default router;