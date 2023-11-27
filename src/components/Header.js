//import liraries
import clsx from "clsx";
import React, { useContext } from "react";
import { Link } from "react-router-dom";
import AuthContext from "../context/AuthCntx";
import logo from "./images/logo.png";

// create a component
const Header = () => {
	const { isAuth, setAuth } = useContext(AuthContext);

	const currentRoute = window.location.pathname;

	return (
		<nav className="navbar navbar-expand-lg navbar-light shadow sticky-top p-0">
			<Link
				to="/"
				className="navbar-brand d-flex align-items-center px-4 px-lg-5"
			>
				<img src={logo} alt="logo" width={150} />
			</Link>
			<button
				type="button"
				className="navbar-toggler me-4"
				data-bs-toggle="collapse"
				data-bs-target="#navbarCollapse"
			>
				<span className="navbar-toggler-icon" />
			</button>
			<div
				className={clsx("collapse navbar-collapse", !isAuth && "justify-end")}
				id="navbarCollapse"
			>
				{isAuth && (
					<div className="navbar-nav p-4 p-lg-0">
						<Link to="/myCourses" className="nav-item nav-link">
							My Courses
						</Link>
						<Link to="/courses" className="nav-item nav-link">
							All Courses
						</Link>
						<Link to="/bookmarks" className="nav-item nav-link">
							Bookmarks
						</Link>
					</div>
				)}
				{isAuth && (
					<div className="navbar-nav ms-auto p-4 p-lg-0">
						<Link to="/profile" className="nav-item nav-link">
							My Profile
						</Link>
						<Link
							to="/"
							className="nav-item nav-link"
							onClick={() => {
								localStorage.clear();
								setAuth(false);
							}}
						>
							Logout
						</Link>
					</div>
				)}
				{!isAuth && (
					<div className="flex">
						<Link
							to="signin"
							className="btn text-primary me-1 py-4 px-lg-5 d-none d-lg-block login-menu"
						>
							Login
						</Link>
						<Link
							to="signup"
							className="btn btn-primary py-4 px-lg-5 d-none d-lg-block"
						>
							Signup
						</Link>
					</div>
				)}
			</div>
		</nav>
	);
};

export default Header;
