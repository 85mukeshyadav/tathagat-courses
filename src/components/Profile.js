import { Button, TextInput } from "@mantine/core";
import React, { useState } from "react";
import { FaRegUserCircle } from "react-icons/fa";
import { toast } from "react-toastify";
import apiClient from "../api/apiClient";
import useUserStore from "../store/useUserStore";
import Loader from "./Loader";

const Profile = () => {
	const { setUser } = useUserStore();
	const [name, setName] = useState("");
	const [phoneNumber, setPhoneNumber] = useState("");
	const [address, setAddress] = useState("");
	const [profilePhoto, setProfilePhoto] = useState("");
	const [image, setImage] = useState(null);

	const [loading, setLoading] = useState(false);
	const [profileLoading, setProfileLoading] = useState(false);

	const handleNameChange = (event) => {
		setName(event.target.value);
	};

	const handlePhoneNumberChange = (event) => {
		setPhoneNumber(event.target.value);
	};

	const handleAddressChange = (event) => {
		setAddress(event.target.value);
	};

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

	const handleSaveChanges = async () => {
		if (!name || !phoneNumber) {
			toast.error("Please fill in the required fields.", {
				position: "bottom-center",
				autoClose: 1000,
				limit: 1,
			});
			return;
		}
		setLoading(true);
		const formData = new FormData();
		formData.append("full_name", name);
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
		} else {
			console.log(res.data);
			toast.error("There was an error updating your profile");
		}
		setLoading(false);
	};

	const getUserProfile = async () => {
		setProfileLoading(true);
		const res = await apiClient.get(`/profile/${localStorage.getItem("user")}`);
		if (res.ok) {
			console.log(res.data);
			setName(res.data.data?.full_name);
			setPhoneNumber(res.data.data?.mobileNumber);
			setAddress(res.data.data?.address);
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
		setProfileLoading(false);
	};

	React.useEffect(() => {
		getUserProfile();
	}, []);

	if (profileLoading) return <Loader />;

	return (
		<div className="max-w-md h-full mx-auto px-6 py-10 my-10 bg-white rounded-lg shadow-lg">
			<h1 className="text-4xl text-gray-700 font-bold mb-10">Profile</h1>
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
							className="cursor-pointer text-blue-500 hover:underline"
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
					label="Name"
					id="name"
					value={name}
					onChange={handleNameChange}
					placeholder="Name"
					withAsterisk
				/>
			</div>
			<div className="mb-6 text-left">
				<TextInput
					label="Phone Number"
					id="phone"
					value={phoneNumber}
					onChange={handlePhoneNumberChange}
					placeholder="Phone Number"
					withAsterisk
				/>
			</div>
			<div className="mb-4 text-left">
				<TextInput
					label="Address"
					id="address"
					value={address}
					onChange={handleAddressChange}
					placeholder="Address"
				/>
			</div>
			<Button
				loading={loading}
				className="bg-blue-500 mt-4"
				onClick={handleSaveChanges}
			>
				Save Changes
			</Button>
		</div>
	);
};

export default Profile;
