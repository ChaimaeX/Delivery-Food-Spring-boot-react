import React, { useState } from 'react';
import ProfileNavigation from './ProfileVavigation';
import { Route, Routes } from 'react-router-dom';
import Address from './Address';
import Favorites from './Favorites';
import Events from './Events';
import UserProfile from './UserProfile';
import Order from './Order';
import { useMediaQuery } from '@mui/material';

const Profile = () => {

  // Fonction pour basculer l'état de la navigation
  const isMobile = useMediaQuery("(max-width:768px)");
  const [sidebarWidth, setSidebarWidth] = useState(256);

  return (
    <div className="lg:flex">
      {/* ProfileNavigation - visible en grand écran, mais masquée sur mobile par défaut */}
      <div className={`${isMobile ? 'w-full ' : ''} flex-shrink-0`}>
          <ProfileNavigation />
        </div>

        <div 
        className='flex-1 overflow-x-hidden' 
        style={{ 
          marginLeft: isMobile ? 0 : sidebarWidth,
          transition: 'margin-left 0.3s ease' 
        }}
        >
      

        <Routes >
          <Route path="/" element={<UserProfile />} />
          <Route path="/orders" element={<Order />} />
          <Route path="/address" element={<Address />} />
          <Route path="/favorites" element={<Favorites />} />
          {/* <Route path="/events" element={<Events />} /> */}
        </Routes>
      </div>
      </div>
    
  );
};

export default Profile;
