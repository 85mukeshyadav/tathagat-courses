import { PinInput } from "@mantine/core";
import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import AuthContext from "../../context/AuthCntx";
import Loader from "../Loader";

const OtpInput = () => {
	const navigate = useNavigate();
	const { state } = useLocation();
	const [otp, setOtp] = useState("");
	const [verifyOtp, setVerifyOtp] = useState("");
	const [loading, setLoading] = useState(false);
	const { setAuth } = useContext(AuthContext);

	console.log(state);

	const handleVerify = () => {
		if (otp == "") {
			toast.error("Please enter OTP", {
				position: "top-right",
				autoClose: 2000,
				hideProgressBar: false,
				closeOnClick: true,
				pauseOnHover: true,
				draggable: true,
			});
			return;
		}
		if (otp == verifyOtp) {
			toast.success("OTP Verified", {
				position: "top-right",
				autoClose: 2000,
				hideProgressBar: false,
				closeOnClick: true,
				pauseOnHover: true,
				draggable: true,
			});
		}
		localStorage.setItem("token", state.token);
		localStorage.setItem("user", state.user.email_Id);
		localStorage.setItem("userDetails", JSON.stringify(state.user));
		setAuth(true);
		navigate("/myCourses");
	};

	const getOtp = () => {
		setLoading(true);
		axios
			.post(process.env.REACT_APP_API + "/get-otp", {
				name: state.user?.username,
				mobile: state.user?.mobileNumber,
			})
			.then((res) => {
				setVerifyOtp(res.data.otp);
			})
			.finally(() => setLoading(false));
	};

	useEffect(() => {
		getOtp();
	}, []);

	if (loading) {
		return (
			<div className="min-h-screen">
				<Loader />
			</div>
		);
	}

	return (
		<div className="min-h-[500px] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
			<ToastContainer />
			<div className="max-w-md w-full space-y-8 mx-auto">
				<div>
					<img
						className="mx-auto h-12 w-auto"
						src="https://tailwindui.com/img/logos/workflow-mark-indigo-600.svg"
						alt="Workflow"
					/>
					<h2 className="mt-6 text-center text-lg font-extrabold text-gray-900">
						Please enter the OTP sent to your mobile number.
					</h2>
				</div>
				<PinInput
					size="lg"
					className="flex items-center justify-center"
					onComplete={(str) => setOtp(str)}
				/>

				<div>
					<button
						onClick={handleVerify}
						type="submit"
						className="group relative w-1/2 mx-auto flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
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
						Verify
					</button>
				</div>
			</div>
		</div>
	);
};

export default OtpInput;
