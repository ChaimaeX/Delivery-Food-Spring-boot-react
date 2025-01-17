import React, { useState } from 'react';
import { useFormik } from 'formik';
import CloseIcon from '@mui/icons-material/Close';

import { Button, CircularProgress, Grid, IconButton, TextField } from '@mui/material';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import { uploadImageToCloudinary } from '../Util/UploadToCloadinary';
import { useDispatch } from 'react-redux';
import { createRestaurant } from '../../component/State/Restaurant/Action';


const initialValues = {
  name: "",
  description: "",
  cuisineType: "",
  streetAddress: "",
  stateProvince: "",
  postalCode: "",
  country: "",
  email: "",
  mobile: "",
  X: "",
  instagram: "",
  facebook: "",
  openingHours: "Mon-Sun : 9:00 AM - 12:00 PM",
  images: []
};

const CreateRestaurantForm = () => {
  const [uploadImage, setUploadImage] = useState(false);
   const dispatch = useDispatch();
   const jwt = localStorage.getItem("jwt");
   const formik = useFormik({
    initialValues,
    onSubmit: (values) => {
      const data = {
        name: values.name,
        description: values.description,
        cuisineType: values.cuisineType,
        address: {
          streetAddress: values.streetAddress,
          city:values.city,
          stateProvince: values.stateProvince,
          postalCode: values.postalCode,
          country: values.country,
        },
        contactInformation: {
          email: values.email,
          mobile: values.mobile,
          X: values.X,
          instagram: values.instagram,
        },
        openingHours: values.openingHours,
        images: values.images,
      };
      console.log("data----", data);
      dispatch(createRestaurant({data,token:jwt}))
    },
  });

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      setUploadImage(true);
      const image = await uploadImageToCloudinary(file);
      formik.setFieldValue("images", [...formik.values.images, image]);
      setUploadImage(false);
    }
  };

  const handleRemoveImage = (index) => {
    const updatedImages = [...formik.values.images];
    updatedImages.splice(index, 1);
    formik.setFieldValue("images", updatedImages);
  };

  return (
    <div className="py-10 px-5 lg:flex items-center justify-center min-h-screen">
      <div className="lg:max-w-4xl">
        <h1 className="font-bold text-2xl text-center py-2">Add New Restaurant</h1>
        <form onSubmit={formik.handleSubmit} className="space-y-4">
          <Grid container spacing={2}>
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
            {[
              "name",
              "description",
              "cuisineType",
              "openingHours",
              "streetAddress",
              "stateProvince",
              "postalCode",
              "country",
              "email",
              "mobile",
              "instagram",
              "X",
            ].map((field) => (
              <Grid item xs={12} key={field} lg={6}>
                <TextField
                  fullWidth
                  id={field}
                  name={field}
                  label={field.charAt(0).toUpperCase() + field.slice(1)}
                  variant="outlined"
                  onChange={formik.handleChange}
                  value={formik.values[field]}
                />
              </Grid>
            ))}
          </Grid>

          <Button className="mt-4" variant="contained" color="primary" type="submit">
            Create Restaurant
          </Button>
        </form>
      </div>
    </div>
  );
};

export default CreateRestaurantForm;
