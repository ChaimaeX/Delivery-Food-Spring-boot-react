import * as ActionTypes from './ActionType';

const initialState = {
    menuItems: [],
    loading: false,
    error: null,
    search: [],
    message: null,
};

const MenuItemReducer = (state = initialState, action) => {
    switch (action.type) {
        case ActionTypes.CREATE_MENU_ITEM_REQUEST:
        case ActionTypes.GET_MENU_ITEMS_BY_RESTAURANT_ID_REQUEST:
        case ActionTypes.DELETE_MENU_ITEM_REQUEST:
        case ActionTypes.SEARCH_MENU_ITEM_REQUEST:
        case ActionTypes.UPADTE_MUNU_ITEMS_AVAILABILITY_REQUEST: // Correction du type
            return {
                ...state,
                loading: true,
                error: null,
                message: null,
            };

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

        case ActionTypes.DELETE_MENU_ITEM_SUCCESS:
            return {
                ...state,
                loading: false,
                menuItems: state.menuItems.filter(
                    (menuItem) => menuItem.id !== action.payload
                ),
            };

        case ActionTypes.UPADTE_MUNU_ITEMS_AVAILABILITY_SUCCESS: // Correction du type
            console.log("UPDATE ITEMS ID", action.payload.id);

            return {
                ...state,
                loading: false,
                menuItems: state.menuItems.map((menuItem) =>
                    menuItem.id === action.payload.id ? action.payload : menuItem
                ),
            };

        case ActionTypes.SEARCH_MENU_ITEM_SUCCESS: // Correction du type
            return {
                ...state,
                loading: false,
                search: action.payload,
            };

        case ActionTypes.CREATE_MENU_ITEM_FAILURE:
        case ActionTypes.GET_MENU_ITEMS_BY_RESTAURANT_ID_FAILURE:
        case ActionTypes.DELETE_MENU_ITEM_FAILURE:
        case ActionTypes.SEARCH_MENU_ITEM_FAILURE:
        case ActionTypes.UPADTE_MUNU_ITEMS_AVAILABILITY_FAILURE: // Correction du type
            return {
                ...state,
                loading: false,
                error: action.payload,
                message: null,
            };

        default:
            return state;
    }
};

export default MenuItemReducer;
