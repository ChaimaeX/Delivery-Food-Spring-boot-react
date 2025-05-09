import { Card, CardActions, CardContent, CardMedia, IconButton, Typography } from '@mui/material'
import React from 'react'
import DeleteIcon from '@mui/icons-material/Delete';

const EventCard = () => {
  return (
    <div>
        <Card xs={{width:345}}>
            <CardMedia 
             sx={{height:345}}
             image='https://images.pexels.com/photos/1640772/pexels-photo-1640772.jpeg?auto=compress&cs=tinysrgb&w=600' />

             <CardContent>
                <Typography variant='h5'>
                    Morroco Fast Food
                </Typography>
                <Typography variant='body2'>
                    50% off on yoor first order
                </Typography>
                <div className='py-2 space-y-2'>
                      <p>{"Meknes"}</p>
                      <p className='text-sm text-blue-500'>February 14,2024 12:00 AM   </p>
                       <p className='text-sm text-red-500'> Febraury 15,2024 12:00 AM      </p>
                    
                </div>   
                </CardContent>
          {true &&  
             <CardActions>
                <IconButton>
                    <DeleteIcon/>
                </IconButton>
             </CardActions>} 
        </Card>
    </div>
  )
}

export default EventCard