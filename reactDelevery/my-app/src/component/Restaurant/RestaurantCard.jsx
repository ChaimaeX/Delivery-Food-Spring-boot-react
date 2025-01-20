import React, { useState } from 'react';
import { Alert, Card, Chip, IconButton } from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import {useNavigate, useParams} from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux';
import { isPresentInFavorites } from '../config/logic';
import {addToFavorite} from '../State/Authentication/Action';

export const RestaurantCard = ({item}) => {
  const navigate=useNavigate()
  const dispatch=useDispatch()
  const jwt=localStorage.getItem("jwt")
  const {auth} = useSelector(store=>store)
 

 
  const handleAddToFavorite=()=>{
    dispatch(addToFavorite({restaurantId:item.id,jwt}))
  }

  const handleNavigateToRestaurant=()=>{
    if(item.open){
       navigate(`/restaurant/${item.address.city}/${item.name}/${item.id                                                                                                                                                                                                                                                    }`)
    }
    // else{
    //   <Alert icon={false} severity="success">
    //          the Restaurant is close
    //   </Alert>
    // }
  }
  const [isFavorite, setIsFavorite] = useState(false);
  
  // const toggleFavorite = () => setIsFavorite(!isFavorite);

  return (
    <Card className='w-[18rem] productCard'>
      <div className=' relative'>
        <img
          className='w-full h-[10rem] rounded-t-md object-cover'
          src={item.images[2]}
          alt="Restaurant"
        />
        <Chip
          size='small'
          className='absolute top-2 left-2'
          color={item.open ? "success" : "error"}
          label={item.open ? "open" : "closed"}
        />
      </div>
      <div className='p-4 textPart lg:flex w-full justify-between cursor-pointer'>
       <div onClick={handleNavigateToRestaurant} >
        <div className='space-y-1'>
          <p className='font-semibold text-lg cursor-pointer'>{item.name}</p>
          <p className='text-gray-500 text-sm'>{item.description}</p>
        </div>
        </div>
        <div>
          <IconButton onClick={handleAddToFavorite} color="error">
            {isPresentInFavorites(auth.favorites,item) ? <FavoriteIcon /> : <FavoriteBorderIcon />}
          </IconButton>
        </div>
      </div>
    </Card>
  );
};

export default RestaurantCard;
