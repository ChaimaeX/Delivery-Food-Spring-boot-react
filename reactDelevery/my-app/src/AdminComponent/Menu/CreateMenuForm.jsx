import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import CloseIcon from "@mui/icons-material/Close";
import Box from "@mui/material/Box";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import Chip from "@mui/material/Chip";
import {
  Button,
  CircularProgress,
  FormControlLabel,
  Grid,
  IconButton,
  Radio,
  RadioGroup,
  TextField,
} from "@mui/material";
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";
import { uploadImageToCloudinary } from "../Util/UploadToCloadinary";
import { useDispatch, useSelector } from "react-redux";
import { createMenuItem } from "../../component/State/Menu/Action";
import { getIngredientsOfRestaurant } from "../../component/State/ingredients/Action";

// Initial values
const initialValues = {
  name: "",
  description: "",
  price: "",
  category: "",
  restaurantId: "",
  vegetarian: true,
  seasonal: false,
  ingredients: [],
  images: [],
  topMeels:"",
};

// Validation schema
// const validationSchema = Yup.object({
//   name: Yup.string().required("Name is required"),
//   description: Yup.string().required("Description is required"),
//   price: Yup.number()
//     .required("Price is required")
//     .positive("Price must be a positive number"),
//   category: Yup.string().required("Category is required"),
//   ingredients: Yup.array()
//     .of(Yup.string())
//     .min(1, "At least one ingredient is required"),
// });

const CreateMenuForm = () => {
  const jwt = localStorage.getItem("jwt");
  const { restaurant, ingredients } = useSelector((store) => store);
  const dispatch = useDispatch();

  const [uploadImage, setUploadImage] = useState(false);
  const formik = useFormik({
    initialValues,
    // validationSchema,
    onSubmit: (values) => {
      values.restaurantId = restaurant.usersRestaurant.id; // Hardcoded for now
      dispatch(createMenuItem({ menu: values, jwt }));
      console.log("Submitted Data: ", values);
    },
  });

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      setUploadImage(true);
      try {
        const image = await uploadImageToCloudinary(file);
        formik.setFieldValue("images", [...formik.values.images, image]);
      } catch (error) {
        console.error("Error uploading image:", error);
      } finally {
        setUploadImage(false);
      }
    }
  };

  useEffect(() => {
    if (restaurant?.usersRestaurant?.id) {
      dispatch(getIngredientsOfRestaurant({jwt,id: restaurant.usersRestaurant.id}));
    }
  }, [dispatch, jwt, restaurant]);

  const handleRemoveImage = (index) => {
    const updatedImages = [...formik.values.images];
    updatedImages.splice(index, 1);
    formik.setFieldValue("images", updatedImages);
  };

  return (
    <div className="py-10 px-5 lg:flex items-center justify-center min-h-screen">
      <div className="lg:max-w-4xl">
        <h1 className="font-bold text-2xl text-center py-2">Add New Menu Item</h1>
        <form onSubmit={formik.handleSubmit} className="space-y-4">
          <Grid container spacing={2}>
            {/* Image Upload */}
            <Grid item xs={12} className="flex flex-wrap gap-5">
              <input
                accept="image/*"
                id="fileInput"
                style={{ display: "none" }}
                onChange={handleImageChange}
                type="file"
              />
              <label className="relative" htmlFor="fileInput">
                <span className="w-24 h-24 cursor-pointer flex items-center justify-center p-3 border rounded-md border-gray-600">
                  <AddPhotoAlternateIcon className="text-gray-600" />
                </span>
                {uploadImage && (
                  <div className="absolute left-0 right-0 top-0 bottom-0 w-24 h-24 flex justify-center items-center">
                    <CircularProgress />
                  </div>
                )}
              </label>
              <div className="flex flex-wrap gap-2">
                {formik.values.images.map((image, index) => (
                  <div key={index} className="relative">
                    <img
                      className="w-24 h-24 object-cover"
                      src={image}
                      alt={`Uploaded preview ${index}`}
                    />
                    <IconButton
                      size="small"
                      sx={{
                        position: "absolute",
                        top: 0,
                        right: 0,
                        outline: "none",
                      }}
                      onClick={() => handleRemoveImage(index)}
                    >
                      <CloseIcon sx={{ fontSize: "1rem" }} />
                    </IconButton>
                  </div>
                ))}
              </div>
            </Grid>

            {/* Form Fields */}
            <Grid item xs={12} lg={6}>
              <TextField
                fullWidth
                id="name"
                name="name"
                label="Name"
                variant="outlined"
                onChange={formik.handleChange}
                value={formik.values.name}
                error={formik.touched.name && Boolean(formik.errors.name)}
                helperText={formik.touched.name && formik.errors.name}
              />
            </Grid>
            <Grid item xs={12} lg={6}>
              <TextField
                fullWidth
                id="description"
                name="description"
                label="Description"
                variant="outlined"
                onChange={formik.handleChange}
                value={formik.values.description}
                error={formik.touched.description && Boolean(formik.errors.description)}
                helperText={formik.touched.description && formik.errors.description}
              />
            </Grid>
            <Grid item xs={12} lg={6}>
              <TextField
                fullWidth
                id="price"
                name="price"
                label="Price"
                variant="outlined"
                onChange={formik.handleChange}
                value={formik.values.price}
                error={formik.touched.price && Boolean(formik.errors.price)}
                helperText={formik.touched.price && formik.errors.price}
              />
            </Grid>
            <Grid item xs={12} lg={6}>
              <FormControl fullWidth>
                <InputLabel id="category-label">Category</InputLabel>
                <Select
                  labelId="category-label"
                  id="category"
                  name="category"
                  value={formik.values.category}
                  onChange={formik.handleChange}
                  input={<OutlinedInput label="Category" />}
                >
                  {restaurant.categories?.map((item) => (
                    <MenuItem key={item.id} value={item}>
                      {item.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
                      
            <FormControl fullWidth>
           <InputLabel id="ingredients-label">Ingredients</InputLabel>
           <Select
             labelId="ingredients-label"
             id="ingredients"
             name="ingredients"
             multiple
             value={formik.values.ingredients}
             onChange={(event) => {
               // Mise à jour de Formik pour inclure directement l'objet sélectionné
               formik.setFieldValue("ingredients", event.target.value);
             }}
             input={<OutlinedInput label="Ingredients" />}
             renderValue={(selected) => (
             <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                 {selected.map((ingredient) => (
                   <Chip key={ingredient.id} label={ingredient.name} />
                 ))}
               </Box>
             )}
           >
            {ingredients.ingredients?.map((ingredient) => (
              <MenuItem key={ingredient.id} value={ingredient}>
                {ingredient.name}
              </MenuItem>
            ))}
          </Select>
            </FormControl>

            </Grid>
            <Grid item xs={12} lg={6}>
              <FormControl fullWidth>
                <InputLabel id="seasonal-label">Is Seasonal</InputLabel>
                <Select
                  labelId="seasonal-label"
                  id="seasonal"
                  name="seasonal"
                  value={formik.values.seasonal}
                  onChange={formik.handleChange}
                  label="Is Seasonal"
                >
                  <MenuItem value={true}>Yes</MenuItem>
                  <MenuItem value={false}>No</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} lg={6}>
              <FormControl fullWidth>
                <InputLabel id="vegetarian-label">Is Vegetarian</InputLabel>
                <Select
                  labelId="vegetarian-label"
                  id="vegetarian"
                  name="vegetarian"
                  value={formik.values.vegetarian}
                  onChange={formik.handleChange}
                  label="Is Vegetarian"
                >
                  <MenuItem value={true}>Yes</MenuItem>
                  <MenuItem value={false}>No</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} lg={6}>
                <FormControl component="fieldset">
                  <RadioGroup
                    aria-labelledby="radio-group-label"
                    name="topMeels" // Le nom du champ géré par Formik
                    value={formik.values.topMeels} // Connecté à Formik
                    onChange={formik.handleChange} // Mise à jour dynamique via Formik
                  >
                    <FormControlLabel
                      value={true} // Valeur optionnelle
                      control={<Radio />}
                      label="Top Menu Item"
                    />
                  </RadioGroup>
                </FormControl>
              </Grid>
          </Grid>

          <Button
            className="mt-4"
            variant="contained"
            color="primary"
            type="submit"
            disabled={formik.isSubmitting}
          >
            Create Menu
          </Button>
        </form>
      </div>
    </div>
  );
};

export default CreateMenuForm;
