import React from "react";

const AuthContext = React.createContext({
    isAuth: false,
    setAuth: () => { }
});

export default AuthContext;