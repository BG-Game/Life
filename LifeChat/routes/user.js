import express from 'express';
import User from '../models/User.js';

const router = express.Router();

// Получить всех пользователей
router.get('/', async (req, res) => {
  try {
    const users = await User.find({}, 'username'); // Возвращаем только username
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: 'Ошибка при получении пользователей' });
  }
});

export default router;
