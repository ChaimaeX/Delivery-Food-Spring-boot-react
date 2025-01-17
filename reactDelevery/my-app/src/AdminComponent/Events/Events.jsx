import { Box, Button, Grid, Modal, TextField } from '@mui/material';
import React, { useState } from 'react';
import { DateTimePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { useDispatch,useSelector } from 'react-redux';
import dayjs from 'dayjs';
import { createEventsAction } from '../../component/State/Restaurant/Action';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

const initialValues={
  image: '',
  location: '',
  name: '',
  startedAt: null,
  endsAt: null,     
}

const Events = () => {
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const {restaurant,ingredients}=useSelector(store=>store)
  const dispatch = useDispatch();
  const jwt=localStorage.getItem("jwt");

  const [formValues, setFormValues] = useState(initialValues);

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(createEventsAction({
      data:formValues,
      restaurantId:restaurant.usersRestaurant?.id,
      jwt
    }))
    console.log('Form submitted:', formValues);
    setFormValues(initialValues) 
  };

  const handleFormChange = (e) => {
    setFormValues({ ...formValues, [e.target.name]: e.target.value });
  };

  const handleDateChange = (date, dateType) => {
    setFormValues({ ...formValues, [dateType]: date });
  };
  

  return (
    <div>
      <div className="p-5">
        <Button onClick={handleOpen} variant="contained">
          Create Events
        </Button>
        <Modal
          open={open}
          onClose={handleClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={style}>
            <form onSubmit={handleSubmit}>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <TextField
                    name="image"
                    label="Image URL"
                    variant="outlined"
                    fullWidth
                    value={formValues.image}
                    onChange={handleFormChange}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    name="location"
                    label="Location"
                    variant="outlined"
                    fullWidth
                    value={formValues.location}
                    onChange={handleFormChange}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    name="name"
                    label="Event Name"
                    variant="outlined"
                    fullWidth
                    value={formValues.name}
                    onChange={handleFormChange}
                  />
                </Grid>
                <Grid item xs={12}>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DateTimePicker
                      renderInput={(props) => <TextField {...props} />}
                      label="Start Date and Time"
                      value={formValues.startedAt}
                      onChange={(newValue) => handleDateChange(newValue, 'startedAt')}
                      sx={{ width: '100%' }}
                    />
                  </LocalizationProvider>
                </Grid>
                <Grid item xs={12}>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DateTimePicker
                      renderInput={(props) => <TextField {...props} />}
                      label="End Date and Time"
                      value={formValues.endsAt}
                      onChange={(newValue) => handleDateChange(newValue, 'endsAt')}
                      sx={{ width: '100%' }}
                    />
                  </LocalizationProvider>
                </Grid>
                <Grid item xs={12} textAlign="center">
                  <Button type="submit" variant="contained">
                    Save Event
                  </Button>
                </Grid>
              </Grid>
            </form>
          </Box>
        </Modal>
      </div>
    </div>
  );
};

export default Events;
