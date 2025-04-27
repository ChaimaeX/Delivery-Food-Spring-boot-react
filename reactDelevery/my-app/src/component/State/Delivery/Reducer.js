import {
    ASSIGN_ORDER_TO_DELIVERY_PERSON_FAILURE,
    ASSIGN_ORDER_TO_DELIVERY_PERSON_REQUEST,
    ASSIGN_ORDER_TO_DELIVERY_PERSON_SUCCESS,
    GET_DELIVERY_HISTORY_FAILURE,
    GET_DELIVERY_HISTORY_REQUEST,
    GET_DELIVERY_HISTORY_SUCCESS,
    GET_ORDERS_BY_ID_FAILURE,
    GET_ORDERS_BY_ID_REQUEST,
    GET_ORDERS_BY_ID_SUCCESS,
    GET_ORDERS_BY_STATUS_FAILURE,
    GET_ORDERS_BY_STATUS_REQUEST,
    GET_ORDERS_BY_STATUS_SUCCESS
  } from './ActionType';
  
  const initialState = {
    orders: [],
    deliveryHistory: [],
    loading: false,
    error: null,
    Order:null,
    assignedOrder: null,
    statusOrders: []
  };
  
  export const deliveryReducer = (state = initialState, action) => {
    switch (action.type) {
      // Requêtes pour obtenir les commandes par statut
      case GET_ORDERS_BY_ID_REQUEST:
      case GET_ORDERS_BY_STATUS_REQUEST:
        return {
          ...state,
          loading: true,
          error: null
        };
  
      case GET_ORDERS_BY_STATUS_SUCCESS:
        return {
          ...state,
          loading: false,
          statusOrders: action.payload,
          error: null
        };

      case GET_ORDERS_BY_ID_SUCCESS:
          return {
            ...state,
            loading: false,
            Order: action.payload,
            statusOrders: [],
            error: null
          };
  

      case GET_ORDERS_BY_ID_FAILURE:
      case GET_ORDERS_BY_STATUS_FAILURE:
        return {
          ...state,
          loading: false,
          error: action.payload,
         
        };
  
      // Requêtes pour l'historique des livraisons
      case GET_DELIVERY_HISTORY_REQUEST:
        return {
          ...state,
          loading: true,
          error: null
        };
  
        case GET_DELIVERY_HISTORY_SUCCESS:
          return {
            ...state,
            loading: false,
            deliveryHistory: Array.isArray(action.payload) ? action.payload : [],
            error: null
          };
  
      case GET_DELIVERY_HISTORY_FAILURE:
        return {
          ...state,
          loading: false,
          error: action.payload,
          deliveryHistory: []
        };
  
      // Requêtes pour assigner une commande à un livreur
      case ASSIGN_ORDER_TO_DELIVERY_PERSON_REQUEST:
        return {
          ...state,
          loading: true,
          error: null
        };
  
      case ASSIGN_ORDER_TO_DELIVERY_PERSON_SUCCESS:
        return {
          ...state,
          loading: false,
          assignedOrder: action.payload,
          // Mettre à jour le statut dans la liste des commandes si nécessaire
          orders: state.orders.map(order => 
            order.id === action.payload.id ? action.payload : order
          ),
          statusOrders: state.statusOrders.map(order => 
            order.id === action.payload.id ? action.payload : order
          ),
          error: null
        };
  
      case ASSIGN_ORDER_TO_DELIVERY_PERSON_FAILURE:
        return {
          ...state,
          loading: false,
          error: action.payload,
          assignedOrder: null
        };
  
      default:
        return state;
    }
  };