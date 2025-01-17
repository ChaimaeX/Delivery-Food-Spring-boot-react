import { Box, Card, CardHeader,IconButton } from '@mui/material'
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
import CreateIngredientsCategoryFrom from './CreateIngredientsCategoryFrom';
import { useDispatch, useSelector } from 'react-redux';
import { getIngredientCategory } from '../../component/State/ingredients/Action';

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

const orders=[1,1,1,1,1,1,1]
export default function IngredientCategoryTable(){
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const dispatch=useDispatch()
  const {restaurant,ingredients}=useSelector(store=>store);
  const jwt=localStorage.getItem('jwt')


  useEffect(()=>{
    dispatch(getIngredientCategory({id:restaurant.usersRestaurant.id,jwt}))
    
  },[])
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
            title={"Ingredient Category"}
            sx={{pt:2,alignItems:'center'}}
            
            
            
            />
             <TableContainer component={Paper}>
             <Table  aria-label="simple table">
             <TableHead>
               <TableRow>
                <TableCell>Id</TableCell>
                <TableCell align="right">name</TableCell>
               
                
             </TableRow>
           </TableHead>
           <TableBody>
          {ingredients.category.map((item) => (
            <TableRow
              key={item.name}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
              <TableCell component="th" scope="row">
                {item.id}
              </TableCell>
              <TableCell align="right">{item.name}</TableCell>
              
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
               <CreateIngredientsCategoryFrom />
            </Box>
         </Modal>
        </Box>
    </div>
  )
}

