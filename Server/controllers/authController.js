import User from '../models/User.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { sendVerificationSMS } from '../utils/smsService.js';
import dotenv from 'dotenv';

dotenv.config();

/**
 * 📌 Верификация кода при регистрации и входе
 */
export const verifyCode = async (req, res) => {
    try {
        const { phoneNumber, code } = req.body;

        // Ищем пользователя по номеру телефона
        const user = await User.findOne({ phoneNumber });

        if (!user) {
            return res.status(404).json({ message: 'Пользователь не найден' });
        }

        // Проверяем срок действия кода
        if (!user.verificationCode || user.verificationExpires < new Date()) {
            return res.status(400).json({ message: "Код истек. Запросите новый." });
        }

        // Проверяем правильность кода
        if (user.verificationCode !== code) {
            return res.status(400).json({ message: 'Неверный код' });
        }

        // Код верный — обновляем статус верификации
        user.isVerified = true;
        user.verificationCode = null;
        user.verificationExpires = null;
        await user.save();

        // Генерируем JWT токен
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '30d' });

        res.status(200).json({ token, message: 'Верификация прошла успешно' });
    } catch (error) {
        console.error("Ошибка при проверке кода:", error);
        res.status(500).json({ message: 'Ошибка сервера' });
    }
};

/**
 * 📌 1️⃣ Отправка кода для восстановления пароля через SMS.ru
 */
export const sendResetCode = async (req, res) => {
    try {
        const { phoneNumber } = req.body;
        console.log("📩 Запрос на отправку кода:", phoneNumber);

        // Проверяем, зарегистрирован ли номер в БД
        const user = await User.findOne({ phoneNumber });
        if (!user) {
            return res.status(400).json({ message: "Этот номер не зарегистрирован" });
        }

        // Генерируем 6-значный код
        const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
        console.log(`✅ Сгенерирован код ${verificationCode} для ${phoneNumber}`);

        // Устанавливаем срок действия кода (5 минут)
        const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

        // Сохраняем код и срок в `User.js`
        user.verificationCode = verificationCode;
        user.verificationExpires = expiresAt;
        await user.save();

        // Отправляем код через `sendVerificationSMS`
        const smsSuccess = await sendVerificationSMS(phoneNumber, verificationCode);
        if (!smsSuccess) {
            return res.status(500).json({ message: "Ошибка отправки SMS" });
        }

        res.json({ message: "Код отправлен" });
    } catch (error) {
        console.log("❌ Ошибка при отправке кода:", error);
        res.status(500).json({ message: "Ошибка сервера" });
    }
};

/**
 * 📌 2️⃣ Подтверждение кода для восстановления пароля
 */
export const verifyResetCode = async (req, res) => {
    try {
        const { phoneNumber, code } = req.body;
        console.log(`📩 Проверяем код ${code} для ${phoneNumber}`);

        // Ищем пользователя
        const user = await User.findOne({ phoneNumber });
        if (!user) {
            return res.status(400).json({ message: "Пользователь не найден" });
        }

        // Проверяем срок действия кода
        if (!user.verificationCode || user.verificationExpires < new Date()) {
            return res.status(400).json({ message: "Код истек. Запросите новый." });
        }

        // Проверяем правильность кода
        if (user.verificationCode !== code) {
            return res.status(400).json({ message: "Неверный код" });
        }

        res.json({ message: "Код подтвержден" });
    } catch (error) {
        console.log("❌ Ошибка при проверке кода:", error);
        res.status(500).json({ message: "Ошибка сервера" });
    }
};

/**
 * 📌 3️⃣ Смена пароля
 */
export const resetPassword = async (req, res) => {
    try {
        const { phoneNumber, newPassword } = req.body;
        console.log(`🔑 Смена пароля для ${phoneNumber}`);

        // Хешируем новый пароль
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        // Обновляем пароль пользователя и удаляем verificationCode
        const user = await User.findOneAndUpdate(
            { phoneNumber },
            { password: hashedPassword, verificationCode: null, verificationExpires: null }, 
            { new: true }
        );

        if (!user) {
            return res.status(400).json({ message: "Пользователь не найден" });
        }

        res.json({ message: "Пароль успешно изменён" });
    } catch (error) {
        console.log("❌ Ошибка при смене пароля:", error);
        res.status(500).json({ message: "Ошибка сервера" });
    }
};
