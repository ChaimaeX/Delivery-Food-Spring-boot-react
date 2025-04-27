import React, { useEffect, useRef, useState } from "react";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import L from "leaflet";
import "leaflet-routing-machine";
import "leaflet-routing-machine/dist/leaflet-routing-machine.css";
import { IconButton, Typography, Box, Fab, CircularProgress, Alert } from "@mui/material";
import GpsFixedIcon from "@mui/icons-material/GpsFixed";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useLocation, useNavigate } from "react-router-dom";
import { useGeolocated } from 'react-geolocated';

// Configuration des icônes Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

const RoutingControl = ({ map, start, end }) => {
  useEffect(() => {
    if (!map || !start || !end) return;

    // Vérification des coordonnées
    if (!Array.isArray(start) || !Array.isArray(end)) return;
    if (start.some(isNaN) || end.some(isNaN)) return;

    const control = L.Routing.control({
      waypoints: [
        L.latLng(start[0], start[1]),
        L.latLng(end[0], end[1])
      ],
      router: L.Routing.osrmv1({
        serviceUrl: 'https://router.project-osrm.org/route/v1',
        timeout: 10000
      }),
      lineOptions: {
        styles: [{ 
          color: '#FF6B00',
          weight: 6,
          opacity: 1
        }]
      },
      show: false,
      addWaypoints: false,
      fitSelectedRoutes: true
    }).addTo(map);

    return () => {
      map.removeControl(control);
    };
  }, [map, start, end]);

  return null;
};

const DeliveryMap = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const mapRef = useRef(null);

  const clientPosition = state?.deliveryAddress
    ? [state.deliveryAddress.latitude, state.deliveryAddress.longitude]
    : null;

  const { coords, isGeolocationAvailable, isGeolocationEnabled } = useGeolocated({
    positionOptions: { enableHighAccuracy: true },
    userDecisionTimeout: 15000,
  });

  const [userPosition, setUserPosition] = useState(null);
  const [distance, setDistance] = useState(0);
  const [mapInitialized, setMapInitialized] = useState(false);
  const [routeDistance, setRouteDistance] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [routeCalculating, setRouteCalculating] = useState(false);

  useEffect(() => {
    if (coords) {
      const newPos = [coords.latitude, coords.longitude];
      setUserPosition(newPos);
      setLoading(false);
    }
  }, [coords]);

  useEffect(() => {
    if (userPosition && clientPosition) {
      const newDistance = calculateDistance(userPosition, clientPosition);
      setDistance(newDistance);
    }
  }, [userPosition, clientPosition]);

  const centerMap = () => {
    if (mapRef.current && userPosition) {
      mapRef.current.flyTo(userPosition, 16);
    }
  };
  

  const handleRouteFound = (distance) => {
    setRouteDistance(distance);
    setError(null);
    setRouteCalculating(false);
  };

  const handleRouteError = () => {
    setError("Impossible de calculer l'itinéraire");
    setRouteDistance(null);
    setRouteCalculating(false);
  };

  const areCoordinatesValid = (coords) => {
    return (
      Array.isArray(coords) &&
      coords.length === 2 &&
      !isNaN(coords[0]) &&
      !isNaN(coords[1])
    );
  };

  if (!clientPosition) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <Alert severity="error">Adresse du client non disponible</Alert>
      </Box>
    );
  }

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
        <Typography sx={{ ml: 2 }}>Chargement de la position...</Typography>
      </Box>
    );
  }
  console.log("Position utilisateur:", userPosition);
  console.log("Position client:", clientPosition);
  return (
    <Box sx={{ height: "100vh", width: "100%", position: "relative" }}>
      {/* Header */}
      <Box sx={{
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
        p: 1,
        bgcolor: "white",
        boxShadow: 2,
        display: "flex",
        alignItems: "center"
      }}>
        <IconButton onClick={() => navigate(-1)} sx={{ color: "#FF6B00" }}>
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h6" sx={{ ml: 1, fontSize: "1.1rem", color: "#333" }}>
          Livraison vers {state?.deliveryAddress?.streetAddress || "Client"}
        </Typography>
      </Box>

      {/* Carte */}
      <MapContainer
        center={clientPosition}
        zoom={15}
        style={{ height: "100%", width: "100%" }}
        whenCreated={(map) => {
          mapRef.current = map;
          setMapInitialized(true);
        }}
        zoomControl={false}
        dragging={true}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        />
        
        {userPosition && (
          <Marker position={userPosition}>
            <Popup>Votre position actuelle</Popup>
          </Marker>
        )}
        
        <Marker position={clientPosition}>
          <Popup>Destination client</Popup>
        </Marker>

        {mapInitialized && userPosition && clientPosition && 
          areCoordinatesValid(userPosition) && 
          areCoordinatesValid(clientPosition) && (
            <RoutingControl 
              map={mapRef.current} 
              start={userPosition} 
              end={clientPosition}
              onRouteFound={handleRouteFound}
              onRouteError={handleRouteError}
            />
        )}
      </MapContainer>

      <Fab
        color="primary"
        sx={{ 
          position: "absolute", 
          bottom: 90, 
          right: 16,
          backgroundColor: "#FF6B00",
          "&:hover": { backgroundColor: "#E55C00" }
        }}
        onClick={centerMap}
      >
        <GpsFixedIcon />
      </Fab>

      {userPosition && (
        <Box sx={{
          position: "absolute",
          bottom: 16,
          left: 16,
          right: 16,
          bgcolor: "white",
          p: 2,
          borderRadius: 2,
          boxShadow: 3,
          zIndex: 1000,
          borderTop: "3px solid #FF6B00"
        }}>
          <Typography variant="body2" sx={{ fontWeight: "bold", mb: 0.5 }}>
            {state?.deliveryAddress?.streetAddress || "Destination client"}
          </Typography>
          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            <Typography variant="caption" sx={{ color: "#666" }}>
              Distance à vol d'oiseau: {distance} km
            </Typography>
            <Typography variant="caption" sx={{ 
              color: distance > 0.5 ? "#FF6B00" : "#4CAF50",
              fontWeight: "bold"
            }}>
              {distance > 0.5 ? "En route" : "Arrivé!"}
            </Typography>
          </Box>
          
          {routeCalculating && !routeDistance && !error && (
            <Typography variant="caption" sx={{ color: "#FF6B00", display: "block", mt: 1 }}>
              Calcul de l'itinéraire en cours...
            </Typography>
          )}
          
          {routeDistance && (
            <Typography variant="caption" sx={{ color: "#666", display: "block", mt: 1 }}>
              Distance par la route: {routeDistance} km
            </Typography>
          )}
          
          {error && (
            <Typography variant="caption" sx={{ color: "error.main", display: "block", mt: 1 }}>
              {error}
            </Typography>
          )}
        </Box>
      )}

      {error && (
        <Alert severity="error" sx={{ position: "absolute", top: 60, left: 10, right: 10, zIndex: 1000 }}>
          {error}
        </Alert>
      )}
    </Box>
  );
};

function calculateDistance(pos1, pos2) {
  if (!pos1 || !pos2) return 0;
  
  const R = 6371;
  const [lat1, lon1] = pos1;
  const [lat2, lon2] = pos2;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return (R * c).toFixed(2);
}

export default DeliveryMap;