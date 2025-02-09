// routes/chat.js
import { Router } from 'express';
import Chat from '../models/Message.js';

const router = Router();

// Создание или поиск чата между двумя пользователями
router.get('/chat', async (req, res) => {
  const { user1, user2 } = req.query;
  try {
    const chat = await Chat.findOne({
      users: { $all: [user1, user2] } // Ищем чат между двумя пользователями
    });

    if (chat) {
      return res.json(chat); // Если чат найден, возвращаем его
    } else {
      const newChat = new Chat({
        users: [user1, user2],
        messages: []
      });
      await newChat.save();
      return res.json(newChat); // Если чат не найден, создаем новый и возвращаем
    }
  } catch (error) {
    console.error(error);
    return res.status(500).send('Server Error');
  }
});

// Добавление сообщения в чат
router.post('/chat/:chatId', async (req, res) => {
  const { message, sender } = req.body;
  const chatId = req.params.chatId;
  try {
    const chat = await Chat.findById(chatId);
    if (!chat) return res.status(404).send('Chat not found');
    
    chat.messages.push({ sender, message });
    await chat.save();
    
    return res.json(chat); // Возвращаем обновленный чат
  } catch (error) {
    console.error(error);
    return res.status(500).send('Server Error');
  }
});

export default router;
