import { CREATE_ORDER_FAILURE, CREATE_ORDER_REQUEST, CREATE_ORDER_SUCCESS, GET_USERS_ORDERS_FAILURE, GET_USERS_ORDERS_REQUEST, GET_USERS_ORDERS_SUCCESS } from "./ActionTypes";

const initialState ={
   loading: false,
   orders:[],
   error:null,
}

export const orderReducer = ( state = initialState ,action) =>{
    switch (action.type) {
        case GET_USERS_ORDERS_REQUEST:
            return{
                ...state, error:null, loading:true
            };
        case GET_USERS_ORDERS_SUCCESS:    
            return{
                ...state,
                error:null,
                loading: false,
                orders: action.payload
            };
        
        case GET_USERS_ORDERS_FAILURE:
            return{
                ...state,
                error:action.payload,
                loading: false
            };

        case CREATE_ORDER_REQUEST:
                return {
                  ...state,
                  loading: true,  // Indique que la requête est en cours
                  error: null,    // Réinitialisation des erreurs
                };
        case CREATE_ORDER_SUCCESS:
                return {
                  ...state,
                  loading: false,  // La requête est terminée
                  order: action.payload,  // La commande créée est stockée ici
                  error: null,    // Réinitialisation des erreurs
                };
        case CREATE_ORDER_FAILURE:
                return {
                  ...state,
                  loading: false,  // La requête est terminée
                  error: action.payload,  // Erreur de la requête
                };
            
        default:
            return state;
    }
};