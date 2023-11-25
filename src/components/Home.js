import { useQuery } from "@tanstack/react-query";
import ms from "ms";
import { Link } from "react-router-dom";
import apiClient from "../api/apiClient";
import slugify from "../utils/slugify";
import Loader from "./Loader";
import about from "./images/about.jpg";
import homebanner from "./images/homebanner1.jpg";
import improvement from "./images/improvement.png";
import language from "./images/language.png";
import learn from "./images/learn.png";
import practice from "./images/practice.png";

const Home = () => {
	const { data, isLoading } = useQuery({
		queryKey: ["getrandomPkg"],
		queryFn: () =>
			apiClient
				.get("/getrndmpkg")
				.then((res) => res.data?.filter((i) => i?.show_to_all == 1)),
		staleTime: ms("24h"),
	});

	if (isLoading) return <Loader />;

	return (
		<>
			<meta charSet="utf-8" />
			<title>
				MYTATHAGAT - Make Exam Better! - Online Test Series &amp; Mock Test for
				CAT , IPMAT &amp; CUET
			</title>
			<meta content="width=device-width, initial-scale=1.0" name="viewport" />
			{/* Favicon */}
			<link href="images/favicon.ico" rel="icon" />
			{/* Carousel Start */}
			<div className="container-fluid p-0 mb-5">
				<div className="banner">
					<img className="img-fluid" src={homebanner} alt="" />
					<div className="position-absolute top-0 start-0 w-100 h-100 d-flex align-items-center">
						<div className="container">
							<div className="row justify-content-start">
								<div className="col-sm-10 col-lg-8">
									<h5 className="text-primary text-uppercase mb-3 animated slideInDown">
										Welcome to the mytathagat
									</h5>
									<h1 className="display-4 text-white animated slideInDown">
										India's Best Online Exam Platform
									</h1>
									<p className="fs-5 text-white mb-4 pb-2">
										One Destination for Complete Exam Preparation
									</p>
									<a
										href="https://mytathagat.com/signup"
										className="btn btn-primary py-md-3 px-md-5 me-3 animated slideInLeft"
									>
										Signup
									</a>
									<a
										href="https://mytathagat.com/signin"
										className="btn btn-light py-md-3 px-md-5 animated slideInRight"
									>
										Login
									</a>
								</div>
							</div>
						</div>
					</div>
				</div>
				{/* Carousel Start */}
				<div className="carousel-wrapper">
					<div className="container">
						<div className="row">
							<div className="owl-carousel header-carousel">
								<div className="owl-carousel-item position-relative">
									<p>Interview Courses</p>
								</div>
								<div className="owl-carousel-item">
									<p>Career Skills</p>
								</div>
								<div className="owl-carousel-item">
									<p>Internship Courses</p>
								</div>
								<div className="owl-carousel-item">
									<p>2000+ Ebooks</p>
								</div>
								<div className="owl-carousel-item">
									<p>500+ Videos</p>
								</div>
								<div className="owl-carousel-item">
									<p> 2000+ Exams</p>
								</div>
								<div className="owl-carousel-item">
									<p> 2000+ Exams</p>
								</div>
							</div>
						</div>
					</div>
					{/* Carousel End */}
				</div>
				{/* Carousel End */}
				{/* Service Start */}
				<div className="container-xxl py-5">
					<div className="container">
						<div className="row g-4">
							<div
								className="col-lg-3 col-sm-6 wow fadeInUp"
								data-wow-delay="0.1s"
							>
								<div className="service-item text-center pt-3">
									<div className="p-4">
										<i className="icon">
											<img src={learn} alt="learn" />
										</i>
										<h5 className="mb-3">
											Learn from
											<br /> the best
										</h5>
										<p>
											Learn from the masters of the subject, in the most
											engaging yet simplified ways
										</p>
									</div>
								</div>
							</div>
							<div
								className="col-lg-3 col-sm-6 wow fadeInUp"
								data-wow-delay="0.3s"
							>
								<div className="service-item text-center pt-3">
									<div className="p-4">
										<i className="icon">
											<img src={practice} alt="learn" />
										</i>
										<h5 className="mb-3">
											Live Tests for Real
											<br /> Exam Experience
										</h5>
										<p>
											Feel the thrill of a real exam. Improve your time &amp;
											pressure management skills
										</p>
									</div>
								</div>
							</div>
							<div
								className="col-lg-3 col-sm-6 wow fadeInUp"
								data-wow-delay="0.5s"
							>
								<div className="service-item text-center pt-3">
									<div className="p-4">
										<i className="icon">
											<img src={improvement} alt="learn" />
										</i>
										<h5 className="mb-3">
											Detailed Score
											<br /> Analysis
										</h5>
										<p>
											Get a detailed breakdown of your strengths &amp;
											weaknesses and discover insights to improve your score
										</p>
									</div>
								</div>
							</div>
							<div
								className="col-lg-3 col-sm-6 wow fadeInUp"
								data-wow-delay="0.7s"
							>
								<div className="service-item text-center pt-3">
									<div className="p-4">
										<i className="icon">
											<img src={language} alt="learn" />
										</i>
										<h5 className="mb-3">
											Multilingual: 2<br /> Languages
										</h5>
										<p>
											Learn in the language you are most comfortable with.
											Choose from any of our 2 languages
										</p>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
				{/* Service End */}
				{/* About Start */}
				<div className="container-xxl py-5">
					<div className="container">
						<div className="row g-5">
							<div className="col-lg-6 wow fadeInUp" data-wow-delay="0.3s">
								<h6 className="section-title bg-white text-start text-primary pe-3">
									About Us
								</h6>
								<h1 className="mb-4">Why Mytathagat?</h1>
								<p className="mb-4">
									TATHAGAT = PERSONALIZED ATTENTION (LIMITED STUDENTS)+ALL
									SENIOR CAT TRAINERS +CURRICULUM TUNED TO MAJOR MBA ENTRANCE
									EXAMS.
								</p>
								<div className="row gy-2 gx-4 mb-4">
									<div className="col-sm-6">
										<p className="mb-0">
											<i className="fa fa-chevron-right text-primary me-2" />
											All India Rank
										</p>
									</div>
									<div className="col-sm-6">
										<p className="mb-0">
											<i className="fa fa-chevron-right text-primary me-2" />
											Latest Exam Patterns
										</p>
									</div>
									<div className="col-sm-6">
										<p className="mb-0">
											<i className="fa fa-chevron-right text-primary me-2" />
											In-depth Performance Analysis
										</p>
									</div>
									<div className="col-sm-6">
										<p className="mb-0">
											<i className="fa fa-chevron-right text-primary me-2" />
											Economical Viability
										</p>
									</div>
									<div className="col-sm-6">
										<p className="mb-0">
											<i className="fa fa-chevron-right text-primary me-2" />
											4000+ Students
										</p>
									</div>
									<div className="col-sm-6">
										<p className="mb-0">
											<i className="fa fa-chevron-right text-primary me-2" />
											Free Mock Test
										</p>
									</div>
								</div>
								<a className="btn btn-primary py-3 px-5 mt-2" href="">
									Read More
								</a>
							</div>
							<div
								className="col-lg-6 wow fadeInUp"
								data-wow-delay="0.1s"
								style={{ minHeight: 400 }}
							>
								<div className="position-relative h-100">
									<img
										className="img-fluid position-absolute w-100 h-100"
										src={about}
										alt=""
										style={{ objectFit: "cover" }}
									/>
								</div>
							</div>
						</div>
					</div>
				</div>
				{/* About End */}
				{/* Categories Start */}
				<div className="container-xxl py-5 category">
					<div className="container">
						<div className="text-center wow fadeInUp" data-wow-delay="0.1s">
							<h6 className="section-title bg-white text-center text-primary px-3">
								Categories
							</h6>
							<h1 className="mb-5">Popular Courses</h1>
						</div>
						<div className="row g-3">
							<div
								className="col-lg-5 col-md-6 wow zoomIn"
								data-wow-delay="0.7s"
								style={{ minHeight: 350 }}
							>
								<a
									className="position-relative d-block h-100 overflow-hidden"
									href="https://online.tathagat.co.in/courses/quant-cat22/"
									target="_blank"
								>
									<img
										className="img-fluid position-absolute w-100 h-100"
										src="https://online.tathagat.co.in/wp-content/uploads/2022/07/bg1-870x440.jpeg"
										alt=""
										style={{ objectFit: "cover" }}
									/>
									<div
										className="bg-white position-absolute bottom-0 end-0 py-2 px-3"
										style={{ margin: 1 }}
									>
										<h5 className="m-0">Quant – CAT 23</h5>
										<small className="text-primary">Lectures: 34</small>
									</div>
								</a>
							</div>
							<div className="col-lg-7 col-md-6">
								<div className="row g-3">
									<div
										className="col-lg-12 col-md-12 wow zoomIn"
										data-wow-delay="0.1s"
									>
										<a
											className="position-relative d-block overflow-hidden"
											href="https://online.tathagat.co.in/courses/online-lr-di-course-for-cat-and-other-b-school-exams/"
										>
											<img
												className="img-fluid"
												src="https://online.tathagat.co.in/wp-content/uploads/2018/08/photo-1507457379470-08b800bebc67-1-870x440.jpeg"
												alt=""
											/>
											<div
												className="bg-white position-absolute bottom-0 end-0 py-2 px-3"
												style={{ margin: 1 }}
											>
												<h5 className="m-0">LR DI – CAT 23</h5>
												<small className="text-primary">Lectures: 18</small>
											</div>
										</a>
									</div>
									<div
										className="col-lg-6 col-md-12 wow zoomIn"
										data-wow-delay="0.3s"
									>
										<a
											className="position-relative d-block overflow-hidden"
											href="https://online.tathagat.co.in/courses/vocab-cat22/"
										>
											<img
												className="img-fluid"
												src="https://online.tathagat.co.in/wp-content/uploads/2018/08/photo-1461749280684-dccba630e2f6-1-870x440.jpeg"
												alt=""
											/>
											<div
												className="bg-white position-absolute bottom-0 end-0 py-2 px-3"
												style={{ margin: 1 }}
											>
												<h5 className="m-0">Vocab – CAT 23</h5>
												<small className="text-primary">Lectures: 10</small>
											</div>
										</a>
									</div>
									<div
										className="col-lg-6 col-md-12 wow zoomIn"
										data-wow-delay="0.5s"
									>
										<a
											className="position-relative d-block overflow-hidden"
											href="https://online.tathagat.co.in/courses/quant-test-package/"
										>
											<img
												className="img-fluid"
												src="https://online.tathagat.co.in/wp-content/uploads/2018/08/photo-1512686096451-a15c19314d59-1-870x440.jpeg"
												alt=""
											/>
											<div
												className="bg-white position-absolute bottom-0 end-0 py-2 px-3"
												style={{ margin: 1 }}
											>
												<h5 className="m-0">Quant Test Package</h5>
												<small className="text-primary">Lectures: 1</small>
											</div>
										</a>
									</div>
								</div>
							</div>
							<div
								className="col-lg-12 col-md-12 wow zoomIn view-more"
								data-wow-delay="0.5s"
							>
								<a
									href="https://online.tathagat.co.in/our-courses/"
									className="btn btn-primary"
								>
									View All Courses
								</a>
							</div>
						</div>
					</div>
				</div>
				{/* Categories Start */}
				<div className="container-xxl py-5 category">
					<div className="card-box">
						<nav className="container">
							<div className="text-center wow fadeInUp" data-wow-delay="0.1s">
								<h6 className="section-title bg-white text-center text-primary px-3">
									All Categories
								</h6>
								<h1 className="mb-5">Courses</h1>
							</div>
							<div className="nav nav-tabs mb-3" id="nav-tab" role="tablist">
								<button
									className="nav-link active"
									id="nav-home-tab"
									data-bs-toggle="tab"
									data-bs-target="#nav-tab1"
									type="button"
									role="tab"
									aria-controls="nav-home"
									aria-selected="true"
								>
									All
								</button>
								<button
									className="nav-link"
									id="nav-profile-tab"
									data-bs-toggle="tab"
									data-bs-target="#nav-tab2"
									type="button"
									role="tab"
									aria-controls="nav-profile"
									aria-selected="false"
								>
									CAT , IPMAT &amp; CUET
								</button>
								<button
									className="nav-link"
									id="nav-contact-tab"
									data-bs-toggle="tab"
									data-bs-target="#nav-tab3"
									type="button"
									role="tab"
									aria-controls="nav-contact"
									aria-selected="false"
								>
									SSC
								</button>
								<button
									className="nav-link"
									id="nav-home-tab"
									data-bs-toggle="tab"
									data-bs-target="#nav-tab4"
									type="button"
									role="tab"
									aria-controls="nav-home"
									aria-selected="true"
								>
									GAT
								</button>
								<button
									className="nav-link"
									id="nav-profile-tab"
									data-bs-toggle="tab"
									data-bs-target="#nav-tab5"
									type="button"
									role="tab"
									aria-controls="nav-profile"
									aria-selected="false"
								>
									CAT
								</button>
								<button
									className="nav-link"
									id="nav-contact-tab"
									data-bs-toggle="tab"
									data-bs-target="#nav-tab6"
									type="button"
									role="tab"
									aria-controls="nav-contact"
									aria-selected="false"
								>
									Banking
								</button>
							</div>
						</nav>
						<div className="tab-content p-3" id="nav-tabContent">
							<div
								className="tab-pane fade active show"
								id="nav-tab1"
								role="tabpanel"
								aria-labelledby="nav-tab"
							>
								<div className="row">
									{data?.map((res) => (
										<Link
											className="col-lg-4 col-sm-6"
											to={
												res.officialDesc
													? `/courses/${slugify(res.name)}/${res.packageId}`
													: ""
											}
											props={res}
											onClick={() => {
												if (!res.officialDesc) {
													localStorage.setItem("pkgid", res.packageId);
													if (res.payment_url)
														window.open(res.payment_url, "_blank").focus();
												}
											}}
										>
											<div data-wow-delay="0.5s">
												<div className="courses-item text-center pt-3">
													<div className="p-4">
														<i className="icon">
															<img src={res?.thumbnail} alt="learn" />
														</i>
														<h5 className="mb-3">GK for IIFT &amp; SNAP</h5>
														<div className="course-details">
															<p>
																Package Details( 75 tests):
																<br />
																36 GK Topic Based Tests. <br />
																52 Weekly Tests on Current Affair
															</p>
															<p>
																<a
																	className="btn"
																	href="https://pages.razorpay.com/Target-GK-SNAP-IIFT"
																>
																	Read more
																</a>
															</p>
														</div>
													</div>
												</div>
											</div>
										</Link>
									))}
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
			{/* Footer Start */}
			{/* Testimonial Start */}
			<div className="container-xxl py-5 wow fadeInUp" data-wow-delay="0.1s">
				<div className="container">
					<div className="text-center">
						<h6 className="section-title bg-white text-center text-primary px-3">
							Testimonial
						</h6>
						<h1 className="mb-5">Our Students Say!</h1>
					</div>
					<div className="owl-carousel testimonial-carousel position-relative">
						<div className="testimonial-item text-center">
							<img
								className="border rounded-circle p-2 mx-auto mb-3"
								src="https://online.tathagat.co.in/wp-content/uploads/elementor/thumbs/saurabh-q7sumabdmwtgrpbxgia3oeabpzab0jfkrpc7zua2g8.jpeg"
								style={{ width: 80, height: 80 }}
							/>
							<h5 className="mb-0">Saurabh Siddhartha - IIM Calcutta</h5>
							<p>Student</p>
							<div className="testimonial-text bg-light text-center p-4">
								<p className="mb-0">
									I joined Tathagat in August to start my preparation for CAT.
									While scanning the options before me, I was looking for an
									institution that could provide me with sufficient personal
									attention and Tathagat seemed the best option on that front. I
									was privileged to be guided by the excellent faculty at
									Tathagat in all three areas – VA, LR-DI and QA. Tathagat's
									workshops helped me the most. These workshops were
									question-intensive and on occasions went on for 8 hours.
									Lastly, Tathagat was very instrumental in helping me prepare
									for my interviews post CAT. It helped me gain immense
									confidence to compete with the best.{" "}
								</p>
								<div className="stars">
									<i className="fa fa-star" />
								</div>
							</div>
						</div>
						<div className="testimonial-item text-center">
							<img
								className="border rounded-circle p-2 mx-auto mb-3"
								src="https://online.tathagat.co.in/wp-content/uploads/elementor/thumbs/ambuj-q7sumgw8yr2h0z2de34hnumjvodvif5p4lwmcs0b8o.jpeg"
								style={{ width: 80, height: 80 }}
							/>
							<h5 className="mb-0">Ambuj Gupta - IIM INDORE</h5>
							<p>Student</p>
							<div className="testimonial-text bg-light text-center p-4">
								<p className="mb-0">
									The experience at TG is something that one can’t really put
									words to. It would be legit to conclude that I came looking
									for a CAT coaching but on top of that I found guidance and
									true pioneering. It’s not just a business entity providing
									services in lieu of monetary benefits, TG is an experience.
									There have been 2-3 stints in my life that I have cherished
									and TG is indubitably an important one of them. One witnesses
									transformation not only in VA, QA, LRDI skills but also in the
									basic perception of different elements of life. Interactions
									with teachers such as Gautam Sir, Kamal Sir, Kumar Sir, and
									Munish Sir leave you with little anecdotes which help you sail
									all along. It would have been a great regret if TG wasn’t
									there, though I wouldn’t have known but now that I do, I
									realize the difference.{" "}
								</p>
							</div>
						</div>
						<div className="testimonial-item text-center">
							<img
								className="border rounded-circle p-2 mx-auto mb-3"
								src="https://online.tathagat.co.in/wp-content/uploads/elementor/thumbs/pratishtha-q7sumd4w7exbqj7u01hzdvkpi4wenmqrs3aofo5vxk.jpeg"
								style={{ width: 80, height: 80 }}
							/>
							<h5 className="mb-0">Pratishtha Gupta - XLRI Jamshedpur</h5>
							<p>Student</p>
							<div className="testimonial-text bg-light text-center p-4">
								<p className="mb-0">
									If I were to credit my success at cracking a top-notch
									B-school it would only be to Tathagat. The topics were taught
									in a way for one to understand the logic behind everything and
									then shortcuts were taught to be able to take the test easily.
									Every doubt of mine was given so much attention and time that
									I got my basics thoroughly cleared. The GD/PI sessions helped
									me find ways to answer any and every question that could be
									asked. Tathagat helped me not only learn what was to be learnt
									for CAT but also taught me lessons for the lifetime.{" "}
								</p>
							</div>
						</div>
					</div>
				</div>
			</div>
			{/* Testimonial End */}
			{/*  Blog Start */}
			<div className="container-xxl py-5 wow fadeInUp" data-wow-delay="0.1s">
				<div className="container">
					<div className="text-center wow fadeInUp" data-wow-delay="0.1s">
						<h6 className="section-title bg-white text-center text-primary px-3">
							Latest Post
						</h6>
						<h1 className="mb-5">BLogs</h1>
					</div>
					<div className="all-post row">
						<div className="col-lg-4 col-sm-6" data-wow-delay="0.5s">
							<a
								href="https://online.tathagat.co.in/vedic-maths-cat/"
								className="card"
								target="_blank"
							>
								<img src="https://online.tathagat.co.in/wp-content/uploads/2023/08/numerology-concept-composition-2-370x193.jpg" />
								<div className="blog-content">
									<h3>Importance of Vedic Maths in CAT Exam</h3>
									<p>
										Vedic Mathematics is an ancient system of mathematical
										techniques. It was basically originated in the Vedas,
										ancient Indian scriptures.
									</p>
									<div className="author">
										<img
											className="avatar border rounded-circle p-2"
											src="images/avtar.png"
										/>
										<div className="author-text">
											<p>
												<strong>CAT Preparation</strong>
											</p>
											<p>Aug 24 - 6 min read</p>
										</div>
									</div>
								</div>
							</a>
						</div>
						<div className="col-lg-4 col-sm-6" data-wow-delay="0.5s">
							<a
								href="https://online.tathagat.co.in/what-is-a-good-cat-percentile-score/"
								className="card"
								target="_blank"
							>
								<img src="https://online.tathagat.co.in/wp-content/uploads/2023/08/young-businesswoman-with-blue-holder-thinking-about-something-white-wall-1-1-370x193.jpg" />
								<div className="blog-content">
									<h3>What is a good CAT percentile score?</h3>
									<p>
										Candidates planning to pursue a management degree, have one
										common question in their mind about the good CAT percentile
									</p>
									<div className="author">
										<img
											className="avatar border rounded-circle p-2"
											src="images/avtar.png"
										/>
										<div className="author-text">
											<p>
												<strong>CAT Preparation</strong>
											</p>
											<p>Aug 24- 2 min read</p>
										</div>
									</div>
								</div>
							</a>
						</div>
						<div className="col-lg-4 col-sm-6" data-wow-delay="0.5s">
							<a
								href="https://online.tathagat.co.in/importance-of-leadership-skill-for-managerial-degree/"
								className="card"
								target="_blank"
							>
								<img src="https://online.tathagat.co.in/wp-content/uploads/2023/08/business-people-meeting-1-1-370x193.jpg" />
								<div className="blog-content">
									<h3>Importance of leadership skill for managerial degree</h3>
									<p>
										The business world is considered to be very dynamic,
										obtaining a managerial degree is not just about gaining
										technical knowledge.
									</p>
									<div className="author">
										<img
											className="avatar border rounded-circle p-2"
											src="images/avtar.png"
										/>
										<div className="author-text">
											<p>
												<strong>B-School Info , CAT Preparation</strong>
											</p>
											<p>Aug 23 - 12 min read</p>
										</div>
									</div>
								</div>
							</a>
						</div>
						<div
							className="col-lg-12 col-md-12 wow zoomIn view-more"
							data-wow-delay="0.5s"
						>
							<a
								href="https://online.tathagat.co.in/blog/"
								className="btn btn-primary"
								target="_blank"
							>
								View All Blogs
							</a>
						</div>
					</div>
				</div>
			</div>
			{/* Blog End */}
			<a href="#" className="btn btn-lg btn-primary btn-lg-square back-to-top">
				<i className="bi bi-arrow-up" />
			</a>
		</>
	);
};

export default Home;
