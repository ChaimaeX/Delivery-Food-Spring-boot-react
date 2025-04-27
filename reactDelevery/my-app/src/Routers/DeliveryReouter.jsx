import React, { useEffect } from 'react'
import Navbar from '../DeliveryComponent/Navbar/Navbar'
import Dashboard from '../DeliveryComponent/Dashboard/Dashboard'
import { Route, Routes, useLocation, useNavigate } from 'react-router-dom'
import Details from '../DeliveryComponent/OrderDetails/Details'
import RoutingLocation from '../DeliveryComponent/OrderDetails/RoutingLocation'
import { findOrderStatus } from '../component/State/Delivery/Action'
import { useDispatch, useSelector } from 'react-redux'
import { getUser } from '../component/State/Authentication/Action'

const DeliveryReouter = () => {
  const jwt = localStorage.getItem('jwt');
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { delivery ,auth} = useSelector(store => store);
  
    //gestion de authorize
    useEffect(()=>{
      dispatch(getUser({jwt}));
      if (auth.user?.role != "ROLE_LIVREUR") {
        navigate("/unauthorized")
      }
    },[dispatch,jwt])


  // Rafraîchir les notifications toutes les 30 secondes
  useEffect(() => {
    const fetchNotifications = () => {
      if (jwt) {
        const reqdata = { jwt, status: false };
        dispatch(findOrderStatus(reqdata));
      }
    };

    // Exécuter immédiatement
    fetchNotifications();

    // Configurer l'intervale
    const interval = setInterval(fetchNotifications, 30000);

    // Nettoyer l'intervale
    return () => clearInterval(interval);
  }, [jwt, dispatch]);

  // Rafraîchir quand la location change
  useEffect(() => {
    if (jwt) {
      const reqdata = { jwt, status: false };
      dispatch(findOrderStatus(reqdata));
    }
  }, [location.pathname, jwt, dispatch]);

  return (
    <div>
        <Navbar/>
        <Routes>
             <Route path='/' element={<Dashboard/>} />
             <Route path='/orders/:id' element={<Details/>} />
             <Route path='/orders/:id/location' element={<RoutingLocation/>} />
             
        </Routes>
    </div>
  )
}

export default DeliveryReouter