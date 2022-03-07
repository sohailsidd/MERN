import {Fragment, useEffect, useState} from 'react';
import { getProduct } from "../../actions/productAction.js";
import { useSelector, useDispatch  } from "react-redux";
import { useAlert } from "react-alert";
import Loader from '../layout/Loader/Loader';
import ProductCard from '../Home/ProductCard';
import MetaData from '../layout/MetaData';
import Pagination from "react-js-pagination";
import "./Products.css";
import Typography from "@material-ui/core/Typography";
import Slider from "@material-ui/core/Slider";
import { clearError } from '../../actions/clearErrorAction.js';

function Product({match}) {
    
    const { product, loading, error, resultPerPage, productCount, filterProductCount } = useSelector(state => state.products);
    const dispatch = useDispatch();
    const alert = useAlert();
    const [currentPage, setCurrentPage] = useState(1);
    const [price, setPrice] = useState([0, 2500000000000000]);
    const [ratings, setRatings] = useState(0);
    const count = filterProductCount;
    const categories = [ "Laptop", "Footwear", "Bottom", "Tops", "Attire", "Camera", "SmartPhones"];
    const [category, setCategory] = useState("");

    const priceHandler = (event, newPrice) => {
        setPrice(newPrice);
    };

    useEffect(() => {
        if(error){
            alert.error(error);
            dispatch(clearError());
        }

        dispatch(getProduct(match.params.keyword, currentPage, price, category, ratings));
    },[dispatch, category, ratings, alert, error, match.params.keyword, currentPage, price]);

    const setCurrentPageNo = (e) => {
        setCurrentPage(e);
    };
console.log("resultPerPage" + resultPerPage);
                            console.log("count" + count);
    return (
        <Fragment>
            {loading ? (<Loader />): (
                <Fragment>
                    <MetaData title="PRODUCTS -- ECOMMERCE" />
                    <h2 className="productsHeading">Products</h2>

                    <div className="container" id="container">
                        {product && product.map(pro => (
                            <ProductCard key={pro._id} product={pro}/>
                        ))}
                    </div>
                    <div className="paginationBox">
                    {resultPerPage  < count && (
                        <Pagination
                            activePage={currentPage}
                            itemsCountPerPage={resultPerPage}
                            totalItemsCount={productCount}
                            onChange={setCurrentPageNo}
                            nextPageText="Next"
                            prevPageText="Prev"
                            firstPageText="1st"
                            lastPageText="Last"
                            itemClass="page-item"
                            linkClass="page-link"
                            activeClass="pageItemActive"
                            activeLinkClass="pageLinkActive"
                        />
                    )}
                    </div>
                    <div className="filterBox">
                        <Typography>Price</Typography>
                            <Slider
                            value={price}
                            onChange={priceHandler}
                            valueLabelDisplay="auto"
                            aria-labelledby="range-slider"
                            min={0}
                            max={2500}
                        />

                        <Typography>Categories</Typography>
                            <ul className="categoryBox">
                                {categories.map((category) => (
                                <li
                                    className="category-link"
                                    key={category}
                                    onClick={() => setCategory(category)}
                                    >
                                    {category}
                                </li>
                            ))}
                            </ul>

                            <fieldset>
                            <Typography component="legend">Ratings Above</Typography>
                            <Slider
                                value={ratings}
                                onChange={(e, newRating) => {
                                setRatings(newRating);
                                }}
                                aria-labelledby="continuous-slider"
                                valueLabelDisplay="auto"
                                min={0}
                                max={5}
                            />
                            </fieldset>
                    </div>
                </Fragment>
            )}
        </Fragment>
    );
}

export default Product;