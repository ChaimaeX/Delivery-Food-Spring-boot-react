import React, { useEffect } from 'react'
import Orders from '../Orders/Orders'
import Details from '../OrderDetails/Details'
import { getUser } from '../../component/State/Authentication/Action'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'


const Dashboard = () => {

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const  {auth} = useSelector((sotre)=>sotre);
  const jwt = localStorage.getItem("jwt") || auth.jwt;

  // useEffect(()=>{
  //     dispatch(getUser({jwt}));
  //     if (auth.user?.role != "ROLE_LIVREUR") {
  //       navigate("/unauthorized")
  //     }
  //   },[dispatch,jwt])
  return (
    <>
    {/* <div>Dashboard</div> */}
    <Orders/>
   
    
    </>

  )
}

export default Dashboard