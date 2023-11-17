import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Home from './user/Home.jsx'
import Register from './user/Register.jsx'
import Login from './user/Login.jsx'
import Chat from './user/Chat.jsx'
import ProductList from './user/ProductList.jsx'

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home/>
  },
  {
    path: "register",
    element: <Register/>
  },
  {
    path: "login",
    element: <Login/>
  },
  {
    path: "Chat",
    element: <Chat/>
  },
  {
    path: "/ProductList",
    element: <ProductList/>
  }
  
])

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router}/>
  </React.StrictMode>,
)
