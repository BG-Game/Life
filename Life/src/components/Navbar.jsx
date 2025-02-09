import { useEffect, useState } from 'react';
import { useNavigate, useLocation, NavLink } from 'react-router-dom';
import '../../src/navbar.css';
import { IoChatbubbles } from 'react-icons/io5';
import { FaMapLocation } from "react-icons/fa6";
import { FaPlay } from "react-icons/fa";
import { GrSettingsOption } from "react-icons/gr";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isAuth] = useState(!!localStorage.getItem("token"));

  useEffect(() => {
    if (!isAuth && location.pathname !== '/login') {
      navigate('/login'); // Если не авторизован и не на логине, отправляем на /login
    }
  }, [isAuth, navigate, location.pathname]);

  if (!isAuth) return null; // Если не авторизован, скрываем Navbar

  return (
    <nav>
      <ul>
        <li>
          <NavLink to="/">
            <FaMapLocation />
          </NavLink>
        </li>
        <li>
          <NavLink to="/chat">
            <IoChatbubbles />
          </NavLink>
        </li>
        <li>
          <NavLink to="/new">
            <FaPlay />
          </NavLink>
        </li>
        <li>
          <NavLink to="/id">
            <GrSettingsOption />
          </NavLink>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;



