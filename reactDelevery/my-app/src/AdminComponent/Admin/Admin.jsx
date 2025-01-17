import React, { useEffect } from 'react'
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
// import { getMenuItemsByResturantId } from '../../component/State/Menu/Action'
// import { getUsersOrders } from '../../component/State/Order/Action'


const Admin = () => {
  const dispatch = useDispatch()
  const jwt = localStorage.getItem("jwt")

  
  const {restaurant}=useSelector(store=>store)
  const handleClose=()=>{

  }
  useEffect(()=>{
    dispatch(getRestaurantCategoory({jwt,restaurantId:restaurant.usersRestaurant?.id,
    }))
    dispatch(
      fetchRestaurantOrder(
      {jwt,
       restaurantId:restaurant.usersRestaurant?.id,
      }
    ))
    
    
  },[])
  return (
    
      <div className='lg:flex justify-between'>
        <div>
            <AdminSideBar handleClose={handleClose}/>
        </div>
        <div className='lg:w-[80%]'>
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
    
  )
}

export default Admin
 