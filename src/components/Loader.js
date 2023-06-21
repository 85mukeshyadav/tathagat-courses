import Lottie from "lottie-react";
import React from "react";
import animationData from "../assets/lotties/loader.json";

const Loader = () => {
	return (
		<div className="fixed w-screen z-50 flex items-center justify-center bg-gray-300 opacity-80 h-screen">
			<Lottie
				rendererSettings={{ preserveAspectRatio: "xMidYMid slice" }}
				animationData={animationData}
				loop={true}
			/>
		</div>
	);
};

export default Loader;
