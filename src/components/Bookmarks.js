import { Tooltip } from "@mantine/core";
import axios from "axios";
import clsx from "clsx";
import React, { useContext, useEffect, useMemo, useState } from "react";
import { FaBookmark, FaInfo, FaRegBookmark, FaSearch } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useImmer } from "use-immer";
import QuestionInput from "../Exam/Calculator/QuestionInput";
import hideNavContext from "../context/AllprojectsContext";
import Header from "./Header";
import Loader from "./Loader";

const customStyles = {
	content: {
		top: "50%",
		left: "50%",
		right: "auto",
		bottom: "auto",
		marginRight: "-50%",
		transform: "translate(-50%, -50%)",
	},
};

// create a component
const Bookmarks = React.memo(() => {
	const options = {
		headers: {
			"Content-type": "application/json",
			Authorization: "Bearer " + localStorage.getItem("token"),
		},
	};

	const navigate = useNavigate();

	const [Question, setQuestion] = useState([]);
	const [currentIndex, setcurrentIndex] = useState(0);
	const { sethidenav } = useContext(hideNavContext);
	const [count, setCount] = useState(1200);
	const [Alert, setAlertbox] = useState(false);
	const [SectionName, setSectionName] = useState();
	const [sectionId, setSectionId] = useState();
	const [negativeMarks, setNegativeMarks] = useState();
	const [positiveMarks, setPositiveMarks] = useState();
	const [selectedAns, setselectedAns] = useState(1000);
	const [selectedSectionnumber, setselectedcategorynumber] = useState(0);
	const [data, setdata] = useState([]);
	const [FinishExam, setFinishExam] = useState(false);
	const [allData, setAllData] = useState([]);
	const [bookmarks, setBookmarks] = useImmer([]);
	const [bookmarksData, setBookmarksData] = useState();

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
	const [modalIsOpen, setModalIsOpen] = useState(false);
	const [modalInsOpen, setModalInsOpen] = useState(false);
	const [isOpen, setIsOpen] = useState(false);

	const [allSectionData, setAllSectionData] = useState([]);
	const [reviewQues, setReviewQues] = useState([]);
	const [getViewSection, setViewSection] = useState(false);
	const [getViewSolution, setViewSolution] = useState("");
	const [getAns, setAns] = useState("");
	const [getMode, setMode] = useState("review");
	const [loading, setLoading] = useState(false);
	const [searchText, setSearchText] = useState("");

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
			setModalIsOpen(false);
			setModalInsOpen(false);
			setIsOpen(false);
			let newState = {
				answered: [],
				notAnswered: [],
				notVisited: [],
				markForReview: [],
				bothAnsReview: [],
			};
			setCurrentQuesStatus(newState);
		}

		setLoading(true);
		const bookmarkResp = await axios.get(
			process.env.REACT_APP_API +
				"/userbookmarklist/" +
				localStorage.getItem("user"),
			{
				headers: {
					Authorization: "Bearer " + localStorage.getItem("token"),
				},
			}
		);
		setLoading(false);
		console.log("BOOKMARK RESP:", bookmarkResp.data);
		setBookmarksData(bookmarkResp.data);
		let newDraft = [];
		for (let i = 0; i < bookmarkResp.data.data.length; i++) {
			newDraft.push(true);
		}
		setBookmarks(newDraft);
		setcurrentIndex(0);

		let quesAnsArray = [];
		let newQues = bookmarkResp.data.data.map((ques, indexs) => {
			let everyQues = {
				isClicked: false,
				quesId: ques.questions_info.questionId,
				quesAns: -1,
				state: 3,
				ansStatus: "",
				optionType: ques.questions_info.optionType,
			};
			quesAnsArray.push(everyQues);
			ques["state"] = 3;
			if (indexs == 0) {
				if (ques.optionType == "input") {
					setAns(-1);
				} else {
					setRadio(-1);
				}
			}
			return ques;
		});

		setQuestion(newQues);
		setQuesAns(quesAnsArray);
		return null;
	}, [selectedSectionnumber]);

	useEffect(() => {
		let notVisit = currentQuesStatus.notVisited.filter((res) => {
			if (res == 1) {
				return res;
			}
		});

		// setAnswered(ans.length);
		// setNotAnswer(notAns.length);
		if (notVisit.length - 1 >= 0) {
			// setNotVisited(notVisit.length - 1);
		}

		// setmarkedReview(markForRev.length);
		// setBothAnsReview(bothAnsMark.length);
		// console.log('qwqwqqw', currentQuesStatus)
	}, [currentQuesStatus]);

	useEffect(() => {
		let qu = [...Question];
		// console.log('ankit22222', getQuesAns)
		if (qu.length && getQuesAns.length) {
			qu[currentQuesIndex]["state"] = getQuesAns[currentQuesIndex]["state"];
			setQuestion(qu);
		}
	}, [getQuesAns]);

	const changeFinish = () => {
		setFinishExam(true);
	};

	useEffect(() => {
		sethidenav(true);
	}, []);

	const setModalIsOpenToFalse = () => {
		setModalIsOpen(false);
	};

	const togglePopup = () => {
		setIsOpen(!isOpen);
	};

	const getSolution = async (res) => {
		console.log(res);
		if (res.explantation) {
			setViewSolution(res.explantation);
		} else {
			const resp = await axios.get(
				process.env.REACT_APP_API + "/question-details/" + res.questionId,
				options
			);
			console.log(resp.data);
			setViewSolution(resp.data["explantation"]);
		}
		setViewSection(!getViewSection);
	};

	const getBookmarks = async () => {
		setLoading(true);
		const bookmarkResp = await axios.get(
			process.env.REACT_APP_API +
				"/userbookmarklist/" +
				localStorage.getItem("user"),
			{
				headers: {
					Authorization: "Bearer " + localStorage.getItem("token"),
				},
			}
		);
		setLoading(false);
		console.log("BOOKMARK RESP:", bookmarkResp.data);
		setBookmarksData(bookmarkResp.data);
		let newDraft = [];
		for (let i = 0; i < bookmarkResp.data.data.length; i++) {
			newDraft.push(true);
		}
		setBookmarks(newDraft);
	};

	const handleBookmark = async (id, status) => {
		const res = await axios.post(process.env.REACT_APP_API + "/addbookmark", {
			userEmailId: localStorage.getItem("user"),
			testId: localStorage.getItem("testid"),
			questionsId: id,
			status: status,
		});
		if (res.status == 200) {
			console.log("Bookmark added successfully!");
			getBookmarks();
		} else {
			console.log("Bookmark not added!");
		}
	};

	const filteredData = useMemo(() => {
		if (searchText.length === 0) {
			return bookmarksData?.data;
		} else {
			return bookmarksData?.data.filter((res) =>
				res.questions_info.question
					.toLowerCase()
					.includes(searchText.toLowerCase())
			);
		}
	}, [searchText, bookmarksData]);

	if (loading) return <Loader />;

	if (bookmarksData && bookmarksData.data.length == 0) {
		return (
			<div className="h-screen overflow-hidden">
				<nav className="block justify-between bg-slate-600 p-2 py-8">
					<div className="text-yellow-400 font-bold text-2xl">Bookmarks</div>
				</nav>
				<div className="flex justify-center items-center h-full">
					<div className="text-2xl font-semibold text-gray-500">
						No bookmarks found!
					</div>
				</div>
			</div>
		);
	}

	return (
		<div className="h-full overflow-hidden">
			<Header />
			<div className="flex flex-row h-full mt-4">
				{/* left aside */}
				<div className="w-1/3 h-[86vh] border-r border-gray-200">
					<div className="flex flex-col h-full">
						<div className="flex flex-row justify-between items-center p-2 border-b border-gray-200">
							<div className="text-gray-500 font-semibold text-lg">
								Bookmarks
								{bookmarksData && bookmarksData.data.length > 0 ? (
									<span className="text-gray-500 text-sm ml-2">
										({bookmarksData.data.length})
									</span>
								) : (
									""
								)}
							</div>
						</div>
						<div className="flex flex-col h-full overflow-y-scroll w-full">
							<div className="flex flex-row justify-between items-center ml-2">
								<FaSearch className="text-gray-500" />
								<input
									type="text"
									className="border-b p-2 w-full text-gray-500 focus:outline-none"
									placeholder="Search bookmarks"
									onChange={(e) => setSearchText(e.target.value)}
								/>
							</div>
							{filteredData?.length > 0 ? (
								filteredData?.map((res, i) => (
									<div
										key={i}
										className={`flex flex-row justify-between items-center p-2 border-b border-gray-200 cursor-pointer
										${currentQuesIndex == i && "bg-gray-100"}`}
										onClick={() => {
											let filteredIndex = bookmarksData.data.findIndex(
												(item) =>
													item.questions_info.questionId ==
													res.questions_info.questionId
											);
											setCurrentQuesIndex(filteredIndex);
											setViewSection(false);
										}}
									>
										<div className="flex flex-row">
											<div className="text-gray-500 text-sm ml-2 flex text-left">
												{res.questions_info.questionType == "paragraph" ? (
													<>
														<div
															className="prow w-1/2"
															style={{ height: "100%" }}
														>
															<div style={{ borderRight: "1px solid grey" }}>
																<p className="w-8">Q.{i + 1}</p>
																<p
																	className="text-jusitfy"
																	dangerouslySetInnerHTML={{
																		__html: res.questions_info.paragraph
																			.slice(0, 50)
																			.concat("..."),
																	}}
																/>
															</div>
														</div>
													</>
												) : (
													<>
														<p className="w-8">Q.{i + 1}</p>
														<p
															dangerouslySetInnerHTML={{
																__html: res.questions_info.question
																	.slice(0, 50)
																	.concat("..."),
															}}
														/>
													</>
												)}
											</div>
										</div>
									</div>
								))
							) : (
								<div className="items-center h-full">
									<div className="mt-4 font-semibold text-gray-500">
										No bookmarks found!
									</div>
								</div>
							)}
						</div>
					</div>
				</div>
				<div className="flex flex-col h-full w-full">
					<div id="quesAns" className="sm:flex block justify-between">
						<div className="w-full mr-4">
							<div>
								<ul className="flex">
									{data.map((res, i) => (
										<button
											key={i}
											onClick={() => {
												setViewSection(false);
												if (selectedSectionnumber < i) setAlertbox(true);
											}}
											className={`flex items-center border-2 ml-2 mt-2 p-1 pl-4 pr-4 disabled:cursor-not-allowed rounded-sm ${
												selectedSectionnumber == i
													? "bg-blue-400"
													: "bg-gray-100"
											} ${
												selectedSectionnumber == i
													? "text-gray-50"
													: "text-gray-500"
											} font-semibold`}
											disabled={selectedSectionnumber > i ? true : false}
										>
											{res.sectionName}
											<div
												key={i}
												className="bg-blue-400 p-1 rounded-full ml-2"
											>
												<FaInfo className="text-white" />
											</div>
										</button>
									))}
								</ul>
							</div>
							<div className="flex justify-between items-center border-b-2 pl-2 w-full">
								<p className="font-bold text-md sm:text-lg py-2">
									Q. {currentQuesIndex + 1}
								</p>
								<Tooltip label="Add this question to bookmarks">
									<button
										onClick={() => {
											const quesId =
												bookmarksData.data[currentQuesIndex].questions_info
													.questionId;
											setBookmarks((draft) => {
												let newDraft = [...draft];
												newDraft[currentQuesIndex] =
													!newDraft[currentQuesIndex];
												handleBookmark(
													quesId,
													!newDraft[currentQuesIndex] ? 0 : 1
												);
												return newDraft;
											});
										}}
									>
										{bookmarks[currentQuesIndex] ? (
											<FaBookmark className="text-blue-400 text-xl ml-2" />
										) : (
											<FaRegBookmark className="text-blue-500 text-xl ml-2" />
										)}
									</button>
								</Tooltip>
							</div>

							{Question.map((res, i) => {
								console.log("🚀 ~ CurrQues ~", res);
								return currentQuesIndex == i ? (
									<div
										key={i}
										className="text-left justify-between overflow-y-scroll max-h-[500px] pl-2 w-full"
										style={{ height: "100%" }}
									>
										{res.questions_info.questionType == "paragraph" ? (
											<>
												<div className="prow w-full" style={{ height: "100%" }}>
													<div
														className="pcolumn"
														style={{ borderRight: "1px solid grey" }}
													>
														<p
															dangerouslySetInnerHTML={{
																__html: res.questions_info.paragraph,
															}}
														></p>
													</div>
													<div className="pcolumn">
														<>
															<p
																className="p-4"
																dangerouslySetInnerHTML={{
																	__html: res.questions_info.question,
																}}
															></p>
															{res.questions_info.optionType == "input" ? (
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
																	{res.questions_info.questionoption[0] &&
																		res.questions_info?.questionoption.map(
																			(ans, iAns) => {
																				return (
																					<div
																						key={iAns}
																						className="flex items-center space-x-3 cursor-pointer px-4 py-2 rounded-sm"
																					>
																						{console.log(
																							"🚀 ~ file: index.js ~ line 687 ~ res.questionoption.map ~ ans",
																							ans
																						)}
																						<div
																							className={`flex items-center py-2 px-4 rounded-md
																					${res.questions_info.correctoption == iAns + 1 && "bg-green-100 "}
																					${reviewQues[i].answerStatus == "C" && "bg-green-100 "}
																					${reviewQues[i].answerStatus == "W" && "bg-red-100"}
																				`}
																						>
																							<input
																								checked={
																									iAns == getRadio
																										? "checked"
																										: null
																								}
																								type="radio"
																								name={`ans` + i}
																								disabled={true}
																								className="appearance checked:text-indigo-500 hover:ring-2 h-6 w-6"
																							/>
																							<h3
																								dangerouslySetInnerHTML={{
																									// remove all br tags & &nbsp; from html
																									__html: ans?.option
																										.replace(/<br>/gi, "")
																										.replace(/&nbsp;/gi, ""),
																								}}
																								className="ml-4 mr-2 text-gray-900 text-md font-semibold text-left"
																							></h3>
																							{(reviewQues[i].answerStatus ==
																								"C" &&
																								iAns == getRadio) ||
																							res.questions_info
																								.correctoption ==
																								iAns + 1 ? (
																								<i className="mr-1 fa fa-check text-green-500 text-2xl" />
																							) : (
																								reviewQues[i].answerStatus ==
																									"W" &&
																								iAns == getRadio && (
																									<i className="mr-1 fa fa-times text-red-500 text-2xl" />
																								)
																							)}
																						</div>
																					</div>
																				);
																			}
																		)}
																</>
															)}
															<div
																style={{
																	marginTop: "10px",
																	minHeight: "200px",
																}}
															>
																<button
																	className="flex items-center border-2  p-1 pl-4 pr-4 disabled:cursor-not-allowed rounded-sm font-semibold bg-blue-400 text-gray-50"
																	name="vieSec"
																	onClick={() =>
																		getSolution(res.questions_info)
																	}
																>
																	{getViewSection ? (
																		<p>Hide Solution</p>
																	) : (
																		<p>View Solution</p>
																	)}
																</button>
																{getViewSection ? (
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
													</div>
												</div>
											</>
										) : (
											<>
												<p
													dangerouslySetInnerHTML={{
														__html: res.questions_info.paragraph,
													}}
												></p>
												<>
													<p
														className="w-10/12 p-4"
														dangerouslySetInnerHTML={{
															__html: res.questions_info.question,
														}}
													></p>

													{res.questions_info.optionType == "input" ? (
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
															{res.questions_info.questionoption[0] &&
																res?.questions_info?.questionoption.map(
																	(ans, iAns) => {
																		{
																			console.log(
																				"🚀 ~ file: index.js ~ line 808 ~ res.questionoption.map ~ ans",
																				res.questions_info
																			);
																		}
																		return (
																			<div
																				key={iAns}
																				className="flex items-center space-x-3 cursor-pointer px-4 py-2 rounded-sm"
																			>
																				<div
																					className={`flex items-center py-2 px-4 rounded-md
																			${res.questions_info.correctoption == iAns + 1 && "bg-green-100 "}
																			`}
																				>
																					<input
																						checked={
																							iAns == getRadio
																								? "checked"
																								: null
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
																					{res.questions_info.correctoption ==
																						iAns + 1 && (
																						<i className="mr-1 fa fa-check text-green-500 text-2xl" />
																					)}
																				</div>
																			</div>
																		);
																	}
																)}
														</>
													)}
													<div
														style={{ marginTop: "10px", minHeight: "200px" }}
													>
														<button
															className="flex items-center px-4 py-2 rounded-sm font-semibold bg-blue-400 hover:bg-blue-500 transition text-gray-50 ml-4"
															name="vieSec"
															onClick={() => getSolution(res.questions_info)}
														>
															{getViewSection ? (
																<p>Hide Solution</p>
															) : (
																<p>View Solution</p>
															)}
														</button>
														{getViewSection ? (
															getViewSolution &&
															typeof getViewSolution == "object" ? (
																<div
																	className="mt-5 mb-8 ml-5"
																	dangerouslySetInnerHTML={{
																		__html: getViewSolution.q,
																	}}
																></div>
															) : (
																<div
																	className="mt-5 mb-8 ml-5"
																	dangerouslySetInnerHTML={{
																		__html: getViewSolution,
																	}}
																></div>
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
						<footer className="fixed w-full border-t-2 border-gray-300 p-2 bottom-0">
							<div className="flex justify-between w-[240px] sm:w-[300px] ml-4">
								<button
									onClick={() => {
										setViewSection(false);
										if (currentQuesIndex - 1 >= 0) {
											setCurrentQuesIndex(currentQuesIndex - 1);
										}
									}}
									className={clsx(
										"bg-blue-400 hover:bg-blue-500 text-white font-semibold rounded-sm px-4 py-2",
										currentQuesIndex == 0
											? "bg-gray-400 hover:bg-gray-400 cursor-default"
											: "hover:bg-blue-500"
									)}
								>
									Previous
								</button>
								<button
									onClick={() => {
										setViewSection(false);
										if (currentQuesIndex + 1 < Question.length) {
											setCurrentQuesIndex(currentQuesIndex + 1);
										}
									}}
									className={clsx(
										"bg-blue-400 text-white font-semibold rounded-sm px-4 py-2",
										currentQuesIndex === Question.length - 1
											? "bg-gray-400 hover:bg-gray-400 cursor-default"
											: "hover:bg-blue-500"
									)}
								>
									Next
								</button>
							</div>
						</footer>
					</div>
				</div>
			</div>
		</div>
	);
});

export default Bookmarks;
