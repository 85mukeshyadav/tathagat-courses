import axios from "axios";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import "highcharts/css/highcharts.css";
import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

require("highcharts/modules/exporting")(Highcharts);
require("highcharts/modules/annotations")(Highcharts);
require("highcharts/modules/accessibility")(Highcharts);

const AnalysisOld = () => {
	const options = {
		headers: {
			"Content-type": "application/json",
			Authorization: "Bearer " + localStorage.getItem("token"),
		},
	};

	const [searchParams] = useSearchParams();
	const [hoverData, setHoverData] = useState(null);
	const [getAnalysisData, setAnalysisData] = useState({});
	const [getChartReportData, setChartReportData] = useState({});
	const [chartOptions, setChartOptions] = useState({
		title: {
			text: "Performance",
		},
		chart: {
			type: "line",
			width: 1200,
			styledMode: true,
		},
		xAxis: {
			categories: [],
			title: {
				text: "Marks Range",
			},
		},
		yAxis: {
			title: {
				text: "Percentage of student",
			},
		},
		credits: {
			enabled: false,
		},
		series: [
			{
				showInLegend: false,
				data: [],
			},
		],
	});

	const updateSeries = () => {
		setChartOptions({
			series: [{ data: [Math.random() * 5, 2, 1] }],
		});
	};

	useEffect(async () => {
		let param = {
			userId: searchParams.get("user") || localStorage.getItem("user"),
			testId: searchParams.get("testid") || localStorage.getItem("testid"),
			packageId: searchParams.get("pkgid") || localStorage.getItem("pkgid"),
		};
		const resp = await axios.post(
			process.env.REACT_APP_API + "/test-analysis",
			param,
			options
		);
		console.log("11111", resp.data);
		setAnalysisData(resp.data);

		const respRep = await axios.post(
			process.env.REACT_APP_API + "/report-user-stand",
			param,
			options
		);
		console.log("22222", respRep.data);
		setChartReportData(respRep.data);
		let dataArr = [];
		let xAxisData = [];
		let userMarksRange = respRep.data?.userMarksRange;
		respRep.data?.studens_marks.map((re, i) => {
			let tt = {
				y: parseFloat(re.userPersentage.toFixed(2)),
			};
			if (userMarksRange == re.marks_range) {
				tt = {
					y: parseFloat(re.userPersentage.toFixed(2)),
					dataLabels: {
						className: "highlight",
					},
				};
			}
			dataArr.push(tt);
			xAxisData.push(re.marks_range);
		});
		setChartOptions({
			plotOptions: {
				series: {
					dataLabels: {
						enabled: true,
						borderRadius: 2,
						y: -10,
						shape: "callout",
						formatter: function () {
							if (userMarksRange != this.x) {
								return this.y + "%";
							}
							return this.y + "% (You stand here)";
						},
					},
				},
			},
			series: [
				{
					//keys: ['y', 'id'],
					data: dataArr,
				},
			],
			xAxis: {
				categories: xAxisData,
			},

			//   annotations: [{
			//     labels: [{
			//         point: { x: '16-20', y: 10 },
			//         text: 'You stand here'
			//     }],
			//     shapes: [{
			//         point: '16-20',
			//         type: 'rect',
			//         width: 20,
			//         height: 20,
			//         x: -10,
			//         y: -25
			//     }]
			// }]
		});
	}, []);

	return (
		<>
			<div className="container-center">
				<HighchartsReact highcharts={Highcharts} options={chartOptions} />
				{/* <h3>Hovering over {hoverData}</h3>
            <button onClick={updateSeries}>Update Series</button> */}

				<div className="relative px-4 anal-tab">
					<div className="grp-sec">
						<div className="grp-nma">Section Wise Performance</div>
						<div className="grp-sec-data">
							{getAnalysisData?.section?.map((res, i) => (
								<>
									<div key={i}>
										<div className="grp-sec-name" style={{ marginTop: "50px" }}>
											Section Name - {res.sectionName}{" "}
										</div>
										<table className="" style={{ width: "100%" }}>
											<tbody>
												<tr className="bg-blue-300">
													<th className="text-left p-2"></th>
													<th className="text-left p-2">Score</th>
													<th className="text-left p-2">Attempted</th>
													<th className="text-left p-2">Correct</th>
													<th className="text-left p-2">Incorrect</th>
													<th className="text-left p-2">Un-attempted</th>
													{/* <th className='text-left p-2'>Accuracy</th> */}
												</tr>
												<tr className="bg-gray-200">
													<td className="text-left p-2">User</td>
													<td className="text-left p-2">{res.score}</td>
													<td className="text-left p-2">{res.answered}</td>
													<td className="text-left p-2">
														{res.correctAnswers}
													</td>
													<td className="text-left p-2">{res.wrongAnswers}</td>
													<td className="text-left p-2">{res.unanswered}</td>
													{/* <td className='text-left p-2'>{res.unanswered}</td> */}
												</tr>
												<tr className="bg-gray-200">
													<td className="text-left p-2">Average</td>
													<td className="text-left p-2"></td>
													<td className="text-left p-2"></td>
													<td className="text-left p-2"></td>
													<td className="text-left p-2"></td>
													<td className="text-left p-2"></td>
													{/* <td className='text-left p-2'></td> */}
												</tr>
												<tr className="bg-gray-200">
													<td className="text-left p-2">Median</td>
													<td className="text-left p-2"></td>
													<td className="text-left p-2"></td>
													<td className="text-left p-2"></td>
													<td className="text-left p-2"></td>
													<td className="text-left p-2"></td>
													{/* <td className='text-left p-2'></td> */}
												</tr>
											</tbody>
										</table>

										<div className="">Strengths and Weaknesses</div>

										<table className="" style={{ width: "100%" }}>
											<tbody>
												<tr className="bg-blue-300">
													<th className="text-left p-2">Question</th>
													<th className="text-left p-2">Topic</th>
													<th className="text-left p-2">Status</th>
													<th className="text-left p-2">Yours Answer</th>
													<th className="text-left p-2">Correct Option</th>
												</tr>

												{res?.question.map((ques, ind) => (
													<tr key={`${i}-${ind}`} className="bg-gray-200">
														<td className="text-left p-2">{ind + 1}</td>
														<td className="text-left p-2">
															{ques.topicName ? ques.topicName : "--"}
														</td>
														<td className="text-left p-2">
															{ques.answer_status ? ques.answer_status : "--"}
														</td>
														<td className="text-left p-2">
															{ques.optionType == "input"
																? ques.usersAnswer
																	? ques.usersAnswer
																	: "--"
																: ques.user_answer != -1
																? ques.user_answer
																: "--"}
														</td>
														<td className="text-left p-2">
															{ques.correctoption ? ques.correctoption : "--"}
														</td>
													</tr>
												))}
											</tbody>
										</table>

										<table
											className=""
											style={{
												width: "100%",
												marginTop: "15px",
												marginBottom: "100px",
												borderBottom: "1px solid red",
											}}
										>
											<tbody>
												<tr className="bg-blue-300">
													<th className="text-left p-2">Chapter Name</th>
													<th className="text-left p-2">Scale (0-10)</th>
													<th className="text-left p-2">Remarks</th>
												</tr>

												{res?.chapterReport.map((chap, ind) => (
													<tr className="bg-gray-200">
														<td className="text-left p-2">
															{chap.chapterName}
														</td>
														<td className="text-left p-2">{chap.scale}</td>
														<td className="text-left p-2">{chap.remarks}</td>
													</tr>
												))}
											</tbody>
										</table>
									</div>
								</>
							))}
						</div>
					</div>
				</div>
			</div>
		</>
	);
};

export default AnalysisOld;
