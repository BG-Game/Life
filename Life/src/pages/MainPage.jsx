import MapComponent from '../components/MapComponent.jsx';
import Navbar from '../components/Navbar.jsx';


export const MainPage = () => {
  return (
    <div className="container">
      <div className="mapcomponent">
        <MapComponent />
      </div>
    
      <div className="navbar">
        <Navbar />
      </div>
    </div>
  );
};

export default MainPage;