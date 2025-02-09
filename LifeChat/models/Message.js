import mongoose from 'mongoose';

const MessageSchema = new mongoose.Schema({
  sender: { type: String, required: true },
  recipient: { type: String, required: true },
  message: { type: String, required: true },
}, { timestamps: true });

export default mongoose.model('Message', MessageSchema);
