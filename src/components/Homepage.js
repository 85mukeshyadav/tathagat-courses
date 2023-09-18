//import liraries
import { useQuery } from "@tanstack/react-query";
import ms from "ms";
import React, { useContext, useEffect } from "react";
import { FaChalkboardTeacher, FaLanguage } from "react-icons/fa";
import {
	FiArrowRight,
	FiBarChart2,
	FiFile,
	FiSearch,
	FiVideo,
} from "react-icons/fi";
import { Link } from "react-router-dom";
import apiClient from "../api/apiClient";
import algebraic from "../assets/algebraic.png";
import examnotification from "../assets/exam-notification.png";
import examIc from "../assets/examic.png";
import heroimage from "../assets/heroimage.jpg";
import hideNavContext from "../context/AllprojectsContext";
import slugify from "../utils/slugify";
import Loader from "./Loader";

// create a component
const Homepage = () => {
	const { hidenav, sethidenav } = useContext(hideNavContext);
	const { data, isLoading } = useQuery({
		queryKey: ["getrandomPkg"],
		queryFn: () => apiClient.get("/getrndmpkg").then((res) => res.data),
		staleTime: ms("24h"),
	});

	useEffect(() => {
		sethidenav(false);
	}, []);

	if (isLoading) return <Loader />;

	return (
		<>
			<div className="relative flex flex-col lg:flex-row bg-white overflow-hidden p-2  ">
				<div className="max-w-7xl mx-auto">
					<div className="relative z-10 pb-8 bg-white sm:pb-16 md:pb-20 lg:max-w-2xl lg:w-full lg:pb-28 xl:pb-32">
						{/* <svg className="hidden lg:block absolute right-0 inset-y-0 h-full w-48 text-white transform translate-x-1/2" fill="currentColor" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
                            <polygon points="50,0 100,0 50,100 0,100" />
                        </svg> */}
						<div>
							<div className="relative pt-6 px-4 sm:px-6 md:p-12 lg:px-8"></div>
							<div className="absolute z-10 top-0 inset-x-0 p-2 transition transform origin-top-right md:hidden"></div>
						</div>
						<main className="mt-10 mx-auto max-w-7xl px-4 sm:mt-12 sm:px-6 md:mt-16 lg:mt-18 lg:px-8 xl:mt-16">
							<div className="sm:text-center lg:text-left">
								<h1 className="text-4xl text-left font-extrabold text-gray-700 sm:text-5xl md:text-6xl">
									<span className="block text-3xl">
										{" "}
										One Destination for Complete{" "}
									</span>
									<span className="block text-indigo-600 xl:inline mt-2 leading-8">
										Exam Preparation
									</span>
								</h1>
								<p className="lg:mt-10 flex items-center text-base text-gray-500 mt-6 sm:text-lg sm:max-w-xl sm:mx-auto md:text-xl lg:mx-0">
									Learn{" "}
									<FiArrowRight className="text-indigo-500 md:ml-2 md:mr-2" />{" "}
									Practice{" "}
									<FiArrowRight className="text-indigo-500 ml-2 mr-2" /> Improve{" "}
									<FiArrowRight className="text-indigo-500 ml-2 mr-2" /> Succeed
								</p>
								<div className="mt-10 lg:mt-10 sm:mt-8 relative sm:flex sm:justify-center w-full sm:w-full md:w-2/3 lg:justify-start">
									<input
										type="search"
										placeholder="Search your favourite course"
										className="p-4 rounded-xl border-2 border-indigo-400 focus:ring-2 ring-indigo-200 w-full pr-12"
									/>
									<FiSearch className="absolute cursor-pointer right-4 top-4 text-2xl font-semibold text-indigo-500" />
								</div>
							</div>
						</main>
					</div>
				</div>
				<div className="relative lg:w-1/2 ">
					<img
						className="h-56 w-full object-contain sm:h-72 md:h-96 lg:w-10/12 lg:h-full"
						src={heroimage}
						alt=""
					/>
					<img
						className="absolute top-[16%] right-[14%] sm:right-[14%] md:right-[24%] h-10 w-6 object-contain sm:h-10 animate-[wiggle_2s_ease-in-out_infinite] md:h-10 lg:w-10 lg:h-10"
						src={examIc}
						alt=""
					/>
					<img
						className="absolute z-20 top-[26%] left-[10%] sm:left-[10%] md:left-[0%] h-10 w-6 object-contain sm:h-10 animate-[wiggle_2s_ease-in-out_infinite] md:h-10 lg:w-10 lg:h-10"
						src={examnotification}
						alt=""
					/>
					<img
						className="absolute z-20 bottom-[4%] sm:bottom-[4%] md:bottom-[10%] right-[40%] h-10 w-6 object-contain sm:h-10 animate-[wiggle_2s_ease-in-out_infinite] md:h-10 lg:w-10 lg:h-10"
						src={algebraic}
						alt=""
					/>
				</div>
			</div>

			<div className="bg-indigo-50">
				<div className="mx-auto py-16 px-4 sm:py-24 sm:px-6">
					<p className="text-gray-500 text-5xl font-bold mb-10">
						Popular Courses
					</p>
					<div className="grid grid-cols-1 sm:grid-cols-2 lg:gap-14 md:gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 xl:gap-2">
						{data.map((res, i) => (
							<Link
								to={
									res.officialDesc
										? `/courses/${slugify(res.name)}/${res.packageId}`
										: ""
								}
								props={res}
								onClick={() => {
									if (!res.officialDesc) {
										localStorage.setItem("pkgid", res.packageId);
										if (res.payment_url)
											window.open(res.payment_url, "_blank").focus();
									}
								}}
							>
								<div className="max-w-6xl mx-auto sm:my-0 my-4">
									<div className="flex items-center justify-center">
										<div className="w-full xl:py-6 px-3 mb-6 md:mb-0 lg:mb-0 xl:mb-0">
											<div className="mb-5 bg-white hover:shadow-xl transition-shadow ease-in-out shadow-md border border-slate-100 rounded-lg overflow-hidden">
												<div
													className="bg-cover bg-center h-56 p-4 border-b border-gray-200"
													style={{
														backgroundImage:
															res?.thumbnail != undefined
																? `url(${res.thumbnail})`
																: "url(https://images.unsplash.com/photo-1554415707-6e8cfc93fe23?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=870&q=80)",
													}}
												>
													<div className="flex justify-between items-center">
														<div className="flex bg-blue-200 px-2 h-10 items-center justify-center rounded-md">
															<p className="font-bold text-xl text-blue-700">
																₹{res?.price}
															</p>
														</div>
														<div className="flex">
															<div className="h-10 w-10 flex bg-red-200 justify-center items-center rounded-full">
																<svg
																	className="h-6 w-6 text-red-500 fill-current"
																	xmlns="http://www.w3.org/2000/svg"
																	// viewBox="0 0 30 30"
																>
																	<path d="M12.76 3.76a6 6 0 0 1 8.48 8.48l-8.53 8.54a1 1 0 0 1-1.42 0l-8.53-8.54a6 6 0 0 1 8.48-8.48l.76.75.76-.75zm7.07 7.07a4 4 0 1 0-5.66-5.66l-1.46 1.47a1 1 0 0 1-1.42 0L9.83 5.17a4 4 0 1 0-5.66 5.66L12 18.66l7.83-7.83z"></path>
																</svg>
															</div>
														</div>
													</div>
												</div>
												<div className="p-4">
													<p className="uppercase tracking-wide text-2xl font-bold text-gray-700 mt-2">
														{res.name}
													</p>
													<p className="uppercase tracking-wide text-md font-bold text-gray-700">
														{res.courseName}
													</p>
													<p className="text-cyan-700">
														8.5k+ Students Enrolled{" "}
													</p>
												</div>
												<div
													style={{ display: "none" }}
													className="flex p-4 border-t border-gray-300 text-gray-700 gap-4"
												>
													<div className="flex-1 inline-flex items-center gap-2">
														<FiVideo className="h-10 min-w-12 w-12 rounded-md bg-[#ff44ad2f] p-2 text-[#ff44ad]" />
														<p>
															<span className="text-gray-900 font-bold">
																500+
															</span>
															<br></br> Videos
														</p>
													</div>
													<div className="flex-1 inline-flex items-center">
														<FiFile className="h-10 min-w-12 w-12 rounded-md bg-[#9775fa2f] px-2 text-[#9775fa]" />
														<p>
															<span className="text-gray-900 font-bold">
																{res.questionCount}+
															</span>{" "}
															Questions
														</p>
													</div>
												</div>
											</div>
										</div>
									</div>
								</div>
							</Link>
						))}
					</div>
				</div>
			</div>
			{/* <div className='h-4 w-full bg-indigo-300'></div> */}
			<div className="grid-cols-1 relative grid justify-center items-center gap-4 lg:grid-cols-2">
				<div className="text-left md:ml-36 px-8">
					<h3 className="text-4xl font-bold sm:mt-0 mt-8">Why Tathagat ?</h3>
					<p className="text-xl text-gray-400 mt-4 tracking-wide md:w-full  ">
						TATHAGAT = PERSONALIZED ATTENTION (LIMITED STUDENTS) + ALL SENIOR
						CAT TRAINERS + CURRICULUM TUNED TO MAJOR MBA ENTRANCE EXAMS.
					</p>
					<div className="mt-10 lg:mt-10 sm:mt-8 relative sm:flex sm:justify-center w-full sm:w-full md:w-2/3 lg:justify-start">
						<input
							type="search"
							placeholder="Search your favourite course"
							className="p-4 rounded-xl border-2 border-indigo-400 focus:ring-2 ring-indigo-100 w-full pr-12"
						/>
						<FiSearch className="absolute cursor-pointer right-4 top-4 text-2xl font-semibold text-indigo-500" />
					</div>
				</div>
				<div className="flex-col sm:flex-col text-left p-8 flex lg:flex-row md:flex-row flex-wrap gap-10">
					<div className="w-full sm:mr-5 sm:w-full md:w-2/5 lg:w-2/5 h-full bg-[#e4feef] shadow-md text-gray-600 font-medium p-4 rounded-xl">
						<FaChalkboardTeacher className="h-12 w-12 mb-4 rounded-md bg-[#1fd56b] p-2 text-white" />
						<h2 className="text-md font-semibold text-slate-800 mt-8">
							Learn from the best
						</h2>
						<p className="text-sm mt-2 tracking-wide mb-6 ">
							Learn from the masters of the subject, in the most engaging yet
							simplified ways
						</p>
					</div>
					<div className="mt-5 w-full sm:w-full md:w-2/5 lg:w-2/5 h-full bg-[#ff44ad1f] shadow-md text-gray-600 font-medium p-4 rounded-xl md:mt-6">
						<FiVideo className="h-12 w-12 mb-4 rounded-md bg-[#ff44ad] p-2 text-white" />
						<h2 className="text-md font-semibold text-slate-800 mt-8">
							Live Tests for Real Exam Experience
						</h2>
						<p className="text-sm mt-2 tracking-wide mb-6 ">
							Feel the thrill of a real exam. Improve your time & pressure
							management skills
						</p>
					</div>
					<div className="mt-5 w-full sm:mr-5 lg:mt-0 sm:w-full md:w-2/5 lg:w-2/5 h-full md:mt-5 bg-[rgba(255,203,0,.1)] shadow-md text-gray-600 font-medium p-4 rounded-xl">
						<FiBarChart2 className="h-12 w-12 mb-4 rounded-md bg-[rgba(255,203,0)] p-2 text-white" />
						<h2 className="text-md font-semibold text-slate-800 mt-8">
							Detailed Score Analysis
						</h2>
						<p className="text-sm mt-2 tracking-wide mb-6 ">
							Get a detailed breakdown of your strengths & weaknesses and
							discover insights to improve your score
						</p>
					</div>
					<div className="mt-5 w-full sm:w-full md:w-2/5 lg:w-2/5 h-full bg-[#f3f0ff] shadow-md text-gray-600 font-medium p-4 rounded-xl md:mt-6 ">
						<FaLanguage className="h-12 w-12 mb-4 rounded-md bg-[#9775fa] p-2 text-white" />
						<h2 className="text-md font-semibold text-slate-800 mt-8">
							Multilingual: 2 Languages
						</h2>
						<p className="text-sm mt-2 tracking-wide mb-6 ">
							Learn in the language you are most comfortable with. Choose from
							any of our 2 languages
						</p>
					</div>
				</div>
			</div>
		</>
	);
};

export default Homepage;
