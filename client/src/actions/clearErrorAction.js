import { CLEAR_ERROR } from "../constants/productConstants";

export const clearError = () => async(dispatch) => {
    dispatch({type:CLEAR_ERROR})
};