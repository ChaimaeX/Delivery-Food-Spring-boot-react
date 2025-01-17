import React, { useState } from 'react';
import {
  Button,
  TextField,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Chip,
  Box,
  OutlinedInput,
} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { createIngredientCategory } from '../../component/State/ingredients/Action';
import { store } from '../../component/State/Store';

const CreateIngredientsCategoryFrom = () => {
  const jwt =localStorage.getItem("jwt")
  const  {restaurant}=useSelector(store=>store)
  const dispatch =useDispatch()
  const [formData, setFormData] = useState({
    name: '',
   
  });

  const handleSubmit = (e) => {
    e.preventDefault()
    const data = {
      name: formData.name, // Utiliser `name` au lieu de `categoryName`
      restaurantId: restaurant.usersRestaurant.id,
      
    };
    console.log('Form data submitted:', formData);
    dispatch(createIngredientCategory({data,jwt}))
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSelectChange = (event) => {
    const { value } = event.target;
    setFormData({
      ...formData,
      IngredientCategoryId: typeof value === 'string' ? value.split(',') : value, // Gérer les sélections multiples
    });
  };

  return (
    <div>
      <div className="p-5">
        <h1 className="text-gray-400 text-center text-xl pb-10">Create Ingredients Category</h1>
        <form onSubmit={handleSubmit} className="space-y-5">
          <TextField
            fullWidth
            id="name"
            name="name"
            label="Category Name"
            variant="outlined"
            onChange={handleInputChange}
            value={formData.name}
          />


          <Button variant="contained" type="submit">
            Create Category
          </Button>
        </form>
      </div>
    </div>
  );
};

export default CreateIngredientsCategoryFrom;
