import React from "react";
import { useNavigate } from "react-router-dom";
import exam from "../assets/exam.png";

const ExamFinished = () => {
	const navigate = useNavigate();

	return (
		<div className="h-full justify-center items-center">
			<h1 className="mt-10 text-gray-700 font-bold sm:text-5xl text-4xl border-b-2 pb-4">
				Congratulations!!!
			</h1>
			<div className="sm:w-1/3 sm:h-1/3 w-full h-full aspect-auto mx-auto">
				<img src={exam} alt="exam finished" />
			</div>
			<p className="text-gray-700 text-center font-bold sm:text-2xl text-xl">
				You have successfully completed the Test. You can view your results in
				the analysis section.
			</p>
			<div className="grid gap-4 grid-cols-1 sm:grid-cols-3 mb-20 my-10 w-1/2 text-center mx-auto">
				<button
					className="bg-blue-400 py-2 px-4 font-bold text-white rounded-md mr-8 w-48 h-10"
					onClick={() => {
						// navigate("/review");
						window.open("/review", "_blank");
					}}
				>
					<i className="fas fa-eye mr-2"></i> Review
				</button>
				<button
					className="bg-blue-400 py-2 px-4 font-bold text-white rounded-md mr-8 w-48 h-10"
					onClick={() => {
						// navigate("/analysis");
						window.open("/analysis", "_blank");
					}}
				>
					<i className="fas fa-chart-bar mr-2"></i> Analysis
				</button>
				<button
					className="bg-blue-400 py-2 px-4 font-bold text-white rounded-md w-48 h-10"
					onClick={() => {
						window.opener = null;
						window.open("", "_self");
						window.close();
						// navigate("/courseDetails/myCourse")
					}}
				>
					<i className="fas fa-sign-out-alt mr-2"></i> Exit
				</button>
			</div>
		</div>
	);
};

export default ExamFinished;
