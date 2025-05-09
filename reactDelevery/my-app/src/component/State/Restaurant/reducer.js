import * as ActionTypes from "./ActionType";

const initialState = {
    restaurants: [],
    usersRestaurant: null,
    restaurant: null,
    loading: false,
    error: null,
    events: [],
    restaurantsEvents: [],
    categories: [],
};

const restaurantReducer = (state = initialState, action) => {
    switch (action.type) {
        case ActionTypes.CREATE_RESTAURANT_REQUEST:
        case ActionTypes.GET_ALL_RESTAURANT_REQUEST:
        case ActionTypes.DELETE_RESTAURANT_REQUEST:
        case ActionTypes.UPDATE_RESTAURANT_REQUEST:
        case ActionTypes.GET_RESTAURANT_BY_ID_REQUEST:
        case ActionTypes.CREATE_CATEGORY_REQUEST:
        case ActionTypes.GET_RESTAURANTS_CATEGORY_REQUEST:
            return {
                ...state,
                loading: true,
                error: null,
                restaurants: [],
            };

        case ActionTypes.CREATE_RESTAURANT_SUCCESS:
            return {
                ...state,
                loading: false,
                usersRestaurant: action.payload,
            };

        case ActionTypes.GET_ALL_RESTAURANT_SUCCESS:
            return {
                ...state,
                loading: false,
                restaurants: action.payload,
            };

        case ActionTypes.GET_RESTAURANT_BY_ID_SUCCESS:
            return {
                ...state,
                loading: false,
                restaurant: action.payload,
            };

        case ActionTypes.GET_RESTAURANT_BY_USER_ID_SUCCESS:
        case ActionTypes.UPDATE_RESTAURANT_STATUS_SUCCESS:
        case ActionTypes.UPDATE_RESTAURANT_SUCCESS:
            return {
                ...state,
                loading: false,
                usersRestaurant: action.payload,
            };

        case ActionTypes.DELETE_RESTAURANT_SUCCESS:
            return {
                ...state,
                loading: false,
                error: null,
                restaurants: state.restaurants?.filter(
                    (item) => item.id !== action.payload
                ),
                usersRestaurant: state.usersRestaurant?.filter(
                    (item) => item.id !== action.payload
                ),
            };

        case ActionTypes.CREATE_EVENTS_SUCCESS:
            return {
                ...state,
                loading: false,
                events: [...state.events, action.payload],
            };

        case ActionTypes.GET_RESTAURANTS_EVENTS_SUCCESS:
            return {
                ...state,
                loading: false,
                restaurantsEvents: action.payload,
            };

        case ActionTypes.DELETE_EVENTS_SUCCESS:
            return {
                ...state,
                loading: false,
                events: state.events?.filter(
                    (item) => item.id !== action.payload
                ),
                restaurantsEvents: state.restaurantsEvents?.filter(
                    (item) => item.id !== action.payload
                ),
            };

        case ActionTypes.CREATE_CATEGORY_SUCCESS:
            return {
                ...state,
                loading: false,
                categories: [...state.categories, action.payload],
            };

        case ActionTypes.GET_RESTAURANTS_CATEGORY_SUCCESS:
            return {
                ...state,
                loading: false,
                categories: action.payload,
            };

        case ActionTypes.CREATE_RESTAURANT_FAILURE:
        case ActionTypes.GET_ALL_RESTAURANT_FAILURE:
        case ActionTypes.DELETE_RESTAURANT_FAILURE:
        case ActionTypes.UPDATE_RESTAURANT_FAILURE:
        case ActionTypes.GET_RESTAURANT_BY_ID_FAILURE:
        case ActionTypes.CREATE_EVENTS_FAILURE:
        case ActionTypes.CREATE_CATEGORY_FAILURE:
        case ActionTypes.GET_RESTAURANTS_CATEGORY_FAILURE:
            return {
                ...state,
                loading: false,
                error: action.payload,
            };

        default:
            return state;
    }
};

export default restaurantReducer;
