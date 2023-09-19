import { Modal, ScrollArea } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import axios from "axios";
import Cookies from "js-cookie";
import katex from "katex";
import "katex/dist/katex.min.css";
import moment from "moment";
import React, { useContext, useEffect, useRef, useState } from "react";
import { FaEquals, FaFile, FaInfo, FaTimes } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

import { userInfo } from "../api/checkAuth";
import Answered from "../assets/Answered.png";
import NewCandidateImage from "../assets/NewCandidateImage.jpg";
import copyCat from "../assets/copyCat.pdf";
import fullLength from "../assets/fullLength.pdf";
import notans from "../assets/notans.png";
import pms from "../assets/pms.pdf";
import hideNavContext from "../context/AllprojectsContext";
import Calculator from "./Calculator/Calculator";
import QuestionInput from "./Calculator/QuestionInput";

window.katex = katex;

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

const style = {
	height: "24rem",
	width: "15rem",
};

function Counter(props) {
	const remainingTime = JSON.parse(localStorage.getItem("time"));
	const testid = localStorage.getItem("testid");
	const [count, setCount] = useState(
		remainingTime?.testid === testid ? remainingTime?.time : props.time
	);

	useInterval(() => {
		// Your custom logic here
		if (count > 0 && props.getLeft == 0) {
			setCount(count - 1);
			localStorage.setItem(
				"time",
				JSON.stringify({
					testid: localStorage.getItem("testid"),
					time: count - 1,
				})
			);
			props.setCount(count - 1);
		}
	}, 1000);
	const duration = moment.duration(count, "seconds");

	const h = duration.hours().toString().padStart(2, "0");
	const m = duration.minutes().toString().padStart(2, "0");
	const s = duration.seconds().toString().padStart(2, "0");

	if (s <= 0 && m <= 0 && h <= 0) {
		// props.changeFinish();

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
const Examination = React.memo(() => {
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
	const [count, setCount] = useState(-1);
	const [Alert, setAlertbox] = useState(false);
	const [SectionName, setSectionName] = useState();
	const [sectionId, setSectionId] = useState();
	const [negativeMarks, setNegativeMarks] = useState();
	const [positiveMarks, setPositiveMarks] = useState();
	const [questionAttempt, setQuestionAttempt] = useState();
	const [selectedAns, setselectedAns] = useState(1000);
	const [selectedSectionnumber, setselectedcategorynumber] = useState(0);
	const [data, setdata] = useState([]);
	const [FinishExam, setFinishExam] = useState(false);
	const [allData, setAllData] = useState([]);

	const [markedReview, setmarkedReview] = useState(0);
	const [bothAnsReview, setBothAnsReview] = useState(0);
	const [answered, setAnswered] = useState(0);
	const [attemptOrder, setAttemptOrder] = useState(0);

	const lastQuesAttempt = JSON.parse(localStorage.getItem("lastQuesAttempt"));
	const testid = localStorage.getItem("testid");
	const [currentQuesIndex, setCurrentQuesIndex] = useState(
		lastQuesAttempt?.testid === testid
			? lastQuesAttempt.currentQuesIndex < 9
				? lastQuesAttempt.currentQuesIndex + 1
				: lastQuesAttempt.currentQuesIndex
			: 0
	);
	const quesAttempted = JSON.parse(localStorage.getItem("quesAttempted"));
	// const quesAttempted = JSON.parse(Cookies.get("quesAttempted") || "{}");
	const [currentQuesStatus, setCurrentQuesStatus] = useState({
		answered:
			quesAttempted?.testid === testid
				? quesAttempted?.objArray["answered"]
				: [],
		notAnswered:
			quesAttempted?.testid === testid
				? quesAttempted?.objArray["notAnswered"]
				: [],
		notVisited:
			quesAttempted?.testid === testid
				? quesAttempted?.objArray["notVisited"]
				: [],
		markForReview:
			quesAttempted?.testid === testid
				? quesAttempted?.objArray["markForReview"]
				: [],
		bothAnsReview:
			quesAttempted?.testid === testid
				? quesAttempted?.objArray["bothAnsReview"]
				: [],
		timeTaken:
			quesAttempted?.testid === testid
				? quesAttempted?.objArray["timeTaken"]
				: [],
		attemptOrder:
			quesAttempted?.testid === testid
				? quesAttempted?.objArray["attemptOrder"]
				: [],
	});

	const [timeSpent, setTimeSpent] = useState(0);
	const [notAnswered, setNotAnswer] = useState(0);
	const [notVisited, setNotVisited] = useState(0);
	const savedSession = JSON.parse(localStorage.getItem("savedSession"));
	// const savedSession = JSON.parse(Cookies.get("savedSession") || "{}");
	const [getQuesAns, setQuesAns] = useState(
		// savedSession?.testid === testid ? savedSession?.getQuesAns : []
		[]
	);
	const [getRadio, setRadio] = useState(
		// savedSession?.testid === testid
		// 	? savedSession?.getQuesAns[currentQuesIndex]?.quesAns
		// 	: -1
		-1
	);
	const [modalIsOpen, setModalIsOpen] = useState(false);
	const [modalInsOpen, setModalInsOpen] = useState(false);
	const [modalQuesAlertOpen, setModalQuesAlertOpen] = useState(false);
	const [isOpen, setIsOpen] = useState(false);

	const [allSectionData, setAllSectionData] = useState([]);
	const [getAttemptId, setAttemptId] = useState("");
	const [leaveAlert, setLeaveAlert] = useState(false);
	const [getAns, setAns] = useState("");
	const [getMode, setMode] = useState("nonReview");
	const [getTotalSection, setTotalSection] = useState(1);
	const [getLeft, setLeft] = useState(0);
	const [getFinalSec, setFinalSec] = useState([]);
	const [getExamLevel, setExamLevel] = useState(1);
	const [getTestName, setTestName] = useState("");
	const [groupedQuestions, setGroupedQuestions] = useState({});

	const [
		questionPaperOpened,
		{ open: questionPaperOpen, close: questionPaperClose },
	] = useDisclosure(false);
	const [
		instructionsOpened,
		{ open: instructionsOpen, close: instructionsClose },
	] = useDisclosure(false);

	// useUnload(e => {
	//     if(leaveAlert)
	//     e.preventDefault();
	//     submitTest(2)
	//     e.returnValue = '';
	// });

	useEffect(() => {
		if (count == 0) {
			_submitPreTest();
			if (selectedSectionnumber < getTotalSection - 1) {
				setselectedcategorynumber(selectedSectionnumber + 1);
			}
			if (selectedSectionnumber == getTotalSection - 1) {
				// submitTest(1);
				setFinishExam(true);
			}
		}
	}, [count]);

	useEffect(async () => {
		if (selectedSectionnumber > 0) {
			setQuestion([]);
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
					subjectId: data.subjectId,
					chapterChapterId: data.chapterChapterId,
					topicId: data.topicId,
					optionType: data.optionType,
				};
				question.push(qu);
			});

			let section = [];

			let newJson = {
				totalMarks: questionAttempt
					? questionAttempt * positiveMarks
					: Question.length * positiveMarks || 0,
				correctAnswers,
				wrongAnswers,
				unanswered: Question.length - answered,
				totalQuestions: Question.length,
				sectionId: sectionId,
				sectionName: SectionName,
				negativeMarks: negativeMarks,
				positiveMarks: positiveMarks,
				questionAttempt: questionAttempt,
				answered,
				notAnswered,
				notVisited,
				markedReview,
				bothAnsReview,
				question,
			};

			section.push(newJson);

			let da = allSectionData.filter((d, i) => {
				if (d.sectionId != sectionId) {
					return d;
				}
			});

			let newData = [...da, ...section];
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
			setQuesAns(
				// savedSession?.testid === testid ? savedSession?.getQuesAns : []
				[]
			);
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
				timeTaken: [],
				attemptOrder: [],
			};
			console.log("newState", newState);
			setCurrentQuesStatus(newState);
		}

		// const res = await fetch(`https://opentdb.com/api.php?amount=30&category=${categorynumber[ selectedSectionnumber ].number}&type=multiple`)
		const isPackageAccess = await axios.get(
			process.env.REACT_APP_API +
				"/getPackagesInfoByUserId" +
				"/" +
				localStorage.getItem("pkgid") +
				"/" +
				localStorage.getItem("user")
		);
		if (isPackageAccess.data.data) {
			const res = await axios.get(
				process.env.REACT_APP_API +
					"/gettest/" +
					localStorage.getItem("testid"),
				options
			);
			console.log(
				"🚀 ~ file: Examination.js ~ line 269 ~ useEffect ~ res",
				res.data
			);
			setCount(res.data[0].Section[selectedSectionnumber].SectionTime * 60);
			setTimeSpent(res.data[0].Section[selectedSectionnumber].SectionTime * 60);
			//  setCount(20)
			setPositiveMarks(
				res.data[0].Section[selectedSectionnumber].positiveMarks
			);
			setNegativeMarks(
				res.data[0].Section[selectedSectionnumber].negativeMarks
			);
			//setQuestionAttempt(10);
			setQuestionAttempt(
				res.data[0].Section[selectedSectionnumber].questionAttempt
			);
			setdata(res.data[0].Section);
			setcurrentIndex(0);
			setAns(getQuesAns[currentQuesIndex]?.quesAns || "");
			setExamLevel(res.data[0].examLevel);
			setTestName(res.data[0].TestTitle);
			// const quesAttempted = JSON.parse(localStorage.getItem("quesAttempted"));
			let objArray = {
				notAnswered:
					quesAttempted?.testid === testid
						? quesAttempted?.objArray["notAnswered"]
						: [],
				notVisited:
					quesAttempted?.testid === testid
						? quesAttempted?.objArray["notVisited"]
						: [],
				answered:
					quesAttempted?.testid === testid
						? quesAttempted?.objArray["answered"]
						: [],
				markForReview:
					quesAttempted?.testid === testid
						? quesAttempted?.objArray["markForReview"]
						: [],
				bothAnsReview:
					quesAttempted?.testid === testid
						? quesAttempted?.objArray["bothAnsReview"]
						: [],
				timeTaken:
					quesAttempted?.testid === testid
						? quesAttempted?.objArray["timeTaken"]
						: [],
				attemptOrder:
					quesAttempted?.testid === testid
						? quesAttempted?.objArray["attemptOrder"]
						: [],
			};
			console.log("objArray", objArray);
			let quesAnsArray = [];
			setTotalSection(res.data[0].Section.length);
			res.data[0].Section[0] &&
				res.data[0].Section.map((res, index) => {
					if (index == selectedSectionnumber) {
						setSectionName(res.sectionName);
						setSectionId(res.sectionId);

						let newQues = res.QuestionList.map((ques, idx) => {
							objArray.notAnswered[idx] =
								quesAttempted?.testid === testid
									? quesAttempted?.objArray?.notAnswered[idx]
									: 1;
							objArray.notVisited[idx] =
								quesAttempted?.testid === testid
									? quesAttempted?.objArray?.notVisited[idx]
									: 1;
							objArray.answered[idx] =
								quesAttempted?.testid === testid
									? quesAttempted?.objArray?.answered[idx]
									: 0;
							objArray.markForReview[idx] =
								quesAttempted?.testid === testid
									? quesAttempted?.objArray?.markForReview[idx]
									: 0;
							objArray.bothAnsReview[idx] =
								quesAttempted?.testid === testid
									? quesAttempted?.objArray?.bothAnsReview[idx]
									: 0;
							objArray.timeTaken[idx] =
								quesAttempted?.testid === testid
									? quesAttempted?.objArray?.timeTaken[idx]
									: 0;
							objArray.attemptOrder[idx] =
								quesAttempted?.testid === testid
									? quesAttempted?.objArray?.attemptOrder[idx]
									: -1;
							let everyQues = {
								isClicked: false,
								// savedSession?.testid === testid
								// 	? savedSession?.getQuesAns[idx]?.isClicked
								// 	: false,
								quesId: ques.questionId,
								quesAns: -1,
								// savedSession?.testid === testid
								// 	? savedSession?.getQuesAns[idx]?.quesAns
								// 	: -1,
								state: 3,
								// savedSession?.testid === testid
								// 	? savedSession?.getQuesAns[idx]?.state
								// 	: 3,
								ansStatus: "",
								// savedSession?.testid === testid
								// 	? savedSession?.getQuesAns[idx]?.ansStatus
								// 	: "",
								optionType: ques.optionType,
								subjectId: ques.subjectId,
								chapterChapterId: ques.chapterChapterId,
								topicId: ques.topicId,
								optionType: ques.optionType,
								timeTaken:
									quesAttempted?.testid === testid
										? quesAttempted?.objArray["timeTaken"][idx]
										: 0,
								attemptOrder:
									quesAttempted?.testid === testid
										? quesAttempted?.objArray["attemptOrder"][idx]
										: -1,
							};
							quesAnsArray.push(everyQues);
							ques["state"] =
								savedSession?.testid === testid
									? savedSession?.getQuesAns[idx]?.state
									: 3;
							return ques;
						});

						res.QuestionList && setQuestion(newQues);
						const groupedQuestions = {};
						newQues.forEach((ques, i) => {
							if (ques.questionType === "paragraph") {
								if (!groupedQuestions[ques.paragraph]) {
									groupedQuestions[ques.paragraph] = [];
								}
								groupedQuestions[ques.paragraph].push({
									index: i,
									question: ques.question,
								});
							} else {
								groupedQuestions[i] = {
									questionType: ques.questionType,
									question: ques.question,
								};
							}
						});
						quesAnsArray[0]["state"] = 2;
						quesAnsArray[0]["isClicked"] = true;
						setGroupedQuestions(groupedQuestions);
						setCurrentQuesStatus(objArray);
						setQuesAns(quesAnsArray);
					}
				});

			setAllData(res.data);
		} else {
			console.log("Exam not accessible!", isPackageAccess);
		}

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

		setAnswered(ans.length);
		setNotAnswer(notAns.length);
		if (notVisit.length - 1 >= 0) {
			setNotVisited(notVisit.length - 1);
		}

		setmarkedReview(markForRev.length);
		setBothAnsReview(bothAnsMark.length);
		console.log(
			"🚀 ~ Examination.js ~ line 377 ~ currentQuesStatus",
			currentQuesStatus
		);
		const newObj = {
			answered: currentQuesStatus.answered,
		};
	}, [currentQuesStatus]);

	useEffect(() => {
		let qu = [...Question];
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

	const SelectAnswer = (index) => {
		for (let i = 0; i < Question.length; i++) {
			if (index == i) {
				Question[i].isSelected = true;
				return;
			}
		}
	};

	function notViewSection(data, i) {
		let question = [];
		let correctAnswers = 0;
		let wrongAnswers = 0;
		let quesAnsArrayNew = [];
		data.Section[i].QuestionList.map((ques, ind) => {
			let everyQues = {
				isClicked: false,
				quesId: ques.questionId,
				quesAns: -1,
				state: 3,
				ansStatus: "",
				optionType: ques.optionType,
				subjectId: ques.subjectId,
				chapterChapterId: ques.chapterChapterId,
				topicId: ques.topicId,
				optionType: ques.optionType,
			};
			quesAnsArrayNew.push(everyQues);
		});

		quesAnsArrayNew.map((data, index) => {
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
				subjectId: data.subjectId,
				chapterChapterId: data.chapterChapterId,
				topicId: data.topicId,
				optionType: data.optionType,
			};
			question.push(qu);
		});

		let section = [];

		let newJson = {
			totalMarks: data.Section[i].questionAttempt
				? data.Section[i].questionAttempt * positiveMarks
				: data.Section[i].QuestionList.length * data.Section[i].positiveMarks ||
				  0,
			correctAnswers,
			wrongAnswers,
			unanswered: data.Section[i].QuestionList.length,
			totalQuestions: data.Section[i].QuestionList.length,
			sectionId: data.Section[i].sectionId,
			sectionName: data.Section[i].sectionName,
			negativeMarks: data.Section[i].negativeMarks,
			positiveMarks: data.Section[i].positiveMarks,
			questionAttempt: data.Section[i].questionAttempt,
			answered: 0,
			notAnswered: data.Section[i].QuestionList.length,
			notVisited: data.Section[i].QuestionList.length,
			markedReview: 0,
			bothAnsReview: 0,
			question,
		};

		section.push(newJson);

		let da = section.filter((d, i) => {
			if (d.sectionId != data.Section[i].sectionId) {
				return d;
			}
		});

		return da;

		// let newData = [...da, ...section];
		//setAllSectionData(newData);
	}

	const _submitPreTest = () => {
		let question = [];
		let correctAnswers = 0;
		let wrongAnswers = 0;
		console.log(
			"🚀 ~ file: Examination.js ~ line 501 ~ _submitPreTest ~ Question",
			getQuesAns
		);
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
				subjectId: data.subjectId,
				chapterChapterId: data.chapterChapterId,
				topicId: data.topicId,
				optionType: data.optionType,
				timeTaken: data.timeTaken,
				attemptOrder: data.attemptOrder,
				markForReview: currentQuesStatus?.markForReview[index],
				bothAnsReview: currentQuesStatus?.bothAnsReview[index],
				notVisited: currentQuesStatus?.notVisited[index],
			};
			question.push(qu);
		});

		let section = [];

		let newJson = {
			totalMarks: questionAttempt
				? questionAttempt * positiveMarks
				: Question.length * positiveMarks || 0,
			correctAnswers,
			wrongAnswers,
			unanswered: Question.length - answered,
			totalQuestions: Question.length,
			sectionId: sectionId,
			sectionName: SectionName,
			negativeMarks: negativeMarks,
			positiveMarks: positiveMarks,
			questionAttempt: questionAttempt,
			answered,
			notAnswered,
			notVisited,
			markedReview,
			bothAnsReview,
			question,
		};

		let finalSec = [];
		for (let i = selectedSectionnumber + 1; i < getTotalSection; i++) {
			let data = allData && allData[0];

			let sec = notViewSection(data, i);
			finalSec = [...finalSec, ...sec];
		}

		setFinalSec(finalSec);

		let da = allSectionData.filter((d, i) => {
			if (d.sectionId != sectionId) {
				return d;
			}
		});

		// da = da.filter((d, i)=>{
		//     finalSec.map((r,v)=>{
		//         if(r.sectionId != d.sectionId){
		//             return d;
		//         }
		//     });
		// });

		section.push(newJson);
		console.log("🚀 ~ Examination.js ~ line 556 ~ da", da, section, finalSec);
		let newData = [...da, ...section];
		if (count == 0 && selectedSectionnumber == getTotalSection - 1) {
			submitTest(1, section);
			setFinishExam(true);
		}
		setAllSectionData(newData);
	};

	const submitTest = async (full_attempt, sectionData = []) => {
		let netScore = 0;
		console.log(
			"🚀 ~ Examination.js ~ line 568 ~ allSectionData",
			allSectionData,
			sectionData
		);
		let sectData = [];
		if (sectionData.length) {
			if (allSectionData.length) {
				sectData = [...allSectionData, ...sectionData];
			} else {
				sectData = sectionData;
			}
		} else {
			sectData = [...allSectionData, ...getFinalSec];
		}

		let sec = sectData.map((d, i) => {
			let calWrong = d.wrongAnswers;
			d.question.map((n, j) => {
				if (n.optionType == "input" && n.answerStatus == "W") {
					calWrong = calWrong - 1;
				}
			});

			d["score"] =
				d.correctAnswers * d.positiveMarks -
				calWrong * Math.abs(d.negativeMarks);
			netScore =
				netScore +
				d.correctAnswers * d.positiveMarks -
				calWrong * Math.abs(d.negativeMarks);
			return d;
		});

		console.log(
			"🚀 ~ Examination.js ~ line 602",
			allSectionData,
			sec,
			sectionData
		);
		let params = {
			userId: localStorage.getItem("user"),
			testId: localStorage.getItem("testid"),
			packageId: localStorage.getItem("pkgid"),
			full_attempt: full_attempt,
			section: sec,
			attempt_id: getAttemptId || undefined,
			netScore,
		};

		const res = await axios.post(
			process.env.REACT_APP_API + "/submitTest",
			params,
			options
		);
		console.log("🚀 ~ Examination.js ~ line 622 ~ submit", res.data);
		// localStorage.removeItem("testid");
		localStorage.removeItem("lastQuesAttempt");
		localStorage.removeItem("currentQuesIndex");
		localStorage.removeItem("quesAttempted");
		localStorage.removeItem("savedSession");
		if (full_attempt == 1) {
			// window.close();
		} else {
			setAttemptId(res.data?.attempt_id || "");
		}
	};

	const redirectTo = () => {
		// navigate("/courseDetails/myCourse");
		navigate("/exam-finished");
		// <Link to="/exam-finished" target="_blank" />;
	};

	useEffect(() => {
		const handleBeforeUnload = (event) => {
			event.preventDefault();
			event.returnValue =
				"If you leave this page, then the page will be submitted. Are you sure you want to leave?"; // Some browsers require a return value to be set.
		};

		window.addEventListener("beforeunload", handleBeforeUnload);

		return () => {
			window.removeEventListener("beforeunload", handleBeforeUnload);
		};
	}, []);

	const SubmitExam = () => {
		return (
			<main className="absolute w-full h-full z-10 bg-gray-50 text-gray-900 font-sans">
				<h2 className="my-10 text-lg font-semibold">Exam Summary</h2>
				<div className="relative px-4 md:flex">
					<div className="relative overflow-x-auto">
						<table className="table-auto">
							<tbody>
								<tr className="bg-blue-300">
									<th className="text-left p-2 text-xs sm:text-base">
										Section
									</th>
									<th className="text-left p-2 text-xs sm:text-base">
										No of Ques
									</th>
									<th className="text-left p-2 text-xs sm:text-base">
										No of Ques to answer
									</th>
									<th className="text-left p-2 text-xs sm:text-base">
										Answered
									</th>
									<th className="text-left p-2 text-xs sm:text-base">
										Not Answered
									</th>
									<th className="text-left p-2 text-xs sm:text-base">
										Marked for review
									</th>
									<th className="text-left p-2 text-xs sm:text-base">
										Answered & Marked for Review (will be considered for
										evaluation)
									</th>
									<th className="text-left p-2 text-xs sm:text-base">
										Not visited
									</th>
								</tr>
								{allSectionData.map((res, i) => (
									<tr key={i} className="bg-gray-200">
										<td className="text-left p-2 text-xs sm:text-base">
											{res.sectionName}
										</td>
										<td className="text-left p-2 text-xs sm:text-base">
											{res.question.length}
										</td>
										<td className="text-left p-2 text-xs sm:text-base">
											{res.questionAttempt
												? res.questionAttempt
												: res.question.length}
										</td>
										<td className="text-left p-2 text-xs sm:text-base">
											{res.answered}
										</td>
										<td className="text-left p-2 text-xs sm:text-base">
											{res.notAnswered}
										</td>
										<td className="text-left p-2 text-xs sm:text-base">
											{res.markedReview}
										</td>
										<td className="text-left p-2 text-xs sm:text-base">
											{res.bothAnsReview}
										</td>
										<td className="text-left p-2 text-xs sm:text-base">
											{res.notVisited}
										</td>
									</tr>
								))}
								{getFinalSec.map((res, i) => (
									<tr key={i} className="bg-gray-200">
										<td className="text-left p-2 text-xs sm:text-base">
											{res.sectionName}
										</td>
										<td className="text-left p-2 text-xs sm:text-base">
											{res.question.length}
										</td>
										<td className="text-left p-2 text-xs sm:text-base">
											{res.answered}
										</td>
										<td className="text-left p-2 text-xs sm:text-base">
											{res.notAnswered}
										</td>
										<td className="text-left p-2 text-xs sm:text-base">
											{res.markedReview}
										</td>
										<td className="text-left p-2 text-xs sm:text-base">
											{res.bothAnsReview}
										</td>
										<td className="text-left p-2 text-xs sm:text-base">
											{res.notVisited}
										</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
				</div>
				<footer className="absolute border-t-2 border-gray-400 flex w-full justify-center self-center bottom-[2%]">
					<div className="">
						{count <= 0 ? (
							<>
								<p>Exam has been finished and submitted</p>
								<button
									onClick={() => redirectTo()}
									className="bg-[#38aae9] text-white hover:border-gray-700 hover:border-2 border-2 rounded-sm px-6 py-2 mr-10"
								>
									Ok
								</button>
							</>
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
									onClick={() => {
										submitTest(1);
										redirectTo();
									}}
									className="bg-[#38aae9] text-white hover:border-gray-700 hover:border-2 border-2 rounded-sm px-6 py-2 mr-10"
								>
									Yes
								</button>

								<button
									onClick={() => {
										setLeft(0);
										setFinishExam(false);
									}}
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

	const setModalQuestAttemptAlert = () => {
		setModalQuesAlertOpen(false);
	};

	const setModalQuestAttemptAlertTrue = () => {
		setModalQuesAlertOpen(true);
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

	return (
		<div className="bg-gray-50 h-full overflow-hidden">
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
			{questionAttempt && Question.length > questionAttempt ? (
				<div className="importantNote">
					<b>
						You cannot attempt more than {questionAttempt} questions in this
						section.
					</b>
				</div>
			) : (
				""
			)}

			<nav className="sm:flex block sm:justify-between bg-slate-600 p-2">
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
						onClick={questionPaperOpen}
						className="flex items-center text-gray-50 mr-6 mb-4 sm:mt-4"
					>
						<div className="bg-green-400 p-2 rounded-full mr-2">
							<FaFile className=" text-white" />
						</div>
						Question paper
					</button>
					<button
						onClick={instructionsOpen}
						className="flex items-center text-gray-50 mb-4 sm:mt-4"
					>
						<div className="bg-blue-400 p-2 rounded-full mr-2">
							<FaInfo className="text-white" />
						</div>
						View Instruction
					</button>
				</div>
				<Modal
					opened={questionPaperOpened}
					onClose={questionPaperClose}
					size="80%"
				>
					<p className="text-2xl font-semibold mb-5 text-red-500">
						Note that the timer is running. Kindly close the question paper to
						attend the questions.
					</p>
					<p className="text-2xl font-bold text-gray-700 mb-5">
						Question Paper
					</p>
					<div>
						{Question.map((ques, i) => (
							<div key={i} className="flex my-5">
								<span className="font-bold text-gray-700 mr-4">Q{i + 1}.</span>
								{ques.questionType == "single" && (
									<p
										key={i}
										className="font-semibold text-gray-700"
										dangerouslySetInnerHTML={{
											__html: ques.question,
										}}
									/>
								)}
								{ques.questionType == "paragraph" && (
									<div key={i}>
										<p
											className="font-semibold text-gray-700"
											dangerouslySetInnerHTML={{
												__html: ques.paragraph,
											}}
										/>
										<div className="mt-2 ml-2 flex">
											<span className="font-bold text-gray-700 mr-1">Q.</span>
											<p
												className="font-semibold text-gray-700"
												dangerouslySetInnerHTML={{
													__html: ques.question,
												}}
											/>
										</div>
									</div>
								)}
							</div>
						))}
						{/* {Object.keys(groupedQuestions).map((key, index) => (
							<div key={key} className="my-5">
								{groupedQuestions[key].hasOwnProperty("questionType") ? (
									<div className="flex">
										<span className="font-bold text-gray-700 mr-2">
											Q{index + 1}.
										</span>
										<p
											className="font-semibold text-gray-700"
											dangerouslySetInnerHTML={{
												__html: groupedQuestions[key].question,
											}}
										/>
									</div>
								) : (
									<>
										<p
											className="font-semibold text-gray-700"
											dangerouslySetInnerHTML={{
												__html: key,
											}}
										/>
										{groupedQuestions[key].map((subQues, j) => (
											<div key={j} className="flex ml-4 mt-2">
												<span className="font-bold text-gray-700 mr-4">
													Q{subQues.index + 1}.
												</span>
												<p
													className="font-semibold text-gray-700"
													dangerouslySetInnerHTML={{
														__html: subQues.question,
													}}
												/>
											</div>
										))}
									</>
								)}
							</div>
						))} */}
					</div>
				</Modal>

				<Modal
					opened={instructionsOpened}
					onClose={instructionsClose}
					size="80%"
					yOffset="1vh"
				>
					<p className="text-2xl font-semibold mb-6 text-red-500">
						Note that the timer is running. Kindly close the instructions to
						attend the questions.
					</p>
					{getExamLevel == 4 || getExamLevel == 3 || getExamLevel == 2 ? (
						<embed
							src={pms}
							type="application/pdf"
							height={window.innerHeight - 200}
							width="100%"
						></embed>
					) : getExamLevel == 1 ? (
						<embed
							src={fullLength}
							type="application/pdf"
							height={window.innerHeight - 200}
							width="100%"
						></embed>
					) : (
						<embed
							src={copyCat}
							type="application/pdf"
							height={window.innerHeight - 200}
							width="100%"
						></embed>
					)}
				</Modal>
			</nav>

			{isOpen ? (
				<div className="popup-box">
					<div className="box">
						<span onClick={togglePopup} className="p-1 cursor-pointer">
							<FaTimes className="text-gray-500 hover:text-gray-600 transition" />
						</span>
						<Calculator />
					</div>
				</div>
			) : (
				""
			)}
			{/* <Calculator /> */}

			<div id="quesAns" className="sm:flex block justify-between">
				<Modal
					isOpen={modalQuesAlertOpen}
					style={customStyles}
					ariaHideApp={false}
				>
					<div style={{ display: "flex", flexDirection: "row-reverse" }}>
						<button onClick={setModalQuestAttemptAlert}>x</button>
					</div>
					<p style={{ textAlign: "center" }}>
						<b>
							You cannot attempt more than {questionAttempt} questions in this
							section.
						</b>
					</p>
					<p style={{ textAlign: "center" }}>
						Please clear the response for some other question of this section to
						attempt this question
					</p>
					<div
						style={{
							display: "flex",
							flexDirection: "row",
							justifyContent: "center",
							marginTop: "20px",
						}}
					>
						<button
							style={{ marginRight: "20px" }}
							onClick={() => {
								setModalQuestAttemptAlert();
							}}
							className="bg-[#38aae9] text-white hover:border-gray-700 hover:border-2 border-2 rounded-sm px-4 py-2"
						>
							Resume
						</button>
						<button
							style={{ marginLeft: "20px" }}
							onClick={() => {
								setLeft(1);
								_submitPreTest();
								setFinishExam(true);
							}}
							className="bg-[#38aae9] text-white hover:border-gray-700 hover:border-2 border-2 rounded-sm px-4 py-2"
						>
							Submit
						</button>
					</div>
				</Modal>
				<div className="w-full mr-4">
					<div>
						<ul className="flex">
							{data.map((res, i) => (
								<button
									key={i}
									onClick={() => {
										if (selectedSectionnumber < i) setAlertbox(false);
										// setselectedcategorynumber(i);
									}}
									className={`flex items-center border-2 ml-2 mt-2 p-1 pl-4 pr-4 disabled:cursor-not-allowed rounded-sm ${
										selectedSectionnumber == i ? "bg-blue-400" : "bg-gray-100"
									} ${
										selectedSectionnumber == i
											? "text-gray-50"
											: "text-gray-500"
									} font-semibold`}
									disabled={selectedSectionnumber != i ? true : false}
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
								getLeft={getLeft}
								setCount={setCount}
								key={count + "time"}
								time={count}
								changeFinish={changeFinish}
							/>
						</p>
					</div>
					<div className="sm:flex justify-between items-center border-b-2 pl-2 w-full">
						<div className="flex items-center">
							<p className="font-bold text-md sm:text-lg py-2">
								Q. {currentQuesIndex + 1}
							</p>
						</div>
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

					{Question.map((res, i) => {
						return currentQuesIndex == i ? (
							<div
								key={i}
								className="text-left justify-between overflow-x-hidden mb-8 pl-2 pb-16 w-full"
								style={{ height: "100%" }}
							>
								{res.questionType == "paragraph" ? (
									<>
										<div className="grid sm:grid-cols-2 grid-cols-1 grid-s w-full">
											<div className="overflow-y-scroll p-4 border-r-[1px] border-gray-300">
												<ScrollArea h={400}>
													<div
														className="pb-5 pr-3"
														dangerouslySetInnerHTML={{
															__html: res.paragraph,
														}}
													/>
												</ScrollArea>
											</div>
											<div className="overflow-y-scroll">
												<ScrollArea h={400}>
													<div
														className="p-4"
														dangerouslySetInnerHTML={{
															__html: res.question,
														}}
													/>

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
														<div className="mb-12">
															{res.questionoption[0] &&
																res?.questionoption.map((ans, iAns) => {
																	let newObj = { ...currentQuesStatus };
																	// newObj["timeTaken"][iAns] = Math.abs(
																	// 	timeSpent - count
																	// );
																	// setTimeSpent(count);
																	return (
																		<div
																			key={iAns}
																			className="flex items-center space-x-3 cursor-pointer px-4 py-2 rounded-sm"
																		>
																			<>
																				<input
																					checked={
																						newObj["answered"][i] == 1 &&
																						iAns == getRadio
																							? "checked"
																							: null
																					}
																					onChange={() => {
																						SelectAnswer(i);
																						setselectedAns(iAns);
																						setRadio(iAns);
																						// newObj['answered'][i] = 1;
																						// newObj['notAnswered'][i] = 0;
																						setCurrentQuesStatus(newObj);
																						localStorage.setItem(
																							"quesAttempted",
																							JSON.stringify({
																								testid:
																									localStorage.getItem(
																										"testid"
																									),
																								objArray: newObj,
																							})
																						);
																						Cookies.set(
																							"quesAttempted",
																							JSON.stringify({
																								testid:
																									localStorage.getItem(
																										"testid"
																									),
																								objArray: newObj,
																							})
																						);

																						let newArry = [...getQuesAns];
																						newArry[i]["quesAns"] = iAns;
																						newArry[i]["isClicked"] = true;
																						newArry[i]["state"] = 2;

																						if (iAns + 1 == res.correctoption) {
																							console.log(
																								"🚀 ~ Examination.js ~ line 1141 ~ correctans"
																							);
																							newArry[i]["ansStatus"] = "C";
																						} else {
																							newArry[i]["ansStatus"] = "W";
																						}
																						setQuesAns(newArry);
																						localStorage.setItem(
																							"savedSession",
																							JSON.stringify({
																								testid:
																									localStorage.getItem(
																										"testid"
																									),
																								getQuesAns: newArry,
																							})
																						);
																						Cookies.set(
																							"savedSession",
																							JSON.stringify({
																								testid:
																									localStorage.getItem(
																										"testid"
																									),
																								getQuesAns: newArry,
																							})
																						);
																					}}
																					type="radio"
																					name={`ans` + i}
																					className="appearance checked:text-indigo-500 hover:ring-2 h-6 w-6"
																				/>

																				<h3
																					dangerouslySetInnerHTML={{
																						__html: ans?.option,
																					}}
																					className="text-gray-900 group-hover:text-white text-sm font-semibold text-left"
																				></h3>
																			</>
																		</div>
																	);
																})}
														</div>
													)}
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
												<div className="mb-12">
													{res.questionoption[0] &&
														res?.questionoption.map((ans, iAns) => {
															let newObj = { ...currentQuesStatus };
															// newObj["timeTaken"][iAns] = Math.abs(
															// 	timeSpent - count
															// );
															// setTimeSpent(count);
															return (
																<div
																	key={iAns}
																	className="flex items-center space-x-3 cursor-pointer px-4 py-2 rounded-sm"
																>
																	<input
																		checked={
																			newObj["answered"][i] == 1 &&
																			iAns == getRadio
																				? "checked"
																				: null
																		}
																		onChange={() => {
																			SelectAnswer(i);
																			setselectedAns(iAns);
																			setRadio(iAns);
																			setCurrentQuesStatus(newObj);
																			localStorage.setItem(
																				"quesAttempted",
																				JSON.stringify({
																					testid:
																						localStorage.getItem("testid"),
																					objArray: newObj,
																				})
																			);
																			Cookies.set(
																				"quesAttempted",
																				JSON.stringify({
																					testid:
																						localStorage.getItem("testid"),
																					objArray: newObj,
																				})
																			);

																			let newArry = [...getQuesAns];
																			newArry[i]["quesAns"] = iAns;
																			newArry[i]["isClicked"] = true;
																			newArry[i]["state"] = 2;

																			if (iAns + 1 == res.correctoption) {
																				console.log(
																					"🚀 ~ Examination.js ~ line 556 ~ correctans"
																				);
																				newArry[i]["ansStatus"] = "C";
																			} else {
																				newArry[i]["ansStatus"] = "W";
																			}
																			setQuesAns(newArry);
																			localStorage.setItem(
																				"savedSession",
																				JSON.stringify({
																					testid:
																						localStorage.getItem("testid"),
																					getQuesAns: newArry,
																				})
																			);
																			Cookies.set(
																				"savedSession",
																				JSON.stringify({
																					testid:
																						localStorage.getItem("testid"),
																					getQuesAns: newArry,
																				})
																			);
																		}}
																		type="radio"
																		name={`ans` + i}
																		className="appearance checked:text-indigo-500 hover:ring-2 h-6 w-6"
																	/>

																	<h3
																		dangerouslySetInnerHTML={{
																			__html: ans?.option,
																		}}
																		className="text-gray-900 group-hover:text-white text-sm font-semibold text-left"
																		key={i + iAns + "p"}
																	></h3>
																</div>
															);
														})}
												</div>
											)}
										</>
									</>
								)}
							</div>
						) : null;
					})}
				</div>
				<div className="border-gray-800 sm:border-l-2 border-t-2 sm:border-t-0 h-full">
					<div className="flex flex-col justify-center sm:w-80 items-center overflow-y-scroll pb-16 sm:pb-0">
						<div className="flex m-4">
							<img
								className="w-28 h-28 rounded-sm ml-2"
								src={NewCandidateImage}
							/>
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
						<div className="flex flex-col w-full mt-2">
							<div className="bg-[#4e85c5]">
								<p className="text-left p-2 text-white font-semibold w-full">
									{SectionName}
								</p>
							</div>
							<p className="text-left pl-2 text-gray-700 font-semibold w-full mt-2">
								Choose a Question
							</p>
						</div>
						<div className="h-[220px] max-h-[220px] overflow-hidden overflow-y-scroll mb-6">
							<div className="flex grow flex-wrap max-w-[inherit] w-[100%] gap-4 p-4">
								{Question.map((res, i) => (
									<button
										key={i}
										onClick={() => {
											setcurrentIndex(i);
											setCurrentQuesIndex(i);
											console.log("🚀 ~ Examination.js ~ line 556 ~ idx", i);
											let newObj = { ...currentQuesStatus };
											newObj["notVisited"][i] = 0;
											setCurrentQuesStatus(newObj);
											localStorage.setItem(
												"quesAttempted",
												JSON.stringify({
													testid: localStorage.getItem("testid"),
													objArray: newObj,
												})
											);
											localStorage.setItem(
												"lastQuesAttempt",
												JSON.stringify({
													testid: localStorage.getItem("testid"),
													currentQuesIndex: i - 1,
												})
											);
											let newArray = [...getQuesAns];

											if (newArray[i]["quesAns"] != -1) {
												//newArray[i]['state'] = 1;
												if (newArray[i]["optionType"] == "input") {
													setAns(newArray[i]["quesAns"]);
												} else {
													setRadio(newArray[i]["quesAns"]);
												}
											} else {
												newArray[i]["quesAns"] = -1;
												if (newArray[i]["optionType"] == "input") {
													setAns("");
												} else {
													setRadio(-1);
												}

												newArray[i]["state"] = 2;
												newArray[i]["isClicked"] = true;
											}
											setQuesAns(newArray);
											localStorage.setItem(
												"savedSession",
												JSON.stringify({
													testid: localStorage.getItem("testid"),
													getQuesAns: newArray,
												})
											);
											Cookies.set(
												"savedSession",
												JSON.stringify({
													testid: localStorage.getItem("testid"),
													getQuesAns: newArray,
												})
											);
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

										{/* { (getQuesAns[i]['state'] == 2 ) ?
                                            <>
                                                <img src={ notans } className='w-10' /> 1
                                                <p className='absolute text-gray-50 top-[0%] -translate-x-2/4 left-2/4 translate-y-1/4'>
                                                    { i + 1 }
                                                </p>
                                            </>
                                            : res.isSelected ?
                                                <>
                                                    <img src={ Answered } className='w-10' /> 2
                                                    <p className='absolute text-gray-50 top-[0%] -translate-x-2/4 left-2/4 translate-y-1/4'>
                                                        { i + 1 }
                                                    </p>
                                                </>
                                                :
                                                <div onClick={ () => {
                                                    if (currentIndex <= Question.length) {
                                                        if (Question[ currentQuesIndex ]?.isSelected == undefined) {
                                                            Question[ currentQuesIndex ].isSelected = false
                                                            setQuestion(Question)
                                                        }
                                                        else {
                                                            Question[ currentQuesIndex ].isSelected = true
                                                            setQuestion(Question)
                                                        }
                                                    }
                                                } } className='relative bg-[#ededed] border-[#979797] shadow-inner shadow-[#a9a9a962] border-2 p-2 w-10 h-10 rounded-sm'>
                                                    <p className='text-gray-800'>{ i + 1 }</p>

                                                </div>
                                        } */}
									</button>
								))}
							</div>
						</div>
					</div>
				</div>
				<footer className="fixed w-full border-t-2 border-gray-400 p-2 bg-gray-50 sm:flex block justify-between bottom-0">
					<div>
						<button
							onClick={() => {
								let newObj = { ...currentQuesStatus };
								let qu = [...Question];
								let newArry = [...getQuesAns];
								let countQues = 0;
								currentQuesStatus["answered"].map((q) => {
									if (q == 1) {
										countQues = countQues + 1;
									}
								});
								if (questionAttempt <= countQues) {
									const chbx = document.getElementsByName(
										"ans" + currentQuesIndex
									);
									for (let i = 0; i < chbx.length; i++) {
										chbx[i].checked = false;
									}
									setModalQuestAttemptAlertTrue();
									return;
								}

								let localCount = count;
								const timeTakenExists = newObj["timeTaken"][currentQuesIndex];
								if (timeTakenExists !== undefined) {
									newObj["timeTaken"][currentQuesIndex] =
										timeTakenExists + Math.abs(timeSpent - localCount);
								} else {
									newObj["timeTaken"][currentQuesIndex] = Math.abs(
										timeSpent - localCount
									);
								}
								setTimeSpent(localCount);
								if (newObj["attemptOrder"][currentQuesIndex] == -1) {
									newObj["attemptOrder"][currentQuesIndex] = attemptOrder;
									setAttemptOrder(attemptOrder + 1);
								}
								if (newArry[currentQuesIndex]["optionType"] == "input") {
									if (getAns) {
										newArry[currentQuesIndex]["quesAns"] = getAns;
										if (getAns == qu[currentQuesIndex].correctoption) {
											newArry[currentQuesIndex]["ansStatus"] = "C";
										} else {
											newArry[currentQuesIndex]["ansStatus"] = "W";
										}
									} else {
										newArry[currentQuesIndex]["quesAns"] = -1;
									}

									// newArry[currentQuesIndex]['isClicked'] = true;
									// newArry[currentQuesIndex]['state'] = 2;

									// if(qu.length - 1  > currentQuesIndex) setAns('');
								}
								//  else if(newArry[currentQuesIndex]['quesAns'] != -1 && newArry[currentQuesIndex]['optionType'] == 'input') {
								//     newArry[currentQuesIndex]['quesAns'] = newArry[currentQuesIndex]['quesAns'];
								// }
								// newObj["timeTaken"][currentQuesIndex] = Math.abs(
								// 	timeSpent - count
								// );
								// setTimeSpent(count);
								newArry[currentQuesIndex]["isClicked"] = true;

								if (newArry[currentQuesIndex]["quesAns"] == -1) {
									newArry[currentQuesIndex]["state"] = 4;
									qu[currentQuesIndex]["state"] = 4;

									newObj["markForReview"][currentQuesIndex] = 1;
									newObj["bothAnsReview"][currentQuesIndex] = 0;
								} else {
									newArry[currentQuesIndex]["state"] = 5;
									qu[currentQuesIndex]["state"] = 5;

									newObj["answered"][currentQuesIndex] = 1;
									newObj["notAnswered"][currentQuesIndex] = 0;
									newObj["notVisited"][currentQuesIndex] = 0;

									newObj["markForReview"][currentQuesIndex] = 0;
									newObj["bothAnsReview"][currentQuesIndex] = 1;
								}
								newArry[currentQuesIndex]["isClicked"] = true;

								if (currentQuesIndex + 1 < Question.length) {
									setCurrentQuesIndex(currentQuesIndex + 1);
								}

								if (currentQuesIndex + 1 == Question.length) {
									setCurrentQuesIndex(0);
								}

								setQuesAns(newArry);
								localStorage.setItem(
									"savedSession",
									JSON.stringify({
										testid: localStorage.getItem("testid"),
										getQuesAns: newArry,
									})
								);
								Cookies.set(
									"savedSession",
									JSON.stringify({
										testid: localStorage.getItem("testid"),
										getQuesAns: newArry,
									})
								);
								setCurrentQuesStatus(newObj);
								localStorage.setItem(
									"quesAttempted",
									JSON.stringify({
										testid: localStorage.getItem("testid"),
										objArray: newObj,
									})
								);
								Cookies.set(
									"quesAttempted",
									JSON.stringify({
										testid: localStorage.getItem("testid"),
										objArray: newObj,
									})
								);
								setQuestion(qu);

								// if (currentIndex <= Question.length) {

								//         if (allData.length > currentIndex) {
								//             allData[ currentIndex ][ 'ans' ] = selectedAns;
								//             allData[ currentIndex ][ 'marked' ] = 1;
								//             allData[ currentIndex ][ 'sectionName' ] = SectionName;
								//             setcurrentIndex(currentIndex + 1)
								//     }
								//     else {
								//             setAllData(prevState => ([ ...prevState, { 'ans': selectedAns, 'marked': 1, 'sectionName': SectionName } ]));
								//             setcurrentIndex(currentIndex + 1)
								//     }
								// }
							}}
							className="border-2 hover:bg-sky-600 transition font-semibold text-gray-500 hover:text-white rounded-sm border-gray-300 px-4 py-2 mr-2 mb-3 sm:mb-0"
						>
							Mark for Review and Next
						</button>
						<button
							onClick={() => {
								setcurrentIndex(currentQuesIndex);
								setCurrentQuesIndex(currentQuesIndex);

								let newObj = { ...currentQuesStatus };
								newObj["answered"][currentQuesIndex] = 0;
								newObj["notAnswered"][currentQuesIndex] = 1;
								newObj["markForReview"][currentQuesIndex] = 0;
								newObj["bothAnsReview"][currentQuesIndex] = 0;
								setCurrentQuesStatus(newObj);
								localStorage.setItem(
									"quesAttempted",
									JSON.stringify({
										testid: localStorage.getItem("testid"),
										objArray: newObj,
									})
								);
								Cookies.set(
									"quesAttempted",
									JSON.stringify({
										testid: localStorage.getItem("testid"),
										objArray: newObj,
									})
								);
								let newArry = [...getQuesAns];
								newArry[currentQuesIndex]["quesAns"] = -1;
								newArry[currentQuesIndex]["isClicked"] = true;
								newArry[currentQuesIndex]["state"] = 2;
								newArry[currentQuesIndex]["ansStatus"] = "";

								let qu = [...Question];
								qu[currentQuesIndex]["state"] = 2;
								if (newArry[currentQuesIndex]["optionType"] == "input") {
									setAns("");
								} else {
									setRadio(-1);
								}

								const chbx = document.getElementsByName(
									"ans" + currentQuesIndex
								);

								for (let i = 0; i < chbx.length; i++) {
									chbx[i].checked = false;
								}
							}}
							className="border-2 hover:bg-sky-600 transition font-semibold text-gray-500 hover:text-white rounded-sm border-gray-300 px-4 py-2"
						>
							Clear Response
						</button>
					</div>
					<div className="flex flex-row mt-3 sm:mt-0 sm:justify-around justify-center items-center">
						<button
							onClick={() => {
								let countQues = 0;
								currentQuesStatus["answered"].map((q) => {
									if (q == 1) {
										countQues = countQues + 1;
									}
								});
								if (questionAttempt <= countQues) {
									const chbx = document.getElementsByName(
										"ans" + currentQuesIndex
									);
									for (let i = 0; i < chbx.length; i++) {
										chbx[i].checked = false;
									}
									setModalQuestAttemptAlertTrue();
									return;
								}

								if (currentQuesIndex + 1 < Question.length) {
									setCurrentQuesIndex(currentQuesIndex + 1);
								}

								if (currentQuesIndex + 1 == Question.length) {
									setCurrentQuesIndex(0);
								}

								const testid = localStorage.getItem("testid");
								localStorage.setItem(
									"lastQuesAttempt",
									JSON.stringify({
										currentQuesIndex: currentQuesIndex,
										testid: testid,
									})
								);
								console.log(currentQuesIndex);

								let newArry = [...getQuesAns];
								let newObj = { ...currentQuesStatus };
								let qu = [...Question];
								let localCount = count;
								const timeTakenExists = newObj["timeTaken"][currentQuesIndex];
								if (timeTakenExists !== undefined) {
									newObj["timeTaken"][currentQuesIndex] =
										timeTakenExists + Math.abs(timeSpent - localCount);
								} else {
									newObj["timeTaken"][currentQuesIndex] = Math.abs(
										timeSpent - localCount
									);
								}
								setTimeSpent(localCount);
								if (newObj["attemptOrder"][currentQuesIndex] == -1) {
									newObj["attemptOrder"][currentQuesIndex] = attemptOrder;
									setAttemptOrder(attemptOrder + 1);
								}
								if (
									newArry[currentQuesIndex]["quesAns"] == -1 &&
									newArry[currentQuesIndex]["optionType"] == "input"
								) {
									newArry[currentQuesIndex]["isClicked"] = true;
									newArry[currentQuesIndex]["state"] = 2;
									if (getAns) {
										newArry[currentQuesIndex]["quesAns"] = getAns;
										if (getAns == qu[currentQuesIndex].correctoption) {
											newArry[currentQuesIndex]["ansStatus"] = "C";
										} else {
											newArry[currentQuesIndex]["ansStatus"] = "W";
										}
									} else {
										newArry[currentQuesIndex]["quesAns"] = -1;
									}

									if (qu.length - 1 > currentQuesIndex) setAns("");
								} else if (
									newArry[currentQuesIndex]["quesAns"] != -1 &&
									newArry[currentQuesIndex]["optionType"] == "input"
								) {
									if (
										newArry[currentQuesIndex + 1]["quesAns"] == -1 &&
										newArry[currentQuesIndex]["optionType"] == "input"
									) {
										if (qu.length - 1 > currentQuesIndex) setAns("");
									}
									newArry[currentQuesIndex]["quesAns"] =
										newArry[currentQuesIndex]["quesAns"];
								}

								console.log(
									"🚀 ~ file: Examination.js ~ line 1616 ~ newArray",
									newArry,
									newObj,
									qu.length,
									currentQuesIndex
								);

								if (currentQuesIndex == qu.length - 1) {
									if (
										newArry[currentQuesIndex]["optionType"] != "input" &&
										newArry[currentQuesIndex]["quesAns"] != -1
									) {
										setRadio(newArry[currentQuesIndex]["quesAns"]);
									}
									if (
										newArry[currentQuesIndex]["optionType"] == "input" &&
										newArry[currentQuesIndex]["quesAns"] != -1
									) {
										setAns(newArry[currentQuesIndex]["quesAns"]);
									}
									if (
										newArry[currentQuesIndex]["optionType"] == "input" &&
										newArry[currentQuesIndex]["quesAns"] == -1
									) {
										setAns("");
									}
								} else {
									if (
										newArry[currentQuesIndex + 1]["optionType"] != "input" &&
										newArry[currentQuesIndex + 1]["quesAns"] != -1
									) {
										setRadio(newArry[currentQuesIndex + 1]["quesAns"]);
									}
									if (
										newArry[currentQuesIndex + 1]["optionType"] == "input" &&
										newArry[currentQuesIndex + 1]["quesAns"] != -1
									) {
										setAns(newArry[currentQuesIndex + 1]["quesAns"]);
									}
									if (
										newArry[currentQuesIndex + 1]["optionType"] == "input" &&
										newArry[currentQuesIndex + 1]["quesAns"] == -1
									) {
										setAns("");
									}
								}
								// newObj["timeTaken"][currentQuesIndex] = count - getLeft;
								newObj["markForReview"][currentQuesIndex] = 0;
								newObj["bothAnsReview"][currentQuesIndex] = 0;
								newObj["notVisited"][currentQuesIndex] = 0;
								if (
									newArry[currentQuesIndex]["quesAns"] != -1 &&
									newObj["markForReview"][currentQuesIndex] == 0
								) {
									newObj["answered"][currentQuesIndex] = 1;
									newObj["notAnswered"][currentQuesIndex] = 0;
									newArry[currentQuesIndex]["state"] = 1;
									qu[currentQuesIndex]["state"] = 1;
								} else if (
									newArry[currentQuesIndex]["quesAns"] != -1 &&
									newObj["markForReview"][currentQuesIndex] == 1
								) {
									newObj["answered"][currentQuesIndex] = 1;
									newObj["notAnswered"][currentQuesIndex] = 0;

									newArry[currentQuesIndex]["state"] = 5;
									qu[currentQuesIndex]["state"] = 5;
								} else if (
									newArry[currentQuesIndex]["quesAns"] == -1 &&
									newObj["markForReview"][currentQuesIndex] == 1
								) {
									newArry[currentQuesIndex]["state"] = 4;
									qu[currentQuesIndex]["state"] = 4;
								} else if (newArry[currentQuesIndex]["quesAns"] == -1) {
									newArry[currentQuesIndex]["state"] = 2;
									qu[currentQuesIndex]["state"] = 2;
								}
								newArry[currentQuesIndex]["isClicked"] = true;
								newArry[currentQuesIndex]["timeTaken"] =
									newObj["timeTaken"][currentQuesIndex];
								newArry[currentQuesIndex]["attemptOrder"] =
									newObj["attemptOrder"][currentQuesIndex];
								setQuesAns(newArry);
								localStorage.setItem(
									"savedSession",
									JSON.stringify({
										testid: localStorage.getItem("testid"),
										getQuesAns: newArry,
									})
								);
								Cookies.set(
									"savedSession",
									JSON.stringify({
										testid: localStorage.getItem("testid"),
										getQuesAns: newArry,
									})
								);
								setCurrentQuesStatus(newObj);
								localStorage.setItem(
									"quesAttempted",
									JSON.stringify({
										testid: localStorage.getItem("testid"),
										objArray: newObj,
									})
								);
								Cookies.set(
									"quesAttempted",
									JSON.stringify({
										testid: localStorage.getItem("testid"),
										objArray: newObj,
									})
								);
							}}
							className="bg-sky-500 text-white hover:bg-sky-600 transition font-semibold rounded-sm px-4 py-2 mr-4"
						>
							Save & Next
						</button>
						<button
							onClick={() => {
								setLeft(1);
								_submitPreTest();
								setFinishExam(true);
							}}
							className="bg-sky-500 text-white hover:bg-sky-600 transition font-semibold rounded-sm px-4 py-2 sm:mr-10"
						>
							Submit
						</button>
					</div>
				</footer>
			</div>
		</div>
	);
});

export default Examination;
