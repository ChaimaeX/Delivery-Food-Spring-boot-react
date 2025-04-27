import axios from "axios";
import { ADD_TO_FAVORITE_FAILURE, ADD_TO_FAVORITE_REQUEST, ADD_TO_FAVORITE_SUCCESS, GET_USER_FAILURE, GET_USER_SUCCESS, LOGIN_FAILURE, LOGIN_REQUEST, LOGIN_SUCCESS, LOGOUT, REGISTER_FAILURE, REGISTER_REQUEST, REGISTER_SUCCESS, GET_USER_REQUEST, FORGOT_PASSWORD_SUCCESS, FORGOT_PASSWORD_REQUEST, FORGOT_PASSWORD_FAILURE, GET_OTP_REQUEST, GET_OTP_SUCCESS, GET_OTP_FAILURE, UPDATE_PASSWORD_REQUEST, UPDATE_PASSWORD_SUCCESS, UPDATE_PASSWORD_FAILURE } from "./ActionType";
import { api, API_URL } from "../../config/api";

export const registerUser = (userData) => async (dispatch) => {
  dispatch({ type: REGISTER_REQUEST });
  try {
    const { data } = await axios.post(`${API_URL}/auth/signup`, userData, {
      headers: {
        'Content-Type': 'application/json'
      }
    });

    dispatch({ type: REGISTER_SUCCESS, payload: data.message });
    console.log("Enregistrement réussi", data);
    
    
  } catch (error) {
    const errorMessage = error.response ? error.response.data.message : error.message;
    dispatch({ type: REGISTER_FAILURE, payload: errorMessage });
    console.log("Erreur", errorMessage);
  }
};

export const LoginUser = (reqData) => async (dispatch) => {
  dispatch({ type: LOGIN_REQUEST })    ;
  try {
    const { data } = await axios.post(`${API_URL}/auth/signin${reqData.token ? `?token=${reqData.token}` : ""}`, reqData.userData);
    if (data.jwt) localStorage.setItem("jwt", data.jwt);

    if (data.role === "ROLE_RESTAURANT_OWNER") {
      reqData.navigate("/admin/restaurant");
    } 
    if (data.role === "ROLE_LIVREUR") {
      reqData.navigate("/");
    }

    if (data.role === "ROLE_ADMIN") {
      reqData.navigate("/admin");
    }
    else{
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

export const Forgotpassword = (email) => async (dispatch) => {
  dispatch({ type: FORGOT_PASSWORD_REQUEST });
  try {
    const { data } = await api.post(`/auth/forgetPassword/verifyMail/${email}`, {});

    dispatch({ type: FORGOT_PASSWORD_SUCCESS,
      payload: { 
        email,
        message: data.message 
      }
    });
    console.log("data", data);
  } catch (error) {
    const errorMessage = error.response ? error.response.data.message : error.message;
    dispatch({ type: FORGOT_PASSWORD_FAILURE, payload: errorMessage });
    console.log("Erreur", errorMessage);
  }
};

export const Otpverifecation = (reqdata) => async (dispatch) => {
  dispatch({ type:GET_OTP_REQUEST });
  try {
    const { data } = await api.post(`/auth/forgetPassword/verifyOtp/${reqdata.otp}/${reqdata.email}`, {});

    dispatch({ type: GET_OTP_SUCCESS, payload: data });
    console.log("data", data);

    
  } catch (error) {
    const errorMessage = error.response ? error.response.data.message : error.message;
    dispatch({ type: GET_OTP_FAILURE, payload: errorMessage });
    console.log("Erreur", errorMessage);
  }
};

export const Changepassword =  ({ email, newPassword, confirmPassword }) => async (dispatch) => {
  dispatch({ type:UPDATE_PASSWORD_REQUEST });
  try {
    const { data } = await api.post(`/auth/forgetPassword/changePassword/${email}`, {
      newPassword,
      confirmPassword
    });

    dispatch({ type: UPDATE_PASSWORD_SUCCESS, payload: data });
    console.log("data", data);
  } catch (error) {
    const errorMessage = error.response ? error.response.data.message : error.message;
    dispatch({ type: UPDATE_PASSWORD_FAILURE, payload: errorMessage });
    console.log("Erreur", errorMessage);
  }
};


export const addToFavorite = ({ jwt,status, restaurantId }) => async (dispatch) => {
  dispatch({ type: ADD_TO_FAVORITE_REQUEST });
  try {
    const { data } = await api.put(`/api/restaurants/${restaurantId}/add-favorite/${status}`, {}, {
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
