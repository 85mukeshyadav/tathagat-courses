import React from "react";
import { Route, Routes } from "react-router-dom";
import Examination from "./Exam/Examination";
import Review from "./Exam/Review";
import TestExam from "./Exam/TestExam";
import Exam from "./Exam/examScreen";
import Page404 from "./components/404";
import Login from "./components/Auth/Login";
import Signup from "./components/Auth/Signup";
import Signin from "./components/Auth/signin";
import Blogs from "./components/Blogs";
import Bookmarks from "./components/Bookmarks";
import Contact from "./components/Contact";
import Analysis from "./components/Course/Analysis";
import CourseDetails from "./components/Course/courseDetails";
import CourseInfo from "./components/Course/courseInfo";
import CourseList from "./components/Course/courselist";
import MyCourses from "./components/Course/myCourses";
import ExamFinished from "./components/ExamFinished";
import Homepage from "./components/Homepage";
import PaymentSuccess from "./components/PaymentSuccess";
import Privacy from "./components/Privacy";
import Profile from "./components/Profile";
import Refund from "./components/Refund";
import Terms from "./components/Terms";

/**
 * Routes component containing routes for the whole application
 * @returns {JSX}
 */
const Rout = (props) => (
	<Routes>
		<Route exact path="signin" element={<Signin />} />
		<Route exact path="signup" element={<Signup />} />
		<Route exact path="courses" element={<CourseList />} />
		<Route exact path="courses/:slug/:pkgid" element={<CourseInfo />} />
		<Route exact path="myCourses" element={<MyCourses />} />
		<Route exact path="bookmarks" element={<Bookmarks />} />
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
		<Route exact path="/test/:pkgid/:testid" element={<TestExam />} />
		<Route exact path="/ssologin/:token/:user" element={<Login />} />
		<Route exact path="/exam-finished" element={<ExamFinished />} />
		<Route exact path="/payment-success" element={<PaymentSuccess />} />
		<Route exact path="/profile" element={<Profile />} />
		<Route exact path="/contact" element={<Contact />} />
		<Route exact path="/terms-conditions" element={<Terms />} />
		<Route exact path="/privacy-policy" element={<Privacy />} />
		<Route exact path="/refund-policy" element={<Refund />} />
		<Route exact path="*" element={<Page404 />} />
	</Routes>
);

export default Rout;
