import React, { useEffect, useReducer } from "react";
import { authReducer } from "./components/category/components/auth/authReducer";
import { AuthContext } from "./components/category/components/auth/authContext";
import { AppRouter } from "./routes/AppRouter";
const init  = () =>{
  return JSON.parse(localStorage.getItem("user")) || {logged: false}
}

const App = () => {
  const [user, dispatch] = useReducer(authReducer, {}, init)

  useEffect(()=>{
    if(!user) return;
    localStorage.setItem("user", JSON.stringify(user))
  },[user])

  return (
    <AuthContext.Provider value={{dispatch, user}}>
      <AppRouter/>
    </AuthContext.Provider>
  );
};

export default App;
