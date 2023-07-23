import { Button, TextInput } from "@mantine/core";
import clsx from "clsx";
import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { BiPencil } from "react-icons/bi";
import { FaRegUserCircle } from "react-icons/fa";
import { toast } from "react-toastify";

import apiClient from "../api/apiClient";
import useUserStore from "../store/useUserStore";
import Loader from "./Loader";

const Profile = () => {
	const { setUser } = useUserStore();
	const { control, handleSubmit, formState, setValue } = useForm({
		defaultValues: {
			name: "",
			email: "",
			phoneNumber: "",
			address: "",
		},
	});

	const [edit, setEdit] = useState(false);
	const [profilePhoto, setProfilePhoto] = useState("");
	const [image, setImage] = useState(null);
	const [loading, setLoading] = useState(false);

	const handleProfilePhotoChange = (event) => {
		if (
			event.target.files[0].size > 1024 * 1024 ||
			(event.target.files[0].type !== "image/jpeg" &&
				event.target.files[0].type !== "image/png")
		) {
			toast.error("Please select a valid image file.", {
				position: "bottom-center",
				autoClose: 1000,
				limit: 1,
			});
			return;
		}
		setProfilePhoto(URL.createObjectURL(event.target.files[0]));
		setImage(event.target.files[0]);
	};

	const handleSaveChanges = async (data) => {
		const { name, email, phoneNumber, address } = data;
		if (!name || !phoneNumber || !email) {
			toast.error("Please fill in the required fields.", {
				position: "bottom-center",
				autoClose: 1000,
				limit: 1,
			});
			return;
		}
		const formData = new FormData();
		formData.append("full_name", name);
		formData.append("personal_email", email);
		formData.append("mobileNumber", phoneNumber);
		formData.append("address", address);
		formData.append("img", image);
		const res = await apiClient.post(
			`/profile_update/${localStorage.getItem("user")}`,
			formData,
			{
				headers: {
					"Content-Type": "multipart/form-data",
				},
			}
		);
		if (res.ok) {
			console.log(res.data);
			toast.success("Profile Updated Successfully", {
				position: "bottom-center",
				autoClose: 1000,
			});
			setUser({
				name: name,
				email: localStorage.getItem("user"),
				mobile: phoneNumber,
				address: address,
				profile: res.data.data?.user?.profile,
			});
			setEdit(false);
		} else {
			console.log(res.data);
			toast.error("There was an error updating your profile");
		}
	};

	const getUserProfile = async () => {
		setLoading(true);
		const res = await apiClient.get(`/profile/${localStorage.getItem("user")}`);
		if (res.ok) {
			console.log(res.data);
			setValue("name", res.data.data?.full_name);
			setValue("email", res.data.data?.personal_email);
			setValue("phoneNumber", res.data.data?.mobileNumber);
			setValue("address", res.data.data?.address);
			setProfilePhoto(process.env.REACT_APP_API + "/" + res.data.data?.profile);
			setUser({
				name: res.data.data?.full_name,
				email: localStorage.getItem("user"),
				mobile: res.data.data?.mobileNumber,
				address: res.data.data?.address,
				profile: res.data.data?.profile,
			});
		} else {
			console.log(res.data);
		}
		setLoading(false);
	};

	useEffect(() => {
		getUserProfile();
	}, []);

	if (loading) return <Loader />;

	return (
		<div className="max-w-md h-full mx-auto px-6 py-10 my-10 bg-white rounded-lg shadow-lg">
			<h1 className="text-4xl text-gray-700 font-bold mb-2">Profile</h1>
			<div
				className="mb-9 cursor-pointer text-blue-500 hover:underline flex items-center justify-center"
				onClick={() => setEdit(!edit)}
			>
				<BiPencil className="inline-block mr-1" />
				<p>{edit ? "Cancel" : "Edit Profile"}</p>
			</div>
			<div className="mb-4">
				{profilePhoto ? (
					<img
						src={profilePhoto}
						alt="Profile"
						className="w-40 h-40 rounded-full mx-auto my-5"
					/>
				) : (
					<FaRegUserCircle
						color="#D4D4D8"
						size={120}
						className="mx-auto my-5"
					/>
				)}
				<div>
					<div className="mb-2">
						<label
							htmlFor="photo"
							className={clsx("cursor-pointer text-blue-500 hover:underline", {
								hidden: !edit,
							})}
						>
							Change Profile Photo
						</label>
						<input
							type="file"
							id="photo"
							className="hidden"
							onChange={handleProfilePhotoChange}
						/>
					</div>
				</div>
			</div>
			<div className="mb-6 text-left">
				<TextInput
					label="Tathagat ID"
					id="tathagatid"
					value={localStorage.getItem("user")}
					disabled
				/>
			</div>
			<div className="mb-6 text-left">
				<Controller
					name="name"
					control={control}
					render={({ field }) => (
						<TextInput
							label="Name"
							id="name"
							value={field.value}
							onChange={field.onChange}
							placeholder="Name"
							withAsterisk
							disabled={!edit}
						/>
					)}
				/>
			</div>
			<div
				className={clsx("text-left", formState.errors.email ? "mb-1" : "mb-6")}
			>
				<Controller
					name="email"
					control={control}
					rules={{
						pattern: {
							value: /^[a-zA-Z0-9+_.-]+@[a-zA-Z0-9.-]+$/i,
							message: "Invalid Email",
						},
					}}
					render={({ field }) => (
						<TextInput
							label="Email"
							id="email"
							value={field.value}
							onChange={field.onChange}
							placeholder="Email"
							withAsterisk
							disabled={!edit}
						/>
					)}
				/>
			</div>
			{formState.errors.email && (
				<div className="mb-4 text-sm text-left text-red-500">
					{formState.errors.email.message}
				</div>
			)}
			<div
				className={clsx(
					"text-left",
					formState.errors.phoneNumber ? "mb-1" : "mb-6"
				)}
			>
				<Controller
					name="phoneNumber"
					control={control}
					rules={{
						pattern: {
							value: /^[6-9]{1}[0-9]{9}$/,
							message: "Invalid Phone Number",
						},
					}}
					render={({ field }) => (
						<TextInput
							label="Phone Number"
							id="phoneNumber"
							value={field.value}
							onChange={field.onChange}
							placeholder="Phone Number"
							withAsterisk
							disabled={!edit}
						/>
					)}
				/>
			</div>
			{formState.errors.phoneNumber && (
				<div className="mb-4 text-sm text-left text-red-500">
					{formState.errors.phoneNumber.message}
				</div>
			)}
			<div className="mb-4 text-left">
				<Controller
					name="address"
					control={control}
					render={({ field }) => (
						<TextInput
							label="Address"
							id="address"
							value={field.value}
							onChange={field.onChange}
							placeholder="Address"
							disabled={!edit}
						/>
					)}
				/>
			</div>
			<Button
				loading={formState.isSubmitting}
				className="bg-blue-500 mt-4"
				onClick={handleSubmit(handleSaveChanges)}
				disabled={!edit}
			>
				Save Changes
			</Button>
		</div>
	);
};

export default Profile;
