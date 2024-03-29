//import liraries
import { Avatar } from "@mantine/core";
import React, { useContext } from "react";
import { Link } from "react-router-dom";
import AuthContext from "../context/AuthCntx";
import useUserStore from "../store/useUserStore";

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
		// <Router>
		// <nav className="bg-indigo-500">
		<nav className="bg-grey-500">
			<div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8">
				<div className="relative flex items-center justify-between h-16">
					<div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
						{/* <button type="button" className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white" aria-controls="mobile-menu" aria-expanded="false">
                            <span className="sr-only">Open main menu</span>

                            <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                            </svg>

                            <svg className="hidden h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button> */}
					</div>
					<div className="flex-1 flex items-center sm:items-stretch sm:justify-start">
						<Link style={{}} to="/">
							<div className="flex-shrink-0 flex items-center">
								<img
									className="w-fullimg h-10"
									src="https://www.tathagat.co.in/assets/img/logo.png"
								></img>
							</div>
						</Link>
						<div className="hidden sm:block sm:ml-6">
							<div className="flex space-x-4">
								{/* <Link style={ { padding: 6 } } to='/courses' > */}
								<Link
									to={isAuth ? "/myCourses" : "/"}
									className={`text-gray-100 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium 
												${currentRoute === "/myCourses" ? "bg-gray-700" : ""}
									`}
								>
									{isAuth ? "My Courses" : ""}
								</Link>

								<Link
									to={isAuth ? "/courses" : "/"}
									className={`text-gray-100 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium
												${currentRoute === "/courses" ? "bg-gray-700" : ""}
									`}
								>
									{isAuth ? "All Courses" : ""}
								</Link>
								<Link
									to={isAuth ? "/bookmarks" : "/"}
									className={`text-gray-100 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium
												${currentRoute === "/bookmarks" ? "bg-gray-700" : ""}
									`}
								>
									{isAuth ? "Bookmarks" : ""}
								</Link>

								{/* </Link> */}
								{/* <Link style={ { padding: 6 } } to='/blogs' > */}
								{/* <Link to={isAuth ? '/blogs' : '/'} className="text-gray-100 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium">Blogs</Link> */}
								{/* </Link> */}

								{/* <Link style={ { padding: 6 } } to='/Exam' >
                                    <Link to={ () => false } className="text-gray-100 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium">Exam</Link>
                                </Link> */}
								{/* <Link onClickCapture={ () => {

                                } } style={ { padding: 6 } } to='/examination' >
                                    <Link to={ () => false } className="text-gray-100 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium">Exam</Link>
                                </Link> */}

								{/* <Link to={ () => false } className="text-gray-100 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium">Calendar</Link> */}
							</div>
						</div>
					</div>
					<div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
						{!isAuth ? (
							<>
								{/* <Link style={ { padding: 6 } } to='signin' > */}
								<Link
									to="signin"
									className="text-gray-100 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
								>
									Login
								</Link>
								{/* </Link> */}
								{/* <Link style={ { padding: 6 } } to='signup' > */}
								<Link
									to="signup"
									className="text-gray-100 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
								>
									Signup
								</Link>
								{/* </Link> */}
							</>
						) : null}
						{/* <button type="button" className=" p-1 rounded-full text-gray-100 hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white">
                            <span className="sr-only">View notifications</span>

                            <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                            </svg>
                        </button> */}

						{/* <div className="ml-3 relative">
                            <div>
                                <button onClick={ closeMenuHandler } onMouseEnter={ openmenuHandler } type="button" className="bg-gray-800 flex text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white" id="user-menu-button" aria-expanded="false" aria-haspopup="true">
                                    <span className="sr-only">Open user menu</span>
                                    <img className="h-8 w-8 rounded-full" src="https://www.kindpng.com/picc/m/78-786207_user-avatar-png-user-avatar-icon-png-transparent.png" alt="" />
                                </button>
                            </div>

                            <div id='meunId' className="hidden origin-top-right z-10 absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none" role="menu" aria-orientation="vertical" aria-labelledby="user-menu-button" tabIndex="-1">

                                <Link to={ () => false } className="block px-4 py-2 text-sm text-gray-700" role="menuitem" tabIndex="-1" id="user-menu-item-0">Your Profile</Link>
                                <Link to={ () => false } className="block px-4 py-2 text-sm text-gray-700" role="menuitem" tabIndex="-1" id="user-menu-item-1">Settings</Link> */}
						{isAuth ? (
							<>
								<Avatar
									className="mr-6"
									component={Link}
									to="/profile"
									variant="filled"
									size="md"
									radius="xl"
									color="dark"
									src={process.env.REACT_APP_API + "/" + user.profile}
								/>
								<Link
									style={{ cursor: "pointer" }}
									onClick={() => {
										localStorage.clear();
										setAuth(false);
										window.open(
											`${process.env.REACT_APP_SSO_URL}/simplesso/weblogout?serviceURL=${process.env.REACT_APP_REDIRECT_URL}`
										);
									}}
									to=""
									className="text-gray-100 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
									role="menuitem"
									tabIndex="-1"
									id="user-menu-item-2"
								>
									Sign out
								</Link>
							</>
						) : null}
						{/* </div>
                        </div> */}
					</div>
				</div>
			</div>

			{/* <!-- Mobile menu, show/hide based on menu state. --> */}
			{/* <div className="sm:hidden" id="mobile-menu">
                <div className="px-2 pt-2 pb-3 space-y-1">
                    <Link to={ () => false } className="bg-gray-900 text-white block px-3 py-2 rounded-md text-base font-medium" aria-current="page">Dashboard</Link>

                    <Link to={ () => false } className="text-gray-100 hover:bg-gray-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium">Team</Link>

                    <Link to={ () => false } className="text-gray-100 hover:bg-gray-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium">Projects</Link>

                    <Link to={ () => false } className="text-gray-100 hover:bg-gray-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium">Calendar</Link>
                </div>
            </div> */}
		</nav>
		// </Router>
	);
};

export default Header;
