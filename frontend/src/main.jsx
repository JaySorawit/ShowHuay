import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Home from './user/Home.jsx'
import Register from './user/Register.jsx'
import Login from './user/Login.jsx'
import Chat from './user/Chat.jsx'
import Goods_List from './user/Goods_List.jsx'
import Desktop_Category from './user/Desktop_Category.jsx'

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
    path: "Desktop_Category",
    element: <Desktop_Category/>
  },
  {
    path: "/Goods_List",
    element: <Goods_List/>
  }
  
])

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router}/>
  </React.StrictMode>,
)
