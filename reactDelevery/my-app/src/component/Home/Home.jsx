import React, { useEffect } from 'react';
import "./Home.css"
import { MultiltemCarousel } from './MultiltemCarousel';
import { RestaurantCard } from '../Restaurant/RestaurantCard';
import { useDispatch, useSelector } from 'react-redux'
import { getAllRestaurantAction } from '../State/Restaurant/Action'
import { findCart } from '../State/Cart/Action';

export const Home = () => {
  const dispatch = useDispatch()
  const jwt = localStorage.getItem("jwt")
  const { restaurant } = useSelector(store => store)

  console.log("restaurant", restaurant);

  useEffect(() => {
      dispatch(findCart(jwt))
   
  }, [dispatch, jwt])

  useEffect(() => {
    dispatch(getAllRestaurantAction({}))
  }, [dispatch])

  return (
    <div className='pb-10'>
      {/* Banner Section */}
      <section className="banner -z-50 relative flex flex-col justify-center items-center">
        <div className="w-[80vw] md:w-[60vw] lg:w-[50vw] z-10 text-center">
          <p className="text-3xl md:text-4xl lg:text-6xl font-bold z-10 py-5 text-white">
            <ul>
              <li>Delivery Food</li>
            </ul>
          </p>
          <p className="z-10 text-gray-300 text-xl sm:text-2xl lg:text-4xl">
            Taste the Convenience: Food, Fast and Delivered.
          </p>
        </div>
        <div className='cover absolute top-0 left-0 right-0'></div>
        <div className='fadout'></div>
      </section>

      {/* Top Meals Section */}
      <section className='p-5 sm:p-10 lg:py-10 lg:px-15'>
        <p className='text-2xl font-semibold text-gray-400 py-3 pb-10'>Top Meals</p>
        <MultiltemCarousel />
      </section>

      {/* Restaurant Section */}
      <section className='px-5 sm:px-10 lg:px-20 pt-10'>
        <h1 className='text-2xl font-semibold text-gray-400 pb-5'>
          Order From Our Handpicked Favorites
        </h1>
        <div className='flex flex-wrap items-center justify-center lg:justify-around gap-5'>
          {restaurant.restaurants?.map((item) => (
            <RestaurantCard key={item.id} item={item} />
          ))}
        </div>
      </section>
    </div>
  );
};
