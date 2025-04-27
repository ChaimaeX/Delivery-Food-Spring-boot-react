import { Grid } from '@mui/material';
import React, { useEffect } from 'react';
import MenuTable from '../Menu/MenuTable';
import OrderTable from '../Orders/OrderTable';
import { useDispatch, useSelector } from 'react-redux';
import { fetchRestaurantOrder } from '../../component/State/Restaurant_order/Action';

const Dashboard = () => {

  const dispatch = useDispatch();
  const { restaurant, restaurantOrder } = useSelector((store) => store);
  const jwt = localStorage.getItem("jwt");

  useEffect(()=>{
    if(!orders)
      dispatch(fetchRestaurantOrder({
        jwt,
        restaurantId: restaurant.usersRestaurant?.id
      }));
    
    

  },[jwt,dispatch])

  const orders = restaurantOrder?.orders || []
  
  return (
    <section>
      <Grid container spacing={2}>
        <Grid item xs={12} lg={6}>
          <MenuTable />
        </Grid>
        <Grid item xs={12} lg={6}>
          <OrderTable orders={orders} />
        </Grid>
      </Grid>
    </section>
  );
};

export default Dashboard;
