import React, { useEffect, useRef } from 'react';
import { MapContainer, Marker, Popup, TileLayer, useMap } from 'react-leaflet';
import L from "leaflet";
import { useParams } from 'react-router-dom';

// Composant pour gérer le zoom automatique
const ZoomToMarker = ({ position }) => {
  const map = useMap();

  useEffect(() => {
    if (position) {
      map.flyTo(position, 16, {
        duration: 1, // Durée de l'animation en secondes
        easeLinearity: 0.25
      });
    }
  }, [position, map]);

  return null;
};

// Configuration des icônes
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

const Location = () => {
    const { latitude, longitude } = useParams();
    const mapRef = useRef();
    
    const defaultPosition = [33.5731, -7.5898]; // Casablanca
    
    const position = [
        latitude ? parseFloat(latitude) : defaultPosition[0],
        longitude ? parseFloat(longitude) : defaultPosition[1]
    ];

    const isValidPosition = (
        position[0] >= -90 && position[0] <= 90 &&
        position[1] >= -180 && position[1] <= 180
    );

    const finalPosition = isValidPosition ? position : defaultPosition;

    return (
        <div className="map-container" style={{ 
            width: '100%', 
            height: '600px',
            borderRadius: '8px',
            overflow: 'hidden',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}>
            <MapContainer 
                center={finalPosition} 
                zoom={13} 
                scrollWheelZoom={true}
                style={{ height: '100%', width: '100%' }}
                ref={mapRef}
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <Marker position={finalPosition}>
                    <Popup>
                        Restaurant Location <br />
                        Latitude: {finalPosition[0].toFixed(4)} <br />
                        Longitude: {finalPosition[1].toFixed(4)}
                    </Popup>
                </Marker>
                <ZoomToMarker position={finalPosition} />
            </MapContainer>
        </div>
    );
};

export default Location;