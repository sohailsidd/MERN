import axios from "axios";
import { CLEAR_ERRORS, ALL_PRODUCT_REQUEST, ALL_PRODUCT_SUCCESS, ALL_PRODUCT_FAIL, PRODUCT_DETAIL_REQUEST, PRODUCT_DETAIL_SUCCESS, PRODUCT_DETAIL_FAIL, NEW_REVIEW_FAIL, NEW_REVIEW_SUCCESS, NEW_REVIEW_REQUEST, ADMIN_PRODUCT_REQUEST, ADMIN_PRODUCT_FAIL, ADMIN_PRODUCT_SUCCESS, NEW_PRODUCT_REQUEST, NEW_PRODUCT_SUCCESS, NEW_PRODUCT_FAIL ,
    DELETE_PRODUCT_REQUEST,
    DELETE_PRODUCT_SUCCESS,
    DELETE_PRODUCT_FAIL,
    UPDATE_PRODUCT_SUCCESS,
    UPDATE_PRODUCT_FAIL,
    ALL_REVIEW_REQUEST,
    ALL_REVIEW_SUCCESS,
    ALL_REVIEW_FAIL,
    DELETE_REVIEW_REQUEST,
    DELETE_REVIEW_SUCCESS,
    DELETE_REVIEW_FAIL,
    } from "../constants/productConstants";
import { UPDATE_PASSWORD_REQUEST } from "../constants/userConstants";

export const getProduct = (keyword=``, page=1, price= [0, 250000000000], category, ratings = 0) => async(dispatch) => {
    try {
        dispatch({type:ALL_PRODUCT_REQUEST})
        
        let link = `/api/products?keyword=${ keyword }&page=${ page }&price[gte]=${price[0]}&price[lte]=${price[1]}&ratings[gte]=${ratings}`;

        if (category) {
            link = `/api/products?keyword=${ keyword }&page=${ page }&price[gte]=${price[0]}&price[lte]=${price[1]}&category=${category}&ratings[gte]=${ratings}`;
        }

        const {data} = await axios.get(link);

        dispatch({
            type:ALL_PRODUCT_SUCCESS,
            payload: data
        })
    } catch (error) {
        dispatch({
            type:ALL_PRODUCT_FAIL,
            payload: error.response.data.message
        })
    }
};

export const getProductDetail = (id) => async (dispatch) => {
    
    try {
        dispatch({ type: PRODUCT_DETAIL_REQUEST });

        console.log(`/api/products/${id}`);
        const {data} = await axios.get(`/api/products/${id}`);


        dispatch({ 
            type: PRODUCT_DETAIL_SUCCESS,
            payload: data.product
        });
    } catch (error) {
        dispatch({
            type: PRODUCT_DETAIL_FAIL,
            payload: error.response.data.message 
        })
    }
}

export const newReview = (reviewData) => async (dispatch) => {
        try {
        dispatch({ type: NEW_REVIEW_REQUEST });
    
        const config = {
            headers: { "Content-Type": "multipart/form-data" },
        };
    
        const { data } = await axios.put(`/api/products/reviews`, reviewData, config);
    
        dispatch({
            type: NEW_REVIEW_SUCCESS,
            payload: data.success,
        });
        } catch (error) {
        dispatch({
            type: NEW_REVIEW_FAIL,
            payload: error.response.data.message,
        });
        }
    };

    // Get All Products For Admin
export const getAdminProduct = () => async (dispatch) => {
    try {
        dispatch({ type: ADMIN_PRODUCT_REQUEST });
    
        const { data } = await axios.get("/api/admin/products");
        dispatch({
            type: ADMIN_PRODUCT_SUCCESS,
            payload: data,
        });
        } catch (error) {
        dispatch({
            type: ADMIN_PRODUCT_FAIL,
            payload: error.response.data.message,
        });
        }
    };

// Create Product
export const createProduct = (productData) => async (dispatch) => {
    try {
        dispatch({ type: NEW_PRODUCT_REQUEST });
    
        const config = {
            headers: { "Content-Type": "multipart/form-data" },
        };
    
        const { data } = await axios.post(
            `/api/admin/products`,
            productData,
            config
        );
    
        dispatch({
            type: NEW_PRODUCT_SUCCESS,
            payload: data,
        });
        } catch (error) {
        dispatch({
            type: NEW_PRODUCT_FAIL,
            payload: error.response.data.message,
        });
        }
    };

    export const deleteProduct = (id) => async (dispatch) => {
        try {
            dispatch({ type: DELETE_PRODUCT_REQUEST });
        
            const { data } = await axios.delete(`/api/admin/products/${id}`);
        
            dispatch({
                type: DELETE_PRODUCT_SUCCESS,
                payload: data.success,
            });
            } catch (error) {
            dispatch({
                type: DELETE_PRODUCT_FAIL,
                payload: error.response.data.message,
            });
            }
        };


// Update Product
export const updateProduct = (id, productData) => async (dispatch) => {
    try {
        dispatch({ type: UPDATE_PASSWORD_REQUEST });
    
        const config = {
            headers: { "Content-Type": "multipart/form-data" },
        };
    
        const { data } = await axios.put(
            `/api/admin/products/${id}`,
            productData,
            config
        );
    
        dispatch({
            type: UPDATE_PRODUCT_SUCCESS,
            payload: data.success,
        });
        } catch (error) {
        dispatch({
            type: UPDATE_PRODUCT_FAIL,
            payload: error.response.data.message,
        });
        }
    };

export const getAllReviews = (id) => async (dispatch) => {
    try {
        dispatch({ type: ALL_REVIEW_REQUEST });
    
        const { data } = await axios.get(`/api/product/getAllReviews?id=${id}`);
    
        dispatch({
        type: ALL_REVIEW_SUCCESS,
        payload: data.reviews,
        });
    } catch (error) {
        dispatch({
        type: ALL_REVIEW_FAIL,
        payload: error.response.data.message,
        });
    }
    };

    // Delete Review of a Product
export const deleteReviews = (reviewId, productId) => async (dispatch) => {
try {
    dispatch({ type: DELETE_REVIEW_REQUEST });

    const { data } = await axios.delete(
    `/api/product/deleteProduct?id=${reviewId}&productId=${productId}`
    );

    dispatch({
    type: DELETE_REVIEW_SUCCESS,
    payload: data.success,
    });
} catch (error) {
    dispatch({
    type: DELETE_REVIEW_FAIL,
    payload: error.response.data.message,
    });
}
};


export const clearErrors = () => async (dispatch) => {
    dispatch({ type: CLEAR_ERRORS });
};