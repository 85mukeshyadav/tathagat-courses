import { Center } from "@mantine/core";
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
			<Center className="justify-between sm:w-4/12 mb-20 sm:mx-auto mx-10 text-justify sm:text-center my-10">
				<button
					className="bg-blue-400 py-2 px-4 font-medium text-white rounded-md text-xl w-1/3 mr-8"
					onClick={() => navigate("/review")}
				>
					<i className="fas fa-eye mr-2"></i> Review
				</button>
				<button
					className="bg-blue-400 py-2 px-4 font-medium text-white rounded-md text-xl w-1/3 mr-8"
					onClick={() => navigate("/analysis")}
				>
					<i className="fas fa-chart-bar mr-2"></i> Analysis
				</button>
				<button
					className="bg-blue-400 py-2 px-4 font-medium text-white rounded-md text-xl w-1/3"
					onClick={() => navigate("/courseDetails/myCourse")}
				>
					<i className="fas fa-sign-out-alt mr-2"></i> Exit
				</button>
			</Center>
		</div>
	);
};

export default ExamFinished;
