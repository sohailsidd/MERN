import { ADD_TO_CARD, REMOVE_CARD_ITEM, SAVE_SHIPPING_INFO } from "../constants/cardConstants";
import axios from "axios";

export const addItemsToCard = (id, quantity) => async (dispatch, getState) => {
    const { data } = await axios.get(`/api/products/${id}`);
    
    dispatch({
        type: ADD_TO_CARD,
        payload : {
            product : data.product._id,
            name: data.product.name,
            price: data.product.price,
            image: data.product.images[0].url,
            stock: data.product.stock,
            quantity,
        }
    });

    localStorage.setItem("cartItems",JSON.stringify(getState().cart.cartItems));
};

export const removeItemsToCard = (id) => async (dispatch, getState) => {
    dispatch({
        type: REMOVE_CARD_ITEM,
        payload: id
    })

    localStorage.setItem("cartItems",JSON.stringify(getState().cart.cartItems));
};

export const saveShippingInfo = (data) => async (dispatch, getState) => {
    dispatch({
        type: SAVE_SHIPPING_INFO,
        payload: data
    })

    localStorage.setItem("shippingInfo",JSON.stringify(data));
};