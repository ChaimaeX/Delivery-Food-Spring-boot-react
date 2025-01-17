import { Box, Modal } from '@mui/material';
import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Registerform from './Registerform';
import LoginForm from './LoginForm';

const styled = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    outline:"non",
    boxShadow: 24,
    p: 4,
};
const Auth = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const handleOnClose = () => {
    navigate('/');
  };

  // Vérifiez si la route est celle de l'enregistrement ou de la connexion
  const openModal = location.pathname === '/account/register' || location.pathname === '/account/login';

  return (
    <>
      <Modal
        open={openModal}
        onClose={handleOnClose}  // Ajoutez une fonction de fermeture
      >
        <Box sx={styled}>
           {location.pathname === '/account/register'?<Registerform/>:<LoginForm/>}


        </Box>
      </Modal>
    </>
  );
};

export default Auth;
