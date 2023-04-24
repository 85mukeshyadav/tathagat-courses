import React from "react";
import { Routes, Route } from "react-router-dom";
import Page404 from "./components/404";
import Signin from "./components/Auth/signin";
import Signup from "./components/Auth/Signup";
import Blogs from "./components/Blogs";
import CourseDetails from "./components/Course/courseDetails";
import CourseList from "./components/Course/courselist";
import MyCourses from "./components/Course/myCourses";
import Homepage from "./components/Homepage";
import Examination from "./Exam/Examination";
import Exam from "./Exam/examScreen";
import Review from "./Exam/Review";
import Analysis from "./components/Course/Analysis";
import TestExam from "./Exam/TestExam";
import ExamFinished from "./components/ExamFinished";

/**
 * Routes component containing routes for the whole application
 * @returns {JSX}
 */
const Rout = (props) => (
	<Routes>
		<Route exact path="signin" element={<Signin />} />
		<Route exact path="signup" element={<Signup />} />
		<Route exact path="courses" element={<CourseList />} />
		<Route exact path="myCourses" element={<MyCourses />} />
		<Route
			exact
			path="courseDetails/:courseType"
			element={<CourseDetails {...props} />}
		/>
		<Route exact path="Exam" element={<Exam />} />
		<Route exact path="examination" element={<Examination />} />
		<Route exact path="review" element={<Review />} />
		<Route exact path="analysis" element={<Analysis />} />
		<Route exact path="" element={<Homepage />} />
		<Route exact path="/blogs" element={<Blogs />} />
		<Route exact path="/test/:pkgid/:testid/:user" element={<TestExam />} />
		<Route exact path="/exam-finished" element={<ExamFinished />} />
		{/* <Navigate exacts from='/' to='/login' /> */}
		<Route exact path="*" element={<Page404 />} />
	</Routes>
);

export default Rout;
