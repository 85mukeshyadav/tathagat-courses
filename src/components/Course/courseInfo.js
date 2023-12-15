import { Group, Rating } from "@mantine/core";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import ms from "ms";
import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import apiClient from "../../api/apiClient";
import useRazorPay from "../../hooks/useRazorpay";
import Loader from "../Loader";

const CourseInfo = () => {
	const { pkgid } = useParams();
	const { displayRazorpay } = useRazorPay();
	const [loading, setLoading] = useState(false);
	const navigate = useNavigate();

	const { data, isLoading } = useQuery({
		queryKey: ["package", pkgid],
		queryFn: () => apiClient.get(`/pacakge/${pkgid}`).then((res) => res.data),
		staleTime: ms("24h"),
	});

	const assignPackage = () => {
		setLoading(true);
		axios
			.post(process.env.REACT_APP_API + "/assignStudentToPackage", {
				packageId: pkgid,
				studentList: [
					{
						status: 1,
						checked: true,
						email_Id: localStorage.getItem("user"),
						user_type: "student",
					},
				],
			})
			.then((res) => {
				console.log(res.data);
				if (res.status === 200) {
					localStorage.setItem("pkgid", pkgid);
					localStorage.setItem("courseid", data[0]?.courseCourseId);
					toast.success("Enrolled into course successfully", {
						position: "bottom-center",
					});
					navigate("/courseDetails/myCourse");
				}
			})
			.catch((err) => {
				console.log(err);
				toast.error("Something went wrong", {
					position: "bottom-center",
				});
			})
			.finally(() => setLoading(false));
	};

	const handlePayment = async (info) => {
		console.log(info);
		const res = await axios.post(
			process.env.REACT_APP_API + "/create-payment",
			{
				amount: info.price,
				currency: "INR",
				receipt: "order_rcptid_11",
			}
		);
		console.log(
			"🚀 ~ file:courselist.js ~ line 28 ~ handlePayment ~ res",
			res.data
		);
		const user = JSON.parse(localStorage.getItem("user_info"));
		if (res.status === 200) {
			displayRazorpay({
				amount: res.data.order.amount,
				order_id: res.data.order.id,
				currency: res.data.order.currency,
				packageId: info.packageId,
				name: user?.name,
				email: user?.email,
				phone: user?.phone || "",
			});
		}
	};

	console.log("🚀 ~ file: courseInfo.js ~ line 18 ~ CourseInfo ~ data", data);

	if (loading || isLoading || !data) return <Loader />;

	return (
		<div>
			<div
				className="bg-cover bg-center sm:h-[360px] h-[75vh] before:bg-[#000000f1] before:opacity-80 before:absolute before:left-0 before:w-screen
             sm:before:h-[360px] before:h-[75vh] before:z-0 opacity-90"
				style={{
					backgroundImage: data[0].thumbnail
						? `url(${data[0].thumbnail})`
						: "url(https://images.unsplash.com/photo-1554415707-6e8cfc93fe23?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=870&q=80)",
				}}
			>
				<div className="z-[1] relative pt-20 grid sm:grid-cols-2 grid-cols-1">
					<div className="justify-start text-left sm:ml-16 ml-8">
						<h1 className="text-white font-bold text-3xl sm:text-4xl uppercase text-left">
							{data[0].PackageName}
						</h1>
						<p className="text-white pt-4 text-justify pr-8 sm:px-0 font-semibold text-lg">
							{data[0].PackageDesc}
						</p>
						{/* <div className=""> */}
						<button
							onClick={() => {
								if (data[0]?.PackagePrice == 0) {
									assignPackage();
								} else {
									handlePayment({
										price: parseInt(data[0].PackagePrice),
										packageId: data[0].packageId,
									});
								}
							}}
							className="py-2 justify-center items-center mt-4 rounded-md sm:px-6 px-4 bg-blue-500 text-white sm:text-xl text-lg font-bold hover:bg-blue-600"
						>
							<i className="fas fa-cart-shopping text-white mr-2"></i>
							{data[0].PackagePrice == 0 ? "Enroll Now" : "Buy Now"}
						</button>
						{/* </div> */}
					</div>
					<div className="sm:mt-24 mt-8 text-center">
						<p className="text-white font-bold text-4xl pt-12">
							{data[0].PackagePrice == 0
								? "Free"
								: `₹ ${data[0].PackagePrice}/-`}
						</p>
						<div className="text-white font-medium text-lg pt-2 mx-auto">
							<Group position="center">
								Rating:
								<Rating value={3.5} fractions={2} readOnly />
							</Group>
							{/* 8.5k+ students enrolled till now */}
						</div>
					</div>
				</div>
			</div>
			<div className="p-8 mt-14">
				<h1 className="text-3xl text-gray-700 font-bold text-left underline mb-6">
					About course:
				</h1>
				<div
					className="text-gray-600 mt-10 mb-8 text-justify text-lg"
					dangerouslySetInnerHTML={{
						__html: data[0].officialDesc,
					}}
				/>
			</div>
		</div>
	);
};

export default CourseInfo;
