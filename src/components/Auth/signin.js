//import liraries
import axios from "axios";
import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import AuthContext from "../../context/AuthCntx";

// import { useState } from 'react/cjs/react.development';

// create a component
const Signin = () => {
	const navigate = useNavigate();
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const { isAuth, setAuth } = useContext(AuthContext);
	if (isAuth) {
		navigate("/myCourses");
	}

	const _SignIn = async (e) => {
		e.preventDefault();
		try {
			let data = {
				email_Id: email,
				password: password,
			};
			let res = await axios.post(process.env.REACT_APP_API + "/login", data);
			if (res.status == 200) {
				const resp = await axios.get(
					process.env.REACT_APP_API + `/user_info/${email}`
				);
				localStorage.setItem(
					"user_info",
					JSON.stringify({
						name: resp.data.username,
						email: resp.data.email_Id,
						phone: resp.data.mobileNumber,
						type: resp.data.user_type,
					})
				);
				localStorage.setItem("token", res.data.token);
				localStorage.setItem("user", res.data.user.email_Id);
				setAuth(true);
				toast.success("Login Successfully", {
					position: "top-right",
					autoClose: 1000,
					hideProgressBar: false,
					closeOnClick: true,
					pauseOnHover: true,
					draggable: true,
					progress: undefined,
				});
				navigate("/myCourses");
			} else {
				toast.error("Invalid credential", {
					position: "top-right",
					autoClose: 5000,
					hideProgressBar: false,
					closeOnClick: true,
					pauseOnHover: true,
					draggable: true,
					progress: undefined,
				});
				setAuth(false);
			}
		} catch (err) {
			toast.error("Invalid credential", {
				position: "top-right",
				autoClose: 5000,
				hideProgressBar: false,
				closeOnClick: true,
				pauseOnHover: true,
				draggable: true,
				progress: undefined,
			});
		}
	};

	return (
		<div className="min-h-full h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
			<ToastContainer />
			<form onSubmit={(e) => _SignIn(e)} className="max-w-md w-full space-y-8">
				<div>
					<img
						className="mx-auto h-12 w-auto"
						src="https://tailwindui.com/img/logos/workflow-mark-indigo-500.svg"
						alt="Workflow"
					/>
					<h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
						Sign in to your account
					</h2>
				</div>
				<input
					onChange={(e) => console.log(e.target.value)}
					type="hidden"
					name="remember"
					value="true"
				/>
				<div className="rounded-md shadow-sm -space-y-px">
					<div>
						<label htmlFor="email-address" className="sr-only">
							Email address
						</label>
						<input
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							id="email-address"
							name="email"
							type="email"
							autoComplete="email"
							required
							className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
							placeholder="Email address"
						/>
					</div>
					<div>
						<label htmlFor="password" className="sr-only">
							Password
						</label>
						<input
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							id="password"
							name="password"
							type="password"
							autoComplete="current-password"
							required
							className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
							placeholder="Password"
						/>
					</div>
				</div>
				<div className="flex items-center justify-between">
					<div className="flex items-center">
						<input
							onClick={(e) => console.log(e.target)}
							id="remember-me"
							name="remember-me"
							type="checkbox"
							className="h-4 w-4 text-indigo-500 focus:ring-indigo-500 border-gray-300 rounded"
						/>
						<label
							htmlFor="remember-me"
							className="ml-2 block text-sm text-gray-900"
						>
							Remember me
						</label>
					</div>

					<div className="text-sm">
						<Link
							to="#"
							className="font-medium text-indigo-500 hover:text-indigo-500"
						>
							Forgot your password?
						</Link>
					</div>
				</div>

				<div>
					<button
						type="submit"
						className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-500 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
					>
						<span className="absolute left-0 inset-y-0 flex items-center pl-3">
							<svg
								className="h-5 w-5 text-indigo-100 group-hover:text-indigo-200"
								xmlns="http://www.w3.org/2000/svg"
								viewBox="0 0 20 20"
								fill="currentColor"
								aria-hidden="true"
							>
								<path
									fillRule="evenodd"
									d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
									clipRule="evenodd"
								/>
							</svg>
						</span>
						Sign in
					</button>
					<Link
						to="/signup"
						type="submit"
						className="group mt-6 relative w-full flex justify-center py-2 px-4 border-2 text-sm font-medium rounded-md text-gray-800 hover:text-gray-100 border-indigo-500 hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
					>
						Don't have an account? Register
					</Link>
					{/* <a
						href={`${process.env.REACT_APP_SSO_URL}/simplesso/login?serviceURL=${process.env.REACT_APP_REDIRECT_URL}`}
						// target="_blank"
						rel="noopener noreferrer"
						// type="submit"
						className="mt-8 group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-500 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
						// onClick={}
					>
						<span className="absolute left-0 inset-y-0 flex items-center pl-3">
							<svg
								className="h-5 w-5 text-indigo-100 group-hover:text-indigo-200"
								xmlns="http://www.w3.org/2000/svg"
								viewBox="0 0 20 20"
								fill="currentColor"
								aria-hidden="true"
							>
								<path
									fillRule="evenodd"
									d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
									clipRule="evenodd"
								/>
							</svg>
						</span>
						SSO Sign in
					</a> */}
				</div>
			</form>
		</div>
	);
};

//make this component available to the app
export default Signin;
