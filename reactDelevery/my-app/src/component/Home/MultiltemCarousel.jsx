import React, { useEffect } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { useDispatch, useSelector } from "react-redux";
import { getAllTopMenuItem } from "../State/Menu/Action";
import { useNavigate } from "react-router-dom";
import { CarouselItem } from "./CarouselItem";

export const MultiltemCarousel = () => {
  const { menu } = useSelector((store) => store);
  const jwt = localStorage.getItem("jwt");
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleNavigateToRestaurant = (item) => {
    console.log("Clicked item:", item);
    const restaurant = item.restaurant;
    if (restaurant && restaurant.open) {
      console.log("Navigating to:", `/restaurant/${restaurant.address.city}/${restaurant.name}/${restaurant.id}`);
      navigate(`/restaurant/${restaurant.address.city}/${restaurant.name}/${restaurant.id}`);
    } else {
      console.log("Restaurant is not open or data is missing");
    }
  };

  useEffect(() => {
    console.log("Fetching top menu items...");
    dispatch(getAllTopMenuItem({ jwt }));
  }, [dispatch, jwt]);

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 5,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2000,
    arrows: false,
  };

  return (
    <div>
      <Slider {...settings} className="cursor-pointer">
        {menu.TopItem?.map((item) => (
          <div onClick={() => handleNavigateToRestaurant(item)}>
          <CarouselItem
            key={item.id}
            image={item.images[0]}
            title={item.name}
          />
          </div>
        ))}

      </Slider>
    </div>
  );
};
