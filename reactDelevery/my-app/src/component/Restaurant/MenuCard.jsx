import React, { useState } from 'react';
    import { 
      Accordion, 
      AccordionDetails, 
      AccordionSummary, 
      Button, 
      Checkbox, 
      FormControlLabel, 
      FormGroup, 
      useMediaQuery,
      Box,
      Typography,
      Snackbar,
      Tooltip
    } from '@mui/material';
    import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
    import { categorizeIngredients } from '../util/categoryIngridents';
    import { useDispatch } from 'react-redux';
    import { addItemToCart } from '../State/Cart/Action';
    import { useSnackbar } from 'notistack';
    import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
    import "./RestaurantDetails.css"

const MenuCard = ({item}) => {

  const [selectedIngredients, setSelectedIngredients] = useState([]);
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();
  const isMobile = useMediaQuery('(max-width:600px)');

  const [state, setState] = React.useState({
      open: false,
      vertical: 'top',
      horizontal: 'center',
    });
    const { vertical, horizontal, open } = state;
  
    
  const handleClose = () => {
      setState({ ...state, open: false });
  };


  const handleAddToCart = (e) =>{
    e.preventDefault();
    const reqData = {
      token: localStorage.getItem("jwt"),
      cartItem:{
       foodId:item.id,
       quantity:1,
       ingredients:selectedIngredients,
      },
      

    };
    dispatch(addItemToCart(reqData));
    console.log("req data",reqData);
    setState({ ...{ vertical: 'bottom', horizontal: 'center' }, open: true });

    
    };

    const handleCheckBoxChange = (itemName) => {
       console.log("value", itemName);

  if (selectedIngredients.includes(itemName)) {
    
    setSelectedIngredients(selectedIngredients.filter((item) => item !== itemName));
  } else {
    
    setSelectedIngredients([...selectedIngredients, itemName]);
    console.log("selectedIngredients",...selectedIngredients);
    
  }
};

const handleClickVariant = (variant) => () => {
  // variant could be success, error, warning, info, or default
  enqueueSnackbar('This is a success message!', { variant });
};

  

return (

        <Box sx={{ mb: 2 }}>
          <Accordion>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel1-content"
              id="panel1-header"
            >
              <Box sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                width: '100%',
                flexDirection: isMobile ? 'row' : 'row'
              }}>
                <img
                  style={{
                    width: isMobile ? '6rem' : '7rem',
                    height: isMobile ? '6rem' : '7rem',
                    objectFit: 'cover',
                    borderRadius: '8px',
                    marginRight: '1rem'
                  }}
                  src={item.images[0]}
                  alt={item.name}
                />
                <Box sx={{ 
                  flex: 1,
                  textAlign: isMobile ? 'left' : 'left'
                }}>
                  <Typography variant={isMobile?"h8":"h6"} sx={{ fontWeight: 'bold' }}>{item.name}</Typography>
                  <Typography variant="body1" color="text.secondary"  sx={{ fontSize: isMobile? '15px': "" }}>{item.price} DH</Typography>
                  <Typography variant="body2" color="text.secondary" sx={{
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis'
                  }}>
                    {item.desciption}
                  </Typography>
                </Box>
              </Box>
            </AccordionSummary>
    
            <AccordionDetails>
              <form onSubmit={handleAddToCart}>
                <Box sx={{ 
                  display: 'flex', 
                  flexDirection: 'column', 
                  gap: 2,
                  maxHeight: isMobile ? '300px' : 'none',
                  overflowY: 'auto'
                }}>
                  <Box>
                {Object.keys(categorizeIngredients(item.integredients)).map((category) => (
                  <Box key={category} sx={{ mb: 2 }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 'bold', color: 'text.secondary' }}>
                      {category}
                    </Typography>
                    <FormGroup>
                      {categorizeIngredients(item.integredients)[category].map((ingredient) => (
                        <FormControlLabel
                          key={ingredient.name}
                          control={
                            <Checkbox 
                              onChange={() => handleCheckBoxChange(ingredient.name)}
                              size="small"
                              disabled={!ingredient.inStoke}
                              inputProps={{
                                'aria-label': `${ingredient.name} ${ingredient.inStoke ? 'available' : 'out of stock'}`,
                              }}
                            />
                          }
                          label={
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                              <span>{ingredient.name}</span>
                              {!ingredient.inStoke && (
                                <Tooltip title="This ingredient is currently out of stock" arrow>
                                  <InfoOutlinedIcon
                                    color="error" 
                                    sx={{ fontSize: '1rem', ml: 1 }} 
                                  />
                                </Tooltip>
                              )}
                            </Box>
                          }
                          sx={{ 
                            '& .MuiFormControlLabel-label': { 
                              fontSize: '0.875rem',
                              opacity: ingredient.inStock ? 1 : 0.6 
                            },
                            '& .MuiCheckbox-root': {
                              color: ingredient.inStock ? 'primary.main' : 'text.disabled'
                            }
                          }}
                        />
                      ))}
                    </FormGroup>
                  </Box>
                ))}
              </Box>
                </Box>
                <Box sx={{ mt: 2 }}>
                  <Button
                    variant="contained"
                    color="primary"
                    type="submit"
                    disabled={!item.available}
                    fullWidth={isMobile}
                    size={isMobile ? 'medium' : 'large'}
                  >
                    {item.available ? "Add to Cart" : "Out Of Stock"}
                   
                   <Snackbar
                     anchorOrigin={{ vertical, horizontal }}
                     open={open}
                     onClose={handleClose}
                     autoHideDuration={2000}
                     message="add to Card"
                     key={vertical + horizontal}
                                 
                  />
                  </Button>
                </Box>
              </form>
            </AccordionDetails>
          </Accordion>
        </Box>
      );
    };
    
    export default MenuCard;
            
          
