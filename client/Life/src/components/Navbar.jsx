import { useState, useEffect, useMemo, useRef } from 'react';
import { useNavigate, useLocation, NavLink } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUser, logout } from '../redux/features/auth/authSlice.js';
import axios from '../utils/axios';
import '../../src/navbar.css';
import '../../src/tab.css';
import { IoChatbubbles } from 'react-icons/io5';
import { FaMapLocation } from "react-icons/fa6";
import { FaPlay } from "react-icons/fa";
import { GrSettingsOption } from "react-icons/gr";
import Tabs from "./Tabs"; // Подключаем вкладки
import { FaPen } from "react-icons/fa6";
import { GrTasks } from "react-icons/gr";
import { IoIosNotifications } from "react-icons/io";
import { IoMdSearch } from "react-icons/io";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const detailsRef = useRef(null);
  const profileRef = useRef(null);

  const isAuth = useMemo(() => !!localStorage.getItem("token"), [location]);
  const { user, isLoading } = useSelector((state) => state.auth);

  const defaultAvatar = "https://avatars.mds.yandex.net/i?id=7ef97ab140e472d108012c816abf09d9_l-8438673-images-thumbs&n=13";
  
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const [isProfileVisible, setIsProfileVisible] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState(user?.avatarUrl || defaultAvatar);

  // 🔹 Обновляем `avatarPreview`, если изменяется `user?.avatarUrl`
  useEffect(() => {
    if (user?.avatarUrl) {
      const fullAvatarUrl = user.avatarUrl.startsWith("/")
        ? `${window.location.origin}${user.avatarUrl}`
        : user.avatarUrl;

      setAvatarPreview(fullAvatarUrl);
    } else {
      setAvatarPreview(defaultAvatar);
    }
  }, [user?.avatarUrl]);

  useEffect(() => {
    if (!isAuth && location.pathname !== '/login') {
      navigate('/login');
    }
  }, [isAuth, navigate, location.pathname]);

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setSearchResults([]);
      setShowResults(false);
      return;
    }

    const fetchUsers = async () => {
      try {
        const { data } = await axios.get(`/users/search?query=${searchQuery}`);
        setSearchResults(data);
        setShowResults(true);
      } catch (error) {
        console.error("Ошибка поиска пользователей:", error);
      }
    };

    fetchUsers();
  }, [searchQuery]);

  useEffect(() => {
    if (isAuth) {
      dispatch(fetchUser());
    }
  }, [dispatch, isAuth]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsProfileVisible(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  const toggleProfileVisibility = () => {
    setIsProfileVisible(!isProfileVisible);
    setIsMenuOpen(false);
  };

  const toggleMenu = () => {
    setIsMenuOpen((prev) => !prev);
  };

  const handleMenuItemClick = () => {
    setIsMenuOpen(false);
    if (detailsRef.current) {
      detailsRef.current.removeAttribute("open"); // Закрываем details вручную
    }
  };

  // 🔹 Загрузка нового аватара
  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("avatar", file);

    try {
        const token = localStorage.getItem("token");
        const { data } = await axios.post("/auth/upload-avatar", formData, {
            headers: {
                "Content-Type": "multipart/form-data",
                Authorization: `Bearer ${token}`,
            },
        });

        if (data.avatarUrl) {
            console.log("🔄 Новый аватар:", data.avatarUrl);
            setAvatarPreview(`http://localhost:3002${data.avatarUrl}`); // Сразу обновляем
            dispatch(fetchUser()); // Обновляем пользователя в Redux
        }
    } catch (error) {
        console.error("Ошибка загрузки фото:", error.response ? error.response.data : error.message);
    }
};


const fullAvatarUrl = avatarPreview
    ? avatarPreview.replace("http://localhost:5173", "http://localhost:3002") // Исправляем, если URL от фронта
    : "https://avatars.mds.yandex.net/i?id=7ef97ab140e472d108012c816abf09d9_l-8438673-images-thumbs&n=13";




    useEffect(() => {
      if (user?.avatarUrl) {
          setAvatarPreview(`http://localhost:3002${user.avatarUrl}`);
      }
  }, []);
  



  return (
    <nav className="navbar">
      <details ref={detailsRef} open={isMenuOpen}>
        <summary onClick={toggleMenu}></summary>
        <nav className={`menu ${isMenuOpen ? "open" : ""}`}>
          <div className="profile" style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <img
  src={avatarPreview}
  alt="Profile"
  style={{
    width: "50px",
    height: "50px",
    borderRadius: "50%",
    objectFit: "cover",
    padding:"20px",
    backgroundImage: `url(${window.location.origin}${avatarPreview})`
  }}
/>


            <div>
              <p style={{ margin: 0, fontWeight: "bold", color: "#fff" }}>
                {isLoading ? "Загрузка..." : user?.fullName || "Неизвестно"}
              </p>
              <p style={{ margin: 0, fontSize: "14px", color: "#aaa" }}>
                {isLoading ? "Загрузка..." : `@${user?.username || "Неизвестно"}`}
              </p>
            </div>
          </div>
          <a href="#link" onClick={() => { toggleProfileVisibility(); handleMenuItemClick(); }}>
            Мой профиль
          </a>
          <a href="#link" onClick={handleMenuItemClick}>Настройки</a>
          <a href="#link" onClick={handleMenuItemClick}>Сменить тему</a>
          <button
            onClick={() => { handleLogout(); handleMenuItemClick(); }}
            className="navbar-link"
            style={{ color: "red", border: "none", cursor: "pointer" }}
          >
            Log out
          </button>
        </nav>
      </details>


      {isProfileVisible && (
  <>
  {/* Затемненный и размытый фон */}
  <div 
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        backgroundColor: "rgba(0, 0, 0, 0.65)", // Затемнение
        backdropFilter: "blur(2px)", // Легкий блур
        zIndex: 9998,
      }}
      onClick={() => setIsProfileVisible(false)} // Закрытие при клике на фон
    ></div>
    <div
      ref={profileRef}
      style={{
        position: "fixed",
        top: "44%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        backgroundColor: "#1c1c1c",
        borderRadius: "15px",
        boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
        zIndex: "9999",
        width: "30%",
        height: "auto",
       
        textAlign: "left",
        color: "white",
      }}
    >
      {/* Иконка редактирования в верхнем правом углу */}
  <div style={{
    position: "absolute",
    top: "10px",
    right: "10px",
    cursor: "pointer",
    backgroundColor: "#333",
    borderRadius: "50%",
    padding: "6px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center"
  }}>
    <FaPen size={14} color="white" />
  </div>
     {/* Блок с фото профиля и кнопкой загрузки */}
<div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "20px" }}>
  {/* Аватар и кнопка загрузки */}
  <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
    <div style={{ position: "relative" }}>
    <img
  src={fullAvatarUrl?.startsWith("/") 
    ? `http://localhost:3002${avatarPreview}` 
    : avatarPreview} 
  alt="Аватар" 
  style={{
    maxWidth: "80px",
    minWidth:"80px",
    minHeight:"80px",
    maxHeight: "80px",
    borderRadius: "50%",
    objectFit: "cover",
    
  }}
