import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const MapComponent = () => {
  const [position, setPosition] = useState(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const initializeMap = () => {
      if (document.getElementById('map') && window.DG) {
        const map = DG.map('map', {
          center: [54.98, 82.89],
          zoom: 13,
          styles: [
            { "elementType": "geometry", "stylers": [{ "color": "#212121" }] },
            { "elementType": "labels.icon", "stylers": [{ "visibility": "off" }] },
            { "elementType": "labels.text.fill", "stylers": [{ "color": "#757575" }] },
            { "elementType": "labels.text.stroke", "stylers": [{ "color": "#212121" }] },
            { "featureType": "road", "elementType": "geometry", "stylers": [{ "color": "#3e3e3e" }] },
            { "featureType": "road.highway", "elementType": "geometry", "stylers": [{ "color": "#1f1f1f" }] },
            { "featureType": "water", "elementType": "geometry", "stylers": [{ "color": "#000000" }] }
          ]
        });

        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            (pos) => {
              const { latitude, longitude } = pos.coords;
              setPosition([latitude, longitude]);
              map.setView([latitude, longitude], 13);
              DG.marker([latitude, longitude])
                .addTo(map)
                .bindPopup('Ваше местоположение');
            },
            () => {
              setPosition([54.98, 82.89]);
              map.setView([54.98, 82.89], 13);
            }
          );
        }

        setMapLoaded(true);
      } else {
        console.error('Ошибка: контейнер #map не найден');
      }
    };

    const script = document.createElement('script');
    script.src = "https://maps.api.2gis.ru/2.0/loader.js?pkg=full";
    script.async = true;
    script.onload = () => {
      DG.then(initializeMap);
    };

    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, [searchQuery]);

  const handleLogout = () => {
    localStorage.removeItem("token"); // Удаляем токен
    sessionStorage.removeItem("user"); // Можно удалить данные пользователя
    navigate("/login"); // Перенаправление на страницу логина
    window.location.reload(); // Перезагружаем страницу, чтобы `Navbar` обновился
  };

  return (
    <div style={{ position: 'relative', height: '100vh' }}>
      {!mapLoaded && <p>Загрузка карты...</p>}

      {/* Блок поиска по центру */}
      <div style={{
        position: 'absolute', top: '5%', left: '50%', 
        transform: 'translate(-50%, -50%)', zIndex: 999, 
        backgroundColor: '#2d3c4a',
        padding: '5px 15px',
        borderRadius: '5px',
        display: 'flex',
        alignItems: 'center',
        width: '60%',
        maxWidth: '450px',
      }}>
        <input
          id="map-search"
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Поиск по карте"
          style={{
            width: '80%',
            height: '100%',
            maxHeight: '350px',
            backgroundColor: '#2d3c4a',
            color: 'white',
            borderRadius: '5px',
            outline: 'none',
            border: 'none',
            maxWidth: '350px',
          }}
        />
        <button 
          onClick={() => handleSearch()}
          style={{
            padding: '10px 15px', 
            cursor: 'pointer', 
            borderRadius: '5px', 
            backgroundColor: 'grey', 
            color: 'white', 
            border: 'none',
            marginLeft: 'auto',
          }}
        >
          S
        </button>
      </div>

      {/* Карта */}
      <div id="map" style={{ width: "100%", height: "100%" }} />

      {/* Кнопка выхода */}
      <button 
        style={{
          position: 'absolute',
          top: '70px',
          right: '5px',
          backgroundColor: '#ff4d4d',
          color: 'white',
          padding: '10px 15px',
          borderRadius: '100px',
          cursor: 'pointer',
          border: 'none',
        }}
        onClick={handleLogout}
      >
        Log Out
      </button>
    </div>
  );
};

export default MapComponent;
