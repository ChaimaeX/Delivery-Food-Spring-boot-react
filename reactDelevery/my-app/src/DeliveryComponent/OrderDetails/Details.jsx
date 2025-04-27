import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Avatar,
  Box,
  Card,
  CardHeader,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Menu,
  MenuItem,
  Typography,
  IconButton,
  Divider,
  Stack
} from '@mui/material';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import { updateOrderStatus } from '../../component/State/Restaurant_order/Action';
import { assignOrder, findOrderById, findOrderStatus } from '../../component/State/Delivery/Action';

const Details = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { delivery } = useSelector((store) => store);
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const [menuAnchor, setMenuAnchor] = useState(null);
  const [currentOrderItem, setCurrentOrderItem] = useState(null);
  const jwt = localStorage.getItem('jwt');
  const [isAccepted, setIsAccepted] = useState(false);
  const [refrech, setRefrech] = useState(false);
  const [updateStatus, setUpdatestatus] = useState(false);


  const orderStatusOptions = [
    { label: 'Out For Delivery', value: 'OUT_FOR_DELIVERY' },
    { label: 'Delivered', value: 'DELIVERED' },
  ];

  const order = delivery.Order || {};

  console.log("order",delivery);
  

  const { customer, items = [], orderStatus, totalPrice, deliveryAddress ,accepted } = order;

  useEffect(() => {
    const reqdata = { jwt, status: false };
    dispatch(findOrderStatus(reqdata));
   
  }, [jwt, dispatch,id,refrech]);

  useEffect(()=>{
    setIsAccepted(accepted || false);
  },[accepted,id])

  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;

    const fetchOrder = async () => {
      try {
        const reqData = { orderId: id, jwt };
        await dispatch(findOrderById(reqData));
        setUpdatestatus(false)
      } catch (err) {
        if (err.name !== 'AbortError') {
          setError(err.message);
        }
      }
    };
    
    fetchOrder();
    

    return () => controller.abort();
  }, [id, dispatch, jwt,updateStatus]);

  const handleMenuClick = (e, orderItem) => {
    setCurrentOrderItem(orderItem);
    setMenuAnchor(e.currentTarget);
  };

  const handleMenuClose = () => {
    setMenuAnchor(null);
    setCurrentOrderItem(null);
  };

  const handleLocation = () => {
    if (deliveryAddress) {
      navigate(`/delivery/orders/${id}/location`, { state: { deliveryAddress } });
    }
  };

  const handleUpdateOrderStatus = async (newStatus) => {
    if (currentOrderItem) {
      await dispatch(updateOrderStatus({ 
        orderId: id,  
        orderStatus: newStatus,
        jwt 
      }));
      setUpdatestatus(true);
    }
    handleMenuClose(); 
    
  };

 

  const handleAccept = async () => {
    try {
      const reqdata = {
        jwt,
         orderId: id
      }
      await dispatch(assignOrder(reqdata));
      setIsAccepted(true);
      setRefrech(true);

    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      {error && (
        <Typography color="error" sx={{ mb: 2 }}>
          Error: {error}
        </Typography>
      )}

      {/* Customer Information Card */}
      <Card sx={{ mb: 3, p: 3, boxShadow: 3 }}>
        <Typography variant="h6" gutterBottom>
          Customer Information
        </Typography>
        <Divider sx={{ mb: 2 }} />
        
        <Stack spacing={2}>
          <Typography>
            <strong>ID:</strong> {order.customer?.id || 'N/A'}
          </Typography>
          <Typography>
            <strong>Name:</strong> {order.customer?.fullName || 'N/A'}
          </Typography>
          <Stack direction="row" alignItems="center" spacing={1}>
            <Typography>
              <strong>Location:</strong> {deliveryAddress?.streetAddress || 'N/A'}
            </Typography>
            <IconButton 
              color="primary" 
              onClick={handleLocation}
              disabled={!deliveryAddress}
            >
              <LocationOnIcon />
            </IconButton>
          </Stack>
        </Stack>
      </Card>

      {/* Order Items Table */}
      <Card sx={{ boxShadow: 3 }}>
        <CardHeader title="Order Details" />
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Item</TableCell>
                <TableCell>Restaurant</TableCell>
                <TableCell align="right">Price</TableCell>
                <TableCell align="right">Quantity</TableCell>
                <TableCell align="right">Ingredients</TableCell>
                <TableCell align="right">Status</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {order.items?.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>
                    <Stack direction="row" alignItems="center" spacing={2}>
                      <Avatar src={item.food?.images?.[0]} />
                      <Typography>{item.food?.name}</Typography>
                    </Stack>
                  </TableCell>
                  <TableCell>{item.food?.restaurant?.name}</TableCell>
                  <TableCell align="right">{item.totalPrice?.toFixed(2)}DH</TableCell>
                  <TableCell align="right">{item.quantity}</TableCell>
                  <TableCell align="right">
                    <Stack direction="row" spacing={1} justifyContent="flex-end">
                      {item.food?.integredients?.slice(0, 3).map((ing) => (
                        <Chip key={ing.id} label={ing.name} size="small" />
                      ))}
                      {item.food?.integredients?.length > 3 && (
                        <Chip label={`+${item.food.integredients.length - 3}`} size="small" />
                      )}
                    </Stack>
                  </TableCell>
                  <TableCell align="right">
                    <Chip 
                      label={order.orderStatus || 'PENDING'} 
                      color={
                        order.orderStatus === 'DELIVERED' ? 'success' : 
                        order.orderStatus === 'PENDING' ? 'warning':
                        order.orderStatus === 'OUT_FOR_DELIVERY' ? 'info' : 'default'
                      }
                      // onClick ={()=>handleUpdateOrderStatus()}
                    />
                  </TableCell>
                  <TableCell align="right">
                    <Button
                      size="small"
                      onClick={(e) => handleMenuClick(e, item)}
                    >
                      Update
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>

      {/* Order Actions */}
      <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
        <Button 
          variant="contained" 
          onClick={handleAccept}
          disabled={isAccepted}
          color={isAccepted ? 'success' : 'primary'}
        >
          {isAccepted ? 'Order Accepted' : 'Accept Order'}
        </Button>
        
        {!isAccepted && (
          <Button variant="outlined" color="error">
            Cancel
          </Button>
        )}
      </Box>

      {/* Status Update Menu */}
      <Menu
        anchorEl={menuAnchor}
        open={Boolean(menuAnchor)}
        onClose={handleMenuClose}
      >
        {orderStatusOptions.map((option) => (
          <MenuItem
            key={option.value}
            onClick={() => handleUpdateOrderStatus(option.value)}
          >
            {option.label}
          </MenuItem>
        ))}
      </Menu>
    </Box>
  );
};

export default Details;