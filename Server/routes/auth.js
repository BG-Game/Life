import { Router } from 'express';
import { register, login, getMe } from '../controllers/auth.js';
import { verifyCode, sendResetCode, verifyResetCode, resetPassword } from '../controllers/authController.js';
import { checkAuth } from "../utils/checkAuth.js";
import userSearchRoute from './userSearch.js';
import User from '../models/User.js';
import { uploadAvatar } from "../controllers/auth.js";
import multer from "multer";

const router = new Router();

// 🔹 Настройка Multer для загрузки файлов
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/avatars/"); // Папка, куда сохраняются файлы
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    },
});

const upload = multer({ storage });

// 🔹 Маршрут для загрузки аватара (только для авторизованных пользователей)
router.post("/upload-avatar", checkAuth, upload.single("avatar"), uploadAvatar);

// 🔹 Регистрация
router.post('/register', register);

// 🔹 Логин
router.post('/login', login);

// 🔹 Получить информацию о текущем пользователе
router.get('/me', checkAuth, async (req, res) => {
    try {
        const user = await User.findById(req.userId).select('fullName username');
        if (!user) {
            return res.status(404).json({ message: 'Пользователь не найден' });
        }
        res.json(user);
    } catch (error) {
        console.error("Ошибка получения данных пользователя:", error);
        res.status(500).json({ message: 'Ошибка сервера' });
    }
});

// 🔹 Верификация кода (для входа и регистрации)
router.post('/verify', verifyCode);

// 🔹 Восстановление пароля
router.post('/send-reset-code', sendResetCode); // Отправка кода на телефон
router.post('/verify-reset-code', verifyResetCode); // Подтверждение кода
router.post('/reset-password', resetPassword); // Смена пароля

// 🔹 Применяем маршрут для поиска пользователей
router.use('/users', userSearchRoute);

export default router;
