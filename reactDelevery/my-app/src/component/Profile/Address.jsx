import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { getUsersAddress, getUsersOrders } from '../State/Order/Action';
import AddressCard from '../Cart/AddressCard';

const Address = () => {

  const {auth,cart,order} = useSelector((store)=>store);
  const dispatch = useDispatch();
  const navigate = useNavigate()
  const jwt = localStorage.getItem("jwt");

  const handleSelectAddress = ()=>{

  }

  const handleRemoveAddress = async (id) => {
    
    
  };

  useEffect(()=>{
    const order = async  ()=> {
      await dispatch(getUsersAddress({jwt}));
    }
    order()
  },[auth,jwt])


  return (
    <div className='flex justify-center items-center min-h-screen'> {/* Centre horizontalement et verticalement */}
      <div className='container flex justify-between items-center flex-col'>
        <h1 className='text-xl text-center p-7 font-semibold'>Address</h1>
        <div className='flex gap-5 flex-wrap justify-center'>
             {order.address?.map((item, index) => (
                                <AddressCard
                                key={item.id}
                                item={item}
                                showButton={false}
                                handleSelectAddress={handleSelectAddress}
                                handleRemoveAddress={() => handleRemoveAddress(item.id)}
                              />
              ))}
        </div>
      </div>
    </div>
  )
}

export default Address