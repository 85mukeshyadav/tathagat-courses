import React, { useState, useEffect } from "react";
import "highcharts/css/highcharts.css";
import HighchartsReact from "highcharts-react-official";
import Highcharts from "highcharts";
import axios from "axios";

require("highcharts/modules/exporting")(Highcharts);
require("highcharts/modules/annotations")(Highcharts);
require("highcharts/modules/accessibility")(Highcharts);

const Analysis = () => {
	const options = {
		headers: {
			"Content-type": "application/json",
			Authorization: "Bearer " + localStorage.getItem("token"),
		},
	};

	const [hoverData, setHoverData] = useState(null);
	const [getAnalysisData, setAnalysisData] = useState({});
	const [getChartReportData, setChartReportData] = useState({});
	const [chartOptions, setChartOptions] = useState({
		title: {
			text: "Performance",
		},
		chart: {
			type: "line",
			// make the chart responsive
			width: window.innerWidth,
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
			userId: localStorage.getItem("user"),
			testId: localStorage.getItem("testid"),
			packageId: localStorage.getItem("pkgid"),
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
			<div className="">
				<div className="flex">
					<HighchartsReact highcharts={Highcharts} options={chartOptions} />
				</div>
				{/* <h3>Hovering over {hoverData}</h3>
            <button onClick={updateSeries}>Update Series</button> */}

				<div className="relative px-4 anal-tab">
					<div className="grp-sec">
						<div className="sm:text-lg font-bold my-2">
							Section Wise Performance
						</div>
						<div className="grp-sec-data">
							{getAnalysisData?.section?.map((res, i) => (
								<>
									<div key={i}>
										<div className="font-bold sm:text-2xl my-4">
											Section Name - {res.sectionName}{" "}
										</div>
										<table className="table-auto sm:w-full">
											<tbody>
												<tr className="bg-blue-300">
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
												<tr className="bg-gray-200">
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
												<tr className="bg-gray-200">
													<td className="text-left p-1 sm:p-2 text-xs sm:text-lg">
														Average
													</td>
													<td className="text-left p-1 sm:p-2 text-xs sm:text-lg"></td>
													<td className="text-left p-1 sm:p-2 text-xs sm:text-lg"></td>
													<td className="text-left p-1 sm:p-2 text-xs sm:text-lg"></td>
													<td className="text-left p-1 sm:p-2 text-xs sm:text-lg"></td>
													<td className="text-left p-1 sm:p-2 text-xs sm:text-lg"></td>
													{/* <td className='text-left p-1 sm:p-2'></td> */}
												</tr>
												<tr className="bg-gray-200">
													<td className="text-left p-1 sm:p-2 text-xs sm:text-lg">
														Median
													</td>
													<td className="text-left p-1 sm:p-2 text-xs sm:text-lg"></td>
													<td className="text-left p-1 sm:p-2 text-xs sm:text-lg"></td>
													<td className="text-left p-1 sm:p-2 text-xs sm:text-lg"></td>
													<td className="text-left p-1 sm:p-2 text-xs sm:text-lg"></td>
													<td className="text-left p-1 sm:p-2 text-xs sm:text-lg"></td>
													{/* <td className='text-left p-2'></td> */}
												</tr>
											</tbody>
										</table>

										<div className="text-md font-bold my-4">
											Strengths and Weaknesses
										</div>

										<table className="table-auto sm:w-full">
											<tbody>
												<tr className="bg-blue-300">
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
														Your Answers
													</th>
													<th className="text-left p-2 text-sm sm:text-lg">
														Correct Option
													</th>
												</tr>

												{res?.question.map((ques, ind) => (
													<tr key={`${i}-${ind}`} className="bg-gray-200">
														<td className="text-left p-2 text-xs sm:text-lg">
															{ind + 1}
														</td>
														<td className="text-left p-2 text-xs sm:text-lg">
															{ques.topicName ? ques.topicName : "--"}
														</td>
														<td className="text-left p-2 text-xs sm:text-lg">
															{ques.answer_status ? ques.answer_status : "--"}
														</td>
														<td className="text-left p-2 text-xs sm:text-lg">
															{ques.optionType == "input"
																? ques.usersAnswer
																	? ques.usersAnswer
																	: "--"
																: ques.user_answer != -1
																? ques.user_answer
																: "--"}
														</td>
														<td className="text-left p-2 text-xs sm:text-lg">
															{ques.correctoption ? ques.correctoption : "--"}
														</td>
													</tr>
												))}
											</tbody>
										</table>

										<table className="table-auto sm:w-full mt-12">
											<tbody>
												<tr className="bg-blue-300">
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
													<tr className="bg-gray-200">
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

export default Analysis;
