import { TextField, Typography, Button, Snackbar, Alert, CircularProgress } from '@mui/material';
import { Field, Form, Formik } from 'formik';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { useDispatch, useSelector } from 'react-redux';
import { registerUser } from '../State/Authentication/Action';
import * as Yup from 'yup';

const initialValues = {
    fullName: '',
    email: '',
    password: '',
    role: 'ROLE_CUSTOMER'
};

const validationSchema = Yup.object().shape({
    fullName: Yup.string().required('Full name is required'),
    email: Yup.string().email('Invalid email').required('Email is required'),
    password: Yup.string()
        .min(8, 'Password must be at least 8 characters')
        .required('Password is required'),
    role: Yup.string().required('Role is required')
});

const RegisterForm = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { error, message, loading } = useSelector(state => state.auth);
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState('success');
    const [verifiedEmail, setVerifiedEmail] = useState(false);

    useEffect(() => {
        if (error) {
            if(error.includes('Email is already used with another account')){
                setSnackbarMessage(error);
                setSnackbarSeverity('error');
                setOpenSnackbar(true);
            }
               
        } else if (message) {  
            // if (message.includes('Registration successful')) {
            //     setTimeout(() => navigate('/account/login'), 2000);
            // } else 
            if (message.includes('Registration successful Please Check your email to Verefication')) {
                setVerifiedEmail(true);
            }else{
                showSnackbar(message, 'success');
            }
        }
    }, [error, message, navigate]);

    const showSnackbar = (message, severity) => {
        setSnackbarMessage(message);
        setSnackbarSeverity(severity);
        setOpenSnackbar(true);
    };

    const handleSubmit = (values, { setSubmitting }) => {
        // Créez un objet avec la structure attendue par votre backend
        const userData = {
            fullName: values.fullName,
            email: values.email,
            password: values.password,
            role: values.role
        };
        
        dispatch(registerUser(userData));
        setSubmitting(false);
    };
    
    const handleVerfied = () =>{
        navigate("/account/login");
        setVerifiedEmail(false);
    }

    const handleCloseSnackbar = (event, reason) => {
        if (reason === 'clickaway') return;
        setOpenSnackbar(false);
    };

    return (
        <div className="max-w-md mx-auto p-4">
            {!verifiedEmail ? (
                <>
                    <Typography variant="h5" className="text-center" gutterBottom>
                        Register
                    </Typography>
                    
                    <Formik 
                        initialValues={initialValues} 
                        onSubmit={handleSubmit}
                        validationSchema={validationSchema}
                    >
                        {({ values, handleChange, handleBlur, errors, touched, isSubmitting }) => (
                             <Form>
                             <Field
                                 as={TextField}
                                 name="fullName"
                                 label="Full Name"
                                 fullWidth
                                 variant="outlined"
                                 margin="normal"
                                 required
                                 error={touched.fullName && Boolean(errors.fullName)}
                                 helperText={touched.fullName && errors.fullName}
                             />
                             
                             <Field
                                 as={TextField}
                                 name="email"
                                 label="Email"
                                 type="email"
                                 fullWidth
                                 variant="outlined"
                                 margin="normal"
                                 required
                                 error={touched.email && Boolean(errors.email)}
                                 helperText={touched.email && errors.email}
                             />
                             
                             <Field
                                 as={TextField}
                                 type="password"
                                 name="password"
                                 label="Password"
                                 fullWidth
                                 variant="outlined"
                                 margin="normal"
                                 required
                                 error={touched.password && Boolean(errors.password)}
                                 helperText={touched.password && errors.password}
                             />
     
                             <FormControl 
                                 fullWidth 
                                 variant="outlined" 
                                 margin="normal"
                                 error={touched.role && Boolean(errors.role)}
                             >
                                 <InputLabel id="role-select-label">Role</InputLabel>
                                 <Select
                                     labelId="role-select-label"
                                     id="role-select"
                                     name="role"
                                     value={values.role}
                                     onChange={handleChange}
                                     onBlur={handleBlur}
                                     label="Role"
                                     required
                                 >
                                     <MenuItem value="ROLE_ADMIN">Admin</MenuItem>
                                     <MenuItem value="ROLE_CUSTOMER">Customer</MenuItem>
                                     <MenuItem value="ROLE_RESTAURANT_OWNER">Restaurant Owner</MenuItem>
                                     <MenuItem value="ROLE_LIVREUR">Deliverer</MenuItem>
                                 </Select>
                                 {touched.role && errors.role && (
                                     <Typography color="error" variant="caption">
                                         {errors.role}
                                     </Typography>
                                 )}
                             </FormControl>
     
                             <Button
                                 type="submit"
                                 variant="contained"
                                 color="primary"
                                 fullWidth
                                 sx={{ 
                                     marginTop: '16px',
                                     height: '48px'
                                 }}
                                 disabled={loading || isSubmitting}
                             >
                                 {loading ? (
                                     <CircularProgress size={24} color="inherit" />
                                 ) : (
                                     'Register'
                                 )}
                             </Button>
                         </Form>
                        )}
                    </Formik>
                </>
            ) : (
                <div className="text-center">
                    <Typography variant="h6" gutterBottom>
                        Registration Successful!
                    </Typography>
                    <Typography variant="body1" sx={{ mb: 2 }}>
                        Please check your email for verification.
                    </Typography>
                    <Button 
                        variant="contained" 
                        onClick={() =>handleVerfied()}
                    >
                        Go to Login
                    </Button>
                </div>
            )}

            <Typography variant="body2" align="center" sx={{ mt: 3 }}>
                Already have an account?
                <Button 
                    size="small" 
                    onClick={() => navigate("/account/login")}
                    sx={{ ml: 1 }}
                >
                    Login
                </Button>
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
                    variant="filled"
                >
                    {snackbarMessage}
                </Alert>
            </Snackbar>
        </div>
    );
};

export default RegisterForm;