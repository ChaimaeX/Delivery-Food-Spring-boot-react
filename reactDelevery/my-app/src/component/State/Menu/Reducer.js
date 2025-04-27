import * as ActionTypes from './ActionType';

const initialState = {
    menuItems: [],
    menus:[],
    loading: false,
    error: null,
    TopItems: [],
    message: null,
};

const MenuItemReducer = (state = initialState, action) => {
    switch (action.type) {
        // Cas de requête (chargement en cours)
        case ActionTypes.CREATE_MENU_ITEM_REQUEST:
        case ActionTypes.GET_MENU_ITEMS_BY_RESTAURANT_ID_REQUEST:
        case ActionTypes.DELETE_MENU_ITEM_REQUEST:
        case ActionTypes.GET_TOP_MENU_ITEM_REQUEST:
        case ActionTypes.GET_ALL_MENU_ITEM_REQUEST:
        case ActionTypes.SEARCH_MENU_ITEM_REQUEST:
        case ActionTypes.UPDATE_MUNU_ITEMS_AVAILABILITY_REQUEST: // Correction du type
            return {
                ...state,
                loading: true,
                error: null,
                message: null,
                menuItems: [],
            };

        // Cas de succès
        case ActionTypes.CREATE_MENU_ITEM_SUCCESS:
            return {
                ...state,
                loading: false,
                menuItems: [...state.menuItems, action.payload],
                message: "Food Created Successfully",
            };

        case ActionTypes.GET_MENU_ITEMS_BY_RESTAURANT_ID_SUCCESS:
            return {
                ...state,
                loading: false,
                menuItems: action.payload,
            };

        case ActionTypes.GET_ALL_MENU_ITEM_SUCCESS:
            return {
                ...state,
                loading: false,
                menus: action.payload,
            };

        case ActionTypes.GET_TOP_MENU_ITEM_SUCCESS:
            return {
                ...state,
                loading: false,
                TopItems: action.payload,
            };

        case ActionTypes.DELETE_MENU_ITEM_SUCCESS:
                return {
                    ...state,
                    loading: false,
                    menuItems: state.menuItems.filter(
                        (menuItem) => menuItem.id !== action.payload // Supprime de menuItems
                    ),
                    TopItems: state.TopItems.filter(
                        (topItem) => topItem.id !== action.payload // Supprime de TopItem
                    ),
        };

        case ActionTypes.UPDATE_MUNU_ITEMS_AVAILABILITY_SUCCESS: // Correction du type
            return {
                ...state,
                loading: false,
                menuItems: state.menuItems.map((menuItem) =>
                    menuItem.id === action.payload.id ? action.payload : menuItem
                ),
            };

        case ActionTypes.SEARCH_MENU_ITEM_SUCCESS:
            return {
                ...state,
                loading: false,
                menuItems: action.payload,
            };

        // Cas d'échec
        case ActionTypes.CREATE_MENU_ITEM_FAILURE:
        case ActionTypes.GET_MENU_ITEMS_BY_RESTAURANT_ID_FAILURE:
        case ActionTypes.DELETE_MENU_ITEM_FAILURE:
        case ActionTypes.SEARCH_MENU_ITEM_FAILURE:
        case ActionTypes.GET_TOP_MENU_ITEM_FAILURE:
        case ActionTypes.GET_ALL_MENU_ITEM_FAILURE:
        case ActionTypes.UPDATE_MUNU_ITEMS_AVAILABILITY_FAILURE: // Correction du type
            return {
                ...state,
                loading: false,
                error: action.payload,
                message: null,
            };

        // Cas par défaut
        default:
            return state;
    }
};

export default MenuItemReducer;