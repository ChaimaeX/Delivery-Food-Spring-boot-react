import { api } from "../../config/api";
import {
  GET_RESTAURNTS_ORDER_FAILURE,
  GET_RESTAURNTS_ORDER_REQUEST,
  GET_RESTAURNTS_ORDER_SUCCESS,
  UPDATE_ORDER_STATUS_FAILURE,
  UPDATE_ORDER_STATUS_REQUEST,
  UPDATE_ORDER_STATUS_SUCCESS,
} from "./Actiontype";

// Action pour mettre à jour le statut d'une commande
export const updateOrderStatus = ({ orderId, orderStatus, jwt }) => {
  return async (dispatch) => {
    try {
      dispatch({ type: UPDATE_ORDER_STATUS_REQUEST });

      const { data: updatedOrder } = await api.put(
        `api/admin/order/${orderId}/${orderStatus}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${jwt}`,
          },
        }
      );

      console.log("Commande mise à jour :", updatedOrder);

      dispatch({
        type: UPDATE_ORDER_STATUS_SUCCESS,
        payload: updatedOrder, // Assurez-vous que ce format est attendu par votre reducer
      });
    } catch (error) {
      console.error("Erreur lors de la mise à jour de la commande :", error);

      dispatch({
        type: UPDATE_ORDER_STATUS_FAILURE,
        errorMessage: error.response?.data?.message || "Une erreur s'est produite.",
      });
    }
  };
};

// Action pour récupérer les commandes d'un restaurant
export const fetchRestaurantOrder = ({ restaurantId, orderStatus, jwt }) => {
  return async (dispatch) => {
    try {
      dispatch({ type: GET_RESTAURNTS_ORDER_REQUEST });

      const { data: orders } = await api.get(
        `api/admin/orders/restaurant/${restaurantId}`,
        {
          params: { order_status: orderStatus },
          headers: {
            Authorization: `Bearer ${jwt}`,
            "Content-Type": "application/json",
          },
        }
      );

      console.log("Commandes récupérées :", orders);

      dispatch({
        type: GET_RESTAURNTS_ORDER_SUCCESS,
        payload: orders,
      });
    } catch (error) {
      console.error("Erreur lors de la récupération des commandes :", error);

      dispatch({
        type: GET_RESTAURNTS_ORDER_FAILURE,
        errorMessage: error.response?.data?.message || "Impossible de récupérer les commandes.",
      });
    }
  };
};
