import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
    fullName: { type: String, required: true },
    username: { type: String, required: true, unique: true },
    phoneNumber: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    profilePicture: { type: String }, // Фото профиля (необязательно)
    avatarUrl: { type: String, default: "" }, // Поле для аватара
    verificationCode: { type: String }, // 6-значный код верификации
    verificationExpires: { type: Date }, // Таймер для кода верификации

    isVerified: { type: Boolean, default: false }
}, { timestamps: true });

export default mongoose.model('User', UserSchema);
