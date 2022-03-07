import "./App.css";
import axios from "axios";
import Header from "./component/layout/Header/Header";
import Footer from "./component/layout/Footer/Footer";
import Home from "./component/Home/Home";
import ProductDetail from "./component/Product/ProductDetail";
import { BrowserRouter as Router, Route, Switch} from "react-router-dom";
import webFont from "webfontloader";
import Products from "./component/Product/Product";
import { useEffect, useState } from "react";
import Search from "./component/Product/Search.js";
import Login from "./component/User/LoginSignUp.js";
import store from "./store";
import { logedIn } from "./actions/userAction";
import { useSelector } from "react-redux";
import UserOptions from "./component/layout/Header/UserOptions";
import ProtectedRoute from "./component/Route/ProtectedRoute.js";
import Profile from "./component/User/Profile";
import UpdateProfile from "./component/User/UpdateProfile";
import UpdatePassword from "./component/User/UpdatePassword";
import ForgotPassword from "./component/User/ForgotPassword";
import ResetPassword from "./component/User/ResetPassword";
import MyOrders from "./component/Order/MyOrders";
import OrderDetails from "./component/Order/OrderDetails";
import Dashboard from "./component/Admin/Dashboard";
import ProductList from "./component/Admin/ProductList";
import NewProduct from "./component/Admin/NewProduct";
import UpdateProduct from "./component/Admin/UpdateProduct";
import OrderList from "./component/Admin/OrderList.js";
import ProcessOrder from "./component/Admin/ProcessOrder.js";
import UserList from "./component/Admin/UserList.js";
import UpdateUser from "./component/Admin/UpdateUser.js";
import ProductReviews from "./component/Admin/ProductReviews.js";
import Cart from "./component/Cart/Cart";
import Shipping from "./component/Cart/Shipping";
import ConfirmOrder from "./component/Cart/ConfirmOrder.js";
import Payment from "./component/Cart/Payment.js";
import Success from "./component/Cart/Success.js";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import Contact from "./component/layout/Contact/Contact.js";
import About from "./component/layout/About/About.js";
import NotFound from "./component/layout/Not Found/NotFound.js";

function App() {

  const { isAuthenticated, user } =  useSelector(state => state.user)
  const [stripeApiKey, setStripeApiKey] = useState("");

  async function getStripeApiKey() {
    const { data } = await axios.get("/api/stripeapikey");
    setStripeApiKey(data.stripeApiKey);
  }

  useEffect(()=>{
    webFont.load({
      google:{
        families: ["Roboto", "Dorid Sans", "Chilanka"]
      }
    })

    store.dispatch(logedIn());
    getStripeApiKey();
  },[]);

  return (
    <Router>
      <Header />
      { isAuthenticated && (<UserOptions user={user} />)}
      {stripeApiKey && (
          <Elements stripe={loadStripe(stripeApiKey)}>
            <ProtectedRoute exact path="/process/payment" component={Payment} />
          </Elements>
      )}

      <Switch>
        <Route exact path="/" component={Home}/>
        <Route exact path="/product/:id" component={ProductDetail}/>
        <Route exact path="/products" component={Products} />
        <Route path="/products/:keyword" component={Products} />
        <Route exact path="/Search" component={Search}/>
        <Route exact path="/login" component={Login}/>
        <Route exact path="/contact" component={Contact} />
        <Route exact path="/about" component={About} />
        <ProtectedRoute exact path="/account" component={Profile} />
        <ProtectedRoute exact path="/update" component={UpdateProfile} />
        <ProtectedRoute exact path="/password/update" component={UpdatePassword} />
        <ProtectedRoute exact path="/shipping" component={Shipping} />
        <ProtectedRoute exact path="/orders" component={MyOrders} />
        <ProtectedRoute isAdmin={true} exact path="/admin/dashboard" component={Dashboard} />
        <ProtectedRoute isAdmin={true} exact path="/admin/products" component={ProductList} />
        <ProtectedRoute isAdmin={true} exact path="/admin/product" component={NewProduct} />
        <ProtectedRoute isAdmin={true} exact path="/admin/product/:id" component={UpdateProduct} />
        <ProtectedRoute isAdmin={true} exact path="/admin/orders" component={OrderList} />
        <ProtectedRoute isAdmin={true} exact path="/admin/order/:id" component={ProcessOrder} />
        <ProtectedRoute isAdmin={true} exact path="/admin/users" component={UserList} />
        <ProtectedRoute isAdmin={true} exact path="/admin/user/:id" component={UpdateUser} />
        <ProtectedRoute isAdmin={true} exact path="/admin/reviews" component={ProductReviews} />
        <Route exact path="/password/forgot" component={ForgotPassword} />
        <Route exact path="/password/reset/:token" component={ResetPassword} />
        <Route exact path="/cart" component={Cart} />
        <ProtectedRoute exact path="/success" component={Success} />
        <ProtectedRoute exact path="/order/:id" component={OrderDetails} />
        <ProtectedRoute exact path="/orders/confirm" component={ConfirmOrder} />

        <Route
          component={
            window.location.pathname === "/process/payment" ? null : NotFound
          }
          />
      </Switch>
      
      <Footer />
    </Router>
  );
}

export default App;
