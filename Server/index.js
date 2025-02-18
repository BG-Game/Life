import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import authRoutes from './routes/auth.js';
import userSearchRoutes from './routes/userSearch.js';

const app = express();
dotenv.config();

const PORT = process.env.PORT || 3002;
const DB_USER = process.env.DB_USER;
const DB_PASSWORD = process.env.DB_PASSWORD;
const DB_NAME = process.env.DB_NAME;

// Middleware
app.use(cors());
app.use(express.json());


app.use(express.json()); // Позволяет серверу читать JSON из body
app.use("/uploads", express.static("uploads")); // Даем доступ к загруженным файлам


// Routes
app.use('/api/auth', authRoutes); // Аутентификация, регистрация, восстановление пароля
app.use('/api/users', userSearchRoutes); // Поиск пользователей

async function start() {
    try {
        await mongoose.connect(
            `mongodb+srv://${DB_USER}:${DB_PASSWORD}@cluster0.u5huw.mongodb.net/${DB_NAME}?retryWrites=true&w=majority&appName=Cluster0`
        );
        app.listen(PORT, () => console.log(`Server started on port: ${PORT}`));
    } catch (error) {
        console.error("Ошибка подключения к базе данных:", error);
    }
}

start();
