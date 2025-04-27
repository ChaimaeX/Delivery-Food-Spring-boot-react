import React from 'react';
import Cart from './Cart';
import HomeIcon from '@mui/icons-material/Home';
import { Button, Card } from '@mui/material';
import ClearIcon from '@mui/icons-material/Clear';
import { DeleteAddress } from '../State/Order/Action';
import { useDispatch, useSelector } from 'react-redux';

const AddressCard = ({ item, showButton, handleSelectAddress, handleRemoveAddress }) => {
   const dispatch = useDispatch();
   const [isDeleting, setIsDeleting] = React.useState(false);

   const handleSelect = () => {
     // Vérifie que la fonction existe et que l'adresse est valide
     if (handleSelectAddress && item) {
       handleSelectAddress(item.deliveryAddress);
     }
   };

   const handleRemove = (id) => {
     if (handleRemoveAddress && item?.id) {
       handleRemoveAddress(item.id);
     }
   };

  return (
    <Card className="flex gap-5 w-64 p-5 justify-between">
      <div className="flex gap-5">
        <HomeIcon />
        
        <div className="space-y-3 text-gray-500">
          <h1 className="font-semibold text-lg text-white">Home</h1>
          <p>{item?.streetAddress}</p>
          <p>{item?.country}</p>
          <p>{item?.city}</p>
          <p>{item?.stateProvince}</p>
          
          {showButton && (
            <Button 
              variant="outlined" 
              fullWidth 
              onClick={handleSelect} // Utilise la fonction intermédiaire
            >
              Select
            </Button>
          )}
        </div>
      </div>
      {showButton && (
        <ClearIcon 
          className="cursor-pointer" 
          onClick={handleRemove} // Utilise la fonction intermédiaire
        />
      )}
    </Card>
  );
};

export default AddressCard;