//import liraries
import axios from "axios";
import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import AuthContext from "../../context/AuthCntx";
import Loader from "../Loader";

// create a component
const Signup = () => {
	const navigate = useNavigate();

	const [firstName, setFirstName] = useState("");
	const [lastName, setLastName] = useState("");
	const [mobile, setMobile] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [crfPassword, setCrfPassword] = useState("");
	const { setAuth } = useContext(AuthContext);
	const [loading, setLoading] = useState(false);

	const Register = async () => {
		if (
			!firstName ||
			!lastName ||
			!mobile ||
			!email ||
			!password ||
			!crfPassword
		) {
			toast.error("Please fill all the fields", {
				position: "top-right",
				autoClose: 2000,
				hideProgressBar: false,
				closeOnClick: true,
				pauseOnHover: true,
				draggable: true,
			});
			return;
		}

		const isMobileValid = /^[6-9]\d{9}$/.test(mobile);
		if (!isMobileValid) {
			toast.error("Please enter a valid mobile number", {
				position: "top-right",
				autoClose: 2000,
				hideProgressBar: false,
				closeOnClick: true,
				pauseOnHover: true,
				draggable: true,
			});
			return;
		}

		if (password !== crfPassword) {
			toast.error("Password does not match confirm password", {
				position: "top-right",
				autoClose: 2000,
				hideProgressBar: false,
				closeOnClick: true,
				pauseOnHover: true,
				draggable: true,
				progress: undefined,
			});
			return;
		}
		const data = {
			firstName: firstName,
			lastName: lastName,
			email_Id: email,
			mobileNumber: mobile,
			password: password,
			role: "student",
		};
		try {
			setLoading(true);
			let res = await axios.post(process.env.REACT_APP_API + "/register", data);
			if (res.status == 200) {
				setFirstName("");
				setLastName("");
				setMobile("");
				setEmail("");
				setPassword("");
				toast.success("Signup Successful", {
					position: "top-right",
					autoClose: 1000,
					hideProgressBar: false,
					closeOnClick: true,
					pauseOnHover: true,
					draggable: true,
					progress: undefined,
				});
				navigate("/verify", {
					state: {
						user: res.data.user,
						token: res.data.token,
					},
				});
			} else {
				toast.error("User already exists!", {
					position: "top-right",
					autoClose: 2000,
					hideProgressBar: false,
					closeOnClick: true,
					pauseOnHover: true,
					draggable: true,
					progress: undefined,
				});
				setAuth(false);
			}
		} catch (err) {
			toast.error("User already exists!", {
				position: "top-right",
				autoClose: 2000,
				hideProgressBar: false,
				closeOnClick: true,
				pauseOnHover: true,
				draggable: true,
				progress: undefined,
			});
		} finally {
			setLoading(false);
		}
	};

	if (loading) {
		return (
			<div className="min-h-screen">
				<Loader />
			</div>
		);
	}

	return (
		<div className="h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
			<ToastContainer />
			<div className="max-w-md w-full space-y-8">
				<div>
					<img
						className="mx-auto h-12 w-auto"
						src="https://tailwindui.com/img/logos/workflow-mark-indigo-600.svg"
						alt="Workflow"
					/>
					<h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
						Create new Tathagat account
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
						<label for="first-name" className="sr-only">
							First Name
						</label>
						<input
							value={firstName}
							onChange={(e) => setFirstName(e.target.value)}
							id="first_name"
							name="first-name"
							type="username"
							required
							className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
							placeholder="First Name"
						/>
					</div>
					<div>
						<label for="last-name" className="sr-only">
							Last Name
						</label>
						<input
							value={lastName}
							onChange={(e) => setLastName(e.target.value)}
							id="last-name"
							name="last-name"
							type="username"
							required
							className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
							placeholder="Last Name"
						/>
					</div>
					<div>
						<label for="email-address" className="sr-only">
							Email address
						</label>
						<input
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							id="email-address"
							name="email"
							type="email"
							required
							className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
							placeholder="Email address"
						/>
					</div>
					<div>
						<label for="mobile" className="sr-only">
							Mobile Nmuber
						</label>
						<input
							value={mobile}
							onChange={(e) => setMobile(e.target.value)}
							id="mobile"
							name="mobile"
							type="tel"
							required
							className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
							placeholder="Mobile Number"
						/>
					</div>
					<div>
						<label for="password" className="sr-only">
							Password
						</label>
						<input
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							id="password"
							name="password"
							type="password"
							autocomplete="current-password"
							required
							className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
							placeholder="Password"
						/>
					</div>
					<div>
						<label for="crfpassword" className="sr-only">
							Confirm Password
						</label>
						<input
							value={crfPassword}
							onChange={(e) => setCrfPassword(e.target.value)}
							id="crfpassword"
							name="crfpassword"
							type="password"
							required
							className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
							placeholder="Confirm Password"
						/>
					</div>
				</div>

				<div>
					<button
						onClick={() => Register()}
						type="submit"
						className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
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
									fill-rule="evenodd"
									d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
									clip-rule="evenodd"
								/>
							</svg>
						</span>
						Sign up
					</button>
					<Link
						to="/signin"
						type="submit"
						className="group mt-6 relative w-full flex justify-center py-2 px-4 border-2 text-sm font-medium rounded-md text-gray-800 hover:text-gray-100 border-indigo-600 hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
					>
						Already have an account? Login
					</Link>
				</div>
			</div>
		</div>
	);
};

//make this component available to the app
export default Signup;
