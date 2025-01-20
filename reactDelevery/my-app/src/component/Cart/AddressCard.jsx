import React from 'react'
import Cart from './Cart'
import HomeIcon from '@mui/icons-material/Home';
import { Button, Card } from '@mui/material';




const AddressCard = ({item,showButton}) => {

   

  const handleSelectAdress=()=>{

  }
  const handleOpenAddressModal=()=>{

  }
  return (
    <Card className="flex gap-5 w-64 p-5">
       <HomeIcon  />
       <div className='space-y-3 text-gray-500'>
        <h1 className='font-semibold text-lg text-white'>Home</h1>
       <p>
          {item.deliveryAddress.streetAddress}
       </p>
       <p>
          {item.deliveryAddress.country}
       </p><p>
          {item.deliveryAddress.city}
       </p><p>
          {item.deliveryAddress.stateProvince}
       </p>
       {showButton &&( 
        <Button variant="outlined" fullWidth onClick={()=>handleSelectAdress()}>select</Button>)}
      </div>
    </Card>
   
  )
}

export default AddressCard