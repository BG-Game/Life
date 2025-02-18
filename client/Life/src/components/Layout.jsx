import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import "../App.css";

export const Layout = () => {
  return (
    <div className="app-container">
      <Navbar />
      <div className="main-content">
        <Outlet />
      </div>
    </div>
  );
};
