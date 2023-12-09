import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import Home from './user/Home.jsx';
import Register from './user/Register.jsx';
import Login from './user/Login.jsx';
import Chat from './user/Chat.jsx';
import Cart from './user/Cart.jsx';
import Product from './user/Product.jsx';
import ProductList from './user/ProductList.jsx';
import MyProfile from './user/MyProfile.jsx';
import EditMyProfile from './user/EditMyProfile.jsx';
import MyAddress from './user/MyAddress.jsx';
import MyCreditCard from './user/MyCreditCard.jsx';
import ChangePassword from './user/ChangePassword.jsx';
import Shop from './user/Shop.jsx';
import ShopProfile from './user/ShopProfile.jsx'
import AddProduct from './user/AddProduct.jsx';
import Admin from './admin/Admin.jsx';
import Orders from './admin/pages/Orders.jsx';
import MyPurchases from './user/MyPurchases.jsx';
import Users from './admin/pages/Users.jsx';
import Products from './admin/pages/Products.jsx';
import Coupons from './admin/pages/Coupons.jsx';
import PageNotFound from './user/PageNotFound.jsx';
import Payment from './user/Payment.jsx';
import './App.css'

const commonRoutes = [
  { path: "/", element: <Home /> },
  { path: "/productList", element: <ProductList /> },
  { path: "/Products/:id", element: <Product /> },
  { path: "/shopProfile/:id", element: <ShopProfile /> },
];

const guestRoutes = [
  ...commonRoutes,
  { path: "/login", element: <Login /> },
  { path: "/register", element: <Register /> },
  { path: "/cart", element: <Navigate to="/login" /> },
  { path: "/chat", element: <Navigate to="/login"/> },
  { path: "/*", element: <PageNotFound /> },
];

const userRoutes = [
  ...commonRoutes,
  { path: "/myPurchases", element: <MyPurchases /> },
  { path: "/cart", element: <Cart /> },
  { path: "/chat/", element: <Chat /> },
  { path: "/chat/:id", element: <Chat /> },
  { path: "/shop", element: <Shop /> },
  { path: "/addProduct", element: <AddProduct /> },
  { path: "/myProfile", element: <MyProfile /> },
  { path: "/editMyProfile", element: <EditMyProfile /> },
  { path: "/changePassword", element: <ChangePassword /> },
  { path: "/myAddress", element: <MyAddress /> },
  { path: "/myCreditCard", element: <MyCreditCard /> },
  { path: "/payment", element: <Payment /> },
  { path: "/*", element: <PageNotFound /> },
];

const adminRoutes = [
  { path: "/admin", element: <Admin /> },
  { path: "/orders", element: <Orders /> },
  { path: "/users", element: <Users /> },
  { path: "/products", element: <Products /> },
  { path: "/coupons", element: <Coupons /> },
];


const guestRouter = createBrowserRouter(guestRoutes);
const userRouter = createBrowserRouter(userRoutes);
const adminRouter = createBrowserRouter(adminRoutes);

let userIsAdmin = localStorage.getItem('is_admin');
let userIsLogIn = localStorage.getItem('isLoggedIn');


const Main = () => {
  return (
    <React.StrictMode>
      <RouterProvider
        router={
          userIsLogIn == null
            ? guestRouter
            : userIsAdmin === 'true'
              ? adminRouter
              : userRouter
        }
      />
    </React.StrictMode>
  )
};

export default Main;

ReactDOM.createRoot(document.getElementById('root')).render(<Main />);
