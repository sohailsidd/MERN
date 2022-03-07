import {createStore, combineReducers, applyMiddleware} from "redux";
import thunk from "redux-thunk";
import {composeWithDevTools} from "redux-devtools-extension";
import {productsReducer, productDetailReducer, newReviewReducer, newProductReducer, productReducer, productReviewsReducer, reviewReducer} from "./reducers/productReducer";
import { userReducer, updateProfile, forgotPasswordReducer, allUsersReducer, userDetailsReducer } from "./reducers/useReducer";
import { cartReducer } from "./reducers/cartReducer";
import { allOrdersReducer, myOrdersReducer, newOrderReducer, orderDetailsReducer, orderReducer } from "./reducers/orderReducer";

const reducer = combineReducers({
    products: productsReducer,
    productDetail: productDetailReducer,
    user: userReducer,
    profile: updateProfile,
    forgotPassword : forgotPasswordReducer,
    cart: cartReducer,
    newOrder: newOrderReducer,
    myOrders: myOrdersReducer,
    orderDetails: orderDetailsReducer,
    newReview: newReviewReducer,
    newProduct: newProductReducer,
    product: productReducer,
    allOrders: allOrdersReducer,
    order: orderReducer,
    allUsers: allUsersReducer,
    userDetails: userDetailsReducer,
    productReviews: productReviewsReducer,
    review: reviewReducer,
});

const initialState = {
    cart: {
        cartItems: localStorage.getItem("cartItems") ? 
        JSON.parse(localStorage.getItem("cartItems")) : [],
        shippingInfo: {
            cartItems: localStorage.getItem("shippingInfo") ? 
            JSON.parse(localStorage.getItem("shippingInfo")) : [],
        }
    }
};

const middleware = [thunk];

const store = createStore(reducer,initialState,composeWithDevTools(applyMiddleware(...middleware)));

export default store;