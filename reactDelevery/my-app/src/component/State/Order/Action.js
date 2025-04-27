import { AxiosError } from "axios";
import { CREATE_ORDER_FAILURE, CREATE_ORDER_REQUEST, CREATE_ORDER_SUCCESS, Delete_Address_Order_FAILURE, Delete_Address_Order_REQUEST, Delete_Address_Order_SUCCESS, GET_USERS_DELIVERYADDRESS_FAILURE, GET_USERS_DELIVERYADDRESS_REQUEST, GET_USERS_DELIVERYADDRESS_SUCCESS, GET_USERS_ORDERS_FAILURE, GET_USERS_ORDERS_REQUEST, GET_USERS_ORDERS_SUCCESS } from "./ActionTypes";
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
            // if (data.payment_url) {
            //     window.location.href=data.payment_url;
            // }
            // if (data) {
            //     reqdata.navigate("/payment/success/" + data.getId())
            // }
            console.log("created order data",data);
            dispatch({type:CREATE_ORDER_SUCCESS,payload:data})
            
            return data;
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

export const getUsersAddress = ({jwt}) =>{

    return async (dispatch) =>{
        dispatch({type:GET_USERS_DELIVERYADDRESS_REQUEST});
        try {
            const {data} = await api.get('/api/orders/Addresses',{
                headers:{
                    Authorization: `Bearer ${jwt}`,
                },
            });
            
            console.log(" users order",data);
            dispatch({type:GET_USERS_DELIVERYADDRESS_SUCCESS,payload:data})
            
            
        } catch (error) {
            console.log('error',error);
            
            dispatch({type:GET_USERS_DELIVERYADDRESS_FAILURE,payload:error})
            
        }
    }
}

export const DeleteAddress = (reqdata) =>{

    return async (dispatch) =>{
        dispatch({ type: Delete_Address_Order_REQUEST });
        try {
            const {data} = await api.delete(`/api/order/${reqdata.id}`,{
                headers:{
                    Authorization: `Bearer ${reqdata.jwt}`,
                     "Content-Type": "application/json"
                },
            });
          
           
            console.log("delete adress successfuly",reqdata.id);
            dispatch({type:Delete_Address_Order_SUCCESS,payload:reqdata.id})
            
            
        } catch (error) {
            console.log('error',error);
            
            dispatch({type:Delete_Address_Order_FAILURE,payload:error})
            
        }
    }
}