import React from 'react';
import { Route, Routes } from 'react-router-dom';
import AdminRouter from './AdminRouter';
import CustomerRouter from './CustomerRouter';
import DeliveryReouter from './DeliveryReouter';
import Dashboard from '../Admin/Dashboard/Dashboard';

const Routers = () => {
  console.log('AdminRouter:', AdminRouter);
  console.log('CustomerRouter:', CustomerRouter);

  return ( 
    <Routes>
      <Route path='/admin/restaurant/*' element={<AdminRouter />} />
      <Route path='/admin/*' element={<Dashboard />} />
      <Route path='/*' element={<CustomerRouter />} />
      <Route path='/delivery/*' element={<DeliveryReouter />} />
    </Routes>
  );
};

export default Routers;

