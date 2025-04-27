import React from 'react';
import { TextField, Typography, Button, Box, CircularProgress, Alert } from '@mui/material';
import { Field, Form, Formik } from 'formik';
import * as Yup from 'yup';
import { useDispatch, useSelector } from 'react-redux';
import { Changepassword } from '../State/Authentication/Action';
import { useLocation, useNavigate } from 'react-router-dom';

const validationSchema = Yup.object().shape({
  newPassword: Yup.string()
    .min(8, 'Password must be at least 8 characters')
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
      'Password must contain at least one uppercase, one lowercase, one number and one special character'
    )
    .required('Password is required'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('newPassword'), null], 'Passwords must match')
    .required('Please confirm your password'),
});

const ChangePassword = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { loading, error, message } = useSelector(state => state.auth);
  
  const email = location.state?.email;

  const handleSubmit = (values, { setSubmitting, resetForm }) => {
    const reqData = {
      
      
    };

    dispatch(Changepassword({
      email,
      newPassword: values.newPassword,
      confirmPassword: values.confirmPassword
    }))
      .then(() => {
        resetForm();
        navigate('/account/login', {
          state: { 
            message: 'Password changed successfully! Please login with your new password.' 
          }
        });
      })
      .catch(() => {
        setSubmitting(false);
      });
  };

  return (
    <Box sx={{ maxWidth: 400, mx: 'auto', p: 3 }}>
      <Typography variant="h5" align="center" gutterBottom>
        Change Password
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {message && (
        <Alert severity="success" sx={{ mb: 2 }}>
          {message}
        </Alert>
      )}

      <Formik
        initialValues={{
          newPassword: '',
          confirmPassword: ''
        }}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting, errors, touched }) => (
          <Form>
            <Field
              as={TextField}
              type="password"
              name="newPassword"
              label="New Password"
              fullWidth
              variant="outlined"
              margin="normal"
              error={touched.newPassword && Boolean(errors.newPassword)}
              helperText={touched.newPassword && errors.newPassword}
              disabled={loading}
            />

            <Field
              as={TextField}
              type="password"
              name="confirmPassword"
              label="Confirm New Password"
              fullWidth
              variant="outlined"
              margin="normal"
              error={touched.confirmPassword && Boolean(errors.confirmPassword)}
              helperText={touched.confirmPassword && errors.confirmPassword}
              disabled={loading}
            />
            
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              disabled={loading || isSubmitting}
              sx={{ mt: 3 }}
            >
              {loading ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                'Update Password'
              )}
            </Button>

            <Box sx={{ mt: 2, textAlign: 'center' }}>
              <Button 
                size="small" 
                onClick={() => navigate('/account/login')}
                sx={{ textTransform: 'none' }}
              >
                Back to Login
              </Button>
            </Box>
          </Form>
        )}
      </Formik>
    </Box>
  );
};

export default ChangePassword;