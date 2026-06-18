import express from 'express';
const router = express.Router();
import Message from '../models/Message.js';

// Dono users ke darmiyan purani chat messages time order me fetch hoti hain.
router.get('/thread/:userId/:partnerId', async (req, res) => {
  try {
    const { userId, partnerId } = req.params;

    const conversation = await Message.find({
      $or: [
        { senderId: userId, receiverId: partnerId },
        { senderId: partnerId, receiverId: userId }
      ]
    }).sort({ createdAt: 1 });

    res.status(200).json({ success: true, conversation });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Chat logs sequence retrieval failure." });
  }
});

// Naya message save hota hai aur phir frontend ko same message wapas milta hai.
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
