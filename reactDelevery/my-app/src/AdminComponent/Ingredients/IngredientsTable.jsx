import { Box, Button, Card, CardHeader, IconButton } from '@mui/material'
import React, { useEffect, useState } from 'react'
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import CreateIcon from '@mui/icons-material/Create';
import Modal from '@mui/material/Modal';
import CreateIngredientForm from './CreateIngredientForm';
import { useDispatch, useSelector } from 'react-redux';
import { getIngredientsOfRestaurant, updateStockOfIngredient } from '../../component/State/ingredients/Action';

const orders=[1,1,1,1,1,1,1]
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
const IngredientsTable = () => {

      const jwt =localStorage.getItem("jwt")
      const  {restaurant,ingredients}=useSelector(store=>store)
      const dispatch =useDispatch()

      const [open, setOpen] = useState(false);
      const handleOpen = () => setOpen(true);
      const handleClose = () => setOpen(false);

      useEffect(() => {
        const fetchIngredients = async () => {
            await dispatch(getIngredientsOfRestaurant({ jwt, id: restaurant.usersRestaurant.id }));
            console.log("restaurant",restaurant);
            
        };
        fetchIngredients();
    }, [dispatch, jwt, restaurant.usersRestaurant.id]);
    

      const handleUpdateStock=(id)=>{
        dispatch(updateStockOfIngredient({id,jwt}))
      }
  return (
    <div>
        <Box>
            <Card className='mt-1'>
            <CardHeader
             action={
              <IconButton aria-label="settings">
                <CreateIcon  onClick={handleOpen}/>
              </IconButton>
               }

            title={"Ingredients"}
            sx={{pt:2,alignItems:'center'}}
            
            
            
            />
             <TableContainer component={Paper}>
             <Table sx={{ minWidth: 650 }} aria-label="simple table">
             <TableHead>
               <TableRow>
                <TableCell>Id</TableCell>
                <TableCell align="right">name</TableCell>
                <TableCell align="right"> category</TableCell>
                <TableCell align="right">Avaibilty</TableCell>
               
             </TableRow>
           </TableHead>
           <TableBody>
          {ingredients.ingredients.map((item) => (
            <TableRow
              key={item.name}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
              <TableCell component="th" scope="row">
                {item.id}
              </TableCell>
              <TableCell align="right">{item.name}</TableCell>
              <TableCell align="right">{item.category.name}</TableCell>
              <TableCell align="right">
                <Button onClick={()=>handleUpdateStock(item.id)}>{item.inStoke?"in_stock":"out_of_stock"}</Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
                 

            </Card>

            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
           >
           <Box sx={style}>
                 <CreateIngredientForm/>
            </Box>
         </Modal>
        </Box>
    </div>
  )
}

export default IngredientsTable