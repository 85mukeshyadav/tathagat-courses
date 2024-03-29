import { Divider, RingProgress, Table, Tabs } from "@mantine/core";
import clsx from "clsx";
import dayjs from "dayjs";
import React, { useEffect, useState } from "react";
import { AiOutlineAim } from "react-icons/ai";
import { BiReceipt } from "react-icons/bi";
import { BsPeople, BsTrophy } from "react-icons/bs";
import { FaAward } from "react-icons/fa";
import { FiUser } from "react-icons/fi";
import { MdClose } from "react-icons/md";
import Modal from "react-modal";
import {
	Bar,
	BarChart,
	CartesianGrid,
	Label,
	Line,
	LineChart,
	ResponsiveContainer,
	Tooltip,
	XAxis,
	YAxis,
} from "recharts";

import apiClient from "../../api/apiClient";
import Loader from "../Loader";

const Analysis = () => {
	const [performance, setPerformance] = useState({
		rank: 0,
		score: 0,
		attempted: 0,
		accuracy: 0,
		percentile: 0,
	});
	const [analysisData, setAnalysisData] = useState({});
	const [section, setSection] = useState([]);
	const [currentSection, setCurrentSection] = useState(0);
	const [activeSectionTab, setActiveSectionTab] = useState("");
	const [totalQuestions, setTotalQuestions] = useState(0);
	const [totalMarks, setTotalMarks] = useState(0);
	const [topper, setTopper] = useState({});
	const [topperPerformance, setTopperPerformance] = useState({});
	const [topperAnalysisData, setTopperAnalysisData] = useState({});
	const [marksDistribution, setMarksDistribution] = useState([]);
	const [average, setAverage] = useState(0);
	const [leaderboard, setLeaderboard] = useState([]);
	const [quesList, setQuesList] = useState([]);
	const [rightPercentage, setRightPercentage] = useState([]);
	const [percentileDistribution, setPercentileDistribution] = useState([]);
	const [cutoffMarks, setCutoffMarks] = useState(0);

	const [loading, setLoading] = useState(false);
	const [activeTimeManagmentTab, setActiveTimeManagmentTab] = useState("");
	const [questionIndex, setQuestionIndex] = useState(0);
	const [modalIsOpen, setIsOpen] = useState(false);

	function openModal() {
		setIsOpen(true);
	}

	function closeModal() {
		setIsOpen(false);
	}

	const param = {
		userId: localStorage.getItem("user"),
		testId: localStorage.getItem("testid"),
		packageId: localStorage.getItem("pkgid"),
		startDate: `${dayjs().year()}-${dayjs().month() + 1}-01`,
		endDate: `${dayjs().year()}-${
			dayjs().month() + 1
		}-${dayjs().daysInMonth()}`,
	};

	const getOverallPerformance = async () => {
		setLoading(true);
		try {
			const res = await apiClient.post("/overallPerformanceSummary", param);
			const res1 = await apiClient.post("/getwritePercentage", param);
			if (res.ok) {
				console.log(
					"🚀 ~ file: Analysis.js:125 ~ getOverallPerformance ~",
					res.data?.data
				);
				setAnalysisData(res.data?.data);
				setPerformance(res.data?.data?.section[0]?.overallPerformanceSummary);
				setTotalQuestions(res.data?.data?.section[0]?.totalQuestions);
				setTotalMarks(res.data?.data?.section[0]?.totalMarks);
				setActiveTimeManagmentTab(res.data?.data?.section[0]?.sectionName);
				setTopper(res.data?.data?.topperObject);
				setLeaderboard(res.data?.data?.leaderBoardList.reverse());
				setQuesList(res.data?.data?.Qans?.Section[0]?.QuestionList);
				const markDistribution = res.data?.data?.section[0]?.marksDistributtion;
				const students = res.data?.data?.AllStudent;
				const averageScore =
					students.reduce((sum, i) => sum + i.score, 0) / students.length;
				setAverage(averageScore);
				let distribution = [];
				console.log(markDistribution.marks.endnumber);
				for (
					let i = markDistribution.marks.startnumber;
					i < markDistribution.marks.endnumber;
					i += 5
				) {
					const percentageOfStudents =
						(students.filter((item) => item.score >= i && item.score <= i + 5)
							.length /
							students.length) *
						100;
					const obj = {
						marks:
							i === markDistribution.marks.startnumber
								? i + " to " + (i + 5)
								: i + 1 + " to " + (i + 5),
						noOfStudents: percentageOfStudents,
						youarehere:
							students.find(
								(item) => item.userId === localStorage.getItem("user")
							).score >= i &&
							students.find(
								(item) => item.userId === localStorage.getItem("user")
							).score <
								i + 5
								? true
								: false,
					};
					distribution.push(obj);
				}
				console.log(distribution);
				setMarksDistribution(distribution);

				const leaderboard = res.data?.data?.leaderBoardList.sort((a, b) => {
					return a.netScore - b.netScore;
				});
				console.log(leaderboard);
				const cutoffMarks =
					leaderboard[Math.floor((leaderboard.length * 80) / 100)].netScore;
				setCutoffMarks(cutoffMarks);
				let percentileData = [];
				if (leaderboard.length == 1) {
					const obj = {
						score: leaderboard[0].netScore,
						percentile: 100,
						youarehere: leaderboard[0].userId === localStorage.getItem("user"),
					};
					percentileData.push(obj);
				} else {
					for (let i = 0; i < leaderboard.length; i++) {
						const obj = {
							score: leaderboard[i].netScore,
							percentile: (i / (leaderboard.length - 1)) * 100,
							youarehere:
								leaderboard[i].userId === localStorage.getItem("user"),
						};
						percentileData.push(obj);
					}
				}
				console.log("percentiledata ~", percentileData);
				setPercentileDistribution(percentileData);
			} else {
				console.log(res.data);
			}
			if (res1.ok) {
				setRightPercentage(res1.data?.data[0]?.question);
			}
		} catch (error) {
			console.log(error);
		} finally {
			setLoading(false);
		}
	};

	const getTopperPerformance = async () => {
		setLoading(true);
		try {
			const res = await apiClient.post("/overallPerformanceSummary", {
				userId: topper?.userId,
				testId: localStorage.getItem("testid"),
				packageId: localStorage.getItem("pkgid"),
			});
			if (res.ok) {
				console.log(
					"🚀 ~ file: Analysis.js:159 ~ getTopperPerformance ~",
					res.data?.data
				);
				setTopperPerformance(
					res.data?.data?.section[0]?.overallPerformanceSummary
				);
				setTopperAnalysisData(res.data?.data);
			} else {
				console.log(res.data);
			}
		} catch (error) {
			console.log(error);
		} finally {
			setLoading(false);
		}
	};

	const getSectionFromTest = async () => {
		setLoading(true);
		try {
			const res = await apiClient.get(
				"/gettest/" + localStorage.getItem("testid")
			);
			if (res.ok) {
				console.log(
					"🚀 ~ file: Analysis.js:171 ~ getSectionFromTest ~",
					res.data
				);
				setSection(res.data[0]?.Section);
				setActiveSectionTab(res.data[0]?.Section[0]?.sectionName);
			} else {
				console.log(res.data);
			}
		} catch (error) {
			console.log(error);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		getOverallPerformance();
		getSectionFromTest();
	}, []);

	useEffect(() => {
		getTopperPerformance();
	}, [topper]);

	const customStyles = {
		content: {
			top: "50%",
			left: "50%",
			right: "auto",
			bottom: "auto",
			marginRight: "-50%",
			transform: "translate(-50%, -50%)",
			width: "80%",
		},
	};

	if (loading) {
		return <Loader />;
	}

	return (
		<div>
			<Modal
				isOpen={modalIsOpen}
				onRequestClose={closeModal}
				style={customStyles}
				contentLabel="Question"
			>
				<div>
					<div className="flex justify-end">
						<MdClose
							className="cursor-pointer"
							size={30}
							color="#A3A3A3"
							onClick={closeModal}
						/>
					</div>
					<div className="flex items-center justify-between">
						<div className="flex items-center">
							<div>
								<p className="text-lg font-bold text-gray-700">
									{section[currentSection]?.sectionName}
								</p>
								<p className="text-sm font-semibold text-gray-400">
									Chapter -{" "}
									{section[currentSection]?.QuestionList[questionIndex]
										?.chapterName || "NA"}
								</p>
							</div>
						</div>
					</div>
				</div>
				<div
					className="mt-4 text-lg font-semibold text-gray-700"
					dangerouslySetInnerHTML={{
						__html:
							`Question ${questionIndex + 1}.` +
							section[currentSection]?.QuestionList[questionIndex]?.question,
					}}
				></div>
			</Modal>
			<div>
				<div className="flex">
					<div className="w-3/4">
						<div className="mt-10 bg-gray-100 pb-10">
							<p className="text-2xl text-left font-bold ml-10 py-4 text-gray-700">
								Overall Performance Summary
							</p>
							<div className="flex items-center sm:justify-around py-6 bg-white shadow sm:mx-10 overflow-x-auto">
								<div className="flex items-center justify-center ml-6 mr-6 sm:ml-0 sm:mr-0">
									<div className="h-10 w-10 rounded-full bg-rose-500 flex items-center justify-center">
										<FaAward size={20} color="white" />
									</div>
									<div>
										<p className="text-lg font-semibold text-gray-700">
											{performance?.rank || "NA"}
										</p>
										<p className="text-sm font-semibold ml-2 text-gray-400">
											Rank
										</p>
									</div>
								</div>
								<div className="flex items-center justify-center ml-6 mr-6 sm:ml-0 sm:mr-0">
									<div className="h-10 w-10 rounded-full bg-purple-500 flex items-center justify-center">
										<BsTrophy size={20} color="white" />
									</div>
									<div>
										<p className="text-lg font-semibold text-gray-700 ml-2">
											{performance?.score}{" "}
											<span className="text-sm text-gray-400">
												/ {totalMarks}
											</span>
										</p>
										<p className="text-sm font-semibold ml-2 text-gray-400">
											Score
										</p>
									</div>
								</div>
								<div className="flex items-center justify-center ml-6 mr-6 sm:ml-0 sm:mr-0">
									<div className="h-10 w-10 rounded-full bg-cyan-500 flex items-center justify-center">
										<BiReceipt size={20} color="white" />
									</div>
									<div>
										<p className="text-lg font-semibold text-gray-700">
											{performance?.attempted}{" "}
											<span className="text-sm text-gray-400">
												/ {totalQuestions}
											</span>
										</p>
										<p className="text-sm font-semibold ml-2 text-gray-400">
											Attempted
										</p>
									</div>
								</div>
								<div className="flex items-center justify-center ml-6 mr-6 sm:ml-0 sm:mr-0">
									<div className="h-10 w-10 rounded-full bg-green-500 flex items-center justify-center">
										<AiOutlineAim size={20} color="white" />
									</div>
									<div>
										<p className="text-lg font-semibold text-gray-700">
											{performance?.accuracy?.toFixed(1) || "NA"}
										</p>
										<p className="text-sm font-semibold ml-2 text-gray-400">
											Accuracy
										</p>
									</div>
								</div>
								<div className="flex items-center justify-center ml-6 mr-6 sm:ml-0 sm:mr-0">
									<div className="h-10 w-10 rounded-full bg-violet-500 flex items-center justify-center">
										<BsPeople size={20} color="white" />
									</div>
									<div>
										<p className="text-lg font-semibold text-gray-700 ml-2">
											{performance?.percentile + "%" || "NA"}
										</p>
										<p className="text-sm font-semibold ml-2 text-gray-400">
											Percentile
										</p>
									</div>
								</div>
							</div>
						</div>
						<div className="mt-10">
							<p className="text-2xl text-left font-bold ml-10 py-4 text-gray-700">
								Test Summary
							</p>
							<div className="mx-2 sm:mx-10 table-auto overflow-x-auto">
								<Table
									striped
									withBorder
									withColumnBorders
									verticalSpacing="lg"
									fontSize="md"
								>
									<thead>
										<tr>
											<th>Section</th>
											<th>Attempted</th>
											<th>Correct</th>
											<th>Incorrect</th>
											<th>Skipped</th>
											<th>Accuracy</th>
											<th>Score</th>
											<th>Rank</th>
											<th>Time</th>
										</tr>
									</thead>
									<tbody>
										{analysisData?.section?.map((item, i) => (
											<tr key={i}>
												<td>{item?.sectionName || "NA"}</td>
												<td>{item?.answered}</td>
												<td>{item?.correctAnswers}</td>
												<td>{item?.wrongAnswers}</td>
												<td>{item?.unanswered}</td>
												<td>
													{(
														(item?.correctAnswers / item?.answered) *
														100
													).toFixed(1) || "NA"}
												</td>
												<td>{item?.score}</td>
												<td>{item?.rank || "NA"}</td>
												<td>
													{item?.question.reduce(
														(sum, i) => sum + i.timeTaken,
														0
													) || "NA"}
												</td>
											</tr>
										))}
									</tbody>
								</Table>
							</div>
						</div>
						<div className="mt-16 px-4 anal-tab">
							<div>
								<div className="text-2xl font-bold my-2">
									Section Wise Performance
								</div>
								<div className="grp-sec-data">
									{analysisData?.section?.map((res, i) => (
										<>
											<div key={i}>
												<div className="font-bold sm:text-xl my-4">
													Section Name - {res.sectionName}{" "}
												</div>
												<Table
													withBorder
													withColumnBorders
													striped
													className="table-auto sm:w-full"
												>
													<tbody>
														<tr>
															<th className="text-left"></th>
															<th className="text-left p-1 sm:p-2 text-xs sm:text-lg">
																Score
															</th>
															<th className="text-left p-1 sm:p-2 text-xs sm:text-lg">
																Attempted
															</th>
															<th className="text-left p-1 sm:p-2 text-xs sm:text-lg">
																Correct
															</th>
															<th className="text-left p-1 sm:p-2 text-xs sm:text-lg">
																Incorrect
															</th>
															<th className="text-left p-1 sm:p-2 text-xs sm:text-lg">
																Un-attempted
															</th>
															{/* <th className='text-left p-2'>Accuracy</th> */}
														</tr>
														<tr>
															<td className="text-left p-1 sm:p-2 text-xs sm:text-lg">
																User
															</td>
															<td className="text-left p-1 sm:p-2 text-xs sm:text-lg">
																{res.score}
															</td>
															<td className="text-left p-1 sm:p-2 text-xs sm:text-lg">
																{res.answered}
															</td>
															<td className="text-left p-1 sm:p-2 text-xs sm:text-lg">
																{res.correctAnswers}
															</td>
															<td className="text-left p-1 sm:p-2 text-xs sm:text-lg">
																{res.wrongAnswers}
															</td>
															<td className="text-left p-1 sm:p-2 text-xs sm:text-lg">
																{res.unanswered}
															</td>
															{/* <td className='text-left p-2'>{res.unanswered}</td> */}
														</tr>
														{/* <tr>
															<td className="text-left p-1 sm:p-2 text-xs sm:text-lg">
																Average
															</td>
															<td className="text-left p-1 sm:p-2 text-xs sm:text-lg"></td>
															<td className="text-left p-1 sm:p-2 text-xs sm:text-lg"></td>
															<td className="text-left p-1 sm:p-2 text-xs sm:text-lg"></td>
															<td className="text-left p-1 sm:p-2 text-xs sm:text-lg"></td>
															<td className="text-left p-1 sm:p-2 text-xs sm:text-lg"></td>
															<td className='text-left p-1 sm:p-2'></td>
														</tr>
														<tr>
															<td className="text-left p-1 sm:p-2 text-xs sm:text-lg">
																Median
															</td>
															<td className="text-left p-1 sm:p-2 text-xs sm:text-lg"></td>
															<td className="text-left p-1 sm:p-2 text-xs sm:text-lg"></td>
															<td className="text-left p-1 sm:p-2 text-xs sm:text-lg"></td>
															<td className="text-left p-1 sm:p-2 text-xs sm:text-lg"></td>
															<td className="text-left p-1 sm:p-2 text-xs sm:text-lg"></td>
															<td className='text-left p-2'></td>
														</tr> */}
													</tbody>
												</Table>

												<div className="text-xl font-bold mt-8 mb-4">
													Strengths and Weaknesses
												</div>

												<Table
													withBorder
													withColumnBorders
													striped
													className="table-auto sm:w-full"
												>
													<tbody>
														<tr>
															<th className="text-left p-2 text-sm sm:text-lg">
																Ques.
															</th>
															<th className="text-left p-2 text-sm sm:text-lg">
																Topic
															</th>
															<th className="text-left p-2 text-sm sm:text-lg">
																Status
															</th>
															<th className="text-left p-2 text-sm sm:text-lg">
																Your Answer
															</th>
															<th className="text-left p-2 text-sm sm:text-lg">
																Correct Answer
															</th>
															<th className="text-left p-2 text-sm sm:text-lg">
																Percentage of students who got it right
															</th>
															<th className="text-left p-2 text-sm sm:text-lg">
																Attempt order
															</th>
														</tr>

														{res?.question.map((ques, idx) => (
															<tr key={`${i}-${idx}`}>
																<td className=" flex justify-center items-center">
																	<div
																		onClick={() => {
																			setQuestionIndex(idx);
																			openModal();
																		}}
																		className={clsx(
																			"flex h-10 w-10 rounded-full transition cursor-pointer text-white font-semibold items-center justify-center",
																			ques.answerStatus === "C"
																				? "bg-green-500"
																				: ques.answerStatus === "W"
																				? "bg-red-400"
																				: "bg-gray-400"
																		)}
																	>
																		{idx + 1}
																	</div>
																</td>
																<td className="text-left p-2 text-xs sm:text-lg">
																	{ques.chapterName ? ques.chapterName : "--"}
																</td>
																<td className="text-left p-2 text-xs sm:text-lg">
																	{ques.answerStatus ? ques.answerStatus : "--"}
																</td>
																<td className="text-left p-2 text-xs sm:text-lg">
																	{ques.optionType == "input"
																		? ques.usersAnswer
																			? ques.usersAnswer
																			: "--"
																		: ques.usersAnswer != -1
																		? ques.usersAnswer + 1
																		: "--"}
																</td>
																<td className="text-left p-2 text-xs sm:text-lg">
																	{(quesList.length > 0 &&
																		quesList[idx]?.correctoption) ||
																		"--"}
																</td>
																<td className="text-left p-2 text-xs sm:text-lg">
																	{(
																		rightPercentage[idx]?.writePercentage *
																			100 || 0
																	).toFixed(2) + "%"}
																</td>
																<td className="text-left p-2 text-xs sm:text-lg">
																	{ques.hasOwnProperty("attemptOrder") &&
																	ques?.attemptOrder != -1
																		? ques.attemptOrder + 1
																		: "--"}
																</td>
															</tr>
														))}
													</tbody>
												</Table>

												<Table
													withBorder
													withColumnBorders
													striped
													className="table-auto sm:w-full mt-12"
												>
													<tbody>
														<tr>
															<th className="text-left p-2 text-xs sm:text-lg">
																Chapter Name
															</th>
															<th className="text-left p-2 text-xs sm:text-lg">
																Scale (0-10)
															</th>
															<th className="text-left p-2 text-xs sm:text-lg">
																Remarks
															</th>
														</tr>

														{res?.chapterReport.map((chap, ind) => (
															<tr>
																<td className="text-left p-2 text-xs sm:text-lg">
																	{chap.chapterName}
																</td>
																<td className="text-left p-2 text-xs sm:text-lg">
																	{chap.scale}
																</td>
																<td className="text-left p-2 text-xs sm:text-lg">
																	{chap.remarks}
																</td>
															</tr>
														))}
													</tbody>
												</Table>
											</div>
											<Divider size="sm" variant="dashed" className="mt-10" />
										</>
									))}
								</div>
							</div>
						</div>
					</div>
					<div className="w-1/4 h-min bg-gray-100 mt-10">
						<div className="mt-10">
							<p className="ml-5 text-2xl text-left font-bold py-4 text-gray-700">
								Leaderboard
							</p>
							<div className="h-[700px] overflow-y-scroll">
								{leaderboard.map((student, i) => (
									<div
										key={i}
										className="px-4 border-b border-gray-300 py-4 shadow-sm bg-white mx-5"
									>
										<div className="flex items-center w-full">
											<div className="flex h-10 w-10 items-center justify-center rounded-full bg-cyan-400 mr-4">
												<FiUser size={24} color="white" />
											</div>
											<div>
												<p className="text-lg font-semibold text-gray-700 text-left">
													{student?.name || "NA"}
												</p>
												<div className="flex items-start">
													<p className="text-sm font-semibold mr-4 text-gray-400">
														Rank: {i + 1}
													</p>
													<p className="text-sm font-semibold text-gray-400">
														Score: {student?.netScore || "NA"}
													</p>
												</div>
											</div>
										</div>
									</div>
								))}
							</div>
						</div>
					</div>
				</div>
				<div className="mt-10 bg-gray-100 py-5">
					<p className="text-2xl text-left font-bold ml-10 py-4 text-gray-700">
						Performance Distribution
					</p>
					<div className="flex w-1/2 mx-auto items-center justify-around mb-4">
						<div className="flex items-center">
							<div className="h-5 w-5 bg-[#8884d8]"></div>
							<p className="ml-2">Attempted</p>
						</div>
						<div className="flex items-center">
							<div className="h-5 w-5 bg-[#82ca9d]"></div>
							<p className="ml-2">Correct</p>
						</div>
						<div className="flex items-center">
							<div className="h-5 w-5 bg-[#F43F5E]"></div>
							<p className="ml-2">Incorrect</p>
						</div>
						<div className="flex items-center">
							<div className="h-5 w-5 bg-[#64748B]"></div>
							<p className="ml-2">Skipped</p>
						</div>
					</div>
					<ResponsiveContainer width="100%" height={400}>
						<BarChart
							data={analysisData?.section?.map((section) => {
								return {
									name: section.sectionName,
									attempted: section.questionAttempt,
									correct: section.correctAnswers,
									incorrect: section.wrongAnswers,
									skipped: section.unanswered,
								};
							})}
						>
							<CartesianGrid strokeDasharray="3 3" />
							<XAxis dataKey="name" />
							<YAxis />
							<Tooltip cursor={{ fill: "transparent" }} />
							<Bar dataKey="attempted" fill="#8884d8" />
							<Bar dataKey="correct" fill="#82ca9d" />
							<Bar dataKey="incorrect" fill="#F43F5E" />
							<Bar dataKey="skipped" fill="#64748B" />
						</BarChart>
					</ResponsiveContainer>
				</div>
				{activeTimeManagmentTab && (
					<div className="mt-14 bg-gray-100 py-5">
						<p className="text-2xl text-left font-bold ml-10 pt-4 text-gray-700">
							Know your Time Management
						</p>
						<div className="flex items-center justify-around">
							<div className="w-1/3 ml-10">
								<Tabs
									value={activeTimeManagmentTab}
									onTabChange={setActiveTimeManagmentTab}
								>
									<Tabs.List>
										{analysisData?.section?.map((section) => (
											<Tabs.Tab
												key={section.sectionName}
												value={section.sectionName}
											>
												{section.sectionName}
											</Tabs.Tab>
										))}
									</Tabs.List>
									{analysisData?.section?.map((section) => (
										<Tabs.Panel
											key={section.sectionName}
											value={section.sectionName}
										>
											<div className="flex justify-center">
												<div>
													<RingProgress
														size={120}
														thickness={10}
														label={
															(section.question.reduce(
																(sum, i) => sum + i.timeTaken,
																0
															) || 0) + "s"
														}
														sections={[{ value: 100, color: "#8884d8" }]}
													/>
													<p>Total Time Taken</p>
												</div>
												<div>
													<RingProgress
														size={120}
														thickness={10}
														label={
															(section.question
																.filter((i) => i.answerStatus === "C")
																.reduce((sum, i) => sum + i.timeTaken, 0) ||
																0) + "s"
														}
														sections={[{ value: 100, color: "#8884d8" }]}
													/>
													<p>Correct Answers</p>
												</div>
												<div>
													<RingProgress
														size={120}
														thickness={10}
														label={
															(section.question
																.filter((i) => i.answerStatus === "W")
																.reduce((sum, i) => sum + i.timeTaken, 0) ||
																0) + "s"
														}
														sections={[{ value: 100, color: "#8884d8" }]}
													/>
													<p>Incorrect Answers</p>
												</div>
												<div>
													<RingProgress
														size={120}
														thickness={10}
														label={
															(section.question
																.filter((i) => i.usersAnswer === -1)
																.reduce((sum, i) => sum + i.timeTaken, 0) ||
																0) + "s"
														}
														sections={[{ value: 100, color: "#8884d8" }]}
													/>
													<p>Unanswered</p>
												</div>
											</div>
										</Tabs.Panel>
									))}
								</Tabs>
							</div>
							<div className="mt-10">
								<div className="flex w-1/2 mx-auto items-center justify-around mb-4">
									<div className="flex items-center">
										<div className="h-5 w-5 bg-[#8884d8]"></div>
										<p className="ml-2">You</p>
									</div>
									<div className="flex items-center">
										<div className="h-5 w-5 bg-[#82ca9d]"></div>
										<p className="ml-2">Topper</p>
									</div>
								</div>
								{/* <ResponsiveContainer width="100%" height={200}> */}
								<BarChart
									width={400}
									height={200}
									data={[
										{
											name: "Your Accuracy",
											accuracy: performance?.accuracy,
										},
										{
											name: "Topper Accuracy",
											topperAccuracy: topperPerformance?.accuracy,
										},
									]}
								>
									<CartesianGrid strokeDasharray="3 3" />
									<XAxis dataKey="name" />
									<YAxis />
									{/* <Tooltip /> */}
									<Bar dataKey="accuracy" fill="#8884d8" />
									<Bar dataKey="topperAccuracy" fill="#82ca9d" />
								</BarChart>
								{/* </ResponsiveContainer> */}
							</div>
							<div className="mt-10">
								<div className="flex w-1/2 mx-auto items-center justify-around mb-4">
									<div className="flex items-center">
										<div className="h-5 w-5 bg-[#8884d8]"></div>
										<p className="ml-2">You</p>
									</div>
									<div className="flex items-center">
										<div className="h-5 w-5 bg-[#82ca9d]"></div>
										<p className="ml-2">Topper</p>
									</div>
								</div>
								<BarChart
									width={400}
									height={200}
									data={[
										{
											name: "Your Time",
											accuracy:
												(analysisData?.section &&
													analysisData?.section[0].question.reduce(
														(sum, i) => sum + i.timeTaken,
														0
													)) ||
												0,
										},
										{
											name: "Topper Time",
											topperAccuracy:
												(topperAnalysisData?.section &&
													topperAnalysisData?.section[0].question.reduce(
														(sum, i) => sum + i.timeTaken,
														0
													)) ||
												0,
										},
									]}
								>
									<CartesianGrid strokeDasharray="3 3" />
									<XAxis dataKey="name" />
									<YAxis />
									{/* <Tooltip /> */}
									<Bar dataKey="accuracy" fill="#8884d8" />
									<Bar dataKey="topperAccuracy" fill="#82ca9d" />
								</BarChart>
							</div>
						</div>
					</div>
				)}
				<div className="mt-10">
					<p className="text-2xl text-left font-bold ml-10 py-4 text-gray-700">
						Compare with Topper
					</p>
					<div className="mx-2 sm:mx-10 table-auto overflow-x-auto">
						<Table
							withBorder
							withColumnBorders
							striped
							verticalSpacing="md"
							fontSize="md"
						>
							<thead>
								<tr>
									<th></th>
									<th>Score</th>
									<th>Accuracy</th>
									<th>Correct</th>
									<th>Wrong</th>
									<th>Time</th>
								</tr>
							</thead>
							<tbody>
								<tr>
									<td>You</td>
									<td>{performance?.score}</td>
									<td>{performance?.accuracy?.toFixed(1) || "NA"}</td>
									<td>
										{analysisData?.section &&
											analysisData?.section[0]?.correctAnswers}
									</td>
									<td>
										{analysisData?.section &&
											analysisData?.section[0]?.wrongAnswers}
									</td>
									<td>
										{(analysisData?.section &&
											analysisData?.section[0].question.reduce(
												(sum, i) => sum + i.timeTaken,
												0
											)) ||
											0}
									</td>
								</tr>
								<tr>
									<td>Topper</td>
									<td>{topperPerformance?.score}</td>
									<td>{topperPerformance?.accuracy?.toFixed(1) || "NA"}</td>
									<td>
										{topperAnalysisData?.section &&
											topperAnalysisData?.section[0]?.correctAnswers}
									</td>
									<td>
										{(topperAnalysisData?.section &&
											topperAnalysisData?.section[0]?.wrongAnswers) ||
											"NA"}
									</td>
									<td>
										{(topperAnalysisData?.section &&
											topperAnalysisData?.section[0].question.reduce(
												(sum, i) => sum + i.timeTaken,
												0
											)) ||
											0}
									</td>
								</tr>
							</tbody>
						</Table>
					</div>
				</div>
				<div className="mt-10 bg-gray-100 py-5">
					<p className="text-2xl text-left font-bold ml-10 py-4 text-gray-700">
						Marks Distribution
					</p>
					<div className="flex w-1/2 mx-auto items-center justify-around mb-4">
						<div className="flex items-center">
							<div className="h-5 w-5 bg-[#F43F5E]"></div>
							<p className="ml-2">You</p>
						</div>
					</div>
					<div className="my-5">
						<ResponsiveContainer
							width={window.innerWidth > 768 ? "95%" : "85%"}
							height={500}
						>
							<LineChart
								data={marksDistribution}
								margin={{
									top: 10,
									right: 30,
									left: 50,
									bottom: 20,
								}}
							>
								<CartesianGrid strokeDasharray="3 3" />
								<XAxis
									dataKey="marks"
									style={{
										fontSize: "0.8rem",
										fontWeight: "700",
									}}
								>
									<Label
										value="Marks"
										offset={-20}
										position="insideBottom"
										style={{
											fontSize: "1rem",
											fontWeight: "600",
										}}
									/>
								</XAxis>
								<YAxis>
									<Label
										value="Percentage of students"
										angle={-90}
										position="insideLeft"
										style={{
											fontSize: "1rem",
											fontWeight: "600",
										}}
									/>
								</YAxis>
								<Tooltip
									formatter={(value) => {
										return [`${value.toFixed(2)}%`, "Students"];
									}}
								/>
								<Line
									type="monotone"
									dataKey="noOfStudents"
									stroke="#8884d8"
									strokeWidth={2}
									activeDot={{ r: 8 }}
									dot={(props) => {
										const { payload } = props;
										if (payload.youarehere) {
											return (
												<>
													<circle
														cx={props.cx}
														cy={props.cy}
														fill="#F43F5E"
														r={6}
														strokeWidth={props.strokeWidth}
													/>
													<rect
														x={props.cx}
														y={props.cy}
														width="90"
														height="25"
														fill="#F43F5E"
														rx="2"
													/>
													<text
														x={props.cx}
														y={props.cy}
														dx={12}
														dy={16}
														fill="#FFF"
														textAnchor="start"
														fontWeight={600}
														fontSize={12}
													>
														You're here
													</text>
												</>
											);
										} else {
											return (
												<circle
													cx={props.cx}
													cy={props.cy}
													fill="#8884d8"
													r={6}
													strokeWidth={props.strokeWidth}
												/>
											);
										}
									}}
								/>
							</LineChart>
						</ResponsiveContainer>
					</div>
				</div>
				<div className="my-10">
					<p className="text-2xl text-left font-bold ml-10 py-4 text-gray-700">
						Percentile Distribution
					</p>
					{/* <HighchartsReact highcharts={Highcharts} options={chartOptions} /> */}
					<ResponsiveContainer width="100%" height={500}>
						<LineChart
							data={percentileDistribution}
							margin={{
								top: 50,
								right: 120,
								left: 50,
								bottom: 20,
							}}
						>
							<CartesianGrid strokeDasharray="3 3" />
							<XAxis
								dataKey="score"
								style={{
									fontSize: "0.8rem",
									fontWeight: "700",
								}}
							>
								<Label
									value="Score"
									offset={-20}
									position="insideBottom"
									style={{
										fontSize: "1rem",
										fontWeight: "600",
									}}
								/>
							</XAxis>
							<YAxis>
								<Label
									value="Percentile"
									angle={-90}
									position="insideLeft"
									style={{
										fontSize: "1rem",
										fontWeight: "600",
									}}
								/>
							</YAxis>
							<Tooltip
								formatter={(value) => {
									return [`${value?.toFixed(2)}%`, "Percentile"];
								}}
							/>
							<Line
								type="monotone"
								dataKey="percentile"
								stroke="#8884d8"
								strokeWidth={2}
								activeDot={{ r: 8 }}
								dot={(props) => {
									const { payload } = props;
									if (payload.youarehere || cutoffMarks === payload.score) {
										return (
											<>
												<circle
													cx={props.cx}
													cy={props.cy}
													fill="#8884d8"
													r={6}
													strokeWidth={props.strokeWidth}
												/>
												{cutoffMarks === payload.score && (
													<>
														<rect
															x={props.cx - 110}
															y={props.cy + 5}
															width="100"
															height="25"
															fill="#F43F5E"
															rx="2"
														/>
														<text
															x={props.cx - 100}
															y={props.cy + 21}
															fill="#FFF"
															textAnchor="start"
															fontWeight={600}
															fontSize={12}
														>
															Cutoff Marks
														</text>
													</>
												)}
												{payload.youarehere && (
													<>
														<rect
															x={props.cx + 5}
															y={props.cy - 28}
															width="82"
															height="25"
															fill="#8884d8"
															rx="2"
														/>
														<text
															x={props.cx}
															y={props.cy - 28}
															dx={12}
															dy={16}
															fill="#FFF"
															textAnchor="start"
															fontWeight={600}
															fontSize={12}
														>
															You're here
														</text>
													</>
												)}
											</>
										);
									} else {
										return (
											<circle
												cx={props.cx}
												cy={props.cy}
												fill="#8884d8"
												r={6}
												strokeWidth={props.strokeWidth}
											/>
										);
									}
								}}
							/>
						</LineChart>
					</ResponsiveContainer>
				</div>
			</div>
		</div>
	);
};

export default Analysis;
