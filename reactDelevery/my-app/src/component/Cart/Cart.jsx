import { Box, Button, Card, Divider, Grid, Modal, TextField } from '@mui/material';
import React from 'react';
import CartItem from './CartItem';
import AddressCard from './AddressCard';
import AddLocationAltIcon from '@mui/icons-material/AddLocationAlt';
import { ErrorMessage, Field, Form } from "formik";
import { Formik } from 'formik';
import { useDispatch, useSelector } from 'react-redux';
import { createOrder } from '../State/Order/Action';

// Vous pouvez activer la validation avec Yup ici si nécessaire
// import * as Yup from "yup";

export const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    outline:"none",
    boxShadow: 24,
    p: 4,
};

const initialValues = {
    streetAddress: "",
    state: "",
    pincode: "",
    city: ""
};

// Si vous avez besoin de validation, vous pouvez décommenter ce bloc
// const validationSchema = Yup.object({
//     streetAddress: Yup.string().required("Street address is required"),
//     state: Yup.string().required("State address is required"),
//     pincode: Yup.string().required("Pincode address is required"),
//     city: Yup.string().required("City address is required")
// });

const Cart = () => {
    const handleOpenAddressModal = () => setOpen(true);
    const [open, setOpen] = React.useState(false);
    const { cart, auth } = useSelector(state => state);
    const handleClose = () => setOpen(false);
    const dispatch = useDispatch();

    const handleSubmit = (values) => {
        
        const data = {
            jwt: localStorage.getItem("jwt"),
            order: {
                restaurantId: cart.cartItems[0].food?.restaurant.id, // à ajuster si nécessaire
                delivery: {
                    fullName: auth.user?.fullName,
                    streetAddress: values.streetAddress,
                    city: values.state,
                    postalCode: values.pincode,
                    country: "Morocco", // Assurez-vous que le nom du pays est correct
                },
            },
        };

        // Dispatch de l'action createOrder
        dispatch(createOrder(data));

        // Log pour les valeurs du formulaire
        console.log("Valeurs du formulaire :", data);
    };

    return (
        <>
            <main className="lg:flex justify-between">
                <section className="lg:w-[30%] space-y-6 lg:min-h-screen pt-10 pl-4">
                    {cart.cartItems.map((item) => (
                        <CartItem item={item} />
                    ))}

                    <Divider />

                    <div className="billDetails px-5 text-sm">
                        <p className="font-extralight py-5">Bill Details</p>
                        <div className="space-y-3">
                            <div className="flex justify-between text-gray-400">
                                <p>Item Total</p>
                                <p>DH{cart.cart?.total}</p>
                            </div>
                            <div className="flex justify-between text-gray-400">
                                <p>Delivery Fee</p>
                                <p>DH120</p>
                            </div>
                            <div className="flex justify-between text-gray-400">
                                <p>GST AND Restaurant Charges</p>
                                <p>DH33</p>
                            </div>
                            <Divider />
                        </div>

                        <div className="flex justify-between text-gray-400">
                            <p>Total Pay</p>
                            <p>DH{cart.cart?.total + 33 + 120}</p>
                        </div>
                    </div>
                </section>

                <Divider orientation='vertical' flexItem />

                <section className='lg:w-[70%] flex justify-center px-5 pb-10 lg:pb-0'>
                    <div>
                        <h1 className='text-center font-semibold text-2xl py-10'>Choose Delivery Address</h1>
                        <div className='flex gap-5 flex-wrap justify-center'>
                            {[1, 1, 1, 1, 1].map((item, index) => (
                                <AddressCard key={index} item={item} showButton={true} />
                            ))}

                            <Card className="flex gap-5 w-64 p-5">
                                <AddLocationAltIcon />
                                <div className='space-y-3 text-gray-500'>
                                    <h1 className='font-semibold text-lg text-white'>Add new Address</h1>
                                    <Button variant="outlined" fullWidth onClick={handleOpenAddressModal}>Add</Button>
                                </div>
                            </Card>
                        </div>
                    </div>
                </section>
            </main>

            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style}>
                    <Formik
                        initialValues={initialValues}
                        // validationSchema={validationSchema} // Décommentez si vous utilisez Yup
                        onSubmit={handleSubmit}
                    >
                        <Form>
                            <Grid container spacing={2}>
                                <Grid item xs={12}>
                                    <Field
                                        as={TextField}
                                        name="streetAddress"
                                        label="Street Address"
                                        fullWidth
                                        variant="outlined"
                                    />
                                    <ErrorMessage name="streetAddress" component="div" className="text-red-600" />
                                </Grid>
                                <Grid item xs={12}>
                                    <Field
                                        as={TextField}
                                        name="state"
                                        label="State"
                                        fullWidth
                                        variant="outlined"
                                    />
                                    <ErrorMessage name="state" component="div" className="text-red-600" />
                                </Grid>
                                <Grid item xs={12}>
                                    <Field
                                        as={TextField}
                                        name="city"
                                        label="City"
                                        fullWidth
                                        variant="outlined"
                                    />
                                    <ErrorMessage name="city" component="div" className="text-red-600" />
                                </Grid>
                                <Grid item xs={12}>
                                    <Field
                                        as={TextField}
                                        name="pincode"
                                        label="Pincode"
                                        fullWidth
                                        variant="outlined"
                                    />
                                    <ErrorMessage name="pincode" component="div" className="text-red-600" />
                                </Grid>

                                <Grid item xs={12}>
                                    <Button variant='contained' type='submit' color='primary'>Deliver Here</Button>
                                </Grid>
                            </Grid>
                        </Form>
                    </Formik>
                </Box>
            </Modal>
        </>
    );
};

export default Cart;
