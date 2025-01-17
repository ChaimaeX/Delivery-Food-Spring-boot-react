import React, { useState } from 'react';
import { Accordion, AccordionDetails, AccordionSummary, Button, Checkbox, FormControlLabel, FormGroup } from '@mui/material';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { categorizeIngredients } from '../util/categoryIngridents';
import { useDispatch } from 'react-redux';
import { addItemToCart } from '../State/Cart/Action';


const MenuCard = ({item}) => {

  const [selectedIngredients,setSelectedIngredients]=useState([]);
  const dispatch = useDispatch();

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

  

  return (
    <div>
      <Accordion>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1-content"
          id="panel1-header"
        >
          <div className="lg:flex items-center justify-between w-full">
            <div className="lg:flex items-center lg:gap-5">
              <img
                className="w-[7rem] h-[7rem] object-cover rounded-md"
                src={item.images[0]}
                alt="Burger"
              />
              <div className="space-y-1 lg:space-y-5 lg:max-w-2xl">
                <p className="font-semibold text-xl">{item.name}</p>
                <p className="text-gray-700 font-medium">{item.price}DH</p>
                <p className="text-gray-400">{item.desciption}</p>
              </div>
            </div>
          </div>
        </AccordionSummary>
        <AccordionDetails>
          <form onSubmit={(e)=>handleAddToCart(e)}>
            <div className="flex gap-5 flex-wrap">
              {Object.keys(categorizeIngredients(item.integredients)).map(
                (category) => (
                <div>
                 
                 <p> {category}</p>
                  <FormGroup>
                    { categorizeIngredients(item.integredients)[category].map(
                      (item)=>(

                        <FormControlLabel
                        key={item.name}
                        control={<Checkbox onChange={()=>handleCheckBoxChange(item.name)}/>}
                        label={item.name}
                      />


                    ) 
                      
                )}
                                                   
                  </FormGroup>
                </div>
              ))}
            </div>
            <div className="mt-4">
              <Button variant="contained" color="primary" disabled={false} type="submit">
                {true?"add to Cart":"Out Of Stock"}
              </Button>
            </div>
          </form>
        </AccordionDetails>
      </Accordion>
    </div>
  )
}

export default MenuCard;
