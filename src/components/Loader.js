import Lottie from "lottie-react";
import React from "react";
import animationData from "../assets/lotties/loader.json";

const Loader = () => {
	return (
		<div className="fixed w-screen z-50 flex items-center justify-center bg-gray-100 opacity-80 h-screen">
			<Lottie
				style={{ height: 100 }}
				animationData={animationData}
				loop={true}
			/>
		</div>
	);
};

export default Loader;
