//import liraries
import {
	Divider,
	Modal,
	ScrollArea,
	Switch,
	Textarea,
	Tooltip,
} from "@mantine/core";
import {
	IconAlarm,
	IconClock,
	IconHelpCircle,
	IconHourglass,
} from "@tabler/icons-react";
import axios from "axios";
import dayjs from "dayjs";
import React, { useContext, useEffect, useState } from "react";
import { FaBookmark, FaEquals, FaInfo, FaRegBookmark } from "react-icons/fa";
import { IoWarning } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import { useImmer } from "use-immer";
import apiClient from "../api/apiClient";
import { userInfo } from "../api/checkAuth";
import Answered from "../assets/Answered.png";
import notans from "../assets/notans.png";
import hideNavContext from "../context/AllprojectsContext";
import QuestionInput from "./Calculator/QuestionInput";

const Review = React.memo(() => {
	const options = {
		headers: {
			"Content-type": "application/json",
			Authorization: "Bearer " + localStorage.getItem("token"),
		},
	};

	const navigate = useNavigate();

	const [Question, setQuestion] = useState([]);
	const { sethidenav } = useContext(hideNavContext);
	const [Alert, setAlertbox] = useState(false);
	const [SectionName, setSectionName] = useState();
	const [sectionId, setSectionId] = useState();
	const [negativeMarks, setNegativeMarks] = useState();
	const [positiveMarks, setPositiveMarks] = useState();
	const [selectedSectionnumber, setSelectedCategoryNumber] = useState(0);
	const [data, setdata] = useState([]);

	const [markedReview, setmarkedReview] = useState(0);
	const [bothAnsReview, setBothAnsReview] = useState(0);
	const [answered, setAnswered] = useState(0);

	const [currentQuesIndex, setCurrentQuesIndex] = useState(0);
	const [currentQuesStatus, setCurrentQuesStatus] = useState({
		answered: [],
		notAnswered: [],
		notVisited: [],
		markForReview: [],
		bothAnsReview: [],
	});

	const [notAnswered, setNotAnswer] = useState(0);
	const [notVisited, setNotVisited] = useState(0);
	const [getQuesAns, setQuesAns] = useState([]);
	const [getRadio, setRadio] = useState(-1);

	const [allSectionData, setAllSectionData] = useState([]);
	const [reviewQues, setReviewQues] = useImmer([]);
	const [getViewSection, setViewSection] = useState(false);
	const [getViewSolution, setViewSolution] = useState("");
	const [getAns, setAns] = useState("");
	const [getMode, setMode] = useState("review");
	const [getExamLevel, setExamLevel] = useState(1);
	const [getTestName, setTestName] = useState("");
	const [bookmarks, setBookmarks] = useImmer([]);
	const [reviewRes, setReviewRes] = useState({
		section: [],
	});
	const [showCorrectAns, setShowCorrectAns] = useState(false);
	const [isReportVisible, setIsReportVisible] = useState(false);
	const [reviewRes1, setReviewRes1] = useState([]);

	const handleBookmark = async (ques, status) => {
		console.log("status", status);
		const res = await axios.post(process.env.REACT_APP_API + "/addbookmark", {
			userEmailId: localStorage.getItem("user"),
			testId: localStorage.getItem("testid"),
			questionsId: ques.questionId,
			topicName: ques.topicId,
			subjectName: ques.subjectId,
			courseName: localStorage.getItem("courseid"),
			status: status,
		});
		if (res.status == 200) {
			console.log("Bookmark added successfully!");
		} else {
			console.log("Bookmark not added!");
		}
	};

	useEffect(async () => {
		if (selectedSectionnumber > 0) {
			let question = [];
			let correctAnswers = 0;
			let wrongAnswers = 0;
			getQuesAns.map((data) => {
				if (data["ansStatus"] == "C") {
					correctAnswers = correctAnswers + 1;
				}
				if (data["ansStatus"] == "W") {
					wrongAnswers = wrongAnswers + 1;
				}
				let qu = {
					questionId: data.quesId,
					usersAnswer: data.quesAns,
					answerStatus: data.ansStatus,
				};
				question.push(qu);
			});

			let section = [];

			let newJson = {
				totalMarks: Question.length * positiveMarks || 0,
				correctAnswers,
				wrongAnswers,
				unanswered: Question.length - answered,
				totalQuestions: Question.length,
				sectionId: sectionId,
				sectionName: SectionName,
				negativeMarks: negativeMarks,
				positiveMarks: positiveMarks,
				answered,
				notAnswered,
				notVisited,
				markedReview,
				bothAnsReview,
				question,
			};

			section.push(newJson);

			let newData = [...allSectionData, ...section];
			setAllSectionData(newData);
			setSectionName("");
			setSectionId("");
			setNegativeMarks("");
			setPositiveMarks("");
			setmarkedReview(0);
			setBothAnsReview(0);
			setAnswered(0);
			setCurrentQuesIndex(0);
			setNotAnswer(0);
			setNotVisited(0);
			setQuesAns([]);
			setRadio(-1);
			let newState = {
				answered: [],
				notAnswered: [],
				notVisited: [],
				markForReview: [],
				bothAnsReview: [],
			};
			setCurrentQuesStatus(newState);
		}

		// const res = await fetch(`https://opentdb.com/api.php?amount=30&category=${categorynumber[ selectedSectionnumber ].number}&type=multiple`)
		const res = await axios.get(
			process.env.REACT_APP_API + "/gettest/" + localStorage.getItem("testid"),
			options
		);
		let param = {
			userId: localStorage.getItem("user"),
			testId: localStorage.getItem("testid"),
			packageId: localStorage.getItem("pkgid"),
			startDate: `${dayjs().year()}-${dayjs().month() + 1}-01`,
			endDate: `${dayjs().year()}-${
				dayjs().month() + 1
			}-${dayjs().daysInMonth()}`,
		};
		const respReview = await axios.post(
			process.env.REACT_APP_API + "/reviewTest",
			param,
			options
		);
		const res1 = await apiClient.post("/getwritePercentage", param);
		setReviewRes1(res1.data?.data[0]?.question);

		if (!respReview.data || !respReview.data?.section) {
			navigate("/myCourses");
		}

		setReviewRes(respReview.data);

		setExamLevel(res.data[0].examLevel);
		setTestName(res.data[0].TestTitle);

		setPositiveMarks(res.data[0].Section[selectedSectionnumber].positiveMarks);
		setNegativeMarks(res.data[0].Section[selectedSectionnumber].negativeMarks);
		setdata(res.data[0].Section);
		let objArray = {
			notAnswered: [],
			notVisited: [],
			answered: [],
			markForReview: [],
			bothAnsReview: [],
		};

		let quesAnsArray = [];
		res.data[0].Section[0] &&
			res.data[0].Section.map((res, index) => {
				if (index == selectedSectionnumber) {
					setSectionName(res.sectionName);
					setSectionId(res.sectionId);
					setReviewQues(respReview.data.section[index].question);
					setmarkedReview(respReview.data.section[index].markedReview);
					setBothAnsReview(respReview.data.section[index].bothAnsReview);
					setAnswered(respReview.data.section[index].answered);
					setNotAnswer(respReview.data.section[index].notAnswered);
					setNotVisited(respReview.data.section[index].notVisited);

					let newQues = res.QuestionList.map((ques, indexs) => {
						objArray.notAnswered[indexs] = 1;
						objArray.notVisited[indexs] = 1;
						objArray.answered[indexs] = 0;
						objArray.markForReview[indexs] = 0;
						objArray.bothAnsReview[indexs] = 0;
						let everyQues = {
							isClicked: false,
							quesId: ques.questionId,
							quesAns:
								respReview.data?.section[index]?.question[indexs]?.usersAnswer,
							state: 3,
							ansStatus: "",
							optionType: ques.optionType,
						};
						quesAnsArray.push(everyQues);
						ques["state"] = 3;
						if (indexs == 0) {
							if (ques.optionType == "input") {
								setAns(respReview.data.section[index].question[0].usersAnswer);
							} else {
								setRadio(
									respReview.data.section[index].question[0].usersAnswer
								);
							}
						}
						return ques;
					});

					res.QuestionList && setQuestion(newQues);
					setCurrentQuesStatus(objArray);
					// if (getQuesAns.length == 0) {

					setQuesAns(quesAnsArray);
					// }
				}
			});

		return null;
	}, [selectedSectionnumber]);

	useEffect(() => {
		let notVisit = currentQuesStatus.notVisited.filter((res) => {
			if (res == 1) {
				return res;
			}
		});
		if (notVisit.length - 1 >= 0) {
		}
	}, [currentQuesStatus]);

	useEffect(() => {
		let qu = [...Question];
		if (qu.length && getQuesAns.length) {
			qu[currentQuesIndex]["state"] = getQuesAns[currentQuesIndex]["state"];
			setQuestion(qu);
		}
	}, [getQuesAns]);

	useEffect(() => {
		sethidenav(true);
	}, []);

	const getSolution = async (res) => {
		if (res.explantation) {
			setViewSolution(res.explantation);
		} else {
			const resp = await axios.get(
				process.env.REACT_APP_API + "/question-details/" + res.questionId,
				options
			);
			setViewSolution(resp.data["explantation"]);
		}

		setViewSection(true);
	};

	return (
		<div className="bg-gray-50 h-full overflow-hidden">
			<nav className="sm:flex block justify-between bg-slate-600 p-2 py-6">
				<div className="text-yellow-400 font-semibold">{SectionName}</div>
				<div className="text-yellow-400 sm:text-lg font-semibold">
					{getTestName}
				</div>
				<div></div>
			</nav>
			{/* report modal */}
			<Modal
				opened={isReportVisible}
				onClose={() => setIsReportVisible(false)}
				title="Report Question"
				hideCloseButton
				centered
				size="lg"
			>
				<div className="flex flex-col space-y-4">
					<div className="flex items-center space-x-2">
						<IconHelpCircle size={24} />
						<p className="text-lg font-semibold">
							Are you sure you want to report this question?
						</p>
					</div>
					<p className="text-sm">
						Reporting this question will notify the admin and the question will
						be reviewed.
					</p>
					<Textarea
						placeholder="Enter your reason for reporting this question"
						className="w-full"
					/>
					<div className="flex items-center justify-center">
						<button
							className="bg-red-500 hover:bg-red-600 transition text-white font-semibold py-2 px-4 rounded-md"
							onClick={() => setIsReportVisible(false)}
						>
							Report
						</button>
					</div>
				</div>
			</Modal>
			<div id="quesAns" className="sm:flex block justify-between">
				<div className="w-full mr-4">
					<div>
						<ul className="flex">
							{data.map((res, i) => (
								<button
									key={i}
									onClick={() => {
										if (selectedSectionnumber < i) setAlertbox(true);
										setViewSection(false);
									}}
									className={`flex items-center border-2 ml-2 mt-2 p-1 pl-4 pr-4 disabled:cursor-not-allowed rounded-sm ${
										selectedSectionnumber == i ? "bg-blue-400" : "bg-gray-100"
									} ${
										selectedSectionnumber == i
											? "text-gray-50"
											: "text-gray-500"
									} font-semibold`}
									disabled={selectedSectionnumber > i ? true : false}
								>
									{res.sectionName}
									<div key={i} className="bg-blue-400 p-1 rounded-full ml-2">
										<FaInfo className="text-white" />
									</div>
								</button>
							))}
						</ul>
					</div>
					<div className="flex justify-end border-y-2 border-gray-300 pl-2 py-2 mt-2">
						<p className="py-2 font-semibold text-sm sm:text-lg mr-2 text-left">
							Marks for Correct Answer:{" "}
							<span className="text-green-600">
								{data[selectedSectionnumber]?.positiveMarks || ""}
							</span>{" "}
							| Negative Marks:{" "}
							<span className="text-red-500">
								{Math.abs(data[selectedSectionnumber]?.negativeMarks) || ""}
							</span>
						</p>
					</div>
					<div className="flex items-center border-b-2 pl-2 w-full">
						<div className="sm:flex w-full sm:items-center justify-between">
							<p className="font-bold text-md text-left sm:text-lg py-2">
								Q. {currentQuesIndex + 1}
							</p>
							<div className="flex items-center mr-2">
								<p className="text-sm mr-3 font-semibold">Re-attempt</p>
								<Switch
									checked={showCorrectAns}
									label="Solution"
									className="mr-4 font-semibold"
									onChange={() => {
										setShowCorrectAns(!showCorrectAns);
										getSolution(Question[currentQuesIndex]);
									}}
								/>
								<Tooltip label="Report this question to the admin">
									<button
										className="flex items-center text-red-500 text-sm sm:text-base font-semibold mr-4"
										onClick={() => setIsReportVisible(true)}
									>
										<IoWarning className="text-red-500 text-lg mr-1" />
										Report
									</button>
								</Tooltip>
								<Tooltip
									label={
										(reviewQues && reviewQues[currentQuesIndex]?.bookmark) ||
										bookmarks[currentQuesIndex]
											? "Remove this question from bookmarks"
											: "Add this question to bookmarks"
									}
								>
									<button
										className="flex items-center text-blue-500 text-sm sm:text-base font-semibold"
										onClick={() => {
											const ques =
												data[selectedSectionnumber].QuestionList[
													currentQuesIndex
												];
											const bookmarkStatus =
												reviewQues[currentQuesIndex]?.bookmark ||
												bookmarks[currentQuesIndex];
											setBookmarks((draft) => {
												draft[currentQuesIndex] = !bookmarkStatus;
											});
											setReviewQues((draft) => {
												draft[currentQuesIndex].bookmark = !bookmarkStatus;
											});
											handleBookmark(ques, !bookmarkStatus ? 1 : 0);
										}}
									>
										{(reviewQues && reviewQues[currentQuesIndex]?.bookmark) ||
										bookmarks[currentQuesIndex] ? (
											<>
												<FaBookmark className="text-blue-400 mr-1" />
												<p>Bookmarked</p>
											</>
										) : (
											<>
												<FaRegBookmark className="text-blue-500 mr-1" />
												<p>Bookmark</p>
											</>
										)}
									</button>
								</Tooltip>
							</div>
						</div>
					</div>

					{Question.map((res, i) => {
						return currentQuesIndex == i ? (
							<div
								key={i}
								className="text-left justify-between overflow-y-scroll max-h-[450px] pl-2 w-full"
								style={{ height: "100%" }}
							>
								{res.questionType == "paragraph" ? (
									<>
										<div className="grid sm:grid-cols-2 grid-cols-1 grid-s w-full">
											<div className="overflow-y-scroll p-4 border-r-[1px] border-gray-300">
												<ScrollArea h={400} className="p-4 pb-6">
													<div
														dangerouslySetInnerHTML={{
															__html: res.paragraph,
														}}
													/>
												</ScrollArea>
											</div>
											<div className="overflow-y-scroll">
												<ScrollArea h={450} className="p-4 pb-6">
													<>
														<p
															dangerouslySetInnerHTML={{
																__html: res.question,
															}}
														></p>
														{res.optionType == "input" ? (
															<div>
																<QuestionInput
																	getMode={getMode}
																	getAns={getAns}
																	setAns={setAns}
																	getQuesAns={getQuesAns}
																	setQuesAns={setQuesAns}
																	index={i}
																/>
															</div>
														) : (
															<>
																{/* <p className='w-10/12 p-4' dangerouslySetInnerHTML={{
                                                                __html: res.question
                                                            }}></p> */}
																{res.questionoption[0] &&
																	res?.questionoption.map((ans, idx) => {
																		return (
																			<div
																				key={idx}
																				className="flex items-center space-x-3 cursor-pointer px-4 py-2 rounded-sm"
																			>
																				<div
																					className={`flex items-center py-2 px-4 rounded-md
																					${
																						(reviewQues[i].answerStatus ==
																							"C" &&
																							idx == getRadio) ||
																						(res.correctoption == idx + 1 &&
																							showCorrectAns)
																							? "bg-green-100"
																							: ""
																					}
																					${reviewQues[i].answerStatus == "W" && idx == getRadio && "bg-red-100"}
																				`}
																				>
																					<input
																						checked={
																							idx == getRadio ? "checked" : null
																						}
																						type="radio"
																						name={`ans` + i}
																						disabled={true}
																						className="appearance checked:text-indigo-500 hover:ring-2 h-6 w-6"
																					/>
																					<h3
																						dangerouslySetInnerHTML={{
																							__html: ans?.option
																								.replace(/<br>/gi, "")
																								.replace(/&nbsp;/gi, ""),
																						}}
																						className="ml-4 mr-2 text-gray-900 text-md font-semibold text-left"
																					/>
																					{(reviewQues[i].answerStatus == "C" &&
																						idx == getRadio) ||
																					(res.correctoption == idx + 1 &&
																						showCorrectAns) ? (
																						<i className="mr-1 fa fa-check text-green-500 text-2xl" />
																					) : (
																						reviewQues[i].answerStatus == "W" &&
																						idx == getRadio && (
																							<i className="mr-1 fa fa-times text-red-500 text-2xl" />
																						)
																					)}
																				</div>
																			</div>
																		);
																	})}

																{/* <div style={{ marginTop: "10px", minHeight: '200px' }}>
                                                                <button className="flex items-center border-2  p-1 pl-4 pr-4 disabled:cursor-not-allowed rounded-sm font-semibold bg-blue-400 text-gray-50" name="vieSec" onClick={() => getSolution(res)}> View Solution </button> 
                                                                {
                                                                    (getViewSection ? getViewSolution && typeof getViewSolution == 'object' ?
                                                                        <div dangerouslySetInnerHTML={{ __html: getViewSolution.q }}></div> :
                                                                        <div dangerouslySetInnerHTML={{ __html: getViewSolution }}></div> : ""
                                                                    )
                                                                }
                                                            </div> */}
															</>
														)}
														<div className="mt-4">
															{/* <button
															className="flex items-center border-2  p-1 pl-4 pr-4 disabled:cursor-not-allowed rounded-sm font-semibold bg-blue-400 text-gray-50"
															name="vieSec"
															onClick={() => getSolution(res)}
														>
															{" "}
															View Solution{" "}
														</button> */}
															{showCorrectAns ? (
																getViewSolution &&
																typeof getViewSolution == "object" ? (
																	<div
																		className="mb-8"
																		dangerouslySetInnerHTML={{
																			__html: getViewSolution.q,
																		}}
																	></div>
																) : (
																	<div
																		className="mb-8"
																		dangerouslySetInnerHTML={{
																			__html: getViewSolution,
																		}}
																	></div>
																)
															) : (
																""
															)}
														</div>
													</>
												</ScrollArea>
											</div>
										</div>
									</>
								) : (
									<>
										<p
											dangerouslySetInnerHTML={{
												__html: res.paragraph,
											}}
										></p>
										<>
											<p
												className="w-10/12 p-4"
												dangerouslySetInnerHTML={{
													__html: res.question,
												}}
											></p>

											{res.optionType == "input" ? (
												<div>
													<QuestionInput
														getMode={getMode}
														getAns={getAns}
														setAns={setAns}
														getQuesAns={getQuesAns}
														setQuesAns={setQuesAns}
														index={i}
													/>
												</div>
											) : (
												<>
													{res.questionoption[0] &&
														res?.questionoption.map((ans, idx) => {
															return (
																<div
																	key={idx}
																	className="flex items-center space-x-3 cursor-pointer px-4 py-2 rounded-sm"
																>
																	<div
																		className={`flex items-center py-2 px-4 rounded-md
																			${
																				(reviewQues[i].answerStatus == "C" &&
																					idx == getRadio) ||
																				(res.correctoption == idx + 1 &&
																					showCorrectAns)
																					? "bg-green-100"
																					: ""
																			}
																			${reviewQues[i].answerStatus == "W" && idx == getRadio && "bg-red-100"}`}
																	>
																		<input
																			checked={
																				idx == getRadio ? "checked" : null
																			}
																			type="radio"
																			name={`ans` + i}
																			disabled={true}
																			className="appearance checked:text-indigo-500 hover:ring-2 h-6 w-6"
																		/>
																		<h3
																			dangerouslySetInnerHTML={{
																				__html: ans?.option
																					.replace(/<br>/gi, "")
																					.replace(/&nbsp;/gi, ""),
																			}}
																			className="ml-4 mr-2 text-gray-900 text-md font-semibold text-left"
																		></h3>
																		{(reviewQues[i].answerStatus == "C" &&
																			idx == getRadio) ||
																		(res.correctoption == idx + 1 &&
																			showCorrectAns) ? (
																			<i className="mr-1 fa fa-check text-green-500 text-2xl" />
																		) : (
																			reviewQues[i].answerStatus == "W" &&
																			idx == getRadio && (
																				<i className="mr-1 fa fa-times text-red-500 text-2xl" />
																			)
																		)}
																	</div>
																</div>
															);
														})}
												</>
											)}

											{/* <div>
												<span style={{ position: "absolute" }}>
													Correct Answer :-{" "}
												</span>
												<h3
													style={{ marginLeft: "12%", marginTop: "2px" }}
													dangerouslySetInnerHTML={{
														__html:
															((res.correctoption ||
																res.correctoption == "0") &&
																res.questionoption[res.correctoption - 1]
																	?.option) ||
															"",
													}}
													className="text-gray-900 group-hover:text-white text-sm font-semibold text-left"
												></h3>
											</div> */}
											<div style={{ marginTop: "10px", minHeight: "200px" }}>
												{showCorrectAns ? (
													getViewSolution &&
													typeof getViewSolution == "object" ? (
														<>
															<p className="text-xl font-semibold ml-5">
																Solution:
															</p>
															<div
																className="mb-8 pl-5 sm:pl-10 pt-5"
																dangerouslySetInnerHTML={{
																	__html: getViewSolution.q,
																}}
															/>
														</>
													) : (
														<>
															<p className="text-xl font-semibold ml-5">
																Solution:
															</p>
															<div
																className="mb-8 pl-5 sm:pl-10 pt-5"
																dangerouslySetInnerHTML={{
																	__html: getViewSolution,
																}}
															/>
														</>
													)
												) : (
													""
												)}
											</div>
										</>{" "}
									</>
								)}
							</div>
						) : null;
					})}
				</div>
				<div className="border-gray-800 sm:border-l-2 border-t-2 sm:border-t-0 h-full">
					<div className="flex flex-col justify-center sm:w-80 items-center">
						<div className="w-full">
							<div className="text-left py-2 px-2 text-lg text-white font-semibold bg-[#4e85c5]">
								{userInfo(localStorage.getItem("token"))}
							</div>
							<div className="flex items-center w-full py-3 px-2 text-gray-700 font-semibold">
								<div className="flex items-center">
									<IconClock size={20} className="mr-2" />
									Time spent on this ques:
								</div>
								<p className="ml-1 text-sm">
									{reviewRes?.section[selectedSectionnumber]?.question[
										currentQuesIndex
									]?.timeTaken ||
									reviewRes?.section[selectedSectionnumber]?.question[
										currentQuesIndex
									]?.timeTaken?.length > 0
										? `${reviewRes?.section[selectedSectionnumber]?.question[currentQuesIndex]?.timeTaken}s`
										: "NA"}
								</p>
							</div>
							<Divider />
							<div className="flex items-center w-full py-3 px-2 text-gray-700 font-semibold">
								<IconHelpCircle size={22} className="mr-2" />
								<p>Question Difficulty:</p>
								<p
									className={`ml-1 text-sm px-1 py-[1px] rounded-sm text-white
									${reviewRes1[currentQuesIndex]?.questionLevel == "Easy" && `bg-green-500`}
									${reviewRes1[currentQuesIndex]?.questionLevel == "Medium" && `bg-yellow-500`}
									${reviewRes1[currentQuesIndex]?.questionLevel == "Hard" && `bg-red-500`}
								`}
								>
									{reviewRes1[currentQuesIndex]?.questionLevel}
								</p>
							</div>
							<Divider />
							<div className="flex items-center w-full py-3 px-2 text-gray-700 font-semibold">
								<IconHourglass size={22} className="mr-2" />
								<p>Avg. time spent:</p>
								<p className="ml-1 text-sm">
									{reviewRes?.section[selectedSectionnumber]?.avgSpentTime
										? `${reviewRes?.section[
												selectedSectionnumber
										  ]?.avgSpentTime?.toFixed(2)}s`
										: "NA"}
								</p>
							</div>
							<Divider />
							<div className="flex items-center w-full py-3 px-2 text-gray-700 font-semibold">
								<IconAlarm size={22} className="mr-1" />
								<p>Avg. time for correct ans:</p>
								<p className="ml-1 text-sm">
									{reviewRes?.section[selectedSectionnumber]
										?.avgCorrentSpentTime
										? `${reviewRes?.section[
												selectedSectionnumber
										  ]?.avgCorrentSpentTime?.toFixed(2)}s`
										: "NA"}
								</p>
							</div>
							<Divider />
						</div>
						<div className="flex flex-col w-full">
							<div className="bg-[#4e85c5] mt-8">
								<p className="text-left p-2 text-white font-semibold w-full">
									{SectionName}
								</p>
							</div>
							<p className="text-left pl-2 mt-2 text-gray-700 font-semibold w-full">
								Choose a Question
							</p>
						</div>
						<div className="sm:h-[220px] overflow-y-scroll">
							<div className="flex grow flex-wrap max-w-[inherit] w-[100%] gap-4 p-4">
								{reviewRes?.section[selectedSectionnumber]?.question.map(
									(ques, i) => (
										<button
											key={i}
											onClick={() => {
												setCurrentQuesIndex(i);
												setViewSection(false);
												getSolution(ques);
												setShowCorrectAns(false);
												if (ques.optionType == "input") {
													if (reviewQues[i].usersAnswer != -1) {
														setAns(reviewQues[i].usersAnswer);
													} else {
														setAns();
													}
												} else {
													setRadio(reviewQues[i].usersAnswer);
												}
											}}
											className="relative"
										>
											{!ques?.answerStatus && !ques?.notVisited ? (
												<>
													<img src={notans} className="w-10" />
													<p className="absolute text-gray-50 top-[0%] -translate-x-2/4 left-2/4 translate-y-1/2">
														{i + 1}
													</p>
												</>
											) : ques?.bothAnsReview ? (
												<>
													<div className="flex font-medium items-center self-center">
														<div className="relative bg-[#765398] border-[#7a638f] shadow-inner shadow-[#d3a7fc] border-2 p-2 min-w-[2.5rem] min-h-[2.5rem] w-10 h-10 rounded-full">
															<FaEquals className="absolute bottom-[-10%] font-normal text-sm right-[-10%] text-white bg-[#98c271] text-[8px] rounded-full min-w-[1rem] w-4 h-4 min-h-4" />
															<p className="text-gray-50">{i + 1}</p>
														</div>
													</div>
												</>
											) : ques?.notVisited ? (
												<>
													<div className="relative bg-[#ededed] border-[#979797] shadow-inner shadow-[#a9a9a962] border-2 p-2 w-10 h-10 rounded-sm">
														<p className="text-gray-800">{i + 1}</p>
													</div>
												</>
											) : ques?.markForReview ? (
												<>
													<div className="flex flex-wrap font-medium items-center">
														<div className="relative bg-[#765398] border-[#7a638f] shadow-inner shadow-[#d3a7fc] border-2 p-2 w-10 h-10 rounded-full">
															<p className="text-gray-50">{i + 1}</p>
														</div>
													</div>
												</>
											) : ques?.answerStatus ? (
												<>
													<img src={Answered} className="w-10" />
													<p className="absolute text-gray-50 top-[0%] -translate-x-2/4 left-2/4 translate-y-1/2">
														{i + 1}
													</p>
												</>
											) : (
												""
											)}
										</button>
									)
								)}
							</div>
							<div className="flex flex-wrap gap-4 mt-2 items-center justify-center mb-20 sm:mb-5">
								<div className="flex sm:gap-4 gap-10 w-full items-center sm:justify-start justify-center sm:ml-5">
									<div className="flex flex-wrap font-medium items-center">
										<div className="relative">
											<img src={Answered} className="w-10" />
											<p className="absolute text-gray-50 top-[0%] -translate-x-2/4 left-2/4 translate-y-1">
												{reviewRes?.section[
													selectedSectionnumber
												]?.question.filter((ques) => ques?.answerStatus)
													.length || 0}
											</p>
										</div>
										<p className="ml-2 text-sm font-normal">Answered</p>
									</div>
									<div className="flex flex-wrap font-medium items-center">
										<div className="relative">
											<img src={notans} className="w-10" />
											<p className="absolute text-gray-50 top-[0%] -translate-x-2/4 left-2/4 translate-y-1">
												{reviewRes?.section[
													selectedSectionnumber
												]?.question.filter((ques) => !ques?.answerStatus)
													.length || 0}
											</p>
										</div>
										<p className="ml-2 text-sm font-normal">Not Answered</p>
									</div>
								</div>
								<div className="flex gap-4 w-full items-center sm:justify-start justify-center sm:ml-4">
									<div className="flex flex-wrap font-medium items-center sm:ml-0 ml-6">
										<div className="relative bg-[#ededed] border-[#979797] shadow-inner shadow-[#a9a9a962] border-2 flex flex-col items-center justify-center w-10 h-10 rounded-sm">
											<p className="text-gray-800">
												{reviewRes?.section[
													selectedSectionnumber
												]?.question.filter((ques) => ques?.notVisited).length ||
													0}
											</p>
										</div>
										<p className="ml-2 text-sm font-normal">Not visited</p>
									</div>
									<div className="flex flex-wrap font-medium items-center sm:ml-0 ml-4">
										<div className="relative bg-[#765398] border-[#7a638f] shadow-inner shadow-[#d3a7fc] border-2 flex flex-col items-center justify-center w-10 h-10 rounded-full">
											<p className="text-gray-50">
												{reviewRes?.section[
													selectedSectionnumber
												]?.question.filter((ques) => ques?.markForReview)
													.length || 0}
											</p>
										</div>
										<p className="ml-2 text-sm font-normal">
											Marked for review
										</p>
									</div>
								</div>
								<div className="flex font-medium items-center w-80 sm:ml-2 ml-6">
									<div className="ml-2 relative bg-[#765398] border-[#7a638f] shadow-inner shadow-[#d3a7fc] border-2 flex flex-col justify-center items-center min-w-[2.5rem] min-h-[2.5rem] w-10 h-10 rounded-full">
										<FaEquals className="absolute bottom-[-10%] font-normal text-sm right-[-10%] text-white bg-[#98c271] text-[8px] rounded-full min-w-[1rem] w-4 h-4 min-h-4" />
										<p className="text-gray-50">
											{reviewRes?.section[
												selectedSectionnumber
											]?.question.filter((ques) => ques?.bothAnsReview)
												.length || 0}
										</p>
									</div>
									<p className="text-sm font-normal ml-2">
										Answered & Marked for Review
									</p>
								</div>
							</div>
						</div>
					</div>
				</div>
				<footer className="fixed w-full border-t-2 border-gray-400 p-2 bg-gray-50 flex justify-between bottom-0">
					<div></div>
					<div className="flex justify-around items-center sm:w-[30%] w-1/2">
						<button
							onClick={() => {
								setViewSection(false);
								getSolution(Question[currentQuesIndex]);
								setShowCorrectAns(false);
								if (currentQuesIndex > 0) {
									setCurrentQuesIndex(currentQuesIndex - 1);
									if (Question[currentQuesIndex - 1]["optionType"] == "input") {
										if (reviewQues[currentQuesIndex - 1].usersAnswer != -1) {
											setAns(reviewQues[currentQuesIndex - 1].usersAnswer);
										} else {
											setAns("");
										}
									} else {
										setRadio(reviewQues[currentQuesIndex - 1].usersAnswer);
									}
								}
							}}
							className={`bg-blue-500 hover:bg-blue-600 text-white rounded-sm px-4 py-2 ${
								currentQuesIndex == 0 &&
								"bg-gray-400 hover:bg-gray-400 cursor-default"
							}`}
						>
							Previous
						</button>
						<button
							onClick={() => {
								setViewSection(false);
								getSolution(Question[currentQuesIndex]);
								setShowCorrectAns(false);
								if (currentQuesIndex + 1 < Question.length) {
									setCurrentQuesIndex(currentQuesIndex + 1);
									if (Question[currentQuesIndex + 1]["optionType"] == "input") {
										if (reviewQues[currentQuesIndex + 1].usersAnswer != -1) {
											setAns(reviewQues[currentQuesIndex + 1].usersAnswer);
										} else {
											setAns("");
										}
									} else {
										setRadio(reviewQues[currentQuesIndex + 1].usersAnswer);
									}
								}
							}}
							className={`bg-blue-500 hover:bg-blue-600 text-white rounded-sm px-4 py-2 ${
								currentQuesIndex == Question.length - 1 &&
								"bg-gray-400 hover:bg-gray-400 cursor-default"
							}`}
						>
							Next
						</button>
					</div>
				</footer>
			</div>
		</div>
	);
});

export default Review;
