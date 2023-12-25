import { Box, Button, Divider, Group, Modal, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useDisclosure } from "@mantine/hooks";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import ms from "ms";
import React, { useEffect, useState } from "react";
import Marquee from "react-fast-marquee";
import { FiFile, FiVideo } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import apiClient from "../../api/apiClient";
import Loader from "../Loader";

const MyCourses = () => {
	const navigate = useNavigate();
	const [opened, { open, close }] = useDisclosure(false);
	const [packageId, setPackageId] = useState("");
	const [courseId, setCourseId] = useState("");
	const [loading, setLoading] = useState(false);
	const [loadingCourse, setLoadingCourse] = useState(false);
	const form = useForm({
		initialValues: {
			friend1Name: "",
			friend1Mobile: "",
			friend2Name: "",
			friend2Mobile: "",
		},
		validate: {
			friend1Name: (value) =>
				value.trim().length > 0 ? null : "Please enter a valid name",
			friend1Mobile: (value) =>
				/^[6-9]\d{9}$/.test(value)
					? null
					: "Please enter a valid mobile number",
			friend2Name: (value) =>
				value.trim().length > 0 ? null : "Please enter a valid name",
			friend2Mobile: (value) =>
				/^[6-9]\d{9}$/.test(value)
					? null
					: "Please enter a valid mobile number",
		},
	});

	const params = {
		userId: localStorage.getItem("user"),
	};

	const { data, isLoading, refetch } = useQuery({
		queryKey: ["myCourses"],
		queryFn: () =>
			apiClient.post(`/mypackages`, params).then((res) => res.data),
		staleTime: ms("24h"),
	});

	// const location = {
	// 	pathname: "/courseDetails/myCourse",
	// 	state: { fromDashboard: true },
	// };

	useEffect(() => {
		refetch();
	}, []);

	const handleReferral = () => {
		const user = JSON.parse(localStorage.getItem("userDetails"));

		if (
			form.values.friend1Mobile == user?.mobileNumber ||
			form.values.friend2Mobile == user?.mobileNumber
		) {
			toast.error("You cannot refer yourself", {
				position: "top-right",
				autoClose: 2000,
				hideProgressBar: false,
				closeOnClick: true,
				pauseOnHover: true,
				draggable: true,
			});
			return;
		}

		if (form.values.friend1Mobile == form.values.friend2Mobile) {
			toast.error("Please enter different mobile numbers", {
				position: "top-right",
				autoClose: 2000,
				hideProgressBar: false,
				closeOnClick: true,
				pauseOnHover: true,
				draggable: true,
			});
			return;
		}
		setLoading(true);
		axios
			.post(process.env.REACT_APP_API + "/addreferral", {
				userEmailId: localStorage.getItem("user"),
				referee_1_name: form.values.friend1Name,
				referee_1_phone: form.values.friend1Mobile,
				referee_2_name: form.values.friend2Name,
				referee_2_phone: form.values.friend2Mobile,
			})
			.then(() => {
				axios
					.post(process.env.REACT_APP_API + "/assignStudentToPackage", {
						packageId: packageId,
						studentList: [
							{
								status: 1,
								checked: true,
								email_Id: localStorage.getItem("user"),
								user_type: "student",
							},
						],
					})
					.then(() => {
						localStorage.setItem("pkgid", packageId);
						localStorage.setItem("courseid", courseId);
						close();
						navigate("/courseDetails/myCourse");
					})
					.finally(() => setLoading(false));
			});
	};

	const checkIfPackageIsAssigned = async (data) => {
		setPackageId(data?.packageId);
		setCourseId(data?.courseId);

		if (data?.packagePrice != 0) {
			localStorage.setItem("pkgid", data?.packageId);
			localStorage.setItem("courseid", data?.courseId);
			navigate("/courseDetails/myCourse");
			return;
		}

		setLoadingCourse(true);
		try {
			const res = await axios.get(process.env.REACT_APP_API + "/getreferral", {
				params: {
					userEmailId: localStorage.getItem("user"),
				},
			});
			if (res.status == 200) {
				localStorage.setItem("pkgid", data?.packageId);
				localStorage.setItem("courseid", data?.courseId);
				navigate("/courseDetails/myCourse");
			}
		} catch (error) {
			console.log(error);
			if (data?.is_referral_required == 1) {
				open();
			}
		} finally {
			setLoadingCourse(false);
		}
	};

	if (isLoading || loadingCourse) {
		return <Loader />;
	}

	return (
		<div className="bg-white">
			<Marquee
				className="bg-blue-200 text-blue-600 text-center py-2 font-semibold"
				pauseOnHover
			>
				🚀 We are happy to inform all TGits that we have upgraded our test
				portal. New features will be shown on your new test attempts. 🚀
			</Marquee>
			<Modal
				opened={opened}
				onClose={close}
				title="Refer 2 friends to access this package."
				centered
			>
				<Box maw={340} mx="auto">
					<form onSubmit={form.onSubmit(handleReferral)}>
						<p className="text-xl font-bold text-gray-700 mb-2">Referral - 1</p>
						<TextInput
							label="Name"
							placeholder="Name of Friend 1"
							{...form.getInputProps("friend1Name")}
						/>
						<TextInput
							mt="md"
							label="Mobile"
							placeholder="Mobile of Friend 1"
							{...form.getInputProps("friend1Mobile")}
						/>

						<Divider mt="xl" />

						<p className="text-xl font-bold text-gray-700 mt-4 mb-2">
							Referral - 2
						</p>
						<TextInput
							label="Name"
							placeholder="Name of Friend 2"
							{...form.getInputProps("friend2Name")}
						/>

						<TextInput
							mt="md"
							label="Mobile"
							placeholder="Mobile of Friend 2"
							{...form.getInputProps("friend2Mobile")}
						/>

						<Group justify="center" mt="xl">
							<Button
								className="bg-blue-500 mx-auto"
								type="submit"
								loading={loading}
							>
								Submit
							</Button>
						</Group>
					</form>
				</Box>
			</Modal>
			<div className="mx-auto py-16 px-4 sm:py-24 sm:px-6">
				<p className="text-gray-500 text-5xl font-bold mb-10">My Courses</p>
				<div className="grid grid-cols-1 sm:grid-cols-2 lg:gap-14 md:gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:gap-2">
					{data.data.map((res, i) => (
						<div
							className="cursor-pointer"
							onClick={() => checkIfPackageIsAssigned(res)}
						>
							<div className="max-w-6xl mx-auto sm:my-0 my-4">
								<div className="flex items-center justify-center">
									<div className="w-full xl:py-6 px-3 mb-6 md:mb-0 lg:mb-0 xl:mb-0">
										<div className="mb-5 bg-white hover:shadow-xl transition-shadow ease-in-out shadow-md border border-slate-100 rounded-lg overflow-hidden">
											<div
												className="bg-cover bg-center h-56 p-4 border-b border-gray-200"
												style={{
													backgroundImage:
														res?.thumbnail != undefined
															? `url(${res.thumbnail})`
															: "url(https://images.unsplash.com/photo-1554415707-6e8cfc93fe23?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=870&q=80)",
												}}
											>
												<div className="flex justify-between items-center">
													{/* <div className="flex bg-blue-200 px-2 h-10 items-center justify-center rounded-md">
														<p className="font-bold text-xl text-blue-600">
															₹{res?.packagePrice}
														</p>
													</div> */}
													<div className="flex">
														<div className="h-10 w-10 flex bg-red-200 justify-center items-center rounded-full">
															<i className="fas fa-heart text-red-500 text-2xl" />
														</div>
													</div>
												</div>
											</div>
											<div className="p-4">
												<p className="uppercase tracking-wide text-xl font-bold text-gray-700">
													{res.PackageName}
												</p>
												<p className="uppercase tracking-wide text-md font-bold text-gray-700">
													{res.courseName}
												</p>
												{/* <p className="text-cyan-700">
													8.5k+ Students Enrolled{" "}
												</p> */}
											</div>
											<div
												style={{ display: "none" }}
												className="flex p-4 border-t border-gray-300 text-gray-700 gap-4"
											>
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
										</div>
									</div>
								</div>
							</div>
						</div>
					))}
				</div>
			</div>
		</div>
	);
};

export default MyCourses;
