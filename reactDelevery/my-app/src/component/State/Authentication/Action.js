import axios from "axios";
import { ADD_TO_FAVORITE_FAILURE, ADD_TO_FAVORITE_REQUEST, ADD_TO_FAVORITE_SUCCESS, GET_USER_FAILURE, GET_USER_SUCCESS, LOGIN_FAILURE, LOGIN_REQUEST, LOGIN_SUCCESS, LOGOUT, REGISTER_FAILURE, REGISTER_REQUEST, REGISTER_SUCCESS, GET_USER_REQUEST } from "./ActionType";
import { api, API_URL } from "../../config/api";

export const registerUser = (reqData) => async (dispatch) => {
  dispatch({ type: REGISTER_REQUEST });
  try {
    const { data } = await axios.post(`${API_URL}/auth/signup`, reqData.userData);
    if (data.jwt) localStorage.setItem("jwt", data.jwt);

    if (data.role === "ROLE_RESTAURANT_OWNER") {
      reqData.navigate("/admin/restaurant");
    } else {
      reqData.navigate("/");
    }

    dispatch({ type: REGISTER_SUCCESS, payload: data.jwt });
    console.log("Enregistrement réussi", data);
  } catch (error) {
    const errorMessage = error.response ? error.response.data.message : error.message;
    dispatch({ type: REGISTER_FAILURE, payload: errorMessage });
    console.log("Erreur", errorMessage);
  }
};

export const LoginUser = (reqData) => async (dispatch) => {
  dispatch({ type: LOGIN_REQUEST });
  try {
    const { data } = await axios.post(`${API_URL}/auth/signin`, reqData.userData);
    if (data.jwt) localStorage.setItem("jwt", data.jwt);

    if (data.role === "ROLE_RESTAURANT_OWNER") {
      reqData.navigate("/admin/restaurant");
    } else {
      reqData.navigate("/");
    }

    dispatch({ type: LOGIN_SUCCESS, payload: data.jwt });
    console.log("Connexion réussie", data);
  } catch (error) {
    const errorMessage = error.response ? error.response.data.message : error.message;
    dispatch({ type: LOGIN_FAILURE, payload: errorMessage });
    console.log("Erreur", errorMessage);
  }
};

export const getUser = (jwt) => async (dispatch) => {
  dispatch({ type: GET_USER_REQUEST });
  try {
    const { data } = await api.get(`/api/users/profile`, {
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
    });

    dispatch({ type: GET_USER_SUCCESS, payload: data });
    console.log("Profil utilisateur", data);
  } catch (error) {
    const errorMessage = error.response ? error.response.data.message : error.message;
    dispatch({ type: GET_USER_FAILURE, payload: errorMessage });
    console.log("Erreur", errorMessage);
  }
};

export const addToFavorite = ({ jwt, restaurantId }) => async (dispatch) => {
  dispatch({ type: ADD_TO_FAVORITE_REQUEST });
  try {
    const { data } = await api.put(`/api/restaurants/${restaurantId}/add-favorite`, {}, {
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
    });

    dispatch({ type: ADD_TO_FAVORITE_SUCCESS, payload: data });
    console.log("Mise à jour des favoris", data);
  } catch (error) {
    const errorMessage = error.response ? error.response.data.message : error.message;
    dispatch({ type: ADD_TO_FAVORITE_FAILURE, payload: errorMessage });
    console.log("Erreur", errorMessage);
  }
};

export const logout = () => async (dispatch) => {
  
  try {
    
    dispatch({ type: LOGOUT });
    console.log("Déconnexion réussie");
  } catch (error) {
    console.log("Erreur", error);
  }
};
