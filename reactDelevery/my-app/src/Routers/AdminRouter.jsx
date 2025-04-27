import React, { useEffect } from 'react'
import { Route, Routes, useNavigate } from 'react-router-dom'
import CreateRestaurantForm from '../AdminComponent/CreatRestaurant/CreateRestaurantForm';
import Admin from '../AdminComponent/Admin/Admin'
import { useDispatch, useSelector } from 'react-redux';
import { store } from '../component/State/Store';
import { getUser } from '../component/State/Authentication/Action';

const AdminRouter = () => {
  const {restaurant,auth}=useSelector(store=>store);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  console.log("restaurant",restaurant);
  const jwt = localStorage.getItem("jwt") || auth.jwt;

  useEffect(()=>{
      dispatch(getUser({jwt}));
      if (auth.user?.role != "ROLE_RESTAURANT_OWNER") {
        navigate("/unauthorized")
      }
    },[dispatch,jwt])

 
  return (

    <div>

      <Routes>
        <Route path='/*' element={
          !restaurant.usersRestaurant?<CreateRestaurantForm />:
          <Admin />}>

        </Route>
        </Routes>
    </div>
  )
}

export default AdminRouter