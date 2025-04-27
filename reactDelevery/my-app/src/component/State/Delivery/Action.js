import {api} from '../../config/api';
import { ASSIGN_ORDER_TO_DELIVERY_PERSON_FAILURE, 
     ASSIGN_ORDER_TO_DELIVERY_PERSON_REQUEST,
     ASSIGN_ORDER_TO_DELIVERY_PERSON_SUCCESS, 
     GET_DELIVERY_HISTORY_FAILURE, 
     GET_DELIVERY_HISTORY_REQUEST, 
     GET_DELIVERY_HISTORY_SUCCESS,   
      GET_ORDERS_BY_ID_REQUEST,   
      GET_ORDERS_BY_ID_SUCCESS,   
      GET_ORDERS_BY_STATUS_FAILURE,   
      GET_ORDERS_BY_STATUS_REQUEST,   
      GET_ORDERS_BY_STATUS_SUCCESS,   
      } from './ActionType';



export const findOrderStatus = (reqData) =>{

    return async (dispatch) =>{
        dispatch({ type: GET_ORDERS_BY_STATUS_REQUEST});
        try {
            const {data} = await api.get(`/api/delivery/orders/status/${reqData.status}`,{
                headers:{
                    Authorization: `Bearer ${reqData.jwt}`,
                     "Content-Type": "application/json"
                },
            });
          
            console.log("get orderDeleveries data",data);
            dispatch({type:GET_ORDERS_BY_STATUS_SUCCESS,payload:data})
            
            
        } catch (error) {
            console.log('error',error);
            
            dispatch({type:GET_ORDERS_BY_STATUS_FAILURE,payload:error})
            
        }
    }
}

export const findOrderById = (reqData) =>{

    return async (dispatch) =>{
        dispatch({ type: GET_ORDERS_BY_ID_REQUEST});
        try {
            const {data} = await api.get(`/api/delivery/orders/id/${reqData.orderId}`,{
                headers:{
                    Authorization: `Bearer ${reqData.jwt}`,
                     "Content-Type": "application/json"
                },
            });
          
            console.log("get orderDeleveries data",data);
            dispatch({type:GET_ORDERS_BY_ID_SUCCESS,payload:data})
            
            
        } catch (error) {
            console.log('error',error);
            
            dispatch({type:GET_ORDERS_BY_STATUS_FAILURE,payload:error})
            
        }
    }
}

export const LivreurHistory = ({jwt}) =>{

    return async (dispatch) =>{
        dispatch({ type: GET_DELIVERY_HISTORY_REQUEST  });
        try {
            const {data} = await api.get(`/api/delivery/orders`,{
                headers:{
                    Authorization: `Bearer ${jwt}`,
                     "Content-Type": "application/json"
                },
            });
          
            console.log("get order history by id ",data);
            dispatch({type:GET_DELIVERY_HISTORY_SUCCESS,payload:data})
            
            
        } catch (error) {
            console.log('error',error);
            
            dispatch({type:GET_DELIVERY_HISTORY_FAILURE,payload:error})
            
        }
    }
}

export const assignOrder = (reqData) =>{

    return async (dispatch) =>{
        dispatch({ type: ASSIGN_ORDER_TO_DELIVERY_PERSON_REQUEST  });
        try {
            const {data} = await api.post(`/api/delivery/orders/${reqData.orderId}`, {}, {
                headers: {
                    Authorization: `Bearer ${reqData.jwt}`,
                    "Content-Type": "application/json"
                },
            });

            console.log("create order delevery ",data);
            dispatch({type:ASSIGN_ORDER_TO_DELIVERY_PERSON_SUCCESS,payload:data})
            
            
        } catch (error) {
            console.log('error',error);
            
            dispatch({type:ASSIGN_ORDER_TO_DELIVERY_PERSON_FAILURE,payload:error})
            
        }
    }
}