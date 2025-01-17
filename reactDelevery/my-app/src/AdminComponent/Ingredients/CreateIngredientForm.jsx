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
import CreateIngredientsCategoryFrom from './CreateIngredientsCategoryFrom';
import { createIngredient } from '../../component/State/ingredients/Action';

const CreateIngredientForm = () => {
  const {restaurant,ingredients}=useSelector(store=>store)
  const dispatch = useDispatch();
  const jwt=localStorage.getItem("jwt");
  const [formData, setFormData] = useState({
    CategoryName: "",
    categoryId: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault(); // Empêcher le rechargement de la page
    const data = {
      ...formData, // Utiliser `name` au lieu de `categoryName`
      restaurantId: restaurant.usersRestaurant.id
      
    };
    // const data={...formData,restaurantId:restaurant.usersRestaurant.id}
    console.log('Form data submitted:', data);
    dispatch(createIngredient({data,jwt}))
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
      categoryId: typeof value === 'string' ? value.split(',') : value, // Gérer les sélections multiples
    });
  };

  return (
    <div>
      <div className="p-5">
        <h1 className="text-gray-400 text-center text-xl pb-10">Create Category</h1>
        <form onSubmit={handleSubmit} className="space-y-5">
          <TextField
            fullWidth
            id="name"
            name="name"
            label="Name"
            variant="outlined"
            onChange={handleInputChange}
            value={formData.name}
          />

<FormControl fullWidth>
  <InputLabel id="category-label">Category</InputLabel>
  <Select
    labelId="category-label"
    id="category"
    name="categoryId"
    value={formData.categoryId}
    onChange={handleSelectChange}
    input={<OutlinedInput label="Category" />}
    
  >
    {ingredients.category.map((item) => (
      <MenuItem key={item.id} value={item.id}>
        {item.name}
      </MenuItem>
    ))}
  </Select>
</FormControl>


          <Button variant="contained" type="submit">
            Create Ingredeints
          </Button>
        </form>
      </div>
    </div>
  );
};

export default CreateIngredientForm;
