import React, { useEffect } from 'react'
import OrderCard from './OrderCard'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom';
import { getUsersOrders } from '../State/Order/Action';

const Order = () => {

  const {auth,cart,order} = useSelector((store)=>store);
  const dispatch = useDispatch();
  const navigate = useNavigate()
  const jwt = localStorage.getItem("jwt");

  useEffect(()=>{
    const order = async  ()=> {
      await dispatch(getUsersOrders(jwt));
    }
    order()
  },[auth,jwt])
  
  return (
    <div className='flex justify-center items-center min-h-screen'> {/* Centre horizontalement et verticalement */}
      <div className='container flex justify-center items-center flex-col'>
        <h1 className='text-xl text-center p-7 font-semibold'>My Orders</h1>
        <div className='space-y-5 w-full lg:w-1/2'>
          {
            order.orders.map((order) =>order.items.map((item=> <OrderCard order={order} item={item} />)))
           
            
          }
        </div>
      </div>
    </div>
  )
}

export default Order
