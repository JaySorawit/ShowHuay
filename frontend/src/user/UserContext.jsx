/********************************************************************
 *   UserContext.jsx                                                *
 *                                                                  *
 *   React context file managing user-related state and providing   *
 *   context to components that need access to user information.    *
 *   It typically includes state, methods, and data related to the  *
 *   current user's authentication and profile information.         *
 *                                                                  *
 ********************************************************************/

import React, { createContext, useContext, useState } from "react";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const loginUser = (userData) => {
    setUser(userData);
  };

  const logoutUser = () => {
    setUser(null);
  };

  return (
    <UserContext.Provider value={{ user, loginUser, logoutUser }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};
