import dotenv from 'dotenv';
dotenv.config();

/**
 * Отправка SMS через SMS.ru
 * @param {string} phone - Номер телефона (например, "79123456789")
 * @param {string} code - Код подтверждения
 * @param {string} operator - Оператор связи (например, "MTS", "Megafon", "Beeline") (опционально)
 * @returns {boolean} - Успешна ли отправка SMS
 */
export const sendVerificationSMS = async (phone, code, operator = '') => {
    const apiId = process.env.SMS_API_ID;
    
    if (!apiId) {
        console.error('❌ Ошибка: API-ключ SMS.ru не найден!');
        return false;
    }

    // Формируем URL с параметрами
    const url = `https://sms.ru/sms/send?api_id=${apiId}&to=${phone}&msg=Код: ${code}&json=1${operator ? `&op=${operator}` : ''}`;

    try {
        const response = await fetch(url);
        const data = await response.json();

        console.log('📩 Ответ от SMS.ru:', data);

        if (data.status !== "OK") {
            console.error("❌ Ошибка при отправке SMS:", data.status_text);
            return false;
        }

        return true;
    } catch (error) {
        console.error('⚠️ Ошибка при отправке SMS:', error.message);
        return false;
    }
};
