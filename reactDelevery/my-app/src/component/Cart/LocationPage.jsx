import React, { useEffect, useState, useRef } from 'react';
import { MapContainer, Marker, Popup, TileLayer, useMap } from 'react-leaflet';
import L from "leaflet";
import "leaflet-control-geocoder/dist/Control.Geocoder.css";
import "leaflet-control-geocoder";
import { useGeolocated } from 'react-geolocated';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Typography, Box, CircularProgress, Alert } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import "../../DeliveryComponent/OrderDetails/RoutingLocation.css";
import { findCart } from '../State/Cart/Action';

// Configuration des icônes
const DefaultIcon = L.icon({
  iconUrl: "/marker-icon.png",
  iconSize: [25, 41],
  iconAnchor: [10, 41],
  popupAnchor: [2, -40],
});

const CurrentLocationIcon = L.icon({
  iconUrl: "/marker-icon.png",
  iconSize: [30, 45],
  iconAnchor: [15, 45],
  popupAnchor: [2, -40],
});

L.Marker.prototype.options.icon = DefaultIcon;

const DEFAULT_LATITUDE = 33.8814;
const DEFAULT_LONGITUDE = 5.5550;

const LocationMap = ({ 
  setSelectedLocation, 
  setAddress, 
  selectedLocation,
  userLocation,
  onPositionSelected // Nouvelle prop
}) => {
  const map = useMap();
  const markerRef = useRef(null);
  const userMarkerRef = useRef(null);
  const dispatch = useDispatch();
  const jwt = localStorage.getItem("jwt");

  useEffect(() => {
  // Charger d'abord depuis le localStorage si disponible
  const localCart = localStorage.getItem('cart');
  if (localCart) {
    dispatch({ type: 'FIND_CART_SUCCESS', payload: JSON.parse(localCart) });
  }
  
  // Puis faire la requête API pour mettre à jour
  dispatch(findCart({jwt}));
}, [dispatch, jwt]);
 
  
  useEffect(() => {
    if (userLocation) {
      if (userMarkerRef.current) {
        userMarkerRef.current.setLatLng([userLocation.latitude, userLocation.longitude]);
      } else {
        userMarkerRef.current = L.marker(
          [userLocation.latitude, userLocation.longitude],
          { icon: CurrentLocationIcon }
        )
        .addTo(map)
        .bindPopup("Votre position actuelle")
        .openPopup();
      }
    }

    const handleMapClick = async (e) => {
      const { lat, lng } = e.latlng;
      setSelectedLocation({ latitude: lat, longitude: lng });
      
      if (markerRef.current) {
        markerRef.current.setLatLng([lat, lng]);
      } else {
        markerRef.current = L.marker([lat, lng]).addTo(map);
      }
      
      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
        );
        const data = await response.json();
        
        if (data.address) {
          const addr = data.address;
          setAddress({
            road: addr.road || "",
            city: addr.city || addr.town || addr.village || "",
            state: addr.state || addr.region || "",
            country: addr.country || "",
            postcode: addr.postcode || "",
            displayName: data.display_name || "Adresse sélectionnée"
          });
          
          markerRef.current.bindPopup(data.display_name).openPopup();
          onPositionSelected(); // Appel de la fonction de callback
        }
      } catch (error) {
        console.error("Erreur de géocodage:", error);
        markerRef.current.bindPopup("Position sélectionnée").openPopup();
      }
    };
    
    map.on('click', handleMapClick);
    
    const geocoder = L.Control.geocoder({
      defaultMarkGeocode: false,
      placeholder: "Rechercher une adresse...",
    })
    .on('markgeocode', function(e) {
      const { center, name, properties } = e.geocode;
      setSelectedLocation({
        latitude: center.lat,
        longitude: center.lng
      });
      
      if (markerRef.current) {
        markerRef.current.setLatLng(center);
      } else {
        markerRef.current = L.marker(center).addTo(map);
      }
      
      if (properties.address) {
        setAddress({
          road: properties.address.road || "",
          city: properties.address.city || properties.address.town || "",
          state: properties.address.state || "",
          country: properties.address.country || "",
          postcode: properties.address.postcode || "",
          displayName: name || "Adresse recherchée"
        });
        markerRef.current.bindPopup(name).openPopup();
        onPositionSelected(); // Appel de la fonction de callback
      }
      
      map.setView(center, map.getZoom());
    })
    .addTo(map);

    return () => {
      map.off('click', handleMapClick);
      map.removeControl(geocoder);
    };
  }, [map, setSelectedLocation, setAddress, userLocation, onPositionSelected]);

  return null;
};

const MyLocation = () => {
  const navigate = useNavigate();
  const { cart, auth } = useSelector(state => state);
  const confirmButtonRef = useRef(null); // Réf pour le bouton de confirmation
  
  // Configuration géolocalisation
  const { coords, isGeolocationAvailable, isGeolocationEnabled } = useGeolocated({
    positionOptions: {
      enableHighAccuracy: true,
      maximumAge: 0,
      timeout: 15000
    },
    userDecisionTimeout: 10000
  });

  const [selectedLocation, setSelectedLocation] = useState({
    latitude: DEFAULT_LATITUDE,
    longitude: DEFAULT_LONGITUDE
  });
  
  const [userLocation, setUserLocation] = useState(null);
  const [address, setAddress] = useState(null);
  const [loading, setLoading] = useState({
    geolocation: false,
    submission: false
  });
  const [error, setError] = useState(null);

  // Fonction pour scroller vers le bouton de confirmation
  const scrollToConfirmButton = () => {
    if (confirmButtonRef.current) {
      confirmButtonRef.current.scrollIntoView({ 
        behavior: 'smooth',
        block: 'nearest'
      });
    }
  };

  useEffect(() => {
    if (coords) {
      const newUserLocation = {
        latitude: coords.latitude,
        longitude: coords.longitude
      };
      setUserLocation(newUserLocation);
      setSelectedLocation(newUserLocation);
    }
  }, [coords]);

  const handleUseCurrentLocation = async () => {
    setError(null);
    setLoading(prev => ({ ...prev, geolocation: true }));

    try {
      let position;
      
      if (isGeolocationAvailable && isGeolocationEnabled) {
        position = await new Promise((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(
            resolve,
            reject,
            { enableHighAccuracy: true, timeout: 15000 }
          );
        });
      } else {
        throw new Error("Géolocalisation non disponible");
      }

      const newPos = {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude
      };
      
      setUserLocation(newPos);
      setSelectedLocation(newPos);
      
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${newPos.latitude}&lon=${newPos.longitude}`
      );
      const data = await response.json();
      
      if (data.address) {
        const addr = data.address;
        setAddress({
          road: addr.road || "",
          city: addr.city || addr.town || addr.village || "",
          state: addr.state || addr.region || "",
          country: addr.country || "",
          postcode: addr.postcode || "",
          displayName: data.display_name || "Votre position actuelle"
        });
        scrollToConfirmButton(); // Scroll après avoir obtenu l'adresse
      }
    } catch (error) {
      console.error("Erreur:", error);
      setError("Impossible d'obtenir votre position");
    } finally {
      setLoading(prev => ({ ...prev, geolocation: false }));
    }
  };

  const handleConfirmLocation = async () => {
    if (!address) {
      setError("Veuillez sélectionner une adresse");
      return;
    }

    setLoading(prev => ({ ...prev, submission: true }));
    setError(null);
    
    try {
      if (!cart.cartItems?.length) {
        throw new Error("Votre panier est vide");
      }

      const restaurant = cart.cartItems[0]?.food?.restaurant;
      if (!restaurant?.id) {
        throw new Error("Restaurant introuvable");
      }

      const deliveryData = {
        streetAddress: address.road || "Adresse non spécifiée",
        city: address.city || "",
        stateProvince: address.state || "",
        country: address.country || "Morocco",
        pincode: address.postcode || "",
        latitude: selectedLocation.latitude,
        longitude: selectedLocation.longitude,
        displayName: address.displayName || ""
      };

      navigate("/cart", { 
        state: { 
          deliveryData,
          restaurantId: restaurant.id,
          userId: auth.user?.id 
        } 
      });
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(prev => ({ ...prev, submission: false }));
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom>
        Sélectionnez votre adresse de livraison
      </Typography>
      
      <Typography variant="body1" gutterBottom>
        Cliquez sur la carte ou utilisez la recherche pour sélectionner une adresse
      </Typography>
      
      {!isGeolocationAvailable && (
        <Alert severity="warning">
          La géolocalisation n'est pas disponible sur votre appareil
        </Alert>
      )}
      
      {!isGeolocationEnabled && (
        <Alert severity="info">
          Activez la géolocalisation pour utiliser votre position actuelle
        </Alert>
      )}

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
        <Button
          variant="outlined"
          onClick={handleUseCurrentLocation}
          disabled={loading.geolocation}
          startIcon={loading.geolocation ? <CircularProgress size={20} /> : null}
        >
          {loading.geolocation ? "Localisation..." : "Utiliser ma position"}
        </Button>
      </Box>

      <Box sx={{ 
        height: '500px', 
        width: '100%', 
        mb: 2, 
        borderRadius: 2, 
        overflow: 'hidden',
        boxShadow: 3
      }}>
        <MapContainer 
          center={[selectedLocation.latitude, selectedLocation.longitude]} 
          zoom={13} 
          style={{ height: '100%', width: '100%' }}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          <LocationMap 
            setSelectedLocation={setSelectedLocation} 
            setAddress={setAddress}
            selectedLocation={selectedLocation}
            userLocation={userLocation}
            onPositionSelected={scrollToConfirmButton} // Passage de la fonction de callback
          />
        </MapContainer>
      </Box>

      {address && (
        <Box sx={{ 
          mb: 3, 
          p: 2, 
          border: '1px solid #ddd', 
          borderRadius: 1,
        }}>
          <Typography variant="h6" sx={{ mb: 1 }}>Adresse sélectionnée:</Typography>
          <Typography sx={{ fontWeight: 'bold' }}>{address.displayName}</Typography>
          <Typography variant="body2" color="text.secondary">
            {address.road && `${address.road}, `}
            {address.postcode && `${address.postcode}, `}
            {address.city && `${address.city}, `}
            {address.country}
          </Typography>
        </Box>
      )}

      <div ref={confirmButtonRef}> {/* Réf attachée ici */}
        <Button
          variant="contained"
          color="primary"
          onClick={handleConfirmLocation}
          disabled={!address || loading.submission}
          fullWidth
          size="large"
          sx={{ mt: 2 }}
          startIcon={loading.submission ? <CircularProgress size={20} /> : null}
        >
          {loading.submission ? "Validation en cours..." : "Confirmer l'adresse"}
        </Button>
      </div>
    </Box>
  );
};

export default MyLocation;