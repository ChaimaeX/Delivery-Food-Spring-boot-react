import React from 'react'
import AccountCircleICon from '@mui/icons-material/AccountCircle';
import { Button } from '@mui/material';
const UserProfile = () => {
  const handleLogout=()=>{

  }
  return (
    <div className='min-h-[80vh] flex flex-col justify-center items-center text-center'>
      <div className='flex flex-col items-center justify-center'>
          <AccountCircleICon sx={{fontSize:"9rem"}}/>

          <h1 className='py-5 text-2xl font-semibolc'> Code with Chaimae</h1>
          <p> Email:codewithChaimae12@gmail.com</p>
          <Button variant='contained' Onclick={handleLogout} sx={{margin:"2rem 0rem"}}>LogOut</Button>

      </div>
    </div>
  )
}

export default UserProfile