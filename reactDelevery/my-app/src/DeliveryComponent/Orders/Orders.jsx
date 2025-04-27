import React, { useEffect } from 'react'
import OrderCard from './OrderCard'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom';
import { findOrderStatus, LivreurHistory } from '../../component/State/Delivery/Action';



const Orders = () => {

  const {auth,delivery} = useSelector((store)=>store);
  const dispatch = useDispatch();
  const navigate = useNavigate()
  const jwt = localStorage.getItem("jwt");
 
  
 

  useEffect(() => {
      
      dispatch(LivreurHistory({jwt}));

    }, [jwt, dispatch]);

  console.log("delivery.deliveryHistory:",delivery.deliveryHistory);
  const handleOrder =(id)=>{
    navigate(`/delivery/orders/${id}`)

  }
  
  return (
    <div className='flex justify-center items-center min-h-screen '> {/* Centre horizontalement et verticalement */}
      <div className='container flex justify-center items-center flex-col'>
        <h1 className='text-xl text-center p-7 font-semibold'>All Orders</h1>
        <div className='space-y-5 w-full lg:w-1/2 cursor-pointer '>
          {
            delivery.deliveryHistory?.map((deliveryHistory) => 
                
              <div 
              key={deliveryHistory.id} // Ajout d'une clé unique
              onClick={() => handleOrder(deliveryHistory.id)}
              className=' rounded-lg shadow-sm p-2 px-5' // Carte plus compacte
              >
                   <OrderCard order={deliveryHistory}  
                />
             </div>
            )
           
            
          }
        </div>
      </div>
    </div>
  )
}

export default Orders
