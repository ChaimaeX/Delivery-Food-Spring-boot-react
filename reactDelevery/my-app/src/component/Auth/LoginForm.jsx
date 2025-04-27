import { TextField, Typography, Button, Snackbar, Alert } from '@mui/material';
import { Field, Form, Formik } from 'formik';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { LoginUser } from '../State/Authentication/Action';
import { useSearchParams } from 'react-router-dom';

const initialValues = {
  email: '',
  password: '',
};

const LoginForm = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { error, message,success } = useSelector(state => state.auth);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  
  console.log('Token:', token); // Affiche la valeur ou null

   // Effet pour gérer les messages du state Redux
   useEffect(() => {
    if (error) {
      setSnackbarMessage(error);
      setSnackbarSeverity('error');
      setOpenSnackbar(true);
    } else if (message) {
      setSnackbarMessage(message);
      setSnackbarSeverity('success');
      setOpenSnackbar(true);
    }
  }, [error, message]);

  const handleCloseSnackbar = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpenSnackbar(false);
  };

  const handleSubmit = (values) => {
       dispatch(LoginUser({ userData: values, navigate,token: token || '' }));
   
  };

  return (
    <div>
      <Typography variant="h5" className="text-center">
        Login
      </Typography>
      <Formik initialValues={initialValues} onSubmit={handleSubmit}>
        {() => (
          <Form>
            {/* Email Field */}
            <Field
              as={TextField}
              name="email"
              label="Email"
              fullWidth
              variant="outlined"
              margin="normal"
            />
            {/* Password Field */}
            <Field
              as={TextField}
              type="password"
              name="password"
              label="Password"
              fullWidth
              variant="outlined"
              margin="normal"
            />
            {/* Submit Button */}
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              sx={{ marginTop: '16px' }}
            >
              Login
            </Button>
          </Form>
        )}
      </Formik>
      <Typography variant="body2" align="center" sx={{ mt: 3 }}>
        <Button 
          size="small" 
          onClick={() => navigate("/account/forget-password")}
          sx={{ textTransform: 'none' }}
        >
          Forgot password
        </Button>
        <div className=''>
        Don't have an account 
        <Button 
          size="small" 
          onClick={() => navigate("/account/register")}
          sx={{ textTransform: 'none' }}
        >
          Register
        </Button>
        </div>
      </Typography>

      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert 
          onClose={handleCloseSnackbar} 
          severity={snackbarSeverity}
          sx={{ width: '100%' }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default LoginForm;