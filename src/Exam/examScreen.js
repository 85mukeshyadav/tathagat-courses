//import liraries
import React, { useEffect, useState, useRef } from 'react';
import { Navigate } from 'react-router-dom';
import { FiClock } from "react-icons/fi";
import moment from 'moment';


// create a component
const Exam = () => {

    const [ Question, setQuestion ] = useState([])
    const [ currentIndex, setcurrentIndex ] = useState(0)
    const [ timer, settimer ] = useState(() => 120)
    const savedCallback = useRef()
    const [ count, setCount ] = useState(180 * 60);

    useEffect(async () => {
        const res = await fetch('https://opentdb.com/api.php?amount=10&category=19&type=multiple')
        let data = res.data
        data = await res.json()
        console.log("🚀 ~ file: examScreen.js ~ line 15 ~ useEffect ~ res", data.results)
        setQuestion(data.results)
    }, [])

    function Counter() {

        useInterval(() => {
            // Your custom logic here
            setCount(count - 1);
        }, 1000);
        const duration = moment.duration(count, 'seconds')
        const h = duration.hours(); // 20
        const m = duration.minutes(); // 20
        const s = duration.seconds();


        return <h1>{ `${h}:${m}:${s} Min` }</h1>;
    }

    function useInterval(callback, delay) {
        const savedCallback = useRef();

        // Remember the latest function.
        useEffect(() => {
            savedCallback.current = callback;
        }, [ callback ]);

        // Set up the interval.
        useEffect(() => {
            function tick() {
                savedCallback.current();
            }
            if (delay !== null) {
                let id = setInterval(tick, delay);
                return () => clearInterval(id);
            }
        }, [ delay ]);
    }

    return (

        <div className="bg-gray-50 h-screen p-2">
            <div className="flex flex-row justify-between ml-10 mr-20 items-center">
                <div className="p-4 text-gray-600 text-xl font-bold">UPSC EXAM</div>
                <div className="bg-indigo-100 rounded-xl overflow-hidden">
                    <button className='p-4 text-gray-500 hover:bg-indigo-600 hover:text-white font-semibold pl-6 pr-6'>English</button>
                    <button className='p-4 text-gray-50 font-semibold bg-indigo-500 hover:bg-indigo-600 hover:text-gray-50 pl-6 pr-6'>Analytical Ability</button>
                    <button className='p-4 text-gray-500 font-semibold hover:bg-indigo-500 hover:text-gray-50 pl-6 pr-6'>Programming</button>
                </div>
                <div style={ { minWidth: 200 } } className="flex items-center">
                    <div className="mr-4 bg-indigo-50 p-3 rounded-full">
                        <FiClock className="text-indigo-500 text-xl" />
                    </div>
                    <div className="flex flex-col items-end">
                        <h3 className="font-semibold text-xl text-gray-500">
                            <Counter />
                        </h3>
                        <p className='text-gray-500'>Time Left</p>
                    </div>
                </div>
            </div>
            <div className="h-1 mt-2 mb-2 bg-gray-100 w-full"></div>
            <div className="flex flex-row">

                { Question.map((res, i) => (
                    currentIndex == i ?
                        <section className='flex flex-col p-10 pt-2 bg-gray-50 h-full w-9/12'>
                            <div id='question' className='flex flex-col justify-between p-2 pt-0'>
                                <div className="flex flex-col items-start">
                                    <h4 className='text-gray-400 font-medium'>Question { i + 1 }</h4>
                                    <p dangerouslySetInnerHTML={ { __html: res?.question } } className="text-indigo-600 text-left font-bold text-xl mt-2">
                                    </p>
                                </div>
                                <div className="h-1 mt-2 mb-2 bg-gray-100 w-full"></div>
                            </div>
                            <div id='ans' className='h-full'>
                                <div className="flex items-center space-x-3 bg-white hover:border-l-indigo-500 hover:border-l-4 cursor-pointer p-4 rounded-sm">
                                    <input id={ res?.correct_answer } type="radio" name='ans' className="appearance cursor-pointer checked:text-indigo-500 h-6 w-6" />
                                    <h3 className="text-gray-900 group-hover:text-white text-sm text-left font-semibold">
                                        { res?.correct_answer }
                                    </h3>
                                </div>
                                { res?.incorrect_answers.map((data, index) => (
                                    <div className="flex items-center space-x-3 bg-white hover:border-l-indigo-500 hover:border-l-4 cursor-pointer p-4 rounded-sm mt-2">
                                        <input type="radio" id={ data } name='ans' className="appearance cursor-pointer checked:text-indigo-500 hover:ring-2 h-6 w-6" />
                                        <h3 className="text-gray-900 group-hover:text-white text-sm font-semibold text-left">
                                            { data }
                                        </h3>
                                    </div>
                                )) }
                            </div>
                        </section>
                        : null
                )) }
                <div className="flex flex-col justify-between p-2 bg-white w-1/5 rounded-xl">
                    <div className=''>
                        { Question.map((_, i) => (
                            <button onClick={ () => {
                                setcurrentIndex(i)
                            } } style={ { backgroundColor: currentIndex == i ? '#93FFD8' : 'rgb(129, 140, 248)' } } className="p-2 w-12 h-12 text-xl border-l-indigo-400 hover:text-white bg-indigo-200 m-2 rounded-full hover:bg-indigo-500">
                                { i + 1 }
                            </button>
                        )) }
                    </div>
                    <div className="" >
                        <button onClick={ () => {
                            if (Question.length > currentIndex - 1 && currentIndex != 0)
                                setcurrentIndex(currentIndex - 1)
                        } } className='p-2 pl-4 pr-4 w-28 hover:bg-indigo-500 border-indigo-300 border-2 hover:text-white text-gray-800 text-xl mr-10 rounded-xl'>Previous</button>
                        <button onClick={ () => {
                            if (currentIndex + 1 < Question.length)
                                setcurrentIndex(currentIndex + 1)
                        } } className='p-2 pl-4 pr-4 w-28 hover:bg-indigo-500 border-indigo-300 border-2 hover:text-white text-gray-800 text-xl rounded-xl'>Next</button>
                    </div>
                </div>
            </div>
        </div >
    );
};


export default Exam;