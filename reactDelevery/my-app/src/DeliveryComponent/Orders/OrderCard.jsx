import { Button, Card, Typography, Box, Avatar, Chip, Divider } from '@mui/material';
import React from 'react';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PersonIcon from '@mui/icons-material/Person';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import { styled } from '@mui/system';

const StatusChip = styled(Chip)(({ theme }) => ({
  fontWeight: 'bold',
  textTransform: 'uppercase',
  fontSize: '0.75rem',
  minWidth: 100,
}));

const OrderCard = ({ order }) => {
  const getStatusColor = (status) => {
    switch(status) {
      case 'PENDING': return 'warning';
      case 'OUT_FOR_DELIVERY': return 'info';
      case 'DELIVERED': return 'success';
      case 'CANCELLED': return 'error';
      default: return 'primary';
    }
  };

  return (
    <Card sx={{ 
      mb: 2, 
      borderRadius: 2,
      boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
      transition: 'transform 0.2s, box-shadow 0.2s',
      '&:hover': {
        transform: 'translateY(-2px)',
        boxShadow: '0px 6px 16px rgba(0, 0, 0, 0.15)'
      }
    }}>
      <Box sx={{ p: 3 }}>
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 2
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Avatar sx={{ 
              bgcolor: 'primary.main', 
              mr: 2,
              width: 56, 
              height: 56
            }}>
              <PersonIcon fontSize="large" />
            </Avatar>
            <Box>
              <Typography variant="h6" fontWeight="bold">
                {order.customer?.fullName || 'Client inconnu'}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Commande #{order.id}
              </Typography>
            </Box>
          </Box>
          
          <StatusChip 
            label={order.orderStatus} 
            color={getStatusColor(order.orderStatus)}
            variant="outlined"
          />
        </Box>
        
        <Divider sx={{ my: 2 }} />
        
        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <LocationOnIcon color="primary" sx={{ mr: 1 }} />
            <Typography variant="body2">
              {order.deliveryAddress?.streetAddress || 'Adresse non spécifiée'}
            </Typography>
          </Box>
          
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <AccessTimeIcon color="action" sx={{ mr: 1 }} />
            <Typography variant="caption" color="text.secondary">
              {new Date(order.createdAt).toLocaleString()}
            </Typography>
          </Box>
        </Box>
        
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between',
          mt: 3,
          pt: 2,
          borderTop: '1px dashed',
          borderColor: 'divider'
        }}>
          <Typography variant="body1">
            <strong>Total:</strong> DH{order.totalPrice?.toFixed(2) || '0.00'}
          </Typography>
          
          <Button 
            variant="contained" 
            size="small"
            color="primary"
            sx={{ borderRadius: 2 }}
          >
            Voir détails
          </Button>
        </Box>
      </Box>
    </Card>
  );
};

export default OrderCard;