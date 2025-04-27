import { Box, Divider, FormControl, FormControlLabel, Grid, Radio, RadioGroup, Typography, Button } from '@mui/material';
import React, { useEffect, useRef, useState } from 'react';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import MenuCard from './MenuCard';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getRestaurantById, getRestaurantCategoory } from '../State/Restaurant/Action';
import { getMenuItemsByResturantId, searchMenuItem } from '../State/Menu/Action';
import LoadingSpinner from './LoadingSpinner';
import { debounce } from 'lodash';
import "./RestaurantDetails.css";
import CircularProgress from '@mui/material/CircularProgress';
import FilterListIcon from '@mui/icons-material/FilterList';
import CloseIcon from '@mui/icons-material/Close';

const foodTypes = [
  { label: "All", value: "all" },
  { label: "Vegetarian only", value: "vegetarian" },
  { label: "Non-Vegetarian", value: "non_Vegetarien" },
  { label: "Seasonal", value: "seasonal" },
];

export const RestaurantDetails = () => {
  const [foodType, setFoodType] = useState("all");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isDataLoaded, setIsDataLoaded] = useState(false);
  const foodRef = useRef(null);
  const [isFiltering, setIsFiltering] = useState(false);
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const isMobile = window.innerWidth < 768;

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const jwt = localStorage.getItem("jwt");
  const { id, city } = useParams();
  const { auth, restaurant, menu } = useSelector((store) => store);
  const location = useLocation();

  const selectedFoodId = location.hash?.replace("#food-", "") || "";

  useEffect(() => {
    const fetchRestaurantData = async () => {
      try {
        setLoading(true);
        await dispatch(getMenuItemsByResturantId({
          restaurantId: id,
          jwt: localStorage.getItem("jwt"),
          vegetarian: false,
          seasonal: false,
          nonveg: false,
          foodCategory: "",
        }));
        await dispatch(getRestaurantById({ jwt, restaurantId: id }));
        await dispatch(getRestaurantCategoory({ jwt, restaurantId: id }));
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchRestaurantData();
  }, [dispatch, id, jwt]);

  const debouncedFilter = debounce((foodType, selectedCategory) => {
    setIsFiltering(true);
    dispatch(
      getMenuItemsByResturantId({
        jwt,
        vegetarian: foodType === "vegetarian",
        nonveg: foodType === "non_Vegetarien",
        seasonal: foodType === "seasonal",
        restaurantId: id,
        foodCategory: selectedCategory,
      })
    ).then(() => {
      setIsFiltering(false);
    });
  }, 300);

  const debouncedFilterCategory = debounce((selectedCategory) => {
    setIsFiltering(true);
    dispatch(searchMenuItem({ keyword: selectedCategory, restaurantId: id, jwt }))
      .then(() => {
        setIsFiltering(false);
      });
  }, 300);

  useEffect(() => {
    debouncedFilter(foodType, selectedCategory);
  }, [foodType, selectedCategory, dispatch, jwt, id]);

  useEffect(() => {
    debouncedFilterCategory(selectedCategory);
  }, [selectedCategory, dispatch, jwt, id]);

  useEffect(() => {
    if (menu.menuItems.length > 0) {
      setIsDataLoaded(true);
    }
  }, [menu.menuItems]);

  useEffect(() => {
    if (isDataLoaded && selectedFoodId && menu.menuItems.length > 0) {
      const foodExists = menu.menuItems.map((item) => item.id === selectedFoodId);
      if (foodExists) {
        const checkElement = () => {
          const foodElement = document.getElementById(`food-${selectedFoodId}`);
          if (foodElement) {
            foodElement.classList.add('highlight-scroll');
            foodElement.scrollIntoView({ behavior: "smooth" });
            setTimeout(() => {
              foodElement.classList.remove('highlight-scroll');
            }, 1000);
          } else {
            setTimeout(checkElement, 200);
          }
        };
        checkElement();
      }
    }
  }, [selectedFoodId, isDataLoaded, menu.menuItems]);

  const handleFilter = (e) => {
    setFoodType(e.target.value);
  };

  const handleLocation = (address) => { 
    navigate(`/restaurant/details/Location/${address.latitude}/${address.longitude}`);
  };

  const handleMenu = (item) => {
    console.log("item.id", item.id);
  };

  const handleFilterCategory = (e) => {
    setSelectedCategory(e.target.value);
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <div className="text-red-500 text-center py-10">Error: {error}</div>;

  return (
    <div className='px-5 lg:px-20'>
      <section>
        <h3 className='text-gray-500 py-2 mt-10'>Home / {city} / {restaurant.restaurant?.name} / {id}</h3>
        <div>
          {isMobile ? (
            <div className="mobile-photo-grid">
              {restaurant.restaurant?.images?.slice(0, 2).map((image, index) => (
                <img
                  key={index}
                  className='w-full h-[30vh] object-cover rounded-lg'
                  src={image}
                  alt={`Restaurant ${index + 1}`}
                />
              ))}
            </div>
          ) : (
            <Grid container spacing={2}>
              {restaurant.restaurant?.images?.slice(0, 3).map((image, index) => (
                <Grid item xs={12} lg={index === 0 ? 12 : 6} key={index}>
                  <img
                    className='w-full h-[40vh] object-cover'
                    src={image}
                    alt={`Restaurant ${index + 1}`}
                  />
                </Grid>
              ))}
            </Grid>
          )}
        </div>

        <div className='pt-3 pb-5'>
          <h1 className='text-4xl font-semibold'>{restaurant.restaurant?.name}</h1>
          <p className='text-gray-500 mt-1'>{restaurant.restaurant?.description}</p>
          <div className='space-y-3 mt-3'>
            <p className='text-gray-500 flex items-center gap-3'>
              <LocationOnIcon onClick={() => handleLocation(restaurant.restaurant?.address)} />
              <span>
                {restaurant.restaurant?.address.streetAddress}, {restaurant.restaurant?.address.country}
              </span>
            </p>
            <p className='text-gray-500 flex items-center gap-3'>
              <CalendarTodayIcon />
              <span>{restaurant.restaurant?.openinHours} (Today)</span>
            </p>
          </div>
        </div>
      </section>

      {isMobile && (
        <>
          <Button
            variant="contained"
            color="primary"
            // startIcon={<FilterListIcon />}
            sx={{
              position: 'fixed',
              bottom: '20px',
              right: '20px',
              zIndex: 1000,
              borderRadius: '50%',
              minWidth: '50px',
              height: '50px',
              padding: 0
            }}
            onClick={() => setShowMobileFilters(!showMobileFilters)}
          >
            {showMobileFilters ? <CloseIcon /> : <FilterListIcon />}
          </Button>

          {showMobileFilters && (
            <Box
              sx={{
                position: 'fixed',
                bottom: '80px',
                left: '20px',
                right: '20px',
                bgcolor: 'background.paper',
                p: 2,
                borderRadius: '8px',
                boxShadow: 3,
                zIndex: 999,
                maxHeight: '60vh',
                overflowY: 'auto'
              }}
            >
              <Typography variant="h6" gutterBottom>Filters</Typography>
              
              {/* <Typography variant="subtitle1" gutterBottom>Food Type</Typography>
              <RadioGroup row name='food_type' onChange={handleFilter} value={foodType}>
                {foodTypes.map((item) => (
                  <FormControlLabel
                    key={item.value}
                    value={item.value}
                    control={<Radio size="small" />}
                    label={item.label}
                    sx={{ mb: 1 }}
                  />
                ))}
              </RadioGroup> */}

              {/* <Divider sx={{ my: 2 }} /> */}

              <Typography variant="subtitle1" gutterBottom>Food Category</Typography>
              <RadioGroup name='category_type' value={selectedCategory} onChange={handleFilterCategory}>
                {restaurant.categories.map((item) => (
                  <FormControlLabel
                    key={item.id}
                    value={item.name}
                    control={<Radio size="small" />}
                    label={item.name}
                    sx={{ display: 'block', mb: 1 }}
                  />
                ))}
              </RadioGroup>
            </Box>
          )}
        </>
      )}

      <section className='pt-[2rem] lg:flex relative'>
        {!isMobile && (
          <div className='space-y-10 lg:w-[20%] filter'>
            <div className='box space-y-5 lg:sticky top-28'>
              <div>
                <Typography variant="h5" sx={{ paddingBottom: "1rem" }}>
                  Food Type
                </Typography>
                <FormControl component="fieldset">
                  <RadioGroup name='food_type' onChange={handleFilter} value={foodType}>
                    {foodTypes.map((item) => (
                      <FormControlLabel
                        key={item.value}
                        value={item.value}
                        control={<Radio />}
                        label={item.label}
                      />
                    ))}
                  </RadioGroup>
                </FormControl>
              </div>
              <Divider />
              <div>
                <Typography variant="h5" sx={{ paddingBottom: "1rem" }}>
                  Food Category
                </Typography>
                <FormControl component="fieldset">
                  <RadioGroup name='category_type' value={selectedCategory} onChange={handleFilterCategory}>
                    {restaurant.categories.map((item) => (
                      <FormControlLabel
                        key={item.id}
                        value={item.name}
                        control={<Radio />}
                        label={item.name}
                      />
                    ))}
                  </RadioGroup>
                </FormControl>
              </div>
            </div>
          </div>
        )}

        <div className={`space-y-5 ${!isMobile ? 'lg:w-[80%] lg:pl-10' : ''}`}>
          {isFiltering ? (
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '300px'
              }}
            >
              <CircularProgress size={60} />
            </Box>
          ) : (
          
            menu.menuItems.map((item) => (
              <div 
                key={item.id} 
                id={`food-${item.id}`} 
                className="menu-card"
                onClick={() => handleMenu(item)}
              >
                <MenuCard item={item} />
              </div>
            ))
           
          )}
        
        </div>
      </section>
    </div>
  );
};