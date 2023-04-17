//import liraries
import React, {
	useEffect,
	useState,
	useLayoutEffect,
	useRef,
	useContext,
} from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { FiClock } from "react-icons/fi";
import moment from "moment";
import {
	FaCalculator,
	FaEquals,
	FaFile,
	FaInfo,
	FaPage4,
} from "react-icons/fa";
import Answered from "../assets/Answered.png";
import notans from "../assets/notans.png";
import NewCandidateImage from "../assets/NewCandidateImage.jpg";
import hideNavContext from "../context/AllprojectsContext";
import axios from "axios";
import { userInfo } from "../api/checkAuth";
import Modal from "react-modal";
import Calculator from "./Calculator/Calculator";
import pms from "../assets/pms.pdf";
import fullLength from "../assets/fullLength.pdf";
import copyCat from "../assets/copyCat.pdf";
import QuestionInput from "./Calculator/QuestionInput";

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

const style = {
	height: "24rem",
	width: "15rem",
};

function Counter(props) {
	const [count, setCount] = useState(props.time);

	// useInterval(() => {
	//     // Your custom logic here
	//     setCount(count - 1);
	// }, 1000);
	const duration = moment.duration(count, "seconds");
	// console.log("🚀 ~ file: Examination.js ~ line 26 ~ Counter ~ duration", duration)
	const h = duration.hours(); // 20
	const m = duration.minutes(); // 20
	const s = duration.seconds();

	if (s <= 0 && m <= 0 && h <= 0) {
		props.changeFinish();
		return <span key={props.time} className="mx-1">{`0 Min`}</span>;
	}

	return <span key={props.time} className="mx-1">{`${h}:${m}:${s} Min`}</span>;
}

function useInterval(callback, delay) {
	const savedCallback = useRef();

	// Remember the latest function.
	useEffect(() => {
		savedCallback.current = callback;
	}, [callback]);

	// Set up the interval.
	useEffect(() => {
		function tick() {
			savedCallback.current();
		}
		if (delay !== null) {
			let id = setInterval(tick, delay);
			return () => clearInterval(id);
		}
	}, [delay]);
}

// create a component
const Review = React.memo(() => {
	const options = {
		headers: {
			"Content-type": "application/json",
			Authorization: "Bearer " + localStorage.getItem("token"),
		},
	};

	const navigate = useNavigate();

	const [Question, setQuestion] = useState([]);
	const [currentIndex, setcurrentIndex] = useState(0);
	const { hidenav, sethidenav } = useContext(hideNavContext);
	const savedCallback = useRef();
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
	const [getExamLevel, setExamLevel] = useState(1);
	const [getTestName, setTestName] = useState("");

	// window.addEventListener('beforeunload', function (e) {
	//     e.preventDefault();
	//     e.returnValue = '';
	// });

	// useUnload(e => {
	//     e.preventDefault();
	//     console.log("adasdasdasd")
	//     e.returnValue = '';
	//   });

	useEffect(() => {
		if (count <= 0) {
			// _submitPreTest();
			// setTimeout(()=>{submitTest(1)},5000);
		}
	}, [count]);

	useEffect(async () => {
		if (selectedSectionnumber > 0) {
			let question = [];
			let correctAnswers = 0;
			let wrongAnswers = 0;
			getQuesAns.map((data, index) => {
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

		// const res = await fetch(`https://opentdb.com/api.php?amount=30&category=${categorynumber[ selectedSectionnumber ].number}&type=multiple`)
		const res = await axios.get(
			process.env.REACT_APP_API + "/gettest/" + localStorage.getItem("testid"),
			options
		);
		console.log("rererere", res);
		let param = {
			userId: localStorage.getItem("user"),
			testId: localStorage.getItem("testid"),
			packageId: localStorage.getItem("pkgid"),
		};
		const respReview = await axios.post(
			process.env.REACT_APP_API + "/reviewTest",
			param,
			options
		);

		if (!respReview.data || !respReview.data?.section) {
			navigate("/myCourses");
		}

		setExamLevel(res.data[0].examLevel);
		setTestName(res.data[0].TestTitle);

		// console.log(res.data)
		setCount(res.data[0].Section[selectedSectionnumber].SectionTime * 60);

		setPositiveMarks(res.data[0].Section[selectedSectionnumber].positiveMarks);
		setNegativeMarks(res.data[0].Section[selectedSectionnumber].negativeMarks);
		setdata(res.data[0].Section);
		setcurrentIndex(0);
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
								respReview.data.section[index].question[indexs].usersAnswer,
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

		setAllData(res.data);

		return null;
	}, [selectedSectionnumber]);

	useEffect(() => {
		let ans = currentQuesStatus.answered.filter((res) => {
			if (res == 1) {
				return res;
			}
		});
		let notAns = currentQuesStatus.notAnswered.filter((res) => {
			if (res == 1) {
				return res;
			}
		});

		let notVisit = currentQuesStatus.notVisited.filter((res) => {
			if (res == 1) {
				return res;
			}
		});

		let markForRev = currentQuesStatus.markForReview.filter((res) => {
			if (res == 1) {
				return res;
			}
		});

		let bothAnsMark = currentQuesStatus.bothAnsReview.filter((res) => {
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

	const submitTest = async () => {
		let params = {
			userId: localStorage.getItem("user"),
			testId: localStorage.getItem("testid"),
			packageId: localStorage.getItem("pkgid"),
			section: [...allSectionData],
		};
		const res = await axios.post(
			process.env.REACT_APP_API + "/submitTest",
			params,
			options
		);

		navigate("/myCourses");
	};

	const SubmitExam = () => {
		return (
			<main className="absolute w-full min-h-screen z-10 bg-gray-50 text-gray-900 font-sans overflow-x-hidden">
				<h2 className="my-10 text-lg font-semibold">Exam Summary</h2>
				<div className="relative px-4 md:flex">
					<div>
						<table className="min-w-[98vw]">
							<tbody>
								<tr className="bg-blue-300">
									<th className="text-left p-2">section Name</th>
									<th className="text-left p-2">No of questions</th>
									<th className="text-left p-2">Answered</th>
									<th className="text-left p-2">Not Answered</th>
									<th className="text-left p-2">Marked for review</th>
									<th className="text-left p-2">
										Answered & Marked for Review (will be considered for
										evaluation)
									</th>
									<th className="text-left p-2">Not visited</th>
								</tr>
								{allSectionData.map((res, i) => (
									<tr className="bg-gray-200">
										<td className="text-left p-2">{res.sectionName}</td>
										<td className="text-left p-2">{res.question.length}</td>
										<td className="text-left p-2">{res.answered}</td>
										<td className="text-left p-2">{res.notAnswered}</td>
										<td className="text-left p-2">{res.markedReview}</td>
										<td className="text-left p-2">{res.bothAnsReview}</td>
										<td className="text-left p-2">{res.notVisited}</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
				</div>
				<footer className="absolute border-t-2 border-gray-400 flex w-full justify-center self-center bottom-[2%]">
					<div className="">
						{count <= 0 ? (
							""
						) : (
							<>
								<p>
									Are you sure to submit this Group? Click 'Yes' to proceed;
									Click 'No' to go back.
									<br></br>
									Dear Candidate, Once the Group is submitted, you cannot edit
									your responses.
								</p>
								<button
									onClick={() => submitTest()}
									className="bg-[#38aae9] text-white hover:border-gray-700 hover:border-2 border-2 rounded-sm px-6 py-2 mr-10"
								>
									Yes
								</button>
								<button
									onClick={() => setFinishExam(false)}
									className="bg-[#38aae9] text-white hover:border-gray-700 hover:border-2 border-2 rounded-sm px-6 py-2 mr-10"
								>
									No
								</button>
							</>
						)}
					</div>
				</footer>
			</main>
		);
	};

	const setModalIsOpenToFalse = () => {
		setModalIsOpen(false);
	};

	const setModalIsOpenToTrue = () => {
		setModalIsOpen(true);
	};

	const setModalInsOpenToFalse = () => {
		setModalInsOpen(false);
	};

	const setModalInsOpenToTrue = () => {
		setModalInsOpen(true);
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

	return (
		<div className="bg-gray-50 min-h-screen h-full">
			{FinishExam ? <SubmitExam /> : null}
			{Alert ? (
				<main className="absolute w-full z-10 bg-[#0000002f] text-gray-900 font-sans overflow-x-hidden">
					<div className="relative px-4 min-h-screen md:flex md:items-center md:justify-center">
						<div className="bg-black opacity-25 w-full h-full absolute z-10 inset-0"></div>
						<div className="bg-white rounded-lg md:max-w-md md:mx-auto p-4 fixed inset-x-0 bottom-0 z-50 mb-4 mx-4 md:relative">
							<div className="md:flex items-center">
								{/* <div className="rounded-full border border-gray-300 flex items-center justify-center w-16 h-16 flex-shrink-0 mx-auto">
                                <i className="bx bx-error text-3xl"></i>
                            </div> */}
								<div className="mt-4 md:mt-0 md:ml-6 text-center md:text-left">
									<p className="font-bold">Are You Sure </p>
									<p className="text-sm text-gray-700 mt-1">
										once You leave the section, This action cannot be undone.
									</p>
								</div>
							</div>
							<div className="text-center md:text-right mt-4 md:flex md:justify-end">
								<button
									onClickCapture={() => {
										setAlertbox(false);
										setselectedcategorynumber(selectedSectionnumber + 1);
									}}
									className="block w-full md:inline-block md:w-auto px-4 py-3 md:py-2 bg-red-200 text-red-700 rounded-lg font-semibold text-sm md:ml-2 md:order-2"
								>
									submit
								</button>
								<button
									onClickCapture={() => {
										setAlertbox(false);
									}}
									className="block w-full md:inline-block md:w-auto px-4 py-3 md:py-2 bg-gray-200 rounded-lg font-semibold text-sm mt-4
                                md:mt-0 md:order-1"
								>
									Cancel
								</button>
							</div>
						</div>
					</div>
				</main>
			) : null}
			<nav className="sm:flex block justify-between bg-slate-600 p-2">
				<div className="text-yellow-400 font-semibold">{SectionName}</div>
				<div className="text-yellow-400 font-semibold">
					Test Name:- {getTestName}
				</div>
				<div className="sm:flex block items-center">
					<button
						onClick={togglePopup}
						className="flex items-center text-gray-50 mr-6 mb-4 mt-4 sm:mt-4"
					>
						Calculator
					</button>

					{/* <div className='calculator-demo' style={style}>
                    <h1>Calculator</h1>
                    <Calculator
                        onNewInput={handleInput}
                        onResultChange={onResultChange}/>
                    </div> */}
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
				</div>
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

				<Modal isOpen={modalInsOpen} style={customStyles} ariaHideApp={false}>
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
				</Modal>
			</nav>

			{isOpen ? (
				<div className="popup-box">
					<div className="box">
						<span className="close-icon" onClick={togglePopup}>
							x
						</span>
						<Calculator />
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
					<div className="flex justify-between border-y-2 border-gray-300 pl-2 py-2 mt-2">
						<p className="flex font-bold">Section</p>
						<p className="flex font-bold">
							Time left:
							<Counter
								// getLeft={getLeft}
								setCount={setCount}
								key={count + "time"}
								time={count}
								changeFinish={changeFinish}
							/>
						</p>
					</div>
					<div className="flex justify-between items-center border-b-2 pl-2 w-full">
						<p className="font-bold text-md sm:text-lg py-2">
							Q. {currentQuesIndex + 1}
						</p>
						<p className="py-2 font-semibold text-sm sm:text-lg mr-2">
							Marks for Correct Answer:{" "}
							{data[selectedSectionnumber]?.positiveMarks} | Negative Marks:{" "}
							<span className="text-red-500">
								{data[selectedSectionnumber]?.negativeMarks}
							</span>
						</p>
					</div>

					{Question.map((res, i) => {
						return currentQuesIndex == i ? (
							<div
								key={i}
								className="text-left justify-between overflow-y-scroll max-h-[500px] pl-2 w-full"
								style={{ height: "100%" }}
							>
								{res.questionType == "paragraph" ? (
									<>
										<div className="prow w-full" style={{ height: "100%" }}>
											<div
												className="pcolumn"
												style={{ borderRight: "1px solid grey" }}
											>
												<p
													dangerouslySetInnerHTML={{
														__html: res.paragraph,
													}}
												></p>
											</div>
											<div className="pcolumn">
												<>
													<p
														className="p-4"
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
																res?.questionoption.map((ans, iAns) => {
																	let newObj = { ...currentQuesStatus };
																	return (
																		<div
																			key={iAns}
																			className="flex items-center space-x-3 cursor-pointer px-4 py-2 rounded-sm"
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
																					__html: ans?.option,
																				}}
																				className="text-gray-900 group-hover:text-white text-sm font-semibold text-left"
																			></h3>
																			{reviewQues[i].answerStatus == "C" &&
																			iAns == getRadio ? (
																				<i className={`mr-1 fa fa-check`}> </i>
																			) : reviewQues[i].answerStatus == "W" &&
																			  iAns == getRadio ? (
																				<i className={`mr-1 fa fa-times`}> </i>
																			) : (
																				""
																			)}
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
													<div
														style={{ marginTop: "10px", minHeight: "200px" }}
													>
														<button
															className="flex items-center border-2  p-1 pl-4 pr-4 disabled:cursor-not-allowed rounded-sm font-semibold bg-blue-400 text-gray-50"
															name="vieSec"
															onClick={() => getSolution(res)}
														>
															{" "}
															View Solution{" "}
														</button>
														{getViewSection ? (
															getViewSolution &&
															typeof getViewSolution == "object" ? (
																<div
																	dangerouslySetInnerHTML={{
																		__html: getViewSolution.q,
																	}}
																></div>
															) : (
																<div
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
														res?.questionoption.map((ans, iAns) => {
															let newObj = { ...currentQuesStatus };
															return (
																<div
																	key={iAns}
																	className="flex items-center space-x-3 cursor-pointer px-4 py-2 rounded-sm"
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
																			__html: ans?.option,
																		}}
																		className="text-gray-900 group-hover:text-white text-sm font-semibold text-left"
																	></h3>
																	{reviewQues[i].answerStatus == "C" &&
																	iAns == getRadio ? (
																		<i className={`mr-1 fa fa-check`}> </i>
																	) : reviewQues[i].answerStatus == "W" &&
																	  iAns == getRadio ? (
																		<i className={`mr-1 fa fa-times`}> </i>
																	) : (
																		""
																	)}
																</div>
															);
														})}
												</>
											)}

											{/* <div>
                                    <span style={{position: 'absolute'}}>Correct Answer :- </span><h3 style={{marginLeft: "12%", marginTop: "2px"}} dangerouslySetInnerHTML={{__html:((res.correctoption || res.correctoption == "0")  && res.questionoption[res.correctoption - 1]?.option) || ''}} className="text-gray-900 group-hover:text-white text-sm font-semibold text-left">

                                            </h3>
                                            </div> */}
											<div style={{ marginTop: "10px", minHeight: "200px" }}>
												<button
													className="flex items-center border-2  p-1 pl-4 pr-4 disabled:cursor-not-allowed rounded-sm font-semibold bg-blue-400 text-gray-50"
													name="vieSec"
													onClick={() => getSolution(res)}
												>
													{" "}
													View Solution{" "}
												</button>
												{getViewSection ? (
													getViewSolution &&
													typeof getViewSolution == "object" ? (
														<div
															dangerouslySetInnerHTML={{
																__html: getViewSolution.q,
															}}
														></div>
													) : (
														<div
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
				<div className="border-gray-800 sm:border-l-2 border-t-2 sm:border-t-0 h-full">
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
				</div>
				<footer className="fixed w-full border-t-2 border-gray-400 p-2 bg-gray-50 flex justify-between bottom-0">
					<div></div>
					<div className="flex justify-around items-center w-[37%]">
						<button
							onClick={() => {
								setViewSection(false);
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

								// let newArry = [...getQuesAns];
								// let newObj = { ...currentQuesStatus };
								// let qu = [...Question];

								// console.log("bbbbbbbb", newArry, newObj, '' == 0);

								// newObj['markForReview'][currentQuesIndex] = 0;
								// newObj['bothAnsReview'][currentQuesIndex] = 0;
								// if (newArry[currentQuesIndex]['quesAns'] != -1 && newObj['markForReview'][currentQuesIndex] == 0) {

								//     newObj['answered'][currentQuesIndex] = 1;
								//     newObj['notAnswered'][currentQuesIndex] = 0;
								//     newObj['notVisited'][currentQuesIndex] = 0;
								//     newArry[currentQuesIndex]['state'] = 1;
								//     qu[currentQuesIndex]['state'] = 1;

								// } else if (newArry[currentQuesIndex]['quesAns'] != -1 && newObj['markForReview'][currentQuesIndex] == 1) {
								//     newObj['answered'][currentQuesIndex] = 1;
								//     newObj['notAnswered'][currentQuesIndex] = 0;
								//     newObj['notVisited'][currentQuesIndex] = 0;
								//     newArry[currentQuesIndex]['state'] = 5;
								//     qu[currentQuesIndex]['state'] = 5;
								// } else if (newArry[currentQuesIndex]['quesAns'] == -1 && newObj['markForReview'][currentQuesIndex] == 1) {
								//     newArry[currentQuesIndex]['state'] = 4;
								//     qu[currentQuesIndex]['state'] = 4;
								// } else if (newArry[currentQuesIndex]['quesAns'] == -1) {
								//     newArry[currentQuesIndex]['state'] = 2;
								//     qu[currentQuesIndex]['state'] = 2;
								// }
								// newArry[currentQuesIndex]['isClicked'] = true;
								// setQuesAns(newArry);
								// setCurrentQuesStatus(newObj);
							}}
							className="bg-[#0c7cd5] text-white hover:border-gray-700 hover:border-2 border-2 rounded-sm px-4 py-2"
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
