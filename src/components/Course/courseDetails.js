//import liraries
import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import {
	FiBook,
	FiChevronDown,
	FiFile,
	FiMinusCircle,
	FiPlay,
	FiVideo,
} from "react-icons/fi";
import { Link, Navigate, useNavigate, useLocation } from "react-router-dom";
import { isLoggedIn } from "../../api/checkAuth";
import hideNavContext from "../../context/AllprojectsContext";
import AuthContext from "../../context/AuthCntx";
import styles from "./Coursedetails.module.css";
import { useParams } from "react-router";
import TreeList from "../TreeList";
import "highcharts/css/highcharts.css";
import HighchartsReact from "highcharts-react-official";
import Highcharts from "highcharts";
// import Tree from 'react-animated-tree';

const treeStyles = {
	top: 40,
	left: 40,
	color: "#60a5fa",
	fill: "#60a5fa",
	width: "100%",
};

const typeStyles = {
	fontSize: "2em",
	verticalAlign: "middle",
};

const VideoPlayer = React.memo((props) => {
	return (
		<div className={styles.videoPlayer}>
			<video controls src={props.url} />
			<div>
				<h2>{props.title}</h2>
				<p>{props.desc}</p>
			</div>
		</div>
	);
});

// create a component
const CourseDetails = (props) => {
	const navigate = useNavigate();
	let courseTypes = "";

	const { isAuth, setAuth } = useContext(AuthContext);
	const [isPurchased, setPurchased] = useState(false);

	const [data, setData] = useState([]);
	const { hidenav, sethidenav } = useContext(hideNavContext);
	const [Similardata, setSimilardata] = useState([]);

	const [url, setUrl] = useState("");
	const [title, setTitle] = useState("");
	const [desc, setDesc] = useState("");
	const [courseType, setCourseType] = useState("");
	const [currentActiveTab, setCurrentActiveTab] = useState("overview");
	const [getTreeCreationData, setTreeCreationData] = useState({});
	const [getPackDetail, setPackDetail] = useState({});
	const [getCourseList, setCourseList] = useState([]);
	const [getCourseTest, setCourseTest] = useState([]);
	const [getSubjectList, setSubjectList] = useState([]);
	const [getSubjectTest, setSubjectTest] = useState([]);
	const [getChapterList, setChapterList] = useState([]);
	const [getChapterTest, setChapterTest] = useState([]);
	const [getTopicList, setTopicList] = useState([]);
	const [getTopicTest, setTopicTest] = useState([]);
	const [nodeClick, setNodeClick] = useState({});
	const [getIndex, setIndex] = useState({
		courseIndex: 0,
		subjectIndex: 0,
		chapterIndex: 0,
		topicIndex: 0,
	});
	const [getPckRelatedTest, setPckRelatedTest] = useState([]);

	const _getrandomPkg = async () => {
		const res = await axios.get(process.env.REACT_APP_API + "/getrndmpkg");
		setSimilardata(res.data);
	};

	const hasPurchased = () => {
		if (isAuth == true && isPurchased == true) {
			return true;
		} else {
			return false;
		}
	};

	let location = useLocation();

	useEffect(() => {
		// _getrandomPkg();
		let pathname = location.pathname.split("/");
		courseTypes = pathname[pathname.length - 1];
		setCourseType(courseTypes);
	}, []);

	useEffect(async () => {
		sethidenav(false);
		//  const res = await axios.get(process.env.REACT_APP_API + '/getallpackagebyid/' + localStorage.getItem('pkgid'))
		//  //console.log(res.data)
		//  setData(res.data);

		const packRes = await axios.get(
			process.env.REACT_APP_API +
				"/getPackageDetails/" +
				localStorage.getItem("pkgid"),
			{ params: { userId: localStorage.getItem("user") } }
		);
		console.log("getPackageDetails", packRes.data);
		//setPackDetail(packRes.data.packageDetails);
		setData(packRes.data.packageDetails);
		setCourseList(packRes.data.courseList);
		setCourseTest(packRes.data.testList);
		let tt = packRes.data.testDetails;
		let finalTestResult = [];

		finalTestResult = tt.reduce((agg, curr, i) => {
			let found = agg.find((x) => x.subjectId === curr.subjectId);
			if (found) {
				found.testData.push(curr);
				found.testDataCount = found.testData.length;
				if (curr.attempt_id) {
					found.testAttempted = found.testAttempted + 1;
				}
			} else {
				let newJson = {
					subjectId: curr.subjectId,
					subjectName: curr.subjectName,
					testData: [],
					chapterData: [],
					testDataCount: 1,
					testAttempted: 0,
					chartOptions: {
						title: {
							text: "",
							align: "left",
							margin: 0,
						},
						chart: {
							renderTo: "container2",
							type: "bar",
							height: 70,
						},
						credits: false,
						tooltip: false,
						legend: false,
						navigation: {
							buttonOptions: {
								enabled: false,
							},
						},
						xAxis: {
							visible: false,
						},
						yAxis: {
							visible: false,
							min: 0,
							max: 100,
						},
						series: [
							{
								data: [100],
								grouping: false,
								animation: true,
								enableMouseTracking: false,
								showInLegend: false,
								color: "lightskyblue",
								pointWidth: 25,
								borderWidth: 0,
								borderRadius: 5,
								borderRadiusTopLeft: "4px",
								borderRadiusTopRight: "4px",
								borderRadiusBottomLeft: "4px",
								borderRadiusBottomRight: "4px",
								dataLabels: {
									className: "highlight",
									format: "150 / 600",
									enabled: true,
									align: "right",
									style: {
										color: "white",
										textOutline: false,
									},
								},
							},
							{
								enableMouseTracking: false,
								data: [26],
								borderRadiusBottomLeft: "4px",
								borderRadiusBottomRight: "4px",
								borderRadius: 5,
								color: "navy",
								borderWidth: 0,
								pointWidth: 25,
								animation: {
									duration: 250,
								},
								dataLabels: {
									enabled: true,
									inside: true,
									align: "left",
									format: "{point.y}%",
									style: {
										color: "white",
										textOutline: false,
									},
								},
							},
						],
					},
				};
				newJson["testData"].push(curr);
				if (curr.attempt_id) {
					newJson["testAttempted"] = 1;
				}
				agg.push(newJson);
			}
			return agg;
		}, []);

		finalTestResult = finalTestResult.map((d, i) => {
			let calPer = parseInt(
				((d.testAttempted / d.testDataCount) * 100).toFixed()
			);
			d.chartOptions["series"][0]["dataLabels"]["format"] =
				d.testAttempted + " / " + d.testDataCount;
			d.chartOptions["series"][1]["data"] = [calPer];
			return d;
		});
		setPckRelatedTest(finalTestResult);
		console.log(finalTestResult);

		// finalTestResult = finalTestResult.map((d,i)=>{
		//   d.chapterData = d.testData.reduce((agg,curr, i) => {
		//     let found = agg.find((x) => x.chapterChapterId === curr.chapterChapterId);
		//     if(found){
		//       found.testData.push(curr);
		//     } else {
		//       let newJson =  {
		//         chapterName: curr.chapterName,
		//         chapterChapterId: curr.chapterChapterId,
		//         testData: [],
		//         topicData:[]
		//       }

		//       newJson['testData'].push(curr)

		//       agg.push(newJson);
		//     }
		//     return agg;
		//   }, []);

		//   d.chapterData.map((t,a)=>{
		//     t.topicData = t.testData.reduce((agg,curr, i) => {
		//       let found = agg.find((x) => x.topicId === curr.topicId);
		//       if(found){
		//         if(curr.examLevel == 4){
		//           found.testData.push(curr);
		//         }
		//       } else {
		//         let newJson =  {
		//           topicId: curr.topicId,
		//           topicName: curr.topicName,
		//           testData: []
		//         }

		//         if(curr.examLevel == 4){
		//           newJson.testData.push(curr)

		//         }
		//         agg.push(newJson);
		//       }
		//       return agg;
		//     }, []);
		//   })

		//   return d;
		// })

		// let pt = []
		// for(let i = 0; i < 50; i++){
		//     axios.get(process.env.REACT_APP_API + '/getPackageDetails/' + localStorage.getItem('pkgid'), {params:{userId: localStorage.getItem('user')}})
		// }

		// Promise.all(pt).then(val=>{

		// })
		// .catch(err=>{
		//     console.log(err)
		// })
	}, []);

	const getTestOfRelatedSub = async (testData, index) => {
		let finaTes = [...getPckRelatedTest];

		if (
			finaTes[index]["chapterData"] &&
			finaTes[index]["chapterData"].length > 0
		) {
			return;
		}

		let testId = [];
		testData = testData.map((d, i) => {
			let s = "'" + d.Test_Id + "'";
			testId.push(s);
		});
		let param = {
			userId: localStorage.getItem("user"),
			packageId: localStorage.getItem("pkgid"),
			testId,
		};

		const getTest = await axios.post(
			process.env.REACT_APP_API + "/getTestForTree",
			param
		);
		console.log("getTest", getTest.data.testResult);
		let res = getTest?.data?.testResult;

		let chapterData = res.reduce((agg, curr, i) => {
			let found = agg.find((x) => x.chapterChapterId === curr.chapterChapterId);
			if (found) {
				found.testData.push(curr);
			} else {
				let newJson = {
					chapterName: curr.chapterName,
					chapterChapterId: curr.chapterChapterId,
					testData: [],
					topicData: [],
				};

				newJson["testData"].push(curr);

				agg.push(newJson);
			}
			return agg;
		}, []);

		chapterData = chapterData.map((t, a) => {
			t.topicData = t.testData.reduce((agg, curr, i) => {
				let found = agg.find((x) => x.topicId === curr.topicId);
				if (found) {
					if (curr.examLevel == 4) {
						found.testData.push(curr);
					}
				} else {
					let newJson = {
						topicId: curr.topicId,
						topicName: curr.topicName,
						testData: [],
					};

					if (curr.examLevel == 4) {
						newJson.testData.push(curr);
						agg.push(newJson);
					}
				}
				return agg;
			}, []);
			return t;
		});

		finaTes[index]["chapterData"] = chapterData;
		console.log(finaTes);
		setPckRelatedTest(finaTes);
	};

	useEffect(() => {
		let tree = { ...getTreeCreationData };
		tree["courseList"] = getCourseList;
		tree["courseTest"] = getCourseTest;
		tree["subjectList"] = getSubjectList;
		tree["subjectTest"] = getSubjectTest;
		tree["chapterList"] = getChapterList;
		tree["chapterTest"] = getChapterTest;
		tree["topicList"] = getTopicList;
		tree["topicTest"] = getTopicTest;
		tree["index"] = { ...getIndex };
		// console.log("dd", getIndex)
		setTreeCreationData(tree);
	}, [
		getCourseList,
		getCourseTest,
		getSubjectList,
		getSubjectTest,
		getIndex,
		getChapterList,
		getChapterTest,
		getTopicList,
		getTopicTest,
	]);

	const _isLoggedIn = () => {
		if (!isAuth) {
			navigate("/signin");
		}
	};

	const _getSubjectList = async (id, index) => {
		const res = await axios.get(
			process.env.REACT_APP_API +
				"/getSubjectList/" +
				localStorage.getItem("pkgid") +
				"/" +
				id,
			{ params: { userId: localStorage.getItem("user") } }
		);
		setSubjectList(res.data.subjectList);
		setSubjectTest(res.data.testList);
		let ind = { ...getIndex };
		// console.log("s", ind)
		ind["courseIndex"] = index;
		setIndex(ind);
	};

	const _getChapterList = async (id, index) => {
		const res = await axios.get(
			process.env.REACT_APP_API +
				"/getChaperList/" +
				localStorage.getItem("pkgid") +
				"/" +
				id,
			{ params: { userId: localStorage.getItem("user") } }
		);
		setChapterList(res.data.chapterList);
		setChapterTest(res.data.testList);
		let ind = { ...getIndex };
		// console.log("c", ind)
		ind["subjectIndex"] = index;
		setIndex(ind);
	};

	const _getTopicList = async (id, index) => {
		const res = await axios.get(
			process.env.REACT_APP_API +
				"/getTopicList/" +
				localStorage.getItem("pkgid") +
				"/" +
				id,
			{ params: { userId: localStorage.getItem("user") } }
		);
		setTopicList(res.data.topicList);
		setTopicTest(res.data.testList);
		let ind = { ...getIndex };
		// console.log("c", ind)
		ind["chapterIndex"] = index;
		setIndex(ind);
	};

	const _getTopicTest = async (id, index) => {
		const res = await axios.get(
			process.env.REACT_APP_API +
				"/getTopicTestList/" +
				localStorage.getItem("pkgid") +
				"/" +
				id,
			{ params: { userId: localStorage.getItem("user") } }
		);
		setTopicTest(res.data.testList);
		let ind = { ...getIndex };
		// console.log("c", ind)
		ind["topicIndex"] = index;
		setIndex(ind);
	};

	useEffect(() => {
		// console.log("mmmmmm",nodeClick)
		if (nodeClick.title == "course") {
			_getSubjectList(nodeClick.id, nodeClick.index);
		}
		if (nodeClick.title == "subject") {
			_getChapterList(nodeClick.id, nodeClick.index);
		}
		if (nodeClick.title == "chapter") {
			_getTopicList(nodeClick.id, nodeClick.index);
		}

		if (nodeClick.title == "topic") {
			_getTopicTest(nodeClick.id, nodeClick.index);
		}
	}, [nodeClick]);

	return (
		<div className="bg-white">
			<div
				className="bg-cover bg-center h-[400px] before:bg-[#000000f1] before:opacity-80 before:absolute before:left-0 before:w-screen
             before:h-[400px] before:z-0 opacity-90 "
				style={{
					backgroundImage:
						data && data?.thumbnail != undefined
							? `url(${data.thumbnail})`
							: "url(https://images.unsplash.com/photo-1554415707-6e8cfc93fe23?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=870&q=80)",
				}}
			>
				<div className="z-[1] relative pt-20 items-center flex justify-center flex-col">
					<h1 className="text-white font-bold text-4xl uppercase">
						{data && data.PackageName}
					</h1>
					<p className="text-white pt-8 w-1/2">{data && data.PackageDesc}</p>
					{!isPurchased && (
						<div className={courseType == "allCourse" ? "" : "displayProp"}>
							<button
								onClick={() => {
									if (!isAuth) {
										navigate("/signin");
									} else if (isAuth) {
										setPurchased(false);
										//window.open(' https://tathagat.ccavenue.com', '_blank').focus();
										if (data.payment_url)
											window.open(data.payment_url, "_blank").focus();
									}
								}}
								className="pt-3 pb-4 items-center mt-10 rounded-md px-10 bg-indigo-500 text-white text-xl font-bold"
							>
								₹{data && data.price} Buy now{" "}
							</button>
						</div>
					)}
				</div>
			</div>

			{url !== "" && courseType == "myCourse" ? (
				<VideoPlayer url={url} title={title} desc={desc} />
			) : null}

			<div className={courseType == "myCourse" ? "" : "displayProp"}>
				{/* <div className="container mx-auto">
                    
                    <div className="m-8 mt-20 rounded overflow-hidden">
                    <div className='h-3 mb-4'>Tests</div>
                        {data[0] && data[0].TestList.map((res, i) => (
                            <div className="group outline-none accordion-section" style={{marginBottom:"12px"}} tabIndex={i}>
                                <div className="group bg-gray-900 flex justify-between px-4 py-3 items-center text-gray-500 transition ease duration-500 cursor-pointer pr-10 relative">
                                    <div className="group-focus:text-white transition ease duration-500">

                                        {res?.videoPath != undefined ? res.videoname : res.TestTitle}
                                    </div>
                                    <div className="h-8 w-8 border border-gray-700 rounded-full items-center inline-flex justify-center transform transition ease duration-500 group-focus:text-white group-focus:-rotate-180 absolute top-0 right-0 mb-auto ml-auto mt-2 mr-2">
                                        <FiChevronDown />
                                    </div>
                                </div>
                                <div className="group-focus:max-h-screen max-h-0 bg-gray-800 overflow-hidden ease duration-500">

                                    {res?.videoPath == undefined ?
                                        <>

                                            <p className='p-4 text-gray-400 text-justify'>Test Section : {res.Section && res.Section.length}</p>

                                            <div className='flex p-4 text-white justify-between'>
                                                <p className=' text-gray-400 text-justify'>
                                                    {res?.TestTitle ? res.TestTitle : ''}</p>
                                                <Link to={`/examination`} onClickCapture={() => localStorage.setItem('testid', res.TestId)} >
                                                    <button className='text-indigo-400 text-xl font-bold'>Start Test</button>
                                                </Link>
                                            </div>
                                        </>
                                        :
                                        <div className='flex p-4 text-white justify-between'>
                                            <p className="p-2 text-gray-400 text-justify">
                                                {res?.videoPath != undefined ? res.videodescription : res?.PackageDesc != undefined && res?.PackageDesc != null && res.PackageDesc || "No title"}
                                            </p>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '12px' }}>
                                                {isPurchased == false ? <i className="fa-solid fa-lock"></i> : null}
                                                <button onClick={() => {
                                                    if (isPurchased == true) {
                                                        setUrl(res.videoPath || '')
                                                        setTitle(res.videoname || '')
                                                        setDesc(res.videodescription || '')
                                                    }
                                                }} className='bg-indigo-500 w-8 h-8 items-center flex justify-center rounded-full'>
                                                    <FiPlay />
                                                </button>
                                            </div>

                                        </div>
                                    }
                                </div>
                            </div>
                        ))}
                    </div>
                </div> */}

				<div className="flex justify-between mb-4">
					<div className="w-10/12 mr-4 m-8 mt-20 ">
						<div className="course-details-section">
							<ul className="flex items-center mb-2">
								<button
									onClick={() => {
										setCurrentActiveTab("overview");
									}}
									className={`flex items-center px-4 h-10 rounded-md font-semibold ${
										currentActiveTab === "overview"
											? "bg-blue-400 text-white text-sm sm:text-base"
											: "text-gray-500 text-sm sm:text-base"
									} `}
								>
									Overview
								</button>
								{/* <button onClick={() => { setCurrentActiveTab('q&a') }}
                                    className={`flex items-center border-2 ml-2 p-1 pl-4 pr-4 disabled:cursor-not-allowed rounded-sm font-semibold ${currentActiveTab == 'q&a' ? 'bg-blue-400 text-gray-50' : 'bg-gray-100 text-gray-500'}`}>
                                    Q&A
                                </button>
                                <button onClick={() => { setCurrentActiveTab('notes') }}
                                    className={`flex items-center border-2 ml-2 p-1 pl-4 pr-4 disabled:cursor-not-allowed rounded-sm font-semibold ${currentActiveTab == 'notes' ? 'bg-blue-400 text-gray-50' : 'bg-gray-100 text-gray-500'}`}>
                                    Notes
                                </button>
                                <button onClick={() => { setCurrentActiveTab('reviews') }}
                                    className={`flex items-center border-2 ml-2 p-1 pl-4 pr-4 disabled:cursor-not-allowed rounded-sm font-semibold ${currentActiveTab == 'reviews' ? 'bg-blue-400 text-gray-50' : 'bg-gray-100 text-gray-500'}`}>
                                    Reviews
                                </button>
                                <button onClick={() => { setCurrentActiveTab('analysis') }}
                                    className={`flex items-center border-2 ml-2 p-1 pl-4 pr-4 disabled:cursor-not-allowed rounded-sm font-semibold ${currentActiveTab == 'analysis' ? 'bg-blue-400 text-gray-50' : 'bg-gray-100 text-gray-500'}`}>
                                    Analysis
                                </button> */}
								{getPckRelatedTest.map((sub, i) => (
									<button
										key={i}
										onClick={() => {
											getTestOfRelatedSub(sub.testData, i);
											setCurrentActiveTab(sub.subjectName);
										}}
										className={`flex items-center px-4 h-10 rounded-md font-semibold ${
											currentActiveTab === sub.subjectName
												? "bg-blue-400 text-gray-50 text-sm sm:text-base"
												: "text-gray-500 text-sm sm:text-base"
										}`}
									>
										{sub.subjectName}
									</button>
								))}
							</ul>
						</div>
						<div className="overViewSection">
							<div
								className="p-4"
								style={{
									display: currentActiveTab == "overview" ? "block" : "none",
								}}
							>
								<div className={`line`}>
									<div className="text-lg font-bold lg:text-2xl mb-2 text-gray-700">
										About this package
									</div>
									<p>{data?.PackageDesc}</p>
								</div>

								<div style={{ marginTop: "10px" }}>
									{/* <div className={`h-3 mb-4`}>Details
                                     { getPckRelatedTest.length == 0 ? <span className="bt-spinner"></span> : ''}
                                     </div> */}
									<div style={{ textAlign: "center" }}>
										{" "}
										{getPckRelatedTest.length == 0 ? (
											<div className="flex justify-center items-center">
												<span className="bt-spinner"></span>
											</div>
										) : (
											""
										)}
									</div>
									<ul>
										{getPckRelatedTest.map((sub, i) => (
											<li key={i}>
												<span className="text-md lg:text-xl font-semibold text-gray-700">
													{sub.subjectName}
												</span>
												<span className="text-md lg:text-xl font-semibold text-gray-700">
													{" "}
													|{" "}
												</span>
												<span className="text-md lg:text-xl font-semibold text-gray-700">
													No. of tests Assigned: {sub?.testData.length}
												</span>
												{console.log(sub.chartOptions)}
												<HighchartsReact
													highcharts={Highcharts}
													options={sub.chartOptions}
												/>
											</li>
										))}
									</ul>

									{/* <TreeList treeData={getTreeCreationData} setNodeClick={setNodeClick}/> */}
									{/* <Tree content="main" type="ITEM" canHide open style={treeStyles}>
                                            <Tree content="hello" type={<span style={typeStyles}>🙀</span>} canHide />
                                            <Tree content="subtree with children" canHide>
                                                <Tree content="hello" />
                                                <Tree content="sub-subtree with children">
                                                    <Tree content="child 1" style={{ color: '#63b1de' }} />
                                                    <Tree content="child 2" style={{ color: '#63b1de' }} />
                                                    <Tree content="child 3" style={{ color: '#63b1de' }} />
                                                </Tree>
                                                <Tree content="hello" />
                                            </Tree>
                                            <Tree content="hello" canHide />
                                            <Tree content="hello" canHide />
                                        </Tree> */}

									{/* { data.map((item, i)=> (
                                            <Tree content={item?.name} type="Package Name" canHide open visible  style={treeStyles}>
                                                {
                                                    item?.TestList.map((test, index )=>(
                                                        <Tree content={test?.TestTitle} type={`Test-${index+1}`} canHide>
                                                            { test?.Section.length && test?.Section.map((sec, j)=>(
                                                                <Tree content={sec?.sectionName} type="Section Name" canHide>
                                                                    <Tree content={sec?.QuestionList.length} type="No. of Question" style={{ color: '#63b1de' }} canHide/>
                                                                    <Tree content={sec?.SectionTime} type="Section Time" style={{ color: '#63b1de' }} canHide/>
                                                                    <Tree content={sec?.positiveMarks} type="Positive marks per question" style={{ color: '#63b1de' }} canHide />
                                                                    <Tree content={sec?.negativeMarks} type="Negative marks per question" style={{ color: '#63b1de' }} canHide />
                                                                </Tree>
                                                            ))}
                                                            
                                                            <Tree content={test?.courseCourseId} type="Course" style={{ color: '#63b1de' }} canHide/>
                                                            <Tree content={test?.subjectId} type="Subject" style={{ color: '#63b1de' }} canHide />
                                                            <Tree content={test?.chapterChapterId} type="Chapter" style={{ color: '#63b1de' }} canHide/>
                                                            <Tree content={test?.topicId} type="Topic" style={{ color: '#63b1de' }} canHide/>
                                                        </Tree>
                                                    ))
                                                }
                                            </Tree>
                                        ))} */}
								</div>
							</div>
							{/* <div className='p-4' style={{ display: currentActiveTab == 'q&a' ? 'block' : 'none' }}>
                            <div>
                                    <div className={`h-1`}>Q&A Coming Soon</div>
                                </div>
                            </div>
                            <div className='p-4' style={{ display: currentActiveTab == 'notes' ? 'block' : 'none' }}>
                            <div>
                                    <div className={`h-1`}>Notes Coming Soon</div>
                                </div>
                            </div>
                            <div className='p-4' style={{ display: currentActiveTab == 'reviews' ? 'block' : 'none' }}>
                            <div>
                                    <div className={`h-1`}>Reviews Coming Soon</div>
                                </div>
                            </div> */}

							{getPckRelatedTest.map((sub, i) => (
								<div
									key={i}
									className="p-4"
									style={{
										display:
											currentActiveTab == sub.subjectName ? "block" : "none",
									}}
								>
									<div>
										{/* <div className={`h-3 mb-4`}>Tests<span className="bt-spinner"></span></div> */}
										<TreeList
											subData={sub.testData}
											chapData={sub.chapterData}
											setNodeClick={setNodeClick}
										/>
									</div>

									<div style={{ textAlign: "center" }}>
										{" "}
										{sub.chapterData.length == 0 ? (
											<div className="flex justify-center items-center">
												<span className="bt-spinner"></span>
											</div>
										) : (
											""
										)}
									</div>
								</div>
							))}
						</div>
					</div>
				</div>
			</div>

			<div className={courseType == "allCourse" ? "" : "displayProp"}>
				<div className="max-w-2xl mx-auto py-16 px-4 sm:py-24 sm:px-6 lg:max-w-7xl lg:px-8">
					<div className="grid grid-cols-1 gap-y-10 sm:grid-cols-2 gap-x-6 lg:grid-cols-3 xl:grid-cols-3 xl:gap-x-8">
						{Similardata.map((res, i) => (
							<div className="max-w-6xl mx-auto cursor-pointer">
								<div className="flex items-center justify-center">
									<div
										onClick={() => {
											setData([res]);
											window.scrollTo(0, 0);
										}}
										className="max-w-sm xl:w-full xl:py-6 px-3"
									>
										<div className="bg-white hover:shadow-xl border-gray-50 border-4 rounded-lg overflow-hidden">
											<div
												className="bg-cover bg-center h-56 p-4"
												style={{
													backgroundImage:
														res?.thumbnail != undefined
															? `url(${res.thumbnail})`
															: "url(https://images.unsplash.com/photo-1554415707-6e8cfc93fe23?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=870&q=80)",
												}}
											>
												<div className="flex justify-end">
													<svg
														className="h-6 w-6 text-white fill-current"
														xmlns="http://www.w3.org/2000/svg"
														viewBox="0 0 24 24"
													>
														<path d="M12.76 3.76a6 6 0 0 1 8.48 8.48l-8.53 8.54a1 1 0 0 1-1.42 0l-8.53-8.54a6 6 0 0 1 8.48-8.48l.76.75.76-.75zm7.07 7.07a4 4 0 1 0-5.66-5.66l-1.46 1.47a1 1 0 0 1-1.42 0L9.83 5.17a4 4 0 1 0-5.66 5.66L12 18.66l7.83-7.83z"></path>
													</svg>
												</div>
											</div>
											<div className="p-4">
												<p className="uppercase tracking-wide text-xl font-bold text-gray-700">
													{res.name}
												</p>
												<p className="text-xl text-gray-900">Rs {res?.price}</p>
												<p className="text-gray-700">
													8.5k+ Students Enrolled{" "}
												</p>
											</div>
											<div className="flex p-4 border-t border-gray-300 text-gray-700 gap-4">
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
											<button
												className="px-4 pt-3 w-full shadow-inner pb-4 border-t border-gray-300 items-center bg-indigo-500 
                                                text-white text-xl font-bold"
											>
												Buy now
											</button>
										</div>
									</div>
								</div>
							</div>
						))}
					</div>
				</div>
			</div>
		</div>
	);
};

export default CourseDetails;
