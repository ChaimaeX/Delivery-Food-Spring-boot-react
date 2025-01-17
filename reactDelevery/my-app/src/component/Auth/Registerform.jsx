import { TextField, Typography, Button } from '@mui/material';
import { Field, Form, Formik } from 'formik';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { useDispatch } from 'react-redux';  // N'oubliez pas d'importer useDispatch si vous l'utilisez
import { registerUser, RegisterUser } from '../State/Authentication/Action';

const initialValues = {
    fullName: '',
    email: '',
    password: '',
    role: 'ROLE_CUSTOMER',  // Utilisation de 'role' pour la clé
};

const Registerform = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const handleSubmit = (values) => {
        console.log('Form Data:', values);
        dispatch(registerUser({ userData: values, navigate })); // Assurez-vous que RegisterUser est bien défini
    };

    return (
        <div>
            <Typography variant="h5" className="text-center">
                Register
            </Typography>
            <Formik initialValues={initialValues} onSubmit={handleSubmit}>
                {({ values, handleChange, handleBlur }) => (
                    <Form>
                        {/* Full Name Field */}
                        <Field
                            as={TextField}
                            name="fullName"
                            label="Full Name"
                            fullWidth
                            variant="outlined"
                            margin="normal"
                        />
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

                        {/* Role Field */}
                        <FormControl fullWidth variant="outlined" margin="normal">
                            <InputLabel id="role-select-label">Role</InputLabel>
                            <Select
                                labelId="role-select-label"
                                id="role-select"
                                name="role"
                                value={values.role}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                label="Role"
                            >
                                <MenuItem value="ROLE_CUSTOMER">Customer</MenuItem>
                                <MenuItem value="ROLE_RESTAURANT_OWNER">Restaurant Owner</MenuItem>
                            </Select>
                        </FormControl>

                        {/* Submit Button */}
                        <Button
                            type="submit"
                            variant="contained"
                            color="primary"
                            fullWidth
                            sx={{ marginTop: '16px' }}
                        >
                            Register
                        </Button>
                    </Form>
                )}
            </Formik>
            <Typography variant="body2" align="center" sx={{ mt: 3 }}>
                Already have an account?
                <Button size="small" onClick={() => navigate("/account/login")}>
                    Login
                </Button>
            </Typography>
        </div>
    );
};

export default Registerform;
