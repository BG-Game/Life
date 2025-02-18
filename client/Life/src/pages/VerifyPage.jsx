import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { verifyCode } from "../redux/features/auth/authSlice";
import axios from "../utils/axios";
import { toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { GoClock } from "react-icons/go";

export const VerifyPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { status } = useSelector((state) => state.auth);

  const [verificationCode, setVerificationCode] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [timer, setTimer] = useState(300); // Таймер (5 минут)
  const [showResend, setShowResend] = useState(false);

  useEffect(() => {
    const savedPhoneNumber = localStorage.getItem("phoneNumber");
    if (savedPhoneNumber) {
      setPhoneNumber(savedPhoneNumber);
    } else {
      toast.error("Ошибка: номер телефона не найден ");
      navigate("/register");
    }
  }, [navigate]);

  useEffect(() => {
    if (status) toast(status);
  }, [status]);

  useEffect(() => {
    if (timer === 0) {
      setShowResend(true);
    }
    const interval = setInterval(() => {
      if (timer > 0) {
        setTimer((prev) => prev - 1);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [timer]);

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (!phoneNumber) {
        toast.error("Ошибка: номер телефона отсутствует");
        return;
      }
      dispatch(verifyCode({ phoneNumber, verificationCode }));
      setVerificationCode("");
      navigate("/");
    } catch (error) {
      console.log(error);
    }
  };

  const resendCode = async () => {
    setShowResend(false);
    setTimer(300); // Сбрасываем таймер
    try {
      await axios.post("/auth/resend-code", { phoneNumber });
      toast.success("Код повторно отправлен!");
    } catch (error) {
      toast.error("Ошибка при повторной отправке кода");
    }
  };

  return (
    <div style={{
      background: "#000",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      height: "100vh",
      width: "100vw",
      overflow: "hidden",
      color: "white",
    }}>

      <img
        src="https://media.tenor.com/dcOwFuW2Fn4AAAAi/utya-telegram.gif"
        alt="GIF"
        style={{ width: "150px", height: "150px", marginBottom: "20px" }}
      />

      <form onSubmit={handleSubmit} style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        width: "100%",
        maxWidth: "300px",
        borderRadius: "10px",
        margin: "0 auto",
      }}>
        <div style={{ position: "relative", width: "100%" }}>
          <input
            type="text"
            placeholder="Введите код"
            value={verificationCode}
            onChange={(e) => setVerificationCode(e.target.value)}
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
              outline: "none",
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
            <GoClock style={{ fontSize: "18px", color: "#4B0082", strokeWidth: "2.5" }} />
            {formatTime(timer)}
          </span>
        </div>

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
          Подтвердить код
        </button>
      </form>

      {showResend && (
        <button onClick={resendCode} style={{
          width: "80%",
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
      
      <Link to="/register" style={{
        textDecoration: "none",
        color: "white",
        fontSize: "16px",
        cursor: "pointer",
        marginTop: "10px",
      }}>Вернуться назад</Link>
    </div>
  );
};
