import React, { useEffect, useState } from "react";
import axios from "axios";

const Score = () => {
	const options = {
		headers: {
			"Content-type": "application/json",
			Authorization: "Bearer " + localStorage.getItem("token"),
		},
	};

	const [getReviewData, setReviewData] = useState({});
	const [getTotalData, setTotalData] = useState({});

	useEffect(async () => {
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
		console.log(respReview.data);
		setReviewData(respReview.data);

		let totalQues = 0;
		let quesAttempt = 0;
		let correctAns = 0;
		let wrongAns = 0;
		let netScore = 0;
		let percentile =
			(respReview.data?.percentile && respReview.data?.percentile.toFixed(2)) ||
			0;
		let totalMarks = 0;
		let percentage = 0;
		let rank = respReview.data?.rank;
		let questionAttempt = 0;
		respReview.data?.section.map((d, i) => {
			totalQues = totalQues + d.question.length;
			quesAttempt = quesAttempt + d.answered;
			correctAns = correctAns + d.correctAnswers;
			wrongAns = wrongAns + d.wrongAnswers;
			totalMarks = totalMarks + d.totalMarks;
			netScore = netScore + d.score;
			percentage = ((netScore / totalMarks) * 100).toFixed(2);
			questionAttempt = d.questionAttempt
				? questionAttempt + d.questionAttempt
				: totalQues;
		});
		setTotalData({
			totalQues,
			quesAttempt,
			correctAns,
			wrongAns,
			netScore,
			percentile,
			totalMarks,
			percentage,
			rank,
			questionAttempt,
		});
	}, []);

	return (
		<>
			<main className="w-full z-10 bg-gray-50 mt-2">
				{/* <h2 className='my-10 text-lg font-semibold'>Score Summary</h2> */}
				<div className=" overflow-x-auto">
					<div>
						<table className="w-full table-auto">
							<thead>
								<tr className="bg-blue-300">
									<th className="text-left p-2 text-xs sm:text-base">
										Section Name
									</th>
									<th className="text-left p-2 text-xs sm:text-base">
										No. of ques
									</th>
									<th className="text-left p-2 text-xs sm:text-base">
										No. of ques to answer
									</th>
									<th className="text-left p-2 text-xs sm:text-base">
										Max marks
									</th>
									<th className="text-left p-2 text-xs sm:text-base">
										No. of ques. attempted
									</th>
									<th className="text-left p-2 text-xs sm:text-base">
										No. of correct ans
									</th>
									<th className="text-left p-2 text-xs sm:text-base">
										No of wrong ans
									</th>
									<th className="text-left p-2 text-xs sm:text-base">
										Your net score
									</th>
									<th className="text-left p-2 text-xs sm:text-base">
										Percentage(%)
									</th>
									<th className="text-left p-2 text-xs sm:text-base">Rank</th>
									<th className="text-left p-2 text-xs sm:text-base">
										Your percentile
									</th>
								</tr>
							</thead>
							<tbody>
								{getReviewData?.section?.map((res, i) => (
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
											{res.totalMarks}
										</td>
										<td className="text-left p-2 text-xs sm:text-base">
											{res.answered}
										</td>
										<td className="text-left p-2 text-xs sm:text-base">
											{res.correctAnswers}
										</td>
										<td className="text-left p-2 text-xs sm:text-base">
											{res.wrongAnswers}
										</td>
										<td className="text-left p-2 text-xs sm:text-base">
											{res.score}
										</td>
										<td className="text-left p-2 text-xs sm:text-base">
											{(
												((res.correctAnswers * res.positiveMarks -
													res.wrongAnswers * Math.abs(res.negativeMarks)) /
													res.totalMarks) *
												100
											).toFixed(2) >= 0
												? (
														((res.correctAnswers * res.positiveMarks -
															res.wrongAnswers * Math.abs(res.negativeMarks)) /
															res.totalMarks) *
														100
												  ).toFixed(2)
												: "NA"}
										</td>
										<td className="text-left p-2 text-xs sm:text-base">
											{res?.rank <= 20 ? res?.rank : "NA*"}
										</td>
										<td className="text-left p-2 text-xs sm:text-base">
											{res?.percentile && res?.percentile.toFixed(2)}
										</td>
									</tr>
								))}
								<tr className="bg-gray-200">
									<th className="text-left p-2 text-xs sm:text-base">Total</th>
									<th className="text-left p-2 text-xs sm:text-base">
										{getTotalData.totalQues}
									</th>
									<th className="text-left p-2 text-xs sm:text-base">
										{getTotalData.questionAttempt}
									</th>
									<th className="text-left p-2 text-xs sm:text-base">
										{getTotalData.totalMarks}
									</th>
									<th className="text-left p-2 text-xs sm:text-base">
										{getTotalData.quesAttempt}
									</th>
									<th className="text-left p-2 text-xs sm:text-base">
										{getTotalData.correctAns}
									</th>
									<th className="text-left p-2 text-xs sm:text-base">
										{getTotalData.wrongAns}
									</th>
									<th className="text-left p-2 text-xs sm:text-base">
										{getTotalData.netScore}
									</th>
									<th className="text-left p-2 text-xs sm:text-base">
										{getTotalData.percentage >= 0
											? getTotalData.percentage
											: "NA"}
									</th>
									<th className="text-left p-2 text-xs sm:text-base">
										{getTotalData.rank <= 20 ? getTotalData.rank : "NA*"}
									</th>
									<th className="text-left p-2 text-xs sm:text-base">
										{getTotalData.percentile}
									</th>
								</tr>
							</tbody>
						</table>
					</div>
				</div>
				<p className="my-4 text-gray-700 font-semibold text-sm sm:text-base">
					* Rank is shown only for Top 20 students.
				</p>
			</main>
		</>
	);
};

export default Score;