/>


<label htmlFor="fileInput"
                  style={{
                    position: "absolute",
                    bottom: "5px",
                    right: "5px",
                    width: "25px",
                    height: "25px",
                    borderRadius: "50%",
                    backgroundColor: "#fff",
                    color: "black",
                    fontSize: "18px",
                    fontWeight: "bold",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center"
                  }}>
                  +
                </label>
                <input id="fileInput" type="file" accept="image/*" style={{ display: "none" }} onChange={handleFileChange} />

    </div>

    {/* Информация о пользователе */}
    <div>
      <p style={{ fontSize: "18px", fontWeight: "bold", marginBottom: "5px" }}>
        {isLoading ? "Загрузка..." : user?.fullName || "Неизвестно"}
      </p>
      <p style={{ fontSize: "14px", color: "#aaa", marginBottom: "10px" }}>
        {isLoading ? "Загрузка..." : `@${user?.username || "Неизвестно"}`}
      </p>
    </div>
  </div>

  {/* Блок подписок */}
  <div style={{ display: "flex", gap: "30px", textAlign: "center", marginRight:"50px" }}>
    <div>
      <p style={{ fontSize: "16px", fontWeight: "bold", marginBottom: "2px" }}>
        9
      </p>
      <p style={{ fontSize: "12px", color: "#aaa" }}>публикации</p>
    </div>
    <div>
      <p style={{ fontSize: "16px", fontWeight: "bold", marginBottom: "2px" }}>
        109
      </p>
      <p style={{ fontSize: "12px", color: "#aaa" }}>подписчики</p>
    </div>
    <div>
      <p style={{ fontSize: "16px", fontWeight: "bold", marginBottom: "2px" }}>
        271
      </p>
      <p style={{ fontSize: "12px", color: "#aaa" }}>подписки</p>
    </div>
  </div>
</div>

{/* Описание профиля */}
<div style={{ marginBottom:"20px", padding: "0 20px" }}>
  <p style={{ fontSize: "14px", color: "#aaa" }}>Описание</p>
</div>

<div className="mega-line" style={{
  borderBottom:"1px solid rgba(0, 0, 0, 0.6)",
  width:"70%",
  display:"flex",
  margin:"auto"
}}></div>

     

      {/* Используем Tabs */}
      <Tabs
        tabs={[
          {
            label: "Фото",
            content: (
              <div className="tab-content">
                <div className="profile-lent"><img src="../assets/image/1.jpg" alt="Фото 1" /></div>
                <div className="profile-lent"><img src="../assets/image/2.jpg" alt="Фото 2" /></div>
                <div className="profile-lent"><img src="../assets/image/3.jpg" alt="Фото 3" /></div>
                <div className="profile-lent"><img src="../assets/image/4.jpg" alt="Фото 4" /></div>
                <div className="profile-lent"><img src="../assets/image/5.jpg" alt="Фото 5" /></div>
                <div className="profile-lent"><img src="../assets/image/6.jpg" alt="Фото 6" /></div>
                <div className="profile-lent"><img src="../assets/image/7.jpg" alt="Фото 7" /></div>
                <div className="profile-lent"><img src="../assets/image/8.jpg" alt="Фото 8" /></div>
                <div className="profile-lent"><img src="../assets/image/9.jpg" alt="Фото 9" /></div>
              </div>
            )
          },
          { label: "Видео", content: <div className="tab-content">Содержимое 2</div> },
          { label: "Истории", content: <div className="tab-content">Содержимое 3</div> },
        ]}
      />
    </div>
  </>
)}

    


      <div className="search-container">
      
        <input
          type="text"
          placeholder="Поиск в Жизни..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="search-input"
        />
        <IoMdSearch style={{
          right:"80px",
          color: "#4B0082",
          fontSize:"26px",
          position:"absolute"
        }}/>
        <IoIosNotifications
    style={{
      color: "#555",
      fontSize: "26px",
      cursor: "pointer",
      transition: "0.3s",
      marginLeft:"15px"
    }}
  />
      </div>

      <ul className="nav-links">
        <li>
          <NavLink to="/" onClick={handleMenuItemClick}>
            <FaMapLocation /> Map
          </NavLink>
        </li>
        <li>
          <NavLink to="/chat" onClick={handleMenuItemClick}>
            <IoChatbubbles /> Chat
          </NavLink>
        </li>
        <li>
          <NavLink to="/new" onClick={handleMenuItemClick}>
            <FaPlay /> Video
          </NavLink>
        </li>
        <li>
          <NavLink to="/settings" onClick={handleMenuItemClick}>
            <GrTasks /> Subscriptions
          </NavLink>
        </li>
        <li>
          <NavLink to="/settings" onClick={handleMenuItemClick}>
            <GrSettingsOption /> Еще че-то
          </NavLink>
        </li>
      </ul>

      <div className="search-divider"></div>

      {showResults && (
        <div className="search-results">
          {searchResults.length > 0 ? (
            searchResults.map(user => (
              <div key={user._id} className="search-item">
                <img src="https://goo.su/aHe4COe" alt="Profile" />
                <div className="user-info">
                  <span className="user-name">{user.fullName}</span>
                </div>
              </div>
            ))
          ) : (
            <div style={{
              display: "flex",
              flexDirection: "column", 
              justifyContent: "center", 
              alignItems: "center", 
              width: "90%", 
              height: "100vh", 
              textAlign: "center"
            }}>
              <img 
                src="https://media.tenor.com/h796J-dd0FUAAAAi/utya-utya-duck.gif" 
                style={{
                  width: "100px",
                  height: "100px",
                  objectFit: "cover"
                }} 
              />
              <p style={{ marginTop: "10px", fontSize: "18px", color: "white" }}>
                пользователь не найден
              </p>
            </div>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
