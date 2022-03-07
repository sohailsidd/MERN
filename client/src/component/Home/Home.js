import React, { Fragment , useEffect } from "react";
import { CgMouse } from "react-icons/all";
import Product from "./ProductCard";
import MetaData from "../layout/MetaData.js"
import { getProduct } from "../../actions/productAction.js";
import { useSelector, useDispatch  } from "react-redux";
import Loader from "../layout/Loader/Loader";
import { useAlert } from "react-alert";
import "./Home.css";
import  { clearError } from "../../actions/clearErrorAction";

function Home(props) {

    const { product, loading, error } = useSelector(state => state.products);
    const dispatch = useDispatch();
    const alert = useAlert();

    useEffect(() => {
        if(error){
            alert.error(error);
            dispatch(clearError());
        }
        dispatch(getProduct())
    },[dispatch, alert , error]);

    return (
        <Fragment>
            {loading ? 
            <Loader />:
                <Fragment>
            <MetaData title={"ECOMMERCE"} />

            <div className="banner">
                <p>Welcome to Ecommerce</p>
                <h1>FIND AMAZING PRODUCTS BELOW</h1>

                <a href="#container">
                <button>
                    Scroll <CgMouse />
                </button>
                </a>
            </div>

            <h2 className="homeHeading">Featured Products</h2>

            <div className="container" id="container">
                {product && product.map(pro => (
                    <Product key={pro._id} product={pro}/>
                ))}
            </div>
    </Fragment>
            }
        </Fragment>
    );
}

export default Home;