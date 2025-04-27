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
  Snackbar,
  Alert,
  FormHelperText,
  FormLabel,
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
  category: null,
  restaurantId: "",
  vegetarian: true,
  seasonal: false,
  ingredients: [],
  images: [],
  topMeels: false,
};

// Validation schema
const validationSchema = Yup.object({
  name: Yup.string().required("Le nom est requis"),
  description: Yup.string().required("La description est requise"),
  price: Yup.number()
    .required("Le prix est requis")
    .positive("Le prix doit être positif"),
    category: Yup.object()
    .shape({
      id: Yup.string().required("L'ID de catégorie est requis"),
      name: Yup.string().required("Le nom de catégorie est requis")
    })
    .required("La catégorie est requise")
    .nullable(),
  ingredients: Yup.array()
    .min(1, "Au moins un ingrédient est requis"),
  images: Yup.array()
    .min(1, "Au moins une image est requise"),
});

const CreateMenuForm = () => {
  const jwt = localStorage.getItem("jwt");
  const { restaurant, ingredients } = useSelector((store) => store);
  const dispatch = useDispatch();
  const [uploadImage, setUploadImage] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit: async (values, { setSubmitting }) => {
      try {
        if (!restaurant.usersRestaurant?.id) {
          throw new Error("Restaurant ID missing");
        }
        
        values.restaurantId = restaurant.usersRestaurant.id;
        const result = await dispatch(createMenuItem({ menu: values, jwt }));
        
        setSnackbar({
          open: true,
          message: "Menu créé avec succès!",
          severity: "success",
        });
        
        console.log("Created menu:", result);
      } catch (error) {
        console.error("Creation error:", error);
        setSnackbar({
          open: true,
          message: error.message || "Erreur lors de la création",
          severity: "error",
        });
      } finally {
        setSubmitting(false);
      }
    },
  });

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploadImage(true);
    try {
      const image = await uploadImageToCloudinary(file);
      formik.setFieldValue("images", [...formik.values.images, image]);
    } catch (error) {
      console.error("Erreur d'upload:", error);
      setSnackbar({
        open: true,
        message: "Échec de l'upload de l'image",
        severity: "error",
      });
    } finally {
      setUploadImage(false);
    }
  };

  useEffect(() => {
    if (restaurant?.usersRestaurant?.id) {
      dispatch(getIngredientsOfRestaurant({
        jwt, 
        id: restaurant.usersRestaurant.id
      }));
    }
  }, [dispatch, jwt, restaurant]);

  const handleRemoveImage = (index) => {
    const updatedImages = [...formik.values.images];
    updatedImages.splice(index, 1);
    formik.setFieldValue("images", updatedImages);
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  return (
    <div className="py-10 px-5 lg:flex items-center justify-center min-h-screen">
      <div className="lg:max-w-4xl">
        <h1 className="font-bold text-2xl text-center py-2">Ajouter un nouvel élément au menu</h1>
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
                      alt={`Prévisualisation ${index}`}
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
              {formik.touched.images && formik.errors.images && (
                <FormHelperText error>{formik.errors.images}</FormHelperText>
              )}
            </Grid>

            {/* Form Fields */}
            <Grid item xs={12} lg={6}>
              <TextField
                fullWidth
                required
                id="name"
                name="name"
                label="Nom *"
                variant="outlined"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.name}
                error={formik.touched.name && Boolean(formik.errors.name)}
                helperText={formik.touched.name && formik.errors.name}
              />
            </Grid>
            <Grid item xs={12} lg={6}>
              <TextField
                fullWidth
                required
                id="description"
                name="description"
                label="Description *"
                variant="outlined"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.description}
                error={formik.touched.description && Boolean(formik.errors.description)}
                helperText={formik.touched.description && formik.errors.description}
              />
            </Grid>
            <Grid item xs={12} lg={6}>
              <TextField
                fullWidth
                required
                id="price"
                name="price"
                label="Prix *"
                type="number"
                variant="outlined"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.price}
                error={formik.touched.price && Boolean(formik.errors.price)}
                helperText={formik.touched.price && formik.errors.price}
                InputProps={{
                  inputProps: { min: 0 }
                }}
              />
            </Grid>
            <Grid item xs={12} lg={6}>
              <FormControl 
                fullWidth
                error={formik.touched.category && Boolean(formik.errors.category)}
              >
                <InputLabel id="category-label">Catégorie *</InputLabel>
                <Select
                  labelId="category-label"
                  id="category"
                  name="category"
                  value={formik.values.category}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  input={<OutlinedInput label="Catégorie *" />}
                >
                  {restaurant.categories?.map((item) => (
                    <MenuItem key={item.id} value={item}>
                      {item.name}
                    </MenuItem>
                  ))}
                </Select>
                {formik.touched.category && formik.errors.category && (
                  <FormHelperText>{formik.errors.category}</FormHelperText>
                )}
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <FormControl 
                fullWidth
                error={formik.touched.ingredients && Boolean(formik.errors.ingredients)}
              >
                <InputLabel id="ingredients-label">Ingrédients *</InputLabel>
                <Select
                  labelId="ingredients-label"
                  id="ingredients"
                  name="ingredients"
                  multiple
                  value={formik.values.ingredients}
                  onChange={(event) => {
                    formik.setFieldValue("ingredients", event.target.value);
                  }}
                  onBlur={formik.handleBlur}
                  input={<OutlinedInput label="Ingrédients *" />}
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
                {formik.touched.ingredients && formik.errors.ingredients && (
                  <FormHelperText>{formik.errors.ingredients}</FormHelperText>
                )}
              </FormControl>
            </Grid>
            <Grid item xs={12} lg={6}>
              <FormControl fullWidth>
                <InputLabel id="seasonal-label">Saisonnier</InputLabel>
                <Select
                  labelId="seasonal-label"
                  id="seasonal"
                  name="seasonal"
                  value={formik.values.seasonal}
                  onChange={formik.handleChange}
                  label="Saisonnier"
                >
                  <MenuItem value={true}>Oui</MenuItem>
                  <MenuItem value={false}>Non</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} lg={6}>
              <FormControl fullWidth>
                <InputLabel id="vegetarian-label">Végétarien</InputLabel>
                <Select
                  labelId="vegetarian-label"
                  id="vegetarian"
                  name="vegetarian"
                  value={formik.values.vegetarian}
                  onChange={formik.handleChange}
                  label="Végétarien"
                >
                  <MenuItem value={true}>Oui</MenuItem>
                  <MenuItem value={false}>Non</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} lg={6}>
              <FormControl component="fieldset">
                <FormLabel component="legend">Menu vedette</FormLabel>
                <RadioGroup
                  row
                  aria-labelledby="top-meals-radio-group"
                  name="topMeels"
                  value={formik.values.topMeels}
                  onChange={formik.handleChange}
                >
                  <FormControlLabel
                    value={true}
                    control={<Radio />}
                    label="Oui"
                  />
                  <FormControlLabel
                    value={false}
                    control={<Radio />}
                    label="Non"
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
            disabled={formik.isSubmitting || uploadImage}
            fullWidth
            size="large"
          >
            {formik.isSubmitting ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              "Créer le menu"
            )}
          </Button>
        </form>
      </div>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default CreateMenuForm;