import { Router } from 'express';
import User from '../models/User.js';

const router = new Router();

router.get('/search', async (req, res) => {
    try {
        const { query } = req.query;

        if (!query) {
            return res.status(400).json({ message: "Введите имя пользователя" });
        }

        const users = await User.find({
            username: { $regex: query, $options: "i" } // Поиск без учета регистра
        }).select('username fullName');

        res.json(users);
    } catch (error) {
        console.error("Ошибка поиска пользователей:", error);
        res.status(500).json({ message: "Ошибка поиска" });
    }
});

export default router;
