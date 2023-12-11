/********************************************************************
 *   App.jsx                                                        *
 *                                                                  *
 *   Main entry point for the React application. It typically       *
 *   includes the overall structure.                                *
 *                                                                  *
 ********************************************************************/

import React from "react";
import Main from "./main";
import { UserProvider } from "./user/UserContext";
import './App.css'


const App = () => {
  return (
    <UserProvider>
      <Main />
    </UserProvider>
  );
};

export default App;