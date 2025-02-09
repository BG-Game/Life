import express from 'express';
import User from '../models/User.js';

const router = express.Router();

// Маршрут для поиска пользователей по имени
router.get('/search', async (req, res) => {
  const { name } = req.query;

  try {
    // Ищем пользователей по имени (независимо от регистра)
    const users = await User.find({
      username: { $regex: name, $options: 'i' },
    }).select('username'); // Возвращаем только поле username

    res.json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
});

export default router;
