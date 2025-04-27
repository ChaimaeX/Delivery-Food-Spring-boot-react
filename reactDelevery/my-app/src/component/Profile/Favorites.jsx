import React from 'react';
import {RestaurantCard}  from '../Restaurant/RestaurantCard';
import { useSelector } from 'react-redux';

const Favorites = () => {
  const auth =useSelector(store=>store.auth)
  const jwt = localStorage.getItem("jwt");
  console.log("favorites",auth.favorites);

  return (
    <div className="flex flex-col items-center min-h-screen"> {/* Centre la page verticalement */}
      <h1 className="py-5 text-2xl font-semibold text-center">My Favorites</h1>
      <div className="flex flex-wrap gap-5 justify-center w-full max-w-6xl px-4"> {/* Centre les cartes */}
       {
                 auth.favorites.map((item)=><RestaurantCard item={item}/>)

                 
        }
      </div>
    </div>
  );
};

export default Favorites;
