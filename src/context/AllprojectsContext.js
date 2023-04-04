import React from "react";

const hideNavContext = React.createContext({
    hideNav: [],
    sethideNav: () => { }
});

export default hideNavContext;