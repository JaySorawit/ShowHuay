import React from "react";
import Main from "./main";
import { UserProvider } from "./user/UserContext";

const App = () => {
  return (
    <UserProvider>
      <Main />
    </UserProvider>
  );
};

export default App;