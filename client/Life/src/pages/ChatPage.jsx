import { useState, useEffect } from 'react';
import axios from 'axios';
import { io } from 'socket.io-client';
import '../ChatPage.css'; // Импортируем стили для чата

// Создаем подключение к серверу через Socket.IO
const socket = io('http://localhost:3005'); // Убедитесь, что сервер работает на этом порту

const ChatPage = () => {
  const [messages, setMessages] = useState([]); // Состояние для сообщений
  const [newMessage, setNewMessage] = useState(''); // Состояние для нового сообщения
  const [searchQuery, setSearchQuery] = useState(''); // Состояние для поиска в списке пользователей
  const [users, setUsers] = useState([]); // Состояние для списка пользователей

  const [selectedUser, setSelectedUser] = useState(null); // Храним выбранного пользователя для чата

  // Эффект для получения списка пользователей из базы данных
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        // Запрос на получение пользователей с совпадением имени
        const response = await axios.get(`http://localhost:3005/api/users/search?name=${searchQuery}`);
        setUsers(response.data); // Сохраняем пользователей в состояние
      } catch (err) {
        console.error(err);
      }
    };

    if (searchQuery.length > 0) {
      fetchUsers(); // Если есть введенный запрос, загружаем пользователей
    }
  }, [searchQuery]);

  // Эффект для прослушивания новых сообщений через сокеты
  useEffect(() => {
    socket.on('receive_message', (message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    return () => {
      socket.off('receive_message');
    };
  }, []);

  const sendMessage = () => {
    if (newMessage.trim() && selectedUser) {
      const messageData = {
        sender: 'user1', // Замените на реальный идентификатор пользователя
        recipient: selectedUser,
        message: newMessage,
      };

      socket.emit('send_message', messageData);
      setMessages((prevMessages) => [...prevMessages, messageData]); // Добавляем отправленное сообщение в чат

      setNewMessage('');
    }
  };

  return (
    <div className="chat-container">
      <div className="chat-sidebar">
        <input
          type="text"
          placeholder="Поиск пользователей..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)} // Обновляем строку поиска
        />
        <div className="user-list">
          {users.map((user, index) => (
            <div
              className="user-item"
              key={index}
              onClick={() => setSelectedUser(user.username)} // Устанавливаем выбранного пользователя
            >
              {user.username}
            </div>
          ))}
        </div>
      </div>

      <div className="chat-main">
        <div className="chat-header">
          <h2>Чат с {selectedUser || 'Выберите пользователя'}</h2>
        </div>
        <div className="chat-messages">
          {messages.map((message, index) => (
            <div className={`chat-message ${message.sender === 'user1' ? 'sent' : 'received'}`} key={index}>
              <strong>{message.sender}:</strong> <p>{message.message}</p>
            </div>
          ))}
        </div>
        <div className="chat-footer">
          <input
            type="text"
            placeholder="Введите сообщение..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)} // Обновляем новое сообщение
          />
          <button onClick={sendMessage}>Отправить</button>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
