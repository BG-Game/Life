import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

export const checkAuth = (req, res, next) => {
    console.log("🔍 Проверка авторизации...");

    console.log("📜 Заголовки запроса:", req.headers);
    console.log("📌 Заголовок Authorization:", req.headers.authorization);

    const authHeader = req.headers.authorization;
    if (!authHeader) {
        console.log("❌ Нет доступа: заголовок Authorization отсутствует");
        return res.status(403).json({ message: 'Нет доступа (заголовок отсутствует)' });
    }

    const token = authHeader.split(" ")[1];
    if (!token) {
        console.log("❌ Нет доступа: токен не найден");
        return res.status(403).json({ message: 'Нет доступа (токен не найден)' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log("🔑 Расшифрованный токен:", decoded);

        if (!decoded.id) {
            console.log("❌ Ошибка авторизации: ID пользователя отсутствует в токене");
            return res.status(403).json({ message: 'Нет доступа (некорректный токен)' });
        }

        req.userId = decoded.id;
        console.log("✅ Авторизован, ID пользователя:", req.userId);
        next();
    } catch (error) {
        console.log("❌ Ошибка авторизации: токен неверный или просрочен", error.message);
        return res.status(403).json({ message: 'Нет доступа (токен неверный или просрочен)' });
    }
};
