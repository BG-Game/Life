import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import http from 'http';
import { Server } from 'socket.io';

import userSearchRoute from './routes/userSearch.js';  // Импортируйте маршрут поиска пользователей

// Инициализация Express приложения
const app = express();
dotenv.config();

const PORT = process.env.PORT || 3005;
const DB_USER = process.env.DB_USER;
const DB_PASSWORD = process.env.DB_PASSWORD;
const DB_NAME = process.env.DB_NAME;

// Создание HTTP сервера для интеграции с Socket.IO
const server = http.createServer(app);

// Инициализация Socket.IO
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
});

app.use(cors());
app.use(express.json());

// Подключаем маршруты
app.use('/api/users', userSearchRoute); // Маршрут для поиска пользователей

// Обработка подключения через Socket.IO
io.on('connection', (socket) => {
  console.log('A user connected');

  socket.on('send_message', (data) => {
    console.log('Message received: ', data);
    io.emit('receive_message', data); // Отправка сообщения всем клиентам
  });

  socket.on('disconnect', () => {
    console.log('A user disconnected');
  });
});

// Подключение к MongoDB
async function start() {
  try {
    await mongoose.connect(
      `mongodb+srv://${DB_USER}:${DB_PASSWORD}@cluster0.u5huw.mongodb.net/${DB_NAME}?retryWrites=true&w=majority&appName=Cluster0`
    );
    server.listen(PORT, () => console.log(`server started on port: ${PORT}`));
  } catch (error) {
    console.log(error);
  }
}

start();
