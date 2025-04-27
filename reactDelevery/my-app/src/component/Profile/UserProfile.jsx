import React from 'react';
import AccountCircleIcon from '@mui/icons-material/AccountCircle'; // Correction du nom
import { Button, Divider } from '@mui/material';

const UserProfile = () => {
  const handleLogout = () => {
    // Implémentez la logique de déconnexion ici
    console.log("Déconnexion...");
  };

  return (
    <div className='min-h-[80vh] flex flex-col justify-center items-center text-center'>
      <div className='flex flex-col items-center justify-center max-w-md w-full px-4'>
        <AccountCircleIcon sx={{ fontSize: "9rem", color: "action.active" }} />

        {/* <h1 className='py-5 text-2xl font-semibold'>Code with Chaimae</h1>  */}
        
        {/* <Divider sx={{ width: '100%', my: 2 }} /> 
        
        <p className='text-gray-600 mb-4'>Email: codewithChaimae12@gmail.com</p>
        
        <Divider sx={{ width: '100%', my: 2 }} /> 
         */}
        <Button 
          variant='contained' 
          onClick={handleLogout} // Correction de "Onclick" en "onClick"
          sx={{ 
            margin: "2rem 0rem",
            padding: "0.5rem 2rem",
            backgroundColor: "#e91e63",
            '&:hover': {
              backgroundColor: "#d81b60"
            }
          }}
        >
          Déconnexion
        </Button>

        <p className='mt-4 text-gray-500 text-sm'>
          Un problème ? N'hésitez pas à nous contacter à contact@codewithchaimae.com
        </p>
      </div>
    </div>
  );
};

export default UserProfile;