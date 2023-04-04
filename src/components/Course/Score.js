import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Score = () => {


    const options = {
        headers: {
            'Content-type': 'application/json',
            "Authorization": 'Bearer ' + localStorage.getItem('token')
        }
    };

    const [getReviewData , setReviewData] = useState({});
    const [getTotalData , setTotalData] = useState({});

    useEffect( async()=>{
        let param = {
            "userId": localStorage.getItem('user'),
            "testId": localStorage.getItem('testid'),
            "packageId": localStorage.getItem('pkgid')
        }
        const respReview = await axios.post(process.env.REACT_APP_API + '/reviewTest', param, options);
        console.log(respReview.data)
        setReviewData(respReview.data)

        let totalQues = 0; 
        let quesAttempt = 0; 
        let correctAns = 0; 
        let wrongAns = 0; 
        let netScore = 0; 
        let percentile = respReview.data?.percentile && respReview.data?.percentile.toFixed(2) || 0; 
        let totalMarks = 0; 
        let percentage = 0; 
        let rank = respReview.data?.rank; 
        let questionAttempt = 0;
        respReview.data?.section.map((d,i)=>{
            totalQues = totalQues + d.question.length;
            quesAttempt = quesAttempt + d.answered
            correctAns = correctAns + d.correctAnswers
            wrongAns = wrongAns + d.wrongAnswers
            totalMarks = totalMarks + d.totalMarks
            netScore = netScore + d.score;
            percentage =((netScore/totalMarks) * 100).toFixed(2);
            questionAttempt = d.questionAttempt ? questionAttempt + d.questionAttempt : totalQues
        })
        setTotalData({totalQues,quesAttempt,correctAns,wrongAns,netScore, percentile, totalMarks, percentage, rank, questionAttempt})
    },[])
    




    return (
        <>
        {/* <main className="absolute w-full min-h-screen z-10 bg-gray-50 text-gray-900 font-sans overflow-x-hidden"> */}
            {/* <h2 className='my-10 text-lg font-semibold'>Score Summary</h2> */}
            <div className="relative px-4 md:flex">
                <div>
                    <table className='' style={{width:'100%'}}>
                        <tbody>
                        <tr className='bg-blue-300'>
                            <th className='text-left p-2'>section Name</th>
                            <th className='text-left p-2'>No. of ques</th>
                            <th className='text-left p-2'>No. of ques to answer</th>
                            <th className='text-left p-2'>Max marks</th>
                            <th className='text-left p-2'>No. of ques. attempted</th>
                            <th className='text-left p-2'>No. of correct ans</th>
                            <th className='text-left p-2'>No of wrong ans</th>
                            <th className='text-left p-2'>Your net score</th>
                            <th className='text-left p-2'>Percentage(%)</th>
                            <th className='text-left p-2'>Rank</th>
                            <th className='text-left p-2'>Your percentile</th>
                           
                        </tr>
                        {getReviewData?.section?.map((res, i) => (
                            <tr key={i} className='bg-gray-200'>
                                <td className='text-left p-2'>{res.sectionName}</td>
                                <td className='text-left p-2'>{res.question.length}</td>
                                <td className='text-left p-2'>{res.questionAttempt ? res.questionAttempt : res.question.length}</td>
                                <td className='text-left p-2'>{res.totalMarks}</td>
                                <td className='text-left p-2'>{res.answered}</td>
                                <td className='text-left p-2'>{res.correctAnswers}</td>
                                <td className='text-left p-2'>{res.wrongAnswers}</td>
                                <td className='text-left p-2'>{res.score}</td>
                                <td className='text-left p-2'>{(((((res.correctAnswers * res.positiveMarks) - (res.wrongAnswers * Math.abs(res.negativeMarks)))/res.totalMarks) * 100).toFixed(2)) >= 0 ?
                                    ((((res.correctAnswers * res.positiveMarks) - (res.wrongAnswers * Math.abs(res.negativeMarks)))/res.totalMarks) * 100).toFixed(2) : 'NA'
                                }</td>
                                <td className='text-left p-2'>{(res?.rank <= 20) ? res?.rank : 'NA*'}</td>
                                <td className='text-left p-2'>{res?.percentile &&  res?.percentile.toFixed(2)}</td>
                            </tr>
                            
                        ))}
                        <tr className='bg-gray-200'>
                                <th className='text-left p-2'>Total</th>
                                <th className='text-left p-2'>{getTotalData.totalQues}</th>
                                <th className='text-left p-2'>{getTotalData.questionAttempt}</th>
                                <th className='text-left p-2'>{getTotalData.totalMarks}</th>
                                <th className='text-left p-2'>{getTotalData.quesAttempt}</th>
                                <th className='text-left p-2'>{getTotalData.correctAns}</th>
                                <th className='text-left p-2'>{getTotalData.wrongAns}</th>
                                <th className='text-left p-2'>{getTotalData.netScore}</th>
                                <th className='text-left p-2'>{(getTotalData.percentage >= 0) ? getTotalData.percentage : 'NA' }</th>
                                <th className='text-left p-2'>{(getTotalData.rank <= 20) ? getTotalData.rank : 'NA*'}</th>
                                <th className='text-left p-2'>{getTotalData.percentile}</th>
                                
                            </tr>
                        </tbody>
                    </table>
                    <p>* Rank is shown only for Top 20 students.</p>
                </div>
            </div>
            
         {/* </main> */}
        </>
    )
}

export default Score;