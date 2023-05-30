import React from "react";
import { useNavigate } from "react-router-dom";

const success = require("../assets/payment-success.png");

const PaymentSuccess = () => {
	const navigate = useNavigate();
	return (
		<div className="h-full justify-center items-center">
			<h1 className="mt-10 text-gray-700 font-bold sm:text-5xl text-4xl border-b-2 pb-4">
				Congratulations!!!
			</h1>
			<div className="sm:w-1/3 sm:h-1/3 w-full h-full aspect-auto mx-auto">
				<img src={success} alt="exam finished" />
			</div>
			<p className="text-gray-700 text-center font-bold sm:text-2xl text-xl">
				You have successfully completed the Payment. You can view your courses
				in the My Courses section.
			</p>
			<button
				className="bg-blue-400 py-2 px-4 font-bold text-white rounded-md mr-8 w-48 h-10 mt-10 mb-10"
				onClick={() => {
					navigate("/myCourses");
				}}
			>
				View My Courses
			</button>
		</div>
	);
};

export default PaymentSuccess;
