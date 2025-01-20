import { Chip, IconButton } from '@mui/material';
import React from 'react';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { removeCartItem, updateCartItem } from '../State/Cart/Action';

const CartItem = ({ item }) => {
  const { auth, cart } = useSelector((store) => store);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const jwt = localStorage.getItem('jwt');
  const { loading } = cart; // Récupère l'état de chargement du panier
  
  const handleUpdateCartItem = async (value) => {
    if (value === -1 && item.quantity <= 1) {
      handleRemoveCartItem();
    } else {
      const data = { cartItemId: item.id, quantity: item.quantity + value };
       dispatch(updateCartItem({ data, jwt }));
    }
  };

  const handleRemoveCartItem = () => {
    dispatch(removeCartItem({ cartItemId: item.id, jwt: auth.jwt || jwt }));
  };

  return (
    <div className="px-5">
      <div className="lg:flex items-center lg:space-x-5">
        {/* Image de l'élément du panier */}
        <img
          className="w-[5rem] h-[5rem] object-cover"
          src={item.food.images?.[0] || '/placeholder.jpg'}
          alt={item.food.name || 'Food Image'}
        />
        
        <div className="flex items-center justify-between lg:w-[70%]">
          <div className="space-y-1 lg:space-y-3 w-full">
            <p>{item.food.name}</p>
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-1">
                {/* Boutons pour augmenter et diminuer la quantité */}
                <IconButton onClick={() => handleUpdateCartItem(-1)} disabled={loading}>
                  <RemoveCircleOutlineIcon />
                </IconButton>
                <div className="w-5 h-5 text-xs flex items-center justify-center">
                  {item.quantity}
                </div>
                <IconButton onClick={() => handleUpdateCartItem(1)} disabled={loading}>
                  <AddCircleOutlineIcon />
                </IconButton>
              </div>
            </div>
          </div>

          <p>{item.totalPrice} DH</p>
        </div>
      </div>

      {/* Liste des ingrédients */}
      <div className="pt-3 space-x-2">
        {item.ingredients?.map((ingredient, index) => (
          <Chip key={index} label={ingredient} />
        ))}
      </div>
    </div>
  );
};

export default CartItem;
