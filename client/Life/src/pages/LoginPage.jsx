import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { checkIsAuth, loginUser } from "../redux/features/auth/authSlice";
import { toast } from "react-toastify";

export const LoginPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const isAuth = useSelector(checkIsAuth);
  const { status } = useSelector((state) => state.auth);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    if (status) toast(status);
    if (isAuth) navigate("/");
  }, [status, isAuth, navigate]);

  const handleLogin = (e) => {
    e.preventDefault();
    try {
      dispatch(loginUser({ username, password }));
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
        src="https://media.tenor.com/nme8dFrh7sIAAAAi/telegram-utya-telegram-duck.gif"
        alt="GIF"
        style={{
          width: "130px",
          height: "130px",
          marginBottom: "20px"
        }}
      />

      <h1 style={{ fontSize: "24px", marginBottom: "20px" }}>Login</h1>

      <form onSubmit={handleLogin} style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        width: "100%",
        maxWidth: "300px",
        borderRadius: "10px",
        margin: "0 auto",
      }}>
        <input type="text" placeholder="@username" value={username} onChange={(e) => setUsername(e.target.value)} required style={{
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
        onBlur={(e) => (e.target.style.border = "none")} />
        <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required style={{
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
        onBlur={(e) => (e.target.style.border = "none")} />

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
          Войти
        </button>

        {/* Ссылка для восстановления пароля */}
        <Link to="/forgot-password" style={{
          textDecoration: "none",
          color: "#ffffff",
          fontSize: "16px",
          marginTop: "5px",
          cursor: "pointer",
          transition: "color 0.3s"
        }}>
          Забыли пароль?
        </Link>

        {/* Кнопка для перехода на страницу регистрации */}
        <Link to="/register" style={{
          textDecoration: "none",
          color: "white",
          fontSize: "18px",
          cursor: "pointer",
          marginTop: "10px"
        }}>
          Регистрация
        </Link>
      </form>
    </div>
  );
};
