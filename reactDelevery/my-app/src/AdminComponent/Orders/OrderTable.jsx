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
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchRestaurantOrder, updateOrderStatus } from '../../component/State/Restaurant_order/Action';

const orderStatusOptions = [
  { label: "Pending", value: "PENDING" },
  { label: "Completed", value: "COMPLETED" },
  { label: "Out For Delivery", value: "OUT_FOR_DELIVERY" },
  { label: "Delivered", value: "DELIVERED" },
];

const OrderTable = ({orders,loading}) => {
  const jwt = localStorage.getItem("jwt");
  const dispatch = useDispatch();
  const { restaurant } = useSelector((store) => store);
  
  const [menuAnchor, setMenuAnchor] = useState(null);
  const [currentOrderId, setCurrentOrderId] = useState(null);
  const [updatingOrderId, setUpdatingOrderId] = useState(null);
  const [error, setError] = useState(null);

  const handleMenuClick = (event, orderId) => {
    setMenuAnchor(event.currentTarget);
    setCurrentOrderId(orderId);
  };

  const handleMenuClose = () => {
    setMenuAnchor(null);
    setCurrentOrderId(null);
  };
  

  const handleUpdateOrder = async (orderStatus) => {
 
    if (!currentOrderId) return;
    
    try {
      setUpdatingOrderId(currentOrderId);
      setError(null);
      
      await dispatch(updateOrderStatus({ 
        orderId: currentOrderId, 
        orderStatus, 
        jwt 
      }));
      
      // Rafraîchir les commandes après la mise à jour
      await dispatch(fetchRestaurantOrder({
        jwt,
        restaurantId: restaurant.usersRestaurant?.id
      }));
      
    } catch (err) {
      console.error("Update failed:", err);
      setError("Failed to update order status");
    } finally {
      setUpdatingOrderId(null);
      handleMenuClose();
    }
  };

  if (!orders?.length) {
    return (
      <Box p={3} textAlign="center">
        <Typography variant="h6">Aucune commande trouvée</Typography>
      </Box>
    );
  }

  return (
    <Box>
      <Card className="mt-1">
        <CardHeader title="All Orders" sx={{ pt: 2, alignItems: 'center' }} />
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="order table">
            <TableHead>
              <TableRow>
                <TableCell>Id</TableCell>
                <TableCell align="right">Image</TableCell>
                <TableCell align="right">Customer</TableCell>
                <TableCell align="right">Price</TableCell>
                <TableCell align="right">Name</TableCell>
                <TableCell align="right">Ingredients</TableCell>
                <TableCell align="right">Status</TableCell>
                <TableCell align="right">Update</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {orders?.map((item) => (
                <TableRow
                  key={item.id}
                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                >
                  <TableCell component="th" scope="row">
                    {item.id}
                  </TableCell>
                  <TableCell align="right">
                    {item.items?.map((orderItem) => (
                      <Avatar
                        key={orderItem.food?.id || Math.random()}
                        src={orderItem.food?.images?.[0]}
                      />
                    ))}
                  </TableCell>
                  <TableCell align="right">
                    {item.customer?.fullName || "Unknown"}
                  </TableCell>
                  <TableCell align="right">{item.totalPrice || "0"} DH</TableCell>
                  <TableCell align="right">
                    {item.items?.map((orderItem) => (
                      <p key={orderItem.food?.id || Math.random()}>
                        {orderItem.food?.name || "N/A"}
                      </p>
                    ))}
                  </TableCell>
                  <TableCell align="right">
                    {item.items?.map((orderItem) => (
                      <div  key={orderItem.food?.id || Math.random()}>
                        {orderItem.food?.integredients?.map((ingredient) => (
                          <Chip  key={ingredient.id} label={ingredient.name} />
                        ))}
                      </div>
                    ))}
                  </TableCell>
                  <TableCell align="right">{item.orderStatus || "N/A"}</TableCell>
                  <TableCell align="right">
                    <Button
                      id="basic-button"
                      aria-controls={menuAnchor ? 'basic-menu' : undefined}
                      aria-haspopup="true"
                      aria-expanded={menuAnchor ? 'true' : undefined}
                      onClick={(e) => handleMenuClick(e, item.id)}
                    >
                      {item.orderStatus || "Update"}
                    </Button>
                    <Menu
                      anchorEl={menuAnchor}
                      open={currentOrderId === item.id && Boolean(menuAnchor)}
                      onClose={handleMenuClose}
                      MenuListProps={{
                        'aria-labelledby': 'basic-button',
                      }}
                    >
                      {orderStatusOptions.map((status) => (
                        <MenuItem
                          key={status.value}
                          onClick={() => handleUpdateOrder(status.value)}
                          disabled={item.orderStatus === status.value || updatingOrderId === item.id}
                        >
                          {status.label}
                        </MenuItem>
                      ))}
                    </Menu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>
    </Box>
  );
};

export default OrderTable;
