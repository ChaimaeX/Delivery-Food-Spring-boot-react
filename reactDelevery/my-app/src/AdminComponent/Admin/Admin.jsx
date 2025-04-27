import React, { useEffect, useState } from 'react'
import AdminSideBar from './AdminSideBar'
import { Route, Router, Routes } from 'react-router-dom'
import Dashboard from '../Dashboard/Dashboard'
import Orders from '../Orders/Orders'
import Menu from '../Menu/Menu'
import Events from '../Events/Events'
import FoodCategory from '../foodCategory/FoodCategory'
import Ingredients from '../Ingredients/Ingredients'
import RestaurantDetails from './RestaurantDetails'
import CreateMenuForm from '../Menu/CreateMenuForm'
import { useDispatch, useSelector } from 'react-redux'
import { fetchRestaurantOrder } from '../../component/State/Restaurant_order/Action'
import {getRestaurantCategoory } from '../../component/State/Restaurant/Action'
import FullScreenLoading from '../../component/Restaurant/LoadingSpinner'
import { useMediaQuery } from '@mui/material'
// import { getMenuItemsByResturantId } from '../../component/State/Menu/Action'
// import { getUsersOrders } from '../../component/State/Order/Action'


const Admin = () => {
  const dispatch = useDispatch()
  const jwt = localStorage.getItem("jwt")
  const isMobile = useMediaQuery("(max-width:768px)"); // Utilisation correcte
  const [loading, setLoading] = useState(true);
  const {restaurant}=useSelector(store=>store)
  const [sidebarWidth, setSidebarWidth] = useState(256);

  useEffect(()=>{
    
      const fetchData = async () =>{
        try {
        dispatch(getRestaurantCategoory({jwt,restaurantId:restaurant.usersRestaurant?.id,
        }))
        dispatch(
          fetchRestaurantOrder(
          {jwt,
           restaurantId:restaurant.usersRestaurant?.id,
          }
        ))

     
    } catch (error) {
      console.error("Failed to fetch data:", error);
    } finally {
      setLoading(false);
    }
    };
    fetchData();
    
    
  }, [dispatch, jwt, restaurant.usersRestaurant?.id])

  if (loading) {
    return <FullScreenLoading />;
  }

  return (
    
      <div className='lg:flex justify-between'>
        <div className={`${isMobile ? 'w-full mt-14' : ''} flex-shrink-0`}>
          <AdminSideBar />
        </div>

        <div 
        className='flex-1 overflow-x-hidden' 
        style={{ 
          marginLeft: isMobile ? 0 : sidebarWidth,
          transition: 'margin-left 0.3s ease' 
        }}
        >
        <div className='p-4 md:p-8'>
            <Routes>
              <Route path='/' element={<Dashboard/>} />
              <Route path='/orders' element={<Orders/>} />
              <Route path='/menu' element={<Menu/>} />
              <Route path='/event' element={<Events/>} />
              <Route path='/category' element={<FoodCategory/>} />
              <Route path='/ingredients' element={<Ingredients/>} />
              <Route path='/details' element={<RestaurantDetails/>} />
              <Route path='/add-menu' element={<CreateMenuForm/>} />

            </Routes>
        </div>
        </div>
           
      </div>
    
  )
}

export default Admin
 