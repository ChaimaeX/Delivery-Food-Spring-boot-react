import { combineReducers, applyMiddleware, legacy_createStore } from "redux";
import { authReducer } from "./Authentication/Reducer";

import { thunk } from 'redux-thunk';
import restaurantReducer from "./Restaurant/reducer";
import MenuItemReducer from "./Menu/Reducer";
import cartReducer from "./Cart/Reducer";
import { orderReducer } from "./Order/reducer";
import restaurantsOrderReducer from "./Restaurant_order/Reducer";
import { ingredientReducer } from "./ingredients/Reducer";


// Combinaison des reducers
const rootReducer = combineReducers({
  auth: authReducer,
  restaurant: restaurantReducer,
  menu:MenuItemReducer,
  cart:cartReducer,
  order:orderReducer,
  restaurantOrder:restaurantsOrderReducer,
  ingredients:ingredientReducer,
  
});

// Création du store Redux avec le middleware thunk
export const store = legacy_createStore(rootReducer, applyMiddleware(thunk));
