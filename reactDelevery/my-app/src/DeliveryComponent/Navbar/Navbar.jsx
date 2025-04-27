import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  AppBar,
  Toolbar,
  Avatar, 
  Badge, 
  Box, 
  Divider, 
  IconButton, 
  List, 
  ListItem, 
  ListItemAvatar,
  ListItemButton, 
  ListItemText, 
  Popover, 
  Typography,
  Chip,
  Stack,
  CircularProgress
} from '@mui/material';
import NotificationsIcon from '@mui/icons-material/Notifications';
import PopupState, { bindTrigger, bindPopover } from 'material-ui-popup-state';
import { useDispatch, useSelector } from 'react-redux';
import { findOrderStatus } from '../../component/State/Delivery/Action';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import DeliveryDiningIcon from '@mui/icons-material/DeliveryDining';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

const Navbar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { delivery, auth } = useSelector((store) => store);
  const jwt = localStorage.getItem("jwt") || auth.jwt || '';

  // Initialisation sécurisée
  const statusOrders = Array.isArray(delivery.statusOrders) ? delivery.statusOrders : [];
  const orderCount = statusOrders.length;

  const handleOrder = (id, popupState) => {
    navigate(`/delivery/orders/${id}`);
    popupState.close();
  };

  useEffect(() => {
    const reqdata = { jwt, status: false };
    dispatch(findOrderStatus(reqdata));
  }, []);

  return (
    <AppBar position="sticky" sx={{ backgroundColor: '#e91e63', boxShadow: 'none' }}>
      <Toolbar sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', px: { xs: 2, md: 4 } }}>
        {/* Logo */}
        <Typography 
          variant="h6" 
          onClick={() => navigate("/delivery")}
          sx={{ cursor: 'pointer', fontFamily: 'serif', fontWeight: 'bold', color: 'white' }}
        >
          Chaimae-Food
        </Typography>

        {/* Notification Button */}
        <PopupState variant="popover" popupId="notification-popover">
          {(popupState) => (
            <Box>
              <IconButton
                size="large"
                color="inherit"
                {...bindTrigger(popupState)}
                sx={{ color: 'white', '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.1)' } }}
              >
                <Badge badgeContent={orderCount} color="error" overlap="circular">
                  <NotificationsIcon />
                </Badge>
              </IconButton>
              
              <Popover
                {...bindPopover(popupState)}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                sx={{ 
                  '& .MuiPaper-root': {
                    width: 350,
                    maxHeight: 500,
                    borderRadius: 2,
                    boxShadow: 3,
                    mt: 1
                  }
                }}
              >
                <Box sx={{ p: 2 }}>
                  <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1, display: 'flex', alignItems: 'center' }}>
                    Commandes en attente
                    <Chip label={orderCount} size="small" color="primary" sx={{ ml: 1 }} />
                  </Typography>
                  
                  <Divider sx={{ my: 1 }} />
                  
                  {delivery.loading ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', py: 3 }}>
                      <CircularProgress />
                    </Box>
                  ) : orderCount === 0 ? (
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', py: 3 }}>
                      <CheckCircleIcon color="success" sx={{ fontSize: 60, mb: 1 }} />
                      <Typography variant="body1" color="text.secondary">
                        Aucune nouvelle commande
                      </Typography>
                    </Box>
                  ) : (
                    <List dense>
                      {statusOrders.map((order) => (
                        <React.Fragment key={order.id || Math.random()}>
                          <ListItem 
                            disablePadding
                            onClick={() => handleOrder(order.id, popupState)}
                            sx={{
                              '&:hover': { backgroundColor: 'action.hover' },
                              borderRadius: 1,
                              mb: 1
                            }}
                          >
                            <ListItemButton sx={{ py: 1.5 }}>
                              <ListItemAvatar>
                                <Avatar sx={{ bgcolor: 'primary.main' }}>
                                  <RestaurantIcon />
                                </Avatar>
                              </ListItemAvatar>
                              
                              <ListItemText
                                primary={
                                  <Stack direction="row" spacing={1} alignItems="center">
                                    <Typography variant="subtitle1" fontWeight="medium">
                                      {order.customer?.fullName || 'Client inconnu'}
                                    </Typography>
                                    <Chip 
                                      label={order.orderStatus || 'N/A'} 
                                      size="small" 
                                      color={
                                        order.orderStatus === 'PENDING' ? 'warning' : 
                                        order.orderStatus === 'DELIVERED' ? 'success' : 'primary'
                                      }
                                    />
                                  </Stack>
                                }
                                secondary={
                                  <>
                                    <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}>
                                      <DeliveryDiningIcon fontSize="small" sx={{ mr: 0.5 }} />
                                      {order.deliveryAddress?.streetAddress || 'Adresse non spécifiée'}
                                    </Typography>
                                    <Typography variant="caption" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}>
                                      <AccessTimeIcon fontSize="small" sx={{ mr: 0.5 }} />
                                      {order.createdAt ? new Date(order.createdAt).toLocaleString() : 'Date inconnue'}
                                    </Typography>
                                  </>
                                }
                              />
                            </ListItemButton>
                          </ListItem>
                          <Divider variant="inset" component="li" />
                        </React.Fragment>
                      ))}
                    </List>
                  )}
                </Box>
              </Popover>
            </Box>
          )}
        </PopupState>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;