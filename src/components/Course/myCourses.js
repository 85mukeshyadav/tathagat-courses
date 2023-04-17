import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { FiBook, FiFile, FiVideo } from "react-icons/fi";
import { Link, Navigate } from "react-router-dom";

const MyCourses = () => {
	const options = {
		headers: {
			"Content-type": "application/json",
			Authorization: "Bearer " + localStorage.getItem("token"),
		},
	};
	const [data, setData] = useState([]);

	useEffect(async () => {
		_getMyPackages();
	}, []);

	const _getMyPackages = async () => {
		let params = {
			userId: localStorage.getItem("user"),
		};
		const res = await axios.post(
			process.env.REACT_APP_API + "/mypackages",
			params,
			options
		);
		console.log(res);
		if (res.status == 200) {
			console.log(
				"🚀 ~ file: Examination.js ~ line 45 ~ useEffect ~ res",
				res.data.data
			);
			setData(res.data.data);
		}
	};

	const location = {
		pathname: "/courseDetails/myCourse",
		state: { fromDashboard: true },
	};

	return (
		<div className="bg-white">
			{
				<div className="mx-auto py-16 px-4 sm:py-24 sm:px-6">
					<p className="text-gray-500 text-5xl font-bold mb-10">My Courses</p>
					<div className="grid grid-cols-1 sm:grid-cols-2 lg:gap-14 md:gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:gap-2">
						{data.map((res, i) => (
							<Link
								to={location}
								props={res}
								onClick={() => localStorage.setItem("pkgid", res.packageId)}
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
														<div className="flex bg-blue-200 w-14 h-10 items-center justify-center rounded-md">
															<p className="font-bold text-xl text-blue-700">
																₹{res?.packagePrice}
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
													<p className="uppercase tracking-wide text-xl font-bold text-gray-700">
														{res.PackageName}
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
			}
		</div>
	);
};

export default MyCourses;
