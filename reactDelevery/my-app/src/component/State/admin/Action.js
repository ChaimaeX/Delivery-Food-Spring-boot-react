import {api} from "../../config/api"
import {GET_ALL_ORDERS_FAILURE, GET_ALL_ORDERS_REQUEST, GET_ALL_ORDERS_SUCCESS, GET_ALL_RESTAURANTS_FAILURE, GET_ALL_RESTAURANTS_REQUEST, GET_ALL_RESTAURANTS_SUCCESS, GET_ALL_USERS_FAILURE, GET_ALL_USERS_REQUEST, GET_ALL_USERS_SUCCESS} from "./ActionType";

export const getUsers = ({jwt}) =>{

    return async (dispatch) =>{
        dispatch({ type: GET_ALL_USERS_REQUEST });
        try {
            const {data} = await api.get('/api/aharak/users',{
                headers:{
                    Authorization: `Bearer ${jwt}`,
                     "Content-Type": "application/json"
                },
            });
           
           
            console.log("get all users",data);
            dispatch({type:GET_ALL_USERS_SUCCESS,payload:data})
            
            
        } catch (error) {
            console.log('error',error);
            
            dispatch({type:GET_ALL_USERS_FAILURE,payload:error})
            
        }
    }
}

export const getRestaurants = ({jwt}) =>{

    return async (dispatch) =>{
        dispatch({ type: GET_ALL_RESTAURANTS_REQUEST });
        try {
            const {data} = await api.get('/api/Admin/aharak/restaurants',{
                headers:{
                    Authorization: `Bearer ${jwt}`,
                     "Content-Type": "application/json"
                },
            });
           
           
            console.log("get all restaurants",data);
            dispatch({type:GET_ALL_RESTAURANTS_SUCCESS,payload:data})
            
            
        } catch (error) {
            console.log('error',error);
            
            dispatch({type:GET_ALL_RESTAURANTS_FAILURE,payload:error})
            
        }
    }
}

export const getOrders = ({jwt}) =>{

    return async (dispatch) =>{
        dispatch({ type: GET_ALL_ORDERS_REQUEST });
        try {
            const {data} = await api.get('/api/aharak/orders',{
                headers:{
                    Authorization: `Bearer ${jwt}`,
                     "Content-Type": "application/json"
                },
            });
           
           
            console.log("get all orders",data);
            dispatch({type:GET_ALL_ORDERS_SUCCESS,payload:data})
            
            
        } catch (error) {
            console.log('error',error);
            
            dispatch({type:GET_ALL_ORDERS_FAILURE,payload:error})
            
        }
    }
}