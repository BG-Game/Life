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
      background: "#4682B4",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      height: "100vh",
      width: "100vw",
      overflow: "hidden",
    }}>
      
      <img 
        src="https://media.tenor.com/nme8dFrh7sIAAAAi/telegram-utya-telegram-duck.gif"
        alt="GIF"
        style={{
          width: "120px",
          height: "120px",
          mixBlendMode: "multiply",
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
        <input type="text" placeholder="Логин" value={username} onChange={(e) => setUsername(e.target.value)} required style={{
          width: "100%",
          padding: "12px",
          marginBottom: "10px",
          borderRadius: "5px",
          border: "none",
          fontSize: "16px"
        }} />
        <input type="password" placeholder="Пароль" value={password} onChange={(e) => setPassword(e.target.value)} required style={{
          width: "100%",
          padding: "12px",
          marginBottom: "10px",
          borderRadius: "5px",
          border: "none",
          fontSize: "16px"
        }} />

        <button type="submit" style={{
          width: "110%",
          padding: "12px",
          borderRadius: "5px",
          border: "none",
          marginBottom: "10px",
          backgroundColor: "white",
          color: "#4682B4",
          fontSize: "18px",
          cursor: "pointer"
        }}>
          Войти
        </button>

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
