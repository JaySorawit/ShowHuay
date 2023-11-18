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
import PageNotFound from './user/PageNotFound.jsx';
import './App.css'

const commonRoutes = [
  { path: "/", element: <Home /> },
  { path: "/productList", element: <ProductList /> },
  { path: "/Product/:id", element: <Product />},
];

const guestRoutes = [
  ...commonRoutes,
  { path: "/login", element: <Login /> },
  { path: "/register", element: <Register /> },
  { path: "/cart", element: <Navigate to="/login" />},
  { path: "/chat", element: <Navigate to="/login"/> },
  { path: "/*", element: <PageNotFound /> },
];

const userRoutes = [
  ...commonRoutes,
  { path: "/cart", element: <Cart />},
  { path: "/chat", element: <Chat /> },
  { path: "/*", element: <PageNotFound /> },
];

const adminRoutes = [
  // { path: "/", element: </> },
  { path: "/*", element: <PageNotFound /> },
];


const guestRouter = createBrowserRouter(guestRoutes);
const userRouter = createBrowserRouter(userRoutes);
const adminRouter = createBrowserRouter(adminRoutes);

const user = null; // Set user to the appropriate value

const Main = () => {
  return (
    <React.StrictMode>
    <RouterProvider
      router={
        user == null
          ? guestRouter
          : user.is_admin === 1
          ? adminRouter
          : userRouter
      }
    />
    </React.StrictMode>
  )
};

export default Main;

ReactDOM.createRoot(document.getElementById('root')).render(<Main />);
