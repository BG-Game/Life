
import Navbar from '../components/Navbar';
import { Outlet } from 'react-router-dom';

export const Layout = () => {
  return (
    <div className='container'>
      <Navbar />
      <Outlet /> {/* Контент будет рендериться сюда */}
    </div>
  );
};
