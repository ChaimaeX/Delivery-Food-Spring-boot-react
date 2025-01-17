import React from 'react'
import ProfileNavigation from './ProfileVavigation'
import { Route, Routes } from 'react-router-dom'
import Address from './Address'

import Favorites from './Favorites'
import Events from './Events'
import UserProfile from './UserProfile'
import Order from './Order'

const Profile = () => {
  return (
    <div className='lg:flex justify-between'>
        <div className='sticky h-[80vh] lg:w-[20%]'>
           <ProfileNavigation/>
        </div>
        <div className='lg:w-[80%]'>
            <Routes>
                <Route path='/' element={<UserProfile/>} />
                <Route path='/orders' element={<Order/>} />
                <Route path='/address' element={<Address/>} />
                <Route path='/favorites' element={<Favorites/>} />
                <Route path='/events' element={<Events/>} />

            </Routes>
        </div>
    </div>
  )
}

export default Profile