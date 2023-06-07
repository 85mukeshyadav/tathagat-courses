import React, { useEffect, useState } from "react";
import Lottie from "react-lottie";
import { useLocation, useNavigate } from "react-router-dom";

import paymentSuccess from "../assets/success.json";

const PaymentSuccess = () => {
	const navigate = useNavigate();
	const { state } = useLocation();
	const [counter, setCounter] = useState(3);

	if (!state) {
		navigate("/");
	}

	useEffect(() => {
		const timer = setInterval(() => {
			if (counter <= 0) navigate("/myCourses");
			setCounter((prev) => prev - 1);
		}, 1000);
		return () => clearInterval(timer);
	}, [counter]);

	return (
		<div className="h-full justify-center items-center">
			<h1 className="mt-10 text-gray-700 font-bold sm:text-5xl text-4xl border-b-2 pb-4">
				Congratulations!!!
			</h1>
			<Lottie
				options={{ animationData: paymentSuccess, loop: false }}
				height={300}
				width={300}
			/>
			<p className="text-gray-700 text-center font-bold sm:text-2xl text-xl mb-2">
				Order ID: #{state?.order_id}
			</p>
			<p className="text-gray-700 text-center font-bold sm:text-2xl text-xl">
				You have successfully completed the Payment.
			</p>
			{/* <p className="text-gray-700 text-center font-bold sm:text-2xl text-xl mt-10">
				Package Name: {state?.packageName}
			</p>
			<p className="text-gray-700 text-center font-bold sm:text-2xl text-xl mt-4">
				Description:
			</p>
			<p className="text-gray-700 text-center font-bold sm:text-2xl text-xl px-36">
				{state?.packageDesc}
			</p> */}
			<p className="text-gray-700 text-center font-bold sm:text-lg mt-10 text-xl">
				Explore more in the My Courses section.
			</p>
			<button
				className="bg-blue-400 py-2 px-4 font-bold text-white rounded-md mr-8 w-36 h-10 mt-5 mb-10 hover:bg-blue-500"
				onClick={() => {
					navigate("/myCourses");
				}}
			>
				My Courses
			</button>
			<p className="text-gray-700 text-center sm:text-sm mb-5 text-xl">
				Redirecting to My Courses in {counter} seconds...
			</p>
		</div>
	);
};

export default PaymentSuccess;
