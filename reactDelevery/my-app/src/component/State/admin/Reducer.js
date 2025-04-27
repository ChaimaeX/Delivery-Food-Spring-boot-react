import { LOGOUT } from "../Authentication/ActionType";
import * as actionTyps from "./ActionType"

const initialState = {
    
    users:[],
    restaurants:[],
    orders:[],
    loading: false,
    error: null,
}

const adminReducer = (state = initialState, action) =>{
    switch (action.type) {
        case actionTyps.GET_ALL_USERS_REQUEST:
        case actionTyps.GET_ALL_RESTAURANTS_REQUEST:
        case actionTyps.GET_ALL_ORDERS_REQUEST:
        
            return{
                ...state,
                loading:true,
                error:null,

            };

        case actionTyps.GET_ALL_ORDERS_SUCCESS:
                    return{
                        ...state,
                        loading:false,
                        orders: action.payload,
        
                    };
        
        case actionTyps.GET_ALL_USERS_SUCCESS:
            return{
                ...state,
                loading:true,
                users:action.payload,

            };

        case actionTyps.GET_ALL_RESTAURANTS_SUCCESS:
                return{
                    ...state,
                    restaurants:action.payload
                    
    
        };
      
        case actionTyps.GET_ALL_ORDERS_FAILURE:
        case actionTyps.GET_ALL_RESTAURANTS_FAILURE:
        case actionTyps.GET_ALL_USERS_FAILURE:
                 return{
                    ...state,
                    loading:false,
                    error: action.payload
                 }

        case LOGOUT:
            localStorage.removeItem("jwt");
            return{
                ...state,
                cartItems:[],
                cart:null,
                success:"logout success"
            }
        default:
            return state;
    }
};

export default adminReducer;