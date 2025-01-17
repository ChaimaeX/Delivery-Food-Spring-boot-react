import { 
    UPDATE_RESTAURANT_STATUS_REQUEST, 
    UPDATE_RESTAURANT_STATUS_SUCCESS 
  } from "../Restaurant/ActionType";
  
  import { 
    GET_RESTAURNTS_ORDER_FAILURE, 
    GET_RESTAURNTS_ORDER_REQUEST, 
    GET_RESTAURNTS_ORDER_SUCCESS, 
    UPDATE_ORDER_STATUS_FAILURE 
  } from "./Actiontype";
  
  const initialState = {
    loading: false,
    error: null,
    orders: []
  };
  
  const restaurantsOrderReducer = (state = initialState, action) => {
    switch (action.type) {
      case GET_RESTAURNTS_ORDER_REQUEST:
      case UPDATE_RESTAURANT_STATUS_REQUEST:
        return {
          ...state,
          loading: true,
          error: null
        };
  
      case GET_RESTAURNTS_ORDER_SUCCESS:
        return {
          ...state,
          loading: false,
          orders: action.payload
        };
  
      case UPDATE_RESTAURANT_STATUS_SUCCESS:
        const updatedOrders = state.orders.map((order) =>
          order.id === action.payload.id ? action.payload : order
        );
        return {
          ...state,
          loading: false,
          orders: updatedOrders
        };
  
      case GET_RESTAURNTS_ORDER_FAILURE:
      case UPDATE_ORDER_STATUS_FAILURE:
        return {
          ...state,
          loading: false,
          error: action.error || "An unexpected error occurred."
        };
  
      default:
        return state;
    }
  };
  
  export default restaurantsOrderReducer;
  