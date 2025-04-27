import React, { useEffect, useRef, useState } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { useDispatch, useSelector } from "react-redux";
import { getAllTopMenuItem } from "../State/Menu/Action";
import { useNavigate } from "react-router-dom";
import { CarouselItem } from "./CarouselItem";
import PropTypes from "prop-types"; // Ajout de PropTypes
import { Alert, Snackbar } from "@mui/material";

export const MultiltemCarousel = () => {
  const { menu } = useSelector((store) => store);
  const jwt = localStorage.getItem("jwt") ;
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const TopMeels = menu.TopItems || [];

  const [notification, setNotification] = useState({
     open: false,
     message: "",
     severity: "success"
   });

  const handleNavigateToRestaurant = (item) => {
    const restaurant = item.restaurant;
    if (jwt) {
      if (restaurant && restaurant.open) {
        navigate(`/restaurant/${restaurant.address.city}/${restaurant.name}/${restaurant.id}#food-${item.id}`);
       
        
      } else {
        setNotification({
          open: true,
          message: "Ce Restaurant est ferme",
          severity: "info"
        });
        return;
      }
    }else
    setNotification({
      open: true,
      message: "Please login to view this menu",
      severity: "warning"
    });
    return;
    
  };

  const handleCloseNotification = () => {
    setNotification(prev => ({ ...prev, open: false }));
  };

  useEffect(() => {
    dispatch(getAllTopMenuItem());
    console.log("menuTop",menu.TopItems);
    
    
  }, [dispatch ]);
  console.log("menu:",menu);

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 5, // Par défaut, afficher 5 éléments sur les grands écrans
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2000,
    arrows: false,
    responsive: [
      {
        breakpoint: 768, // Pour les écrans plus petits que 768px (mobile/tablette)
        settings: {
          slidesToShow: 3,
          slidesToScroll: 2,
          infinite: true,
          dots: true,
        },
      },
      {
        breakpoint: 480, // Pour les écrans plus petits que 480px
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
          infinite: true,
          dots: true,
        },
      },
    ],
  };

  return (
    <div>
      <Slider {...settings} className="cursor-pointer">
        {menu.TopItems?.map((item) => (
          <div
            key={item.id} // Ajout d'une clé unique pour chaque élément
            onClick={() => handleNavigateToRestaurant(item)}
          >
            <CarouselItem
              image={item.images?.[0] || "default-image-url"} // Gestion des images manquantes
              title={item.name}
            />
          </div>
        ))}
      </Slider>

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
    </div>
  );
};

// PropTypes pour CarouselItem (exemple)
CarouselItem.propTypes = {
  image: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
};