import { TextField, Typography, Button } from '@mui/material';
import { Field, Form, Formik } from 'formik';
import React from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { LoginUser } from '../State/Authentication/Action';

const initialValues = {
  email: '',
  password: '',
};

const LoginForm = () => {
  const navigate=useNavigate()
  const dispatch=useDispatch() 
  const handleSubmit = (values) => {
    dispatch(LoginUser({userData: values, navigate}));

  };

  return (
    <div>
      <Typography variant="h5" className="text-center">
        Login
      </Typography>
      <Formik initialValues={initialValues} onSubmit={handleSubmit}>
        {() => (
          <Form >
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
      <Typography variant='body2' align='center' sx={{mt:3}}>
        Don't have an account 
        <Button size='small' onClick={()=>navigate("/account/register")}> 
            register
        </Button>
      </Typography>
    </div>
  );
};

export default LoginForm;
