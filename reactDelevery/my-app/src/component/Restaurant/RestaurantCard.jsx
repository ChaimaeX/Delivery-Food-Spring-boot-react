import React, { useCallback, useState } from 'react';
import { Alert, Card, Chip, IconButton, useMediaQuery, useTheme } from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { isPresentInFavorites } from '../config/logic';
import { addToFavorite } from '../State/Authentication/Action';
import Snackbar from '@mui/material/Snackbar';
import "./RestaurantDetails.css"

export const RestaurantCard = ({ item }) => {
  const theme = useTheme();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const jwt = localStorage.getItem("jwt");
  const { auth } = useSelector(store => store);
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  const [notification, setNotification] = useState({
    open: false,
    message: "",
    severity: "success"
  });

  const isFavorite = isPresentInFavorites(auth.favorites, item);
  const handleAddToFavorite = useCallback((e) => {
    e.stopPropagation();
    
    if (!jwt) {
      setNotification({
        open: true,
        message: "Please login to add favorites",
        severity: "warning"
      });
      return;
    }

    dispatch(addToFavorite({ restaurantId: item.id , status:!isFavorite , jwt }));
    setNotification({
      open: true,
      message: isFavorite ? "Removed from favorites" : "Added to favorites",
      severity: "success"
    });
  }, [dispatch, item.id, jwt, isFavorite]);

  const handleNavigateToRestaurant = useCallback(() => {
    if (!jwt) {
      setNotification({
        open: true,
        message: "Please login to view restaurant",
        severity: "warning"
      });
      return;
    }

    if (!item.open) {
      setNotification({
        open: true,
        message: "Restaurant is currently closed",
        severity: "info"
      });
      return;
    }

    navigate(`/restaurant/${item.address?.city}/${item.name}/${item.id}`);
  }, [navigate, item, jwt]);

  const handleCloseNotification = () => {
    setNotification(prev => ({ ...prev, open: false }));
  };

  return (
    <Card className='productCard'
    sx={{ 
      width: isMobile ? '100%' : '18rem',
      marginBottom: 2,
      boxShadow: 3,
      borderRadius: 2,
      overflow: 'hidden',
      position: 'relative',
      cursor: 'pointer'
    }}
    >
      <div className='relative'>
        <img
          className='w-full object-cover'
          style={{ height: isMobile ? '8rem' : '10rem' }}
          src={item.images[0]}
          alt={item.name}
          loading='lazy'
        />
        <Chip
          size='small'
          sx={{ 
            position: 'absolute',
            top: 8,
            left: 8,
            fontWeight: 'bold'
          }}
          color={item.open ? "success" : "error"}
          label={item.open ? "open" : "closed"}
        />
      </div>
      <div className='p-4 textPart flex  w-full justify-between'>
        <div onClick={handleNavigateToRestaurant} className='cursor-pointer'>
          <div className='space-y-1'>
            <p className='font-semibold text-lg'>{item.name}</p>
            <p className='text-gray-500 text-sm'>{item.description}</p>
          </div>
        </div>
        <div>
          <IconButton 
            onClick={handleAddToFavorite} 
            color="error"
            aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
            sx={{ 
              position: 'absolute',
              button: 8,
              right: 8,
              // backgroundColor: 'rgba(255,255,255,0.8)',
              '&:hover': {
                backgroundColor: 'rgba(255,255,255,0.9)'
              }
            }}
          >
            {isFavorite? 
              <FavoriteIcon fontSize={isMobile ? 'small' : 'medium'} /> : 
              <FavoriteBorderIcon fontSize={isMobile ? 'small' : 'medium'} />
            }
          </IconButton>
        </div>
      </div>

      {/* Snackbar placé au niveau racine du composant */}
      <Snackbar
        open={notification.open}
        autoHideDuration={3000}
        onClose={handleCloseNotification}
        anchorOrigin={{ vertical: 'button', horizontal: 'center' }}
      >
        <Alert 
          onClose={handleCloseNotification} 
          severity={notification.severity}
          sx={{ width: '100%' }}
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </Card>
  );
};

export default RestaurantCard;