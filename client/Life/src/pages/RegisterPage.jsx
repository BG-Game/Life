import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { registerUser, checkIsAuth } from "../redux/features/auth/authSlice";
import { toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

export const RegisterPage = () => {
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

  const handleSubmit = (e) => {
    e.preventDefault();
    try {
      dispatch(registerUser({ username, password }));
      setUsername("");
      setPassword("");
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
        src="https://media.tenor.com/X0pKdh_B72UAAAAi/telegram-duck.gif"
        alt="GIF"
        style={{
          width: "120px",
          height: "120px",
          mixBlendMode: "multiply",
          marginBottom: "20px"
        }}
      />

      <h1 style={{ fontSize: "24px", marginBottom: "20px" }}>Регистрация</h1>

      {/* onSubmit висит на форме */}
      <form onSubmit={handleSubmit} style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        width: "100%",
        maxWidth: "300px",
        borderRadius: "10px",
        margin: "0 auto",
      }}>
        <input
          type="text"
          placeholder="Логин"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
          style={{
            width: "100%",
            padding: "12px",
            marginBottom: "10px",
            borderRadius: "5px",
            border: "none",
            fontSize: "16px"
          }}
        />
        <input
          type="password"
          placeholder="Пароль"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          style={{
            width: "100%",
            padding: "12px",
            marginBottom: "10px",
            borderRadius: "5px",
            border: "none",
            fontSize: "16px"
          }}
        />

        {/* Кнопка без onClick, но с type="submit" */}
        <button type="submit" style={{
          width: "110%",
          padding: "12px",
          borderRadius: "5px",
          border: "none",
          backgroundColor: "white",
          color: "#4682B4",
          fontSize: "18px",
          cursor: "pointer"
        }}>
          Зарегистрироваться
        </button>

        <Link to="/login" style={{
          textDecoration: "none",
          color: "white",
          fontSize: "18px",
          cursor: "pointer",
          marginTop: "10px"
        }}>Уже зарегистрированы?</Link>
      </form>
    </div>
  );
};

