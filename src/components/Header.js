//import liraries
import React, { useContext } from "react";
import AuthContext from "../context/AuthCntx";
import useUserStore from "../store/useUserStore";
import logo from "./images/logo.png";

// create a component
const Header = () => {
	const { user } = useUserStore();
	const { isAuth, setAuth } = useContext(AuthContext);

	const currentRoute = window.location.pathname;

	const openmenuHandler = (e) => {
		let menu = document.getElementById("meunId");
		menu.style.display = "block";
	};
	const closeMenuHandler = (e) => {
		let menu = document.getElementById("meunId");
		menu.style.display = "none";
	};

	return (
		<nav className="navbar navbar-expand-lg navbar-light shadow sticky-top p-0">
			<a
				href="#"
				className="navbar-brand d-flex align-items-center px-4 px-lg-5"
			>
				<img src={logo} alt="" width={150} />
			</a>
			<button
				type="button"
				className="navbar-toggler me-4"
				data-bs-toggle="collapse"
				data-bs-target="#navbarCollapse"
			>
				<span className="navbar-toggler-icon" />
			</button>
			<div className="collapse navbar-collapse" id="navbarCollapse">
				<div className="navbar-nav ms-auto p-4 p-lg-0">
					<a href="#" className="nav-item nav-link active">
						Home
					</a>
					<a href="#" className="nav-item nav-link">
						About
					</a>
					<a href="#" className="nav-item nav-link">
						Popular Courses
					</a>
					<a href="#" className="nav-item nav-link">
						Courses
					</a>
					<a href="#" className="nav-item nav-link">
						Testimonials
					</a>
					<a href="#" className="nav-item nav-link">
						Contact
					</a>
				</div>
				<a
					href="https://mytathagat.com/signin"
					className="btn text-primary me-1 py-4 px-lg-5 d-none d-lg-block login-menu"
					target="_blank"
				>
					Login
				</a>
				<a
					href="https://mytathagat.com/signup"
					className="btn btn-primary py-4 px-lg-5 d-none d-lg-block"
					target="_blank"
				>
					Signup
				</a>
			</div>
		</nav>
	);
};

export default Header;
