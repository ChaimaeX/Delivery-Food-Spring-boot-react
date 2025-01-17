import React, { useState } from 'react';
import Button from '@mui/material/Button';
import { Card, CardContent, CardHeader, Grid } from '@mui/material';
import InstagramIcon from '@mui/icons-material/Instagram';
import FacebookIcon from '@mui/icons-material/Facebook';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import XIcon from '@mui/icons-material/X';
import { useDispatch, useSelector } from 'react-redux';
import { store } from '../../component/State/Store';
import { updateRestaurantStatus } from '../../component/State/Restaurant/Action';
const RestaurantDetails = () => {
  const {restaurant} =useSelector((store)=>store);
  const dispatch = useDispatch();
  console.log("Restaurant Details ",restaurant)
  const [isOpen, setIsOpen] = useState(false);  // État pour suivre si le restaurant est ouvert ou fermé

  const handleRestaurantStatus = () => {
    dispatch(updateRestaurantStatus({restaurantId:restaurant.usersRestaurant.id,
                                     jwt:localStorage.getItem("jwt")
    }))
  };

  return (
    <div className='lg:px-20 px-5 pb-10'>
      <div className='py-5 flex justify-center items-center gap-5'>
        <h1 className='text-2xl lg:text-7xl text-center font-bold p-5'>{restaurant.usersRestaurant?.name}</h1>
        <div>
          <Button
            color={restaurant.usersRestaurant?.open? "primary" : "error"}  // Changer la couleur selon l'état
            className='py-[1rem] px-[2rem]'
            variant='contained'
            onClick={handleRestaurantStatus}
            size='large'
          >
            {!restaurant.usersRestaurant?.open ? "Open" : "Close"}  {/* Le texte du bouton dépend de l'état */}
          </Button>
        </div>
      </div>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Card>
           <CardHeader title={<span className='text-gray-300' > Restaurant</span>}/>
           <CardContent>
            <div className=' space-y-4 text-gray-200'>
              <div className='flex'>
                <p className='w-48'>Owner</p>
                <p className='text-gray-400'>
                  <span  className='pr-5' >-</span>
                  {restaurant.usersRestaurant?.owner.fullName}
                </p>
              </div>
              <div className='flex'>
                <p className='w-48'>Restaurant Name </p>
                <p className='text-gray-400'>
                  <span  className='pr-5' >-</span>
                  {restaurant.usersRestaurant?.name}
                </p>
              </div>
               <div className='flex'>
                <p className='w-48'>Cuisine Type</p>
                <p className='text-gray-400'>
                  <span  className='pr-5' >-</span>
                  {restaurant.usersRestaurant?.cuisineType}
                </p>
                </div>
                <div className='flex'>
                <p className='w-48'>Opening Hours </p>
                <p className='text-gray-400'>
                  <span  className='pr-5' >-</span>
                  {restaurant.usersRestaurant?.openinHours}
                </p>
              </div>
              <div className='flex'>
                <p className='w-48'>status </p>
                <p className='text-gray-400'>
                  <span  className='pr-5' >-</span>
                  {restaurant.usersRestaurant?.open?<span className='px-5 py-2 rounded-full bg-green-400 text-gray-950'>Open</span>:
                   <span className='px-5 py-2 rounded-full bg-red-400 text-gray-950'>Closed</span>}
                </p>
              </div>

            </div>
           </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} lg={6}>
          <Card>
           <CardHeader title={<span className='text-gray-300' > Address</span>}/>
           <CardContent>
            <div className=' space-y-4 text-gray-200'>
              <div className='flex'>
                <p className='w-48'>Country</p>
                <p className='text-gray-400'>
                  <span  className='pr-5' >-</span>
                   code with chaimae
                </p>
              </div>
              <div className='flex'>
                <p className='w-48'>City</p>
                <p className='text-gray-400'>
                  <span  className='pr-5' >-</span>
                   code with chaimae
                </p>
              </div>
               <div className='flex'>
                <p className='w-48'>Postal code</p>
                <p className='text-gray-400'>
                  <span  className='pr-5' >-</span>
                   code with chaimae
                </p>
                </div>
                <div className='flex'>
                <p className='w-48'>Street Address </p>
                <p className='text-gray-400'>
                  <span  className='pr-5' >-</span>
                  {restaurant.usersRestaurant?.address?.streetAddress}
                </p>
              </div>
             
            </div>
           </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} lg={6}>
          <Card>
           <CardHeader title={<span className='text-gray-300' > Contact</span>}/>
           <CardContent>
            <div className=' space-y-4 text-gray-200'>
              <div className='flex'>
                <p className='w-48'>Email</p>
                <p className='text-gray-400'>
                  <span  className='pr-5' >-</span>
                  {restaurant.usersRestaurant?.contact?.email}
                </p>
              </div>
              <div className='flex'>
                <p className='w-48'>Mobile </p>
                <p className='text-gray-400'>
                  <span  className='pr-5' >-</span>
                  {restaurant.usersRestaurant?.contact?.mobile}

                </p>
              </div>
               <div className='flex'>
                <p className='w-48'>Social</p>
                <div className='flex text-gray-400 items-center pb-3 gap-2'>
                  <span className='pr-5'>-</span>
                    <a href={restaurant.usersRestaurant?.contact?.instagram} >
                       <InstagramIcon sx={{fontSize:"2rem"}}  />

                    </a>
                    <a href={restaurant.usersRestaurant?.contcat?.x} >
                    
                       <XIcon sx={{fontSize:"2rem"}}  />

                    </a>
                    <a href="/">
                       <LinkedInIcon sx={{fontSize:"2rem"}}  />

                    </a>
                    <a href="/">
                       <FacebookIcon sx={{fontSize:"2rem"}}  />

                    </a>
                 
                </div>
                </div>
            

            </div>
           </CardContent>
          </Card>
        </Grid>

      </Grid>
    </div>
  );
};

export default RestaurantDetails;
