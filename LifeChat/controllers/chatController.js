import Message from '../models/Message.js'
import User from '../models/User.js'

// Отправка сообщения
export const sendMessage = async (req, res) => {
  try {
    const { senderId, receiverId, text } = req.body

    const message = new Message({
      sender: senderId,
      receiver: receiverId,
      text
    })

    await message.save()
    res.status(200).json({ message: 'Message sent successfully' })
  } catch (error) {
    res.status(500).json({ error: 'Error sending message' })
  }
}

// Получение сообщений между двумя пользователями
export const getMessages = async (req, res) => {
  try {
    const { userId, otherUserId } = req.params
    const messages = await Message.find({
      $or: [
        { sender: userId, receiver: otherUserId },
        { sender: otherUserId, receiver: userId }
      ]
    }).populate('sender receiver')

    res.status(200).json(messages)
  } catch (error) {
    res.status(500).json({ error: 'Error fetching messages' })
  }
}
