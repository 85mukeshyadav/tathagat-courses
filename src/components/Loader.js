import React from "react";
import * as animationData from "../assets/lotties/loader.json";
import Lottie from "react-lottie";

const Loader = () => {
	const defaultOptions = {
		loop: true,
		autoplay: true,
		animationData: animationData,
		rendererSettings: {
			preserveAspectRatio: "xMidYMid slice",
		},
	};

	return (
		<div className="fixed w-screen z-50 flex items-center bg-gray-300 opacity-80 h-screen">
			<Lottie
				options={defaultOptions}
				height={80}
				width={80}
				className="absolute top-2/4 transform -translate-x-2/4 mt-auto mb-auto z-50 "
			/>
		</div>
	);
};

export default Loader;
