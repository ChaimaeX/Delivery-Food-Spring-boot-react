import { Alert, Box, Button, Card, CircularProgress, Divider, Snackbar, Typography } from '@mui/material';
import React, { useEffect, useState, useCallback } from 'react';
import CartItem from './CartItem';
import AddressCard from './AddressCard';
import AddLocationAltIcon from '@mui/icons-material/AddLocationAlt';
import { useDispatch, useSelector } from 'react-redux';
import { createOrder, DeleteAddress, getUsersAddress, getUsersOrders } from '../State/Order/Action';
import { useLocation, useNavigate } from 'react-router-dom';
import { findCart } from '../State/Cart/Action';

const Cart = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const location = useLocation();
    const { cart, auth, order } = useSelector(state => state);
    const jwt = localStorage.getItem("jwt");

    const [deliveryData, setDeliveryData] = useState(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [selectedAddress, setSelectedAddress] = useState(null);
    const [isSelectingAddress, setIsSelectingAddress] = useState(false);
    const [snackbar, setSnackbar] = useState({
        open: false,
        message: "",
        severity: "info"
    });

    const totalPrice = cart.cart?.total || 0;
    const deliveryFee = 10;
    const taxes = 33;
    const grandTotal = totalPrice + deliveryFee + taxes;
    

    useEffect(()=>{
        setDeliveryData(location.state?.deliveryData);
        console.log("deliveryData",deliveryData);
        
    },[location])
   
    const handleOpenAddressModal = () => {
        if (!cart.cartItems.length) {
            setSnackbar({
                open: true,
                message: "Your cart is empty",
                severity: "warning"
            });
            return;
        }
        navigate('/Cart/Location');
    };

    const confirmDelivery = useCallback(async (addressParam = null) => {
      const addressToUse = addressParam || selectedAddress || deliveryData;
      
      if (!addressToUse) {
          setSnackbar({
              open: true,
              message: "Please select or add a delivery address",
              severity: "error"
          });
          return;
      }
  
      if (!cart.cartItems.length) {
          setSnackbar({
              open: true,
              message: "Your cart is empty",
              severity: "warning"
          });
          return;
      }
  
      setIsProcessing(true);
  
      try {
          // Vérifier si le restaurant a une adresse valide
          const restaurantAddress = cart.cartItems[0]?.food?.restaurant?.address;
          if (!restaurantAddress || !restaurantAddress.latitude || !restaurantAddress.longitude) {
              throw new Error("Restaurant address is incomplete");
          }
  
          // Vérifier si l'adresse de livraison a des coordonnées valides
          if (!addressToUse.latitude || !addressToUse.longitude) {
              throw new Error("Delivery address is incomplete");
          }
  
          // Calculer la distance (formule Haversine)
          const R = 6371; // Rayon de la Terre en km
          const lat1 = restaurantAddress.latitude;
          const lon1 = restaurantAddress.longitude;
          const lat2 = addressToUse.latitude;
          const lon2 = addressToUse.longitude;
  
          const dLat = (lat2 - lat1) * Math.PI / 180;
          const dLon = (lon2 - lon1) * Math.PI / 180;
  
          const a = 
              Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
              Math.sin(dLon/2) * Math.sin(dLon/2);
          
          const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
          const distance = (R * c).toFixed(2);
  
          // Vérifier si la distance est supérieure à 2 km
          if (distance > 2) {
              setSnackbar({
                  open: true,
                  message: "Désolé, nous ne livrons pas au-delà de 2 km du restaurant",
                  severity: "error"
              });
              return;
          }
  
          // Créer la commande si la distance est acceptable
          const orderData = {
              jwt: jwt,
              order: {
                  restaurantId: cart.cartItems[0].food?.restaurant?.id,
                  delivery: {
                      ...addressToUse,
                      fullName: auth.user?.fullName || "Customer"
                  }
               
              }
          };
  
          console.log("orderData",orderData);
          
         // Création de la commande et attente du résultat
         const result = await dispatch(createOrder(orderData));
        
         // Vérification du résultat avant navigation
         if (result?.id) {
             navigate(`/payment/success/${result?.id}`, { 
                 state: { 
                     orderId: result?.id,
                     totalAmount: grandTotal,
                     deliveryAddress: addressToUse
                 } 
             });
         } else {
             throw new Error("Order creation failed - no order ID received");
         }
        } catch (error) {
            console.error("Order creation failed:", error);
            setSnackbar({
                open: true,
                message: error.message || "Failed to create order",
                severity: "error"
            });
        } finally {
            setIsProcessing(false);
        } 
    }, [selectedAddress, deliveryData, cart.cartItems, auth.user?.fullName, dispatch, navigate, order.order?.id, jwt, grandTotal]);

    const handleSelectAddress = useCallback((address) => {
        if (!cart.cartItems.length) {
            setSnackbar({
                open: true,
                message: "Your cart is empty",
                severity: "warning"
            });
            return;
        }
        
        if (!address || !address.streetAddress || !address.city) {
            setSnackbar({
                open: true,
                message: "Please select a complete address",
                severity: "error"
            });
            return;
        }

        setIsSelectingAddress(true);
        try {
            setSelectedAddress(address);
            // confirmDelivery(address);
        } finally {
            setIsSelectingAddress(false);
        }
    }, [cart.cartItems.length, confirmDelivery]);

    const handleRemoveAddress = async (id) => {
        try {
            const reqData = { id, jwt };
            await dispatch(DeleteAddress(reqData));
            
            setSnackbar({
                open: true,
                message: "Address deleted successfully",
                severity: "success"
            });
            
            dispatch(getUsersAddress({jwt}));
        } catch (error) {
            console.error("Failed to delete address:", error);
            setSnackbar({
                open: true,
                message: "Failed to delete address",
                severity: "error"
            });
        }
    };

    useEffect(() => {
        dispatch(getUsersAddress({jwt}));
        dispatch(findCart(jwt));
    }, [dispatch, jwt]);

    useEffect(() => {
        if (location.state?.deliveryData) {
            setDeliveryData(location.state.deliveryData);
            setSnackbar({
                open: true,
                message: "Location selected successfully",
                severity: "success"
            });
        }
    }, [location]);

    const SnackbarAlert = () => (
        <Snackbar
            open={snackbar.open}
            autoHideDuration={6000}
            onClose={() => setSnackbar(prev => ({...prev, open: false}))}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
            <Alert
                onClose={() => setSnackbar(prev => ({...prev, open: false}))}
                severity={snackbar.severity}
                sx={{ width: '100%' }}
            >
                {snackbar.message}
            </Alert>
        </Snackbar>
    );

    return (
        <>
            <main className="lg:flex justify-between">
                <section className="lg:w-[30%] space-y-6 lg:min-h-screen pt-10 pl-4">
                    {cart.cartItems.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full">
                            <Typography variant="h6" className="mb-4 text-center">
                                Your cart is empty
                            </Typography>
                            <img 
                                src="./cart-icon-28340.png" 
                                alt="Empty cart" 
                                className="w-32 h-32 opacity-50" 
                                style={{
                                    filter: 'grayscale(30%)',
                                    transition: 'all 0.3s ease',
                                }}
                            />
                            <Button
                                variant="contained" 
                                color="primary" 
                                className="mt-6"
                                onClick={() => navigate('/')}
                            >
                                Browse Restaurants
                            </Button>
                        </div>
                    ) : (
                        <>
                            {cart.cartItems.map((item) => (
                                <CartItem key={item.id} item={item} />
                            ))}

                            <Divider />

                            <div className="billDetails px-5 text-sm">
                                <Typography variant="subtitle1" className="py-5">Bill Details</Typography>
                                <div className="space-y-3">
                                    <div className="flex justify-between text-gray-400">
                                        <p>Item Total</p>
                                        <p>DH{totalPrice.toFixed(2)}</p>
                                    </div>
                                    <div className="flex justify-between text-gray-400">
                                        <p>Delivery Fee</p>
                                        <p>DH{deliveryFee.toFixed(2)}</p>
                                    </div>
                                    <div className="flex justify-between text-gray-400">
                                        <p>GST and Restaurant Charges</p>
                                        <p>DH{taxes.toFixed(2)}</p>
                                    </div>
                                    <Divider />
                                </div>

                                <div className="flex justify-between text-gray-400 font-medium">
                                    <p>Total Pay</p>
                                    <p>DH{grandTotal.toFixed(2)}</p>
                                </div>
                            </div>
                        </>
                    )}
                </section>

                <Divider orientation='vertical' flexItem />

                <section className='lg:w-[70%] flex justify-center px-5 pb-10 lg:pb-0'>
                    <div>
                        <Typography variant="h4" className='text-center py-10'>
                            Choose Delivery Address
                        </Typography>
                        <div className='flex gap-5 flex-wrap justify-center'>
                            {order.address.map((item) => (
                                <AddressCard 
                                    key={item.id}
                                    item={item}
                                    showButton={true}
                                    handleSelectAddress={() => handleSelectAddress(item)}
                                    handleRemoveAddress={() => handleRemoveAddress(item.id)}
                                    disabled={isSelectingAddress}
                                />
                            ))}
                            <SnackbarAlert />

                            <Card className="flex gap-5 w-64 p-5">
                                <AddLocationAltIcon />
                                <div className='space-y-3 text-gray-500'>
                                    <Typography variant="h6" className='text-white'>
                                        Add new Address
                                    </Typography>
                                    <Button 
                                        variant="outlined" 
                                        fullWidth 
                                        onClick={handleOpenAddressModal}
                                    >
                                        Add
                                    </Button>
                                </div>
                            </Card>
                        </div>

                        {(selectedAddress || deliveryData) && (
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={() => confirmDelivery()}
                                disabled={isProcessing}
                                fullWidth
                                sx={{ 
                                    mt: 2,
                                    position: 'relative'
                                }}
                            >
                                <Box component="span" sx={{ opacity: isProcessing ? 0 : 1 }}>
                                    Confirm Delivery
                                </Box>
                                {isProcessing && (
                                    <CircularProgress
                                        size={24}
                                        sx={{
                                            position: 'absolute',
                                            top: '50%',
                                            left: '50%',
                                            marginTop: '-12px',
                                            marginLeft: '-12px',
                                        }}
                                    />
                                )}
                            </Button>
                        )}
                    </div>
                </section>
            </main>
        </>
    );
}; 

export default Cart;