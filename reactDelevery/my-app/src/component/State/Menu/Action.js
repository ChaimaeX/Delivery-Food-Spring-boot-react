import {api} from "../../config/api"
import { CREATE_MENU_ITEM_FAILURE, 
    CREATE_MENU_ITEM_REQUEST, 
    CREATE_MENU_ITEM_SUCCESS, 
    DELETE_MENU_ITEM_FAILURE, 
    DELETE_MENU_ITEM_REQUEST, 
    DELETE_MENU_ITEM_SUCCESS, 
    GET_ALL_MENU_ITEM_FAILURE, 
    GET_ALL_MENU_ITEM_REQUEST, 
    GET_ALL_MENU_ITEM_SUCCESS, 
    GET_MENU_ITEMS_BY_RESTAURANT_ID_FAILURE, 
    GET_MENU_ITEMS_BY_RESTAURANT_ID_REQUEST, 
    GET_MENU_ITEMS_BY_RESTAURANT_ID_SUCCESS, 
    GET_TOP_MENU_ITEM_FAILURE, 
    GET_TOP_MENU_ITEM_REQUEST, 
    GET_TOP_MENU_ITEM_SUCCESS, 
    SEARCH_MENU_ITEM_FAILURE, 
    SEARCH_MENU_ITEM_REQUEST, 
    SEARCH_MENU_ITEM_SUCCESS, 
    UPDATE_MUNU_ITEMS_AVAILABILITY_FAILURE, 
    UPDATE_MUNU_ITEMS_AVAILABILITY_REQUEST, 
    UPDATE_MUNU_ITEMS_AVAILABILITY_SUCCESS } from "./ActionType";

 export const createMenuItem =({ menu,jwt}) =>{
    return async (dispatch) =>{
        dispatch({type:CREATE_MENU_ITEM_REQUEST});
        try {
            const { data } = await api.post("api/admin/food",menu,{
                headers: {
                    Authorization: `Bearer ${jwt}`,
                    "Content-Type": "application/json"
                },
            });
        console.log("created menu",data);
        dispatch({type:CREATE_MENU_ITEM_SUCCESS,payload:data})
        
        } catch (error) {
            console.log("catch error ",error);
            dispatch({type:CREATE_MENU_ITEM_FAILURE,payload:error})
            
        }
    }
 }

 export const getMenuItemsByResturantId = (ReqData) => {
    return async (dispatch) => {
        dispatch({ type: GET_MENU_ITEMS_BY_RESTAURANT_ID_REQUEST });
        try {
            const { data } = await api.get(
                `api/food/restaurant/${ReqData.restaurantId}?vegetarian=${ReqData.vegetarian}
                &nonveg=${ReqData.nonveg}
                &seasonal=${ReqData.seasonal}`,
                {
                    headers: {
                        Authorization: `Bearer ${ReqData.jwt}`,
                    },
                }
            );
            console.log("menu item by restaurants", data);
            dispatch({ type: GET_MENU_ITEMS_BY_RESTAURANT_ID_SUCCESS, payload: data });
        } catch (error) {
            console.error("catch error", error);
            dispatch({ type: GET_MENU_ITEMS_BY_RESTAURANT_ID_FAILURE, payload: error });
        }
    };
};


 export const searchMenuItem =({ keyword,restaurantId,jwt}) =>{
    return async (dispatch) =>{
        dispatch({type:SEARCH_MENU_ITEM_REQUEST});
        try {
            const { data } = await api.get(`api/food/search?name=${keyword}&restaurantId=${restaurantId}`,{
                headers: {
                    Authorization: `Bearer ${jwt}`,
                },
            });
        console.log("data -------------",data);
        dispatch({type:SEARCH_MENU_ITEM_SUCCESS,payload:data})
        
        } catch (error) {
            console.log("catch error ",error);
            dispatch({type:SEARCH_MENU_ITEM_FAILURE,payload:error})
            
        }
    }
 }

 export const getAllTopMenuItem =() =>{
    return async (dispatch) =>{
        dispatch({type:GET_TOP_MENU_ITEM_REQUEST});
        try {
            const { data } = await api.get(`api/food`
            // ,{
            //     headers: {
            //         Authorization: `Bearer ${jwt}`,
            //         "Content-Type": "application/json"
            //     },
            // }
        );
        console.log("data Top Meels-----------",data);
        dispatch({type:GET_TOP_MENU_ITEM_SUCCESS,payload:data})
        
        } catch (error) {
            console.log("catch error ",error);
            dispatch({type:GET_TOP_MENU_ITEM_FAILURE,payload:error})
            
        }
    }
 }

 export const getAllMenus =({jwt}) =>{
    return async (dispatch) =>{
        dispatch({type:GET_ALL_MENU_ITEM_REQUEST});
        try {
            const { data } = await api.get(`api/food/foods`,{
                headers: {
                    Authorization: `Bearer ${jwt}`,
                    "Content-Type": "application/json"
                },
            });
        console.log("data Meels-----------",data);
        dispatch({type:GET_ALL_MENU_ITEM_SUCCESS,payload:data})
        
        } catch (error) {
            console.log("catch error ",error);
            dispatch({type:GET_ALL_MENU_ITEM_FAILURE,payload:error})
            
        }
    }
 }

//  export const getAllIngredientOfMenuItem =(reqData) =>{
//     return async (dispatch) =>{
//         dispatch({type:CREATE_MENU_ITEM_REQUEST});
//         try {
//             const { data } = await api.get(`api/food/restaurant/${reqData.restaurantId}`,{
//                 headers: {
//                     Authorization: `Bearer ${reqData}`,
//                 },
//             });
//         console.log("created menu",data);
//         dispatch({type:CREATE_MENU_ITEM_SUCCESS,payload:data})
        
//         } catch (error) {
//             console.log("catch error ",error);
//             dispatch({type:CREATE_MENU_ITEM_FAILURE,payload:error})
            
//         }
//     }
//  }

export const updateMenuItemsAvailability =({ foodId,jwt}) =>{
    return async (dispatch) =>{
        dispatch({type:UPDATE_MUNU_ITEMS_AVAILABILITY_REQUEST});
        try {
            const { data } = await api.put(`api/admin/food/${foodId}/`,{},{
                headers: {
                    Authorization: `Bearer ${jwt}`,
                },
            });
        console.log("update menuItems Availability ",data);
        dispatch({type:UPDATE_MUNU_ITEMS_AVAILABILITY_SUCCESS,payload:data})
        
        } catch (error) {
            console.log("catch error ",error);
            dispatch({type:UPDATE_MUNU_ITEMS_AVAILABILITY_FAILURE,payload:error})
            
        }
    }
 }

 export const deleteFoodAction =(foodId,jwt) =>{
    return async (dispatch) =>{
        dispatch({type:DELETE_MENU_ITEM_REQUEST});
        try {
            const { data } = await api.delete(`api/admin/food/${foodId}`,{
                headers: {
                    Authorization: `Bearer ${jwt}`,
                },
            });
        console.log("delete food ",data);
        dispatch({type:DELETE_MENU_ITEM_SUCCESS,payload:foodId})
        
        } catch (error) {
            console.log("catch error ",error);
            dispatch({type:DELETE_MENU_ITEM_FAILURE,payload:error})
            
        }
    }
 }