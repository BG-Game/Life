import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

const MapComponent = () => {
  const [position, setPosition] = useState(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
 
  const mapRef = useRef(null); // Храним карту в useRef

  useEffect(() => {
    if (mapRef.current) return; // Если карта уже есть - выходим

    const initializeMap = () => {
      if (document.getElementById('map') && window.DG) {
        mapRef.current = DG.map('map', {
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
              mapRef.current.setView([latitude, longitude], 13);
              DG.marker([latitude, longitude])
                .addTo(mapRef.current)
                .bindPopup('Ваше местоположение');
            },
            () => {
              setPosition([54.98, 82.89]);
              mapRef.current.setView([54.98, 82.89], 13);
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
      if (mapRef.current) {
        mapRef.current.remove(); // Удаляем карту при размонтировании
        mapRef.current = null;
      }
      document.body.removeChild(script);
    };
  }, []);

 

  return (
    <div style={{ position: 'relative', height: '100vh' }}>
      {!mapLoaded && (
        <p style={{
          position: 'absolute', top: '40%', left: '59%',
          transform: 'translateX(-50%)', color: 'white',
          background: 'black', padding: '5px 10px', borderRadius: '5px'
        }}>
          Загрузка карты...
        </p>
      )}

      {/* Блок поиска */}
      <div style={{
        position: 'absolute', top: '5%', left: '59%',
        transform: 'translate(-50%, -50%)', zIndex: 999,
        backgroundColor: '#000',
        padding: '10px 15px', // Увеличенный padding для лучшего внешнего вида
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
            height: '10px', // Увеличенная высота инпута
            backgroundColor: '#000',
            color: 'white',
            borderRadius: '5px',
            outline: 'none',
            border: 'none',
            maxWidth: '350px',
            fontSize: "16px", // Увеличенный размер шрифта
            padding: "10px" // Пространство внутри инпута
          }}
        />
</div>


      {/* Карта */}
      <div id="map" style={{ height: "100%", marginLeft: "440px"}} />

     
     
    </div>
  );
};

export default MapComponent;
