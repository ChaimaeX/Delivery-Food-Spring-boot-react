import { 
  Card, 
  FormControl, 
  FormControlLabel, 
  Radio, 
  RadioGroup, 
  Typography,
  Box,
  CircularProgress,
  Alert
} from '@mui/material';
import React, { useState, useEffect } from 'react';
import OrderTable from './OrderTable';
import { useDispatch, useSelector } from 'react-redux';
import { 
  fetchRestaurantOrder, 
  filterOrder 
} from '../../component/State/Restaurant_order/Action';

const orderStatusOptions = [
  { label: "Pending", value: "PENDING", color: "warning" },
  { label: "Completed", value: "COMPLETED", color: "success" },
  { label: "All Orders", value: "ALL", color: "default" },
];

const Orders = () => {
  const [filterValue, setFilterValue] = useState("ALL");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const dispatch = useDispatch();
  const { restaurant, restaurantOrder } = useSelector((store) => store);
  const jwt = localStorage.getItem("jwt");
  const restaurantId = restaurant.usersRestaurant?.id;

  const handleFilterChange = (event) => {
    setFilterValue(event.target.value);
  };

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        setError(null);
        
        if (filterValue === "ALL") {
          await dispatch(fetchRestaurantOrder({
            jwt,
            restaurantId
          }));
        } else {
          await dispatch(filterOrder({
            restaurantId,
            orderStatus: filterValue,
            jwt
          }));
        }
      } catch (err) {
        console.error("Failed to fetch orders:", err);
        setError("Failed to load orders. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    if (restaurantId && jwt) {
      fetchOrders();
    }
  }, [filterValue, restaurantId, dispatch, jwt]);

  return (
    <Box sx={{ p: 2 }}>
      <Card sx={{ p: 3, mb: 3 }}>
        <Typography variant='h5' gutterBottom>
          Order Status
        </Typography>
        
        <FormControl component="fieldset">
          <RadioGroup
            row
            aria-label="order-status"
            name="order-status-radio"
            value={filterValue}
            onChange={handleFilterChange}
          >
            {orderStatusOptions.map((item) => (
              <FormControlLabel
                key={item.value}
                value={item.value}
                control={<Radio color={item.color} />}
                label={item.label}
                sx={{ 
                  color: theme => theme.palette[item.color]?.main || 'text.primary',
                  mr: 3
                }}
              />
            ))}
          </RadioGroup>
        </FormControl>
      </Card>

      {loading ? (
        <Box display="flex" justifyContent="center" p={4}>
          <CircularProgress />
        </Box>
      ) : error ? (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      ) : (
        <OrderTable 
          orders={restaurantOrder?.orders || []} 
          loading={loading}
        />
      )}
    </Box>
  );
};

export default Orders;