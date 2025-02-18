import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { registerUser } from "../redux/features/auth/authSlice"; // Экшен для регистрации
import PhoneInput from 'react-phone-number-input';
import { toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import 'react-phone-number-input/style.css'; // Стили для PhoneInput
import '../../src/register.css'

export const RegisterPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const isAuth = useSelector((state) => state.auth.token);
  const { status } = useSelector((state) => state.auth);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");

  useEffect(() => {
    if (status) toast(status);
    if (isAuth) navigate("/"); // Если уже авторизован, редирект на главную
  }, [status, isAuth, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!phoneNumber) {
      toast.error("Ошибка: номер телефона отсутствует!");
      return;
    }

    console.log("Отправляем данные на сервер:", { username, password, fullName, phoneNumber });

    try {
      await dispatch(registerUser({ username, password, fullName, phoneNumber }));

      // Проверяем, есть ли номер телефона
      if (phoneNumber) {
        localStorage.setItem("phoneNumber", phoneNumber);
        console.log("Сохраненный номер телефона в localStorage:", localStorage.getItem("phoneNumber"));
        navigate("/verify"); // Переход на страницу ввода кода
      } else {
        toast.error("Ошибка: не удалось сохранить номер телефона.");
      }
    } catch (error) {
      console.log(error);
    }
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
        src="https://media.tenor.com/RT_oYjFjo0MAAAAi/utya-utya-duck.gif"
        alt="GIF"
        style={{
          width: "130px",
          height: "130px",
          marginBottom: "20px",
        }}
      />
    
      <form onSubmit={handleSubmit} style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        width: "100%",
        maxWidth: "280px",
       
        padding: "20px",
        borderRadius: "10px",
      }}>
        <input
          type="text"
          placeholder="Full name"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
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
        <input
          type="text"
          placeholder="@username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
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
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
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
            outline: "none", // Убираем стандартную обводку
    
          }}
         
          
        />
    
        <button type="submit" style={{
          width: "100%",
          padding: "12px",
          borderRadius: "5px",
          border: "none",
          backgroundColor: "#151719",
          color: "#4B0082",
          fontSize: "22px",
          cursor: "pointer",
        }}>
          Start Life
        </button>


    
        <Link to="/login" style={{
          textDecoration: "none",
          color: "white",
          fontSize: "14px",
          marginTop: "10px",
        }}>Уже зарегистрированы?</Link>
      </form>
    </div>
  );
};
