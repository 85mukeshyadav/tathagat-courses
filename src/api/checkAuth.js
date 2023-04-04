import { Link } from "react-router-dom";

export const isTokenExpired = (token) => {
    const expiry = (JSON.parse(atob(token.split('.')[ 1 ]))).exp;
    return (Math.floor((new Date).getTime() / 1000)) >= expiry;
}

export const isRoleUser = (token) => {
    const expiry = JSON.parse(atob(token.split('.')[ 1 ]))
    return expiry.user.user_type == 'student' ? true : false
}

export const userInfo = (token) => {
    const expiry = JSON.parse(atob(token.split('.')[ 1 ]))
    return expiry.user.username
}


export const isLoggedIn = () => {
    return localStorage.getItem('token') != null && isTokenExpired(localStorage.getItem('token')) == true && isRoleUser == true ? true : false
}