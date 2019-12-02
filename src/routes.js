import React from "react";
import { Route } from "react-router-dom";
import Hoc from "./hoc/hoc";

import DateList from './containers/DateList'
import SellerList from './containers/SellerList'
import GenreList from './containers/GenreList'
import TitleList from './containers/TitleList'
import PriceList from './containers/PriceList'
import Login from "./containers/Login";
import Signup from "./containers/Signup";
import HomepageLayout from "./containers/Home";
import ProductList from './containers/ProductList'
import ProductDetail from './containers/ProductDetail'
import AuthorList from './containers/AuthorList'
import OrderSummary from './containers/OrderSummary'
import CheckOut from './containers/CheckOut'
import Profile from './containers/Profile'

const BaseRouter = () => (
  <Hoc>
    <Route path="/genre-list/:genre" component={GenreList} />
    <Route path="/date-list/" component={DateList} />
    <Route path="/seller-list/" component={SellerList} />
    <Route path="/title-list/" component={TitleList} />
    <Route path="/price-list/" component={PriceList} />
    <Route exact path="/products" component={ProductList} />
    <Route path="/products/:productID" component={ProductDetail} />
    <Route path="/author-list/" component={AuthorList} />
    <Route path="/login" component={Login} />
    <Route path="/signup" component={Signup} />
    <Route path="/order-summary" component={OrderSummary} />
    <Route path="/checkout" component={CheckOut} />
    <Route path="/profile" component={Profile} />
    <Route exact path="/" component={HomepageLayout} />
  </Hoc>
);

export default BaseRouter;
