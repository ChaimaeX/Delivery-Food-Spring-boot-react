import {api} from "../../config/api"
import { ADD_ITEM_TO_CART_FAILURE, ADD_ITEM_TO_CART_REQUEST, ADD_ITEM_TO_CART_SUCCESS, CLEARE_CART_FAILURE, CLEARE_CART_REQUEST, CLEARE_CART_SUCCESS, FIND_CART_FAILURE, FIND_CART_REQUEST, FIND_CART_SUCCESS, GET_ALL_CART_ITEMS_FAILURE, GET_ALL_CART_ITEMS_REQUEST, GET_ALL_CART_ITEMS_SUCCESS, REMOVE_CARTITEM_FAILURE, REMOVE_CARTITEM_REQUEST, REMOVE_CARTITEM_SUCCESS, UPDATE_CARTITEM_FAILURE, UPDATE_CARTITEM_REQUEST, UPDATE_CARTITEM_SUCCESS } from "./ActionType"

export const findCart = (token) =>{

    return async (dispatch) =>{
        dispatch({type:FIND_CART_REQUEST});
        try {
            const response= await api.get('api/cart' ,{
                headers: {
                    Authorization: `Bearer ${token}` ,
                },
            });
            console.log("myCart: ",response.data);
            if (response) {
                localStorage.setItem('cart', JSON.stringify(response.data));
            }
            
            dispatch({type:FIND_CART_SUCCESS,payload:response.data});
        } catch (error) {
            // Si l'API échoue, essayer de récupérer depuis le localStorage
            const localCart = localStorage.getItem('cart');
            if (localCart) {
              dispatch({ type:'FIND_CART_SUCCESS', payload: JSON.parse(localCart) });
            } else {
              dispatch({ type:'FIND_CART_FAILURE', payload: error.message });
            }
          }
        };
    
}

export const addItemToCart = (reqData) => {
    return async (dispatch) => {
        dispatch({type: ADD_ITEM_TO_CART_REQUEST});
        try {
            // Envoi de la requête PUT avec les données et le token
            const {data} = await api.put('api/cart/add', reqData.cartItem, {
                headers: {
                    Authorization: `Bearer ${reqData.token}`,
                    'Content-Type': 'application/json'  // Assurez-vous que le Content-Type est correct
                },
            });

            // Dispatch de l'action de succès avec les données reçues
            dispatch({type: ADD_ITEM_TO_CART_SUCCESS, payload: data});
            console.log("Data", data);
        } catch (error) {
            // Dispatch de l'action d'échec avec l'erreur
            dispatch({type: ADD_ITEM_TO_CART_FAILURE, payload: error.message});
        }
    };
};


export const getAllItems = (reqData) =>{

    return async (dispatch) =>{
        dispatch({type:GET_ALL_CART_ITEMS_REQUEST});
        try {
            const response= await api.get(`api/cart/${reqData.cartId}/items` ,{
                headers: {
                    Authorization: `Bearer ${reqData.jwt}` ,
                },
            });
            dispatch({type:GET_ALL_CART_ITEMS_SUCCESS,payload:response.data});

        } catch (error) {
            dispatch({type:GET_ALL_CART_ITEMS_FAILURE,payload:error})
        }
    }
}

export const updateCartItem = (reqData) =>{

    return async (dispatch) =>{
        dispatch({type:UPDATE_CARTITEM_REQUEST});
        try {
            const {data}= await api.put(`api/cart-item/update`, reqData.data ,{
                headers: {
                    Authorization: `Bearer ${reqData.jwt}` ,
                    'Content-Type': 'application/json' 
                },
            });
            console.log("update cartItem",data);
            dispatch({type:UPDATE_CARTITEM_SUCCESS,payload:data});

        } catch (error) {
            dispatch({type:UPDATE_CARTITEM_FAILURE,payload:error.message})
        }
    }
}

export const removeCartItem = ({cartItemId,jwt}) =>{

    return async (dispatch) =>{
        dispatch({type:REMOVE_CARTITEM_REQUEST});
        try {
            const response= await api.delete(`api/cart-item/${cartItemId}/remove` ,{
                headers: {
                    Authorization: `Bearer ${jwt}` ,
                },
            });
            console.log("remove cartItem",response);
            dispatch({type:REMOVE_CARTITEM_SUCCESS,payload:response.data});

        } catch (error) {
            console.log("error:",error);
            dispatch({type:REMOVE_CARTITEM_FAILURE,payload:error.message});
        }
    }
}

export const clearCartAction = () =>{

    return async (dispatch) =>{
        dispatch({type:CLEARE_CART_REQUEST});
        try {
            const {data}= await api.put(`api/cart/clear`,{} ,{
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("jwt")}` ,
                },
            });
            console.log("clear cart ",data);
            dispatch({type:CLEARE_CART_SUCCESS,payload:data});

        } catch (error) {
            console.log("catch error".error);
            dispatch({type:CLEARE_CART_FAILURE,payload:error.message});
        }
    }
}

