import { Box, Modal } from '@mui/material';
import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import LoginForm from './LoginForm';
import ForgetPassword from './ForgetPassword';
import OtpVerification from './OtpVerification';
import Changepassword from './Changepassword';
import Registerform from './Registerform';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  outline: 'none',
  boxShadow: 24,
  p: 4,
  borderRadius: 2,
};

const authRoutes = [
  '/account/register',
  '/account/login',
  '/account/forget-password',
  '/account/verify-otp',
  '/account/change-password'
];

const Auth = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const handleOnClose = () => {
    navigate('/');
  };

  const openModal = authRoutes.includes(location.pathname);

  const renderAuthComponent = () => {
    switch(location.pathname) {
      case '/account/register':
        return <Registerform />;
      case '/account/login':
        return <LoginForm />;
      case '/account/forget-password':
        return <ForgetPassword />;
      case '/account/verify-otp':
        return <OtpVerification />;
      case '/account/change-password':
        return <Changepassword />;
      default:
        return null;
    }
  };

  return (
    <Modal
      open={openModal}
      onClose={handleOnClose}
      aria-labelledby="auth-modal-title"
      aria-describedby="auth-modal-description"
    >
      <Box sx={style}>
        {renderAuthComponent()}
      </Box>
    </Modal>
  );
};


export default Auth;