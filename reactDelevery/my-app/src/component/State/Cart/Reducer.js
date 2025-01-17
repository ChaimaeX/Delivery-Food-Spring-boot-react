import { LOGOUT } from "../Authentication/ActionType";
import * as actionTyps from "./ActionType"

const initialState = {
    cart:null,
    cartItems:[],
    loading: false,
    error: null,
}

const cartReducer = (state = initialState, action) =>{
    switch (action.type) {
        case actionTyps.FIND_CART_REQUEST:
        case actionTyps.GET_ALL_CART_ITEMS_REQUEST:
        case actionTyps.UPDATE_CARTITEM_REQUEST:
        case actionTyps.REMOVE_CARTITEM_REQUEST:
            return{
                ...state,
                loading:true,
                error:null,

            };

        case actionTyps.FIND_CART_SUCCESS:
        case actionTyps.CLEARE_CART_SUCCESS:
                    return{
                        ...state,
                        loading:false,
                        cart: action.payload,
                        cartItems:action.payload.item,
        
                    };
        
        case actionTyps.ADD_ITEM_TO_CART_SUCCESS:
            return{
                ...state,
                loading:false,
                cartItems:[action.payload, ...state.cartItems],

            };

        case actionTyps.UPDATE_CARTITEM_SUCCESS:
                return{
                    ...state,
                    loading:false,
                    cartItems:state.cartItems.map((item) =>
                        item.id === action.payload.id ? action.payload : item
                    ),
    
        };
        case actionTyps.ADD_ITEM_TO_CART_SUCCESS:
                    return{
                        ...state,
                        loading:false,
                        cartItems:state.cartItems.filter((item)=>
                           item.id !== action.payload
                        ),
        
                    };
        case actionTyps.FIND_CART_FAILURE:
        case actionTyps.UPDATE_CARTITEM_FAILURE:
        case actionTyps.REMOVE_CARTITEM_FAILURE:
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

export default cartReducer;