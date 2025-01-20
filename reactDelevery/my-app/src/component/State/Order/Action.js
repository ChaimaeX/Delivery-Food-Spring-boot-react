import { AxiosError } from "axios";
import { CREATE_ORDER_FAILURE, CREATE_ORDER_REQUEST, CREATE_ORDER_SUCCESS, GET_USERS_ORDERS_FAILURE, GET_USERS_ORDERS_REQUEST, GET_USERS_ORDERS_SUCCESS } from "./ActionTypes";
import { api } from "../../config/api";

export const createOrder = (reqdata) =>{

    return async (dispatch) =>{
        dispatch({ type: CREATE_ORDER_REQUEST });
        try {
            const {data} = await api.post('/api/orders',reqdata.order,{
                headers:{
                    Authorization: `Bearer ${reqdata.jwt}`,
                     "Content-Type": "application/json"
                },
            });
            if (data.payment_url) {
                window.location.href=data.payment_url;
            }
           
            console.log("created order data",data);
            dispatch({type:CREATE_ORDER_SUCCESS,payload:data})
            
            
        } catch (error) {
            console.log('error',error);
            
            dispatch({type:CREATE_ORDER_FAILURE,payload:error})
            
        }
    }
}

export const getUsersOrders = ({jwt}) =>{

    return async (dispatch) =>{
        dispatch({type:GET_USERS_ORDERS_REQUEST});
        try {
            const {data} = await api.get('/api/order/user',{
                headers:{
                    Authorization: `Bearer ${jwt}`,
                },
            });
            
            console.log(" users order",data);
            dispatch({type:GET_USERS_ORDERS_SUCCESS,payload:data})
            
            
        } catch (error) {
            console.log('error',error);
            
            dispatch({type:GET_USERS_ORDERS_FAILURE,payload:error})
            
        }
    }
}