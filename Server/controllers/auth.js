import { Router } from "express"; // Добавлен Router для маршрутов
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import multer from "multer";
import sharp from "sharp";
import fs from "fs";
import path from "path";
import User from "../models/User.js";
import { sendVerificationSMS } from "../utils/smsService.js";
import { checkAuth } from "../utils/checkAuth.js"; // Проверка авторизации

const router = Router(); // Создаем объект роутера

// 🔹 Регистрация пользователя
export const register = async (req, res) => {
    try {
        const { fullName, username, phoneNumber, password } = req.body;

        console.log("Получены данные для регистрации:", req.body);

        const existingUser = await User.findOne({ $or: [{ username }, { phoneNumber }] });
        if (existingUser) {
            return res.status(400).json({ message: "Имя пользователя или номер уже заняты" });
        }

        const salt = bcrypt.genSaltSync(10);
        const hash = bcrypt.hashSync(password, salt);

        const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();

        const newUser = new User({
            fullName,
            username,
            phoneNumber,
            password: hash,
            verificationCode,
            isVerified: false,
            avatarUrl: "",
        });

        await newUser.save();
        console.log("Пользователь зарегистрирован:", newUser);

        const smsSent = await sendVerificationSMS(phoneNumber, verificationCode);
        if (!smsSent) {
            return res.status(500).json({ message: "Ошибка при отправке SMS" });
        }

        res.status(200).json({ message: "Код подтверждения отправлен на ваш номер" });
    } catch (error) {
        console.error("Ошибка при регистрации:", error);
        res.status(500).json({ message: "Ошибка при регистрации", error: error.message });
    }
};

// 🔹 Логин пользователя
export const login = async (req, res) => {
    try {
        console.log("Данные из фронтенда при логине:", req.body);

        const { username, password } = req.body;
        console.log("Ищем пользователя с username:", username);

        const user = await User.findOne({ username: new RegExp(`^${username}$`, "i") });

        if (!user) {
            console.log("Пользователь не найден в базе!");
            return res.status(400).json({ message: "Такого юзера не существует." });
        }

        console.log("Найден пользователь:", user);

        if (!user.isVerified) {
            return res.status(403).json({ message: "Ваш аккаунт не верифицирован. Подтвердите код из SMS." });
        }

        const isPasswordCorrect = await bcrypt.compare(password, user.password);
        if (!isPasswordCorrect) {
            console.log("Неверный пароль");
            return res.status(400).json({ message: "Неверный пароль." });
        }

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "30d" });

        res.json({ token, user, message: "Вы вошли в систему." });
    } catch (error) {
        console.error("Ошибка при авторизации:", error);
        res.status(500).json({ message: "Ошибка при авторизации.", error: error.message });
    }
};

// 🔹 Получить информацию о текущем пользователе
export const getMe = async (req, res) => {
    try {
        const user = await User.findById(req.userId).select("fullName username avatarUrl");

        if (!user) {
            return res.status(404).json({ message: "Пользователь не найден" });
        }

        res.json(user);
    } catch (error) {
        res.status(500).json({ message: "Ошибка сервера" });
    }
};

// 🔹 Верификация кода пользователя
export const verifyCode = async (req, res) => {
    try {
        console.log("Полученные данные для верификации:", req.body);

        const { phoneNumber, code } = req.body;
        console.log("Ищем пользователя с номером телефона:", phoneNumber);

        const user = await User.findOne({ phoneNumber });

        if (!user) {
            return res.status(404).json({ message: "Пользователь не найден" });
        }

        if (user.verificationCode !== code) {
            return res.status(400).json({ message: "Неверный код" });
        }

        await User.updateOne({ phoneNumber }, { $set: { isVerified: true, verificationCode: null } });

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "30d" });

        res.status(200).json({ token, message: "Верификация прошла успешно" });
    } catch (error) {
        console.error("Ошибка при проверке кода:", error);
        res.status(500).json({ message: "Ошибка при проверке кода", error: error.message });
    }
};

// 🔹 Настройка Multer для загрузки аватаров
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/avatars/");
    },
    filename: (req, file, cb) => {
        const fileExt = file.originalname.split(".").pop();
        cb(null, `${Date.now()}-avatar.${fileExt}`);
    }
});

// 🔹 Ограничение форматов и размера (13MB)
const fileFilter = (req, file, cb) => {
    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error("Неверный формат файла. Разрешены только JPG, PNG, WEBP"), false);
    }
};

const upload = multer({
    storage,
    fileFilter,
    limits: { fileSize: 13 * 1024 * 1024 }
});

// 🔹 API для загрузки аватара
const uploadAvatar = async (req, res) => {
    try {
        console.log("Получен запрос на загрузку аватара");
        console.log("Файл:", req.file); // Должен быть объект с информацией о файле
        console.log("Тело запроса:", req.body); // Должно быть пустым или содержать данные

        const userId = req.userId;

        if (!req.file) {
            return res.status(400).json({ message: "Файл не загружен" });
        }

        const tempPath = req.file.path;
        const outputPath = `uploads/avatars/${Date.now()}-compressed.webp`;

        await sharp(tempPath)
            .resize(512, 512)
            .toFormat("webp")
            .toFile(outputPath);

            await sharp(tempPath)
            .resize(512, 512)
            .toFormat("webp")
            .toFile(outputPath)
            .then(() => fs.unlinkSync(tempPath)) // Удаляем файл ТОЛЬКО после успешного преобразования
            .catch((err) => console.error("Ошибка при удалении временного файла:", err));
        

        const avatarUrl = `/${outputPath}`;

        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { avatarUrl },
            { new: true }
        );
        
        console.log("Обновлённый аватар URL:", updatedUser.avatarUrl);
        

        if (!updatedUser) {
            return res.status(404).json({ message: "Пользователь не найден" });
        }

        res.json({ avatarUrl });
    } catch (error) {
        console.error("Ошибка при загрузке аватара:", error);
        res.status(500).json({ message: "Ошибка сервера" });
    }
};



// 🔹 Добавляем роут для загрузки аватара
router.post("/upload-avatar", checkAuth, upload.single("avatar"), uploadAvatar);

export { uploadAvatar };
