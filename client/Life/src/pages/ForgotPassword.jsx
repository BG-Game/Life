import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "../utils/axios";
import PhoneInput from "react-phone-number-input";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "react-phone-number-input/style.css"; // Стили для PhoneInput
import '../../src/register.css'
import { GoClock } from "react-icons/go";


export const ForgotPassword = () => {
  const navigate = useNavigate();
  const [phoneNumber, setPhoneNumber] = useState("");
  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [step, setStep] = useState(1);
  const [error, setError] = useState(null);
  const [timer, setTimer] = useState(0); // Таймер
  const [showResend, setShowResend] = useState(false);

  // Начать таймер по нажатию на кнопку "Отправить код"
  const sendVerificationCode = async () => {
    if (!phoneNumber) {
      toast.error("Введите номер телефона!");
      return;
    }

    try {
      setError(null);
      await axios.post("/auth/send-reset-code", { phoneNumber });
      setStep(2);
      setTimer(300); // Устанавливаем таймер на 5 минут (300 секунд)
      setShowResend(false); // Скрываем кнопку повторной отправки
    } catch (error) {
      setError("Ошибка отправки кода. Проверьте номер телефона.");
    }
  };

  // Таймер
  useEffect(() => {
    if (timer === 0) {
      setShowResend(true); // Показываем кнопку для повторной отправки, когда таймер истечет
    }
    const interval = setInterval(() => {
      if (timer > 0) {
        setTimer(prev => prev - 1);
      }
    }, 1000);

    return () => clearInterval(interval); // Очистка таймера при размонтировании компонента
  }, [timer]);

  // Форматируем таймер в виде "mm:ss"
  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
  };

  // 2️⃣ Подтверждение кода из SMS
  const verifyCode = async () => {
    if (!code) {
      toast.error("Введите код из SMS!");
      return;
    }

    try {
      setError(null);
      await axios.post("/auth/verify-reset-code", { phoneNumber, code });
      setStep(3);
    } catch (error) {
      setError("Неверный код. Попробуйте снова.");
    }
  };

  // 3️⃣ Установка нового пароля
  const resetPassword = async () => {
    if (!newPassword) {
      toast.error("Введите новый пароль!");
      return;
    }

    try {
      setError(null);
      await axios.post("/auth/reset-password", { phoneNumber, newPassword });
      toast.success("Пароль успешно изменен!");
      navigate("/login");
    } catch (error) {
      setError("Ошибка смены пароля. Попробуйте позже.");
    }
  };

  // Повторная отправка кода
  const resendCode = () => {
    setShowResend(false);
    setTimer(300); // Сброс таймера
    sendVerificationCode(); // Отправка нового кода
  };

  return (
    <div style={{
      background: "#000", // Черный фон
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      height: "100vh",
      width: "100vw",
      overflow: "hidden",
      color: "white", // Белый цвет текста
    }}>

      <img
        src="https://media.tenor.com/X0pKdh_B72UAAAAi/telegram-duck.gif"
        alt="GIF"
        style={{
          width: "130px",
          height: "130px",
          marginBottom: "20px"
        }}
      />

      {error && <p style={{ color: "red" }}>{error}</p>}

      <div style={{
       display: "flex",
       flexDirection: "column",
       alignItems: "center",
       width: "100%",
       maxWidth: "280px",
      
       padding: "20px",
       borderRadius: "10px",
        
      }}>

        {/* 1️⃣ Ввод номера телефона */}
        {step === 1 && (
          <>
            <p style={{ fontSize: "16px", marginBottom: "10px" }}>Введите ваш номер телефона:</p>
            <PhoneInput
          placeholder="Phone number"
          value={phoneNumber}
          onChange={setPhoneNumber}
          defaultCountry="RU"
          international
          required
          style={{
            width: "92%",
            padding: "12px",
            marginBottom: "10px",
            borderRadius: "20px",
            border: "none",
            backgroundColor: "#333",
            color: "white",
            fontSize: "16px",
          }}
          
        />
            <button onClick={sendVerificationCode} style={{
             width: "100%",
             padding: "12px",
             borderRadius: "5px",
             border: "none",
             backgroundColor: "#151719",
             color: "#4B0082",
             fontSize: "22px",
             cursor: "pointer",
            }}>
              Отправить код
            </button>
          </>
        )}

        {/* 2️⃣ Ввод кода из SMS */}
        {step === 2 && (
          <>
            <p style={{ fontSize: "16px", marginBottom: "10px" }}>Введите код из SMS:</p>
            <div style={{ position: "relative", width: "100%" }}>
            
            

<input
  type="text"
  placeholder="Введите код"
  value={code}
  onChange={(e) => setCode(e.target.value)}
  required
  style={{
    width: "92%",
    padding: "12px",
    marginBottom: "10px",
    borderRadius: "20px",
    border: "none",
    backgroundColor: "#333",
    color: "white",
    fontSize: "16px",
    outline: "none", // Убираем стандартную обводку
    
  }}
  onFocus={(e) => (e.target.style.border = "2px solid #4B0082")}
  onBlur={(e) => (e.target.style.border = "none")}
/>
<span
  style={{
    position: "absolute",
    right: "15px",
    top: "40%",
    transform: "translateY(-50%)",
    display: "flex",
    alignItems: "center",
    gap: "5px",
    color: "#aaa",
    fontSize: "14px",
  }}
>
  {/* Иконка часов */}
  <GoClock style={{ fontSize: "18px", color: "#4B0082", strokeWidth: "2.5" }} />
  {formatTime(timer)}
</span>
</div>




            <button onClick={verifyCode} style={{
              width: "100%",
              padding: "12px",
              borderRadius: "5px",
              border: "none",
              backgroundColor: "#151719",
              color: "#4B0082",
              fontSize: "22px",
              cursor: "pointer",
            }}>
              Подтвердить
            </button>

          
            {showResend && (
              <button onClick={resendCode} style={{
                width: "80%", // Кнопка теперь короче
                padding: "10px",
                borderRadius: "5px",
                border: "none",
                backgroundColor: "#000",
                color: "#fff",
                fontSize: "16px",
                cursor: "pointer",
                fontWeight: "bold",
                marginTop: "20px",
              }}>
                Отправить код повторно
              </button>
            )}
          </>
        )}

        {/* 3️⃣ Ввод нового пароля */}
        {step === 3 && (
          <>
            <p style={{ fontSize: "16px", marginBottom: "10px" }}>Введите новый пароль:</p>
            <input
              type="password"
              placeholder="New password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              style={{
                width: "92%",
                padding: "12px",
                marginBottom: "10px",
                borderRadius: "20px",
                border: "none",
                backgroundColor: "#333",
                color: "white",
                fontSize: "16px",
              }}
            />
            <button onClick={resetPassword} style={{
              width: "80%", // Кнопка теперь короче
              padding: "10px",
              borderRadius: "5px",
              border: "none",
              backgroundColor: "#000",
              color: "#fff",
              fontSize: "16px",
              cursor: "pointer",
              fontWeight: "bold",
              marginTop: "10px"
            }}>
              Сохранить пароль
            </button>
          </>
        )}

        {/* Ссылка для возврата на страницу входа */}
        <Link to="/login" style={{
          textDecoration: "none",
          color: "white",
          fontSize: "16px",
          cursor: "pointer",
          marginTop: "10px",
        }}>Вернуться назад</Link>

      </div>
    </div>
  );
};
