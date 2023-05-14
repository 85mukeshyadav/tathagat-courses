//import liraries
import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { FaInfo, FaBookmark, FaRegBookmark } from "react-icons/fa";
import Modal from "react-modal";
import { useNavigate } from "react-router-dom";
import QuestionInput from "../Exam/Calculator/QuestionInput";
import hideNavContext from "../context/AllprojectsContext";
import Loader from "./Loader";
import { Tooltip } from "@mantine/core";
import { useImmer } from "use-immer";

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

		setViewSection(true);
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
		} else {
			console.log("Bookmark not added!");
		}
	};

	if (loading) return <Loader />;

	return (
		<div className="bg-gray-50 h-full overflow-hidden">
			<nav className="block justify-between bg-slate-600 p-2 py-8">
				<div className="text-yellow-400 font-bold text-2xl">Bookmarks</div>
				{/* <div className="text-yellow-400 font-semibold">
					Test Name:- {getTestName}
				</div> */}
				{/* <div className="sm:flex block items-center">
					<button
						onClick={togglePopup}
						className="flex items-center text-gray-50 mr-6 mb-4 mt-4 sm:mt-4"
					>
						Calculator
					</button>

					<div className='calculator-demo' style={style}>
                    <h1>Calculator</h1>
                    <Calculator
                        onNewInput={handleInput}
                        onResultChange={onResultChange}/>
                    </div>
					<button
						onClick={setModalIsOpenToTrue}
						className="flex items-center text-gray-50 mr-6 mb-4 sm:mt-4"
					>
						<div className="bg-green-400 p-2 rounded-full mr-2">
							<FaFile className="text-white" />
						</div>
						Question paper
					</button>
					<button
						onClick={setModalInsOpenToTrue}
						className="flex items-center text-gray-50 mb-4 sm:mt-4"
					>
						<div className="bg-blue-400 p-2 rounded-full mr-2">
							<FaInfo className="text-white" />
						</div>
						View Instruction
					</button>
				</div> */}
				<Modal isOpen={modalIsOpen} style={customStyles} ariaHideApp={false}>
					<button onClick={setModalIsOpenToFalse}>x</button>
					<div class="quesHeight">
						{Question.map((allQues, i) => (
							<div key={i}>
								<span>Q{i + 1}</span>
								<p
									key={i}
									className="w-10/12 p-4"
									dangerouslySetInnerHTML={{
										__html:
											allQues.questionType == "paragraph"
												? allQues.paragraph
												: allQues.question,
									}}
								></p>
							</div>
						))}
					</div>
				</Modal>

				{/* <Modal isOpen={modalInsOpen} style={customStyles} ariaHideApp={false}>
					<button onClick={setModalInsOpenToFalse}>x</button>
					{getExamLevel == 4 || getExamLevel == 3 || getExamLevel == 2 ? (
						<embed
							src={pms}
							type="application/pdf"
							height="700px"
							width="600px"
						></embed>
					) : getExamLevel == 1 ? (
						<embed
							src={fullLength}
							type="application/pdf"
							height="700px"
							width="600px"
						></embed>
					) : (
						<embed
							src={copyCat}
							type="application/pdf"
							height="700px"
							width="600px"
						></embed>
					)}
				</Modal> */}
			</nav>

			{isOpen ? (
				<div className="popup-box">
					<div className="box">
						<span className="close-icon" onClick={togglePopup}>
							x
						</span>
						{/* <Calculator /> */}
					</div>
				</div>
			) : (
				""
			)}
			{/* <Calculator /> */}

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
										newDraft[currentQuesIndex] = !newDraft[currentQuesIndex];
										handleBookmark(quesId, !newDraft[currentQuesIndex] ? 0 : 1);
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
						{/* <p className="py-2 font-semibold text-sm sm:text-lg mr-2">
							Marks for Correct Answer:{" "}
							{data[selectedSectionnumber]?.positiveMarks} | Negative Marks:{" "}
							<span className="text-red-500">
								{data[selectedSectionnumber]?.negativeMarks}
							</span>
						</p> */}
					</div>

					{Question.map((res, i) => {
						console.log("res", res);
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
															{/* <p className='w-10/12 p-4' dangerouslySetInnerHTML={{
                                                                __html: res.question
                                                            }}></p> */}
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
																					{(reviewQues[i].answerStatus == "C" &&
																						iAns == getRadio) ||
																					res.questions_info.correctoption ==
																						iAns + 1 ? (
																						<i className="mr-1 fa fa-check text-green-500 text-2xl" />
																					) : (
																						reviewQues[i].answerStatus == "W" &&
																						iAns == getRadio && (
																							<i className="mr-1 fa fa-times text-red-500 text-2xl" />
																						)
																					)}
																				</div>
																			</div>
																		);
																	}
																)}

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
													<div
														style={{ marginTop: "10px", minHeight: "200px" }}
													>
														<button
															className="flex items-center border-2  p-1 pl-4 pr-4 disabled:cursor-not-allowed rounded-sm font-semibold bg-blue-400 text-gray-50"
															name="vieSec"
															onClick={() => getSolution(res.questions_info)}
														>
															{" "}
															View Solution{" "}
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
																					iAns == getRadio ? "checked" : null
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
												<button
													className="flex items-center border-2  p-1 pl-4 pr-4 disabled:cursor-not-allowed rounded-sm font-semibold bg-blue-400 text-gray-50"
													name="vieSec"
													onClick={() => getSolution(res.questions_info)}
												>
													{" "}
													View Solution{" "}
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
										</>{" "}
									</>
								)}
							</div>
						) : null;
					})}
				</div>
				{/* <div className="border-gray-800 sm:border-l-2 border-t-2 sm:border-t-0 h-full">
					<div className="flex flex-col justify-center sm:w-80 items-center">
						<div className="flex m-4">
							<img className="w-28 h-28 rounded-sm" src={NewCandidateImage} />
							<div className="ml-4 m-auto text-xl font-bold text-gray-700">
								<p>{userInfo(localStorage.getItem("token"))}</p>
								<p></p>
							</div>
						</div>
						<div className="flex flex-wrap gap-4 p-2 mt-2 items-center sm:justify-start justify-center">
							<div className="flex sm:gap-4 gap-10 w-full items-center sm:justify-start justify-center sm:ml-2">
								<div className="flex flex-wrap font-medium items-center">
									<div className="relative">
										<img src={Answered} className="w-10" />
										<p className="absolute text-gray-50 top-[0%] -translate-x-2/4 left-2/4 translate-y-1/4">
											{answered}
										</p>
									</div>
									<p className="ml-2 text-sm font-normal">Answered</p>
								</div>
								<div className="flex flex-wrap font-medium items-center">
									<div className="relative">
										<img src={notans} className="w-10" />
										<p className="absolute text-gray-50 top-[0%] -translate-x-2/4 left-2/4 translate-y-1/4">
											{notAnswered}
										</p>
									</div>
									<p className="ml-2 text-sm font-normal">Not Answered</p>
								</div>
							</div>
							<div className="flex gap-4 w-full items-center sm:justify-start justify-center sm:ml-2">
								<div className="flex flex-wrap font-medium items-center sm:ml-0 ml-6">
									<div className="relative bg-[#ededed] border-[#979797] shadow-inner shadow-[#a9a9a962] border-2 p-2 w-10 h-10 rounded-sm">
										<p className="text-gray-800">{notVisited}</p>
									</div>
									<p className="ml-2 text-sm font-normal">Not visited</p>
								</div>
								<div className="flex flex-wrap font-medium items-center sm:ml-0 ml-4">
									<div className="relative bg-[#765398] border-[#7a638f] shadow-inner shadow-[#d3a7fc] border-2 p-2 w-10 h-10 rounded-full">
										<p className="text-gray-50">{markedReview}</p>
									</div>
									<p className="ml-2 text-sm font-normal">Marked for review</p>
								</div>
							</div>
							<div className="flex font-medium items-center self-center w-80 sm:ml-2 ml-6">
								<div className="relative bg-[#765398] border-[#7a638f] shadow-inner shadow-[#d3a7fc] border-2 p-2 min-w-[2.5rem] min-h-[2.5rem] w-10 h-10 rounded-full">
									<FaEquals className="absolute bottom-[-10%] font-normal text-sm right-[-10%] text-white bg-[#98c271] text-[8px] rounded-full min-w-[1rem] w-4 h-4 min-h-4" />
									<p className="text-gray-50">{bothAnsReview}</p>
								</div>
								<p className="text-sm font-normal">
									Answered & Marked for Review (will be considered for
									evaluation){" "}
								</p>
							</div>
						</div>
						<div className="flex flex-col w-full">
							<div className="bg-[#4e85c5] mt-2">
								<p className="text-left p-2 text-white font-semibold w-full">
									{SectionName}
								</p>
							</div>
							<p className="text-left pl-2 mt-2 text-gray-700 font-semibold w-full">
								Choose a Question
							</p>
						</div>
						<div className="h-[220px] max-h-[220px] overflow-hidden overflow-y-scroll">
							<div className="flex grow flex-wrap max-w-[inherit] w-[100%] gap-4 p-4">
								{Question.map((res, i) => (
									<button
										key={i}
										onClick={() => {
											setcurrentIndex(i);
											setCurrentQuesIndex(i);
											setViewSection(false);

											if (res.optionType == "input") {
												if (reviewQues[i].usersAnswer != -1) {
													setAns(reviewQues[i].usersAnswer);
												} else {
													setAns();
												}
											} else {
												setRadio(reviewQues[i].usersAnswer);
											}

											// let newObj = { ...currentQuesStatus }
											// newObj['notVisited'][i] = 0;
											// setCurrentQuesStatus(newObj);
											// let newArray = [...getQuesAns];

											// console.log(newArray, i)

											// if (newArray[i]['quesAns'] != -1) {
											//     //newArray[i]['state'] = 1;

											//     setRadio(newArray[i]['quesAns'])
											// } else {
											//     setRadio(-1)
											//     // newArray[i]['state'] = 2;
											//     // newArray[i]['isClicked'] = true;

											// }
											// setQuesAns(newArray);
											// let qu = [...Question];
											// setQuestion(qu)
										}}
										className="relative"
									>
										{res.state == 2 ? (
											<>
												<img src={notans} className="w-10" />
												<p className="absolute text-gray-50 top-[0%] -translate-x-2/4 left-2/4 translate-y-1/4">
													{i + 1}
												</p>
											</>
										) : res.state == 1 ? (
											<>
												<img src={Answered} className="w-10" />
												<p className="absolute text-gray-50 top-[0%] -translate-x-2/4 left-2/4 translate-y-1/4">
													{i + 1}
												</p>
											</>
										) : res.state == 3 ? (
											<>
												<div className="relative bg-[#ededed] border-[#979797] shadow-inner shadow-[#a9a9a962] border-2 p-2 w-10 h-10 rounded-sm">
													<p className="text-gray-800">{i + 1}</p>
												</div>
											</>
										) : res.state == 4 ? (
											<>
												<div className="flex flex-wrap font-medium items-center">
													<div className="relative bg-[#765398] border-[#7a638f] shadow-inner shadow-[#d3a7fc] border-2 p-2 w-10 h-10 rounded-full">
														<p className="text-gray-50">{i + 1}</p>
													</div>
												</div>
											</>
										) : res.state == 5 ? (
											<>
												<div className="flex font-medium items-center self-center">
													<div className="relative bg-[#765398] border-[#7a638f] shadow-inner shadow-[#d3a7fc] border-2 p-2 min-w-[2.5rem] min-h-[2.5rem] w-10 h-10 rounded-full">
														<FaEquals className="absolute bottom-[-10%] font-normal text-sm right-[-10%] text-white bg-[#98c271] text-[8px] rounded-full min-w-[1rem] w-4 h-4 min-h-4" />
														<p className="text-gray-50">{i + 1}</p>
													</div>
												</div>
											</>
										) : (
											""
										)}
									</button>
								))}
							</div>
						</div>
					</div>
				</div> */}
				<footer className="fixed w-full border-t-2 border-gray-400 p-2 bg-gray-50 flex justify-between bottom-0">
					<div></div>
					<div className="flex justify-around items-center sm:w-[30%] w-1/2">
						<button
							onClick={() => {
								setViewSection(false);
								if (currentQuesIndex - 1 >= 0) {
									setCurrentQuesIndex(currentQuesIndex - 1);
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
								if (currentQuesIndex + 1 < Question.length) {
									setCurrentQuesIndex(currentQuesIndex + 1);
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

export default Bookmarks;
