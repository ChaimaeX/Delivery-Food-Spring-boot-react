import { isPresentInFavorites } from "../../config/logic";
import { ADD_TO_FAVORITE_FAILURE,
         ADD_TO_FAVORITE_REQUEST,
         ADD_TO_FAVORITE_SUCCESS, 
         GET_FAILURE, LOGIN_FAILURE, 
         LOGIN_REQUEST,
         REGISTER_FAILURE, 
         REGISTER_REQUEST,
         REGISTER_SUCCESS, 
         GET_USER_REQUEST,
         GET_USER_SUCCESS,
         GET_USER_FAILURE,
         LOGOUT,
         LOGIN_SUCCESS,
         FORGOT_PASSWORD_REQUEST,
         GET_OTP_REQUEST,
         UPDATE_PASSWORD_SUCCESS,
         GET_OTP_SUCCESS,
         FORGOT_PASSWORD_SUCCESS,
         FORGOT_PASSWORD_FAILURE,
         GET_OTP_FAILURE,
         UPDATE_PASSWORD_FAILURE,
         UPDATE_PASSWORD_REQUEST} 
          from "./ActionType";
          
const initialState={
    user:null,
    isLoading:false,
    loading:false,
    jwt:null,
    favorites:[],
    email: null,
    otpVerified: false,
    passwordReset: false,
    message: null,
   
}

export const authReducer=(state=initialState,action)=>{

    switch (action.type) {
        case REGISTER_REQUEST:
        case LOGIN_REQUEST:
        case GET_USER_REQUEST:
        case ADD_TO_FAVORITE_REQUEST: 
           return{...state,
                  loading:true,
                  error:null,
                  success:null,
                  message:null
                };
                
        case GET_OTP_REQUEST:          
            return{...state,
                  loading:true,
                  error:null,
                  success:null,
                  messages:null
                };
        case FORGOT_PASSWORD_REQUEST:        
            return{...state,
                loading:true,
                error:null,
                success:null,
                messages:null
             };

        case UPDATE_PASSWORD_REQUEST:          
             return{...state,
                   loading:true,
                   error:null,
                   success:null,
               
                 };

        case REGISTER_SUCCESS:
            return{...state,
                loading:false,
                message:action.payload
        };
            
        case LOGIN_SUCCESS:  
           return{...state,
                loading:false,
               jwt:action.payload,
               message:"Register Success"};
        
        case GET_USER_SUCCESS:
            
            return{...state,
                   isLoading:false,
                   user:action.payload,
                   favorites:action.payload.favorites
                };
       
        // Succès de l'envoi d'email
        case FORGOT_PASSWORD_SUCCESS:
          return {
            ...state,
            loading: false,
            success: true,
            email: action.payload.email,
            message: "Enter your code"
        };

        case GET_OTP_SUCCESS:
          return {
            ...state,
            loading: false,
            otpVerified: true,
            message: action.payload
         };

        case UPDATE_PASSWORD_SUCCESS:
          return {
             ...state, 
             passwordReset: true,
             message: "your password has been changed"
        };
    
        case ADD_TO_FAVORITE_SUCCESS:
            return{
                ...state,
                isLoading:false,
                error:null,
                favorites:isPresentInFavorites(state.favorites,action.payload)
                ? state.favorites.filter((item)=>item.id !== action.payload.id)
                :[action.payload,...state.favorites],
                 

            };
            case LOGOUT:
                return initialState;

            case REGISTER_FAILURE:
            case LOGIN_FAILURE:
            case GET_USER_FAILURE:
            case FORGOT_PASSWORD_FAILURE:
            case GET_OTP_FAILURE:
            case UPDATE_PASSWORD_FAILURE:
            case ADD_TO_FAVORITE_FAILURE:
                    
                   return{...state,
                          isLoading:false,
                          loading:false,
                          error:action.payload,
                          success:null};
                

        default:
            return state
    }
}