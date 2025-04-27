import React from 'react';
import { TextField, Typography, Button, Box, CircularProgress, Alert } from '@mui/material';
import { Field, Form, Formik } from 'formik';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import { Forgotpassword, Otpverifecation } from '../State/Authentication/Action';
import * as Yup from 'yup';

const validationSchema = Yup.object().shape({
  otp: Yup.string()
    .required('OTP is required')
    .matches(/^[0-9]+$/, 'OTP must be numeric')
    .length(5, 'OTP must be exactly 5 digits'),
});

const OtpVerification = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { loading, error } = useSelector(state => state.auth);
  
  // Get email from navigation state or location state
  const email = location.state?.email;

  const handleSubmit = (values, { setSubmitting }) => {
    if (!email) {
      console.error('Email not available');
      return;
    }

    const reqData = {
      email,
      otp: values.otp
    };

    dispatch(Otpverifecation(reqData))
      .then(() => {
        navigate('/account/change-password', { state: { email } });
      })
      .catch(() => {
        setSubmitting(false);
      });
  };

  const handleResendOtp = () => {
    if (email) {
      dispatch(Forgotpassword(email)); // Reuse the forgot password action to resend
    }
  };

  return (
    <Box sx={{ maxWidth: 400, mx: 'auto', p: 3 }}>
      <Typography variant="h5" align="center" gutterBottom>
        Verify Your Account
      </Typography>
      <Typography variant="body2" color="text.secondary" align="center" sx={{ mb: 3 }}>
        We've sent a 6-digit code to {email || 'your email'}
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Formik
        initialValues={{ otp: '' }}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting, errors, touched }) => (
          <Form>
            <Field
              as={TextField}
              name="otp"
              label="Verification Code"
              fullWidth
              variant="outlined"
              margin="normal"
              error={touched.otp && Boolean(errors.otp)}
              helperText={touched.otp && errors.otp}
              inputProps={{
                inputMode: 'numeric',
                pattern: '[0-9]*',
                maxLength: 6,
              }}
            />
            
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              disabled={loading || isSubmitting}
              sx={{ mt: 2, mb: 2 }}
            >
              {loading ? <CircularProgress size={24} /> : 'Verify Code'}
            </Button>

            <Typography variant="body2" align="center" sx={{ mt: 2 }}>
              Didn't receive code?{' '}
              <Button 
                size="small" 
                onClick={handleResendOtp}
                disabled={loading}
                sx={{ textTransform: 'none' }}
              >
                Resend Code
              </Button>
            </Typography>
          </Form>
        )}
      </Formik>
    </Box>
  );
};

export default OtpVerification;