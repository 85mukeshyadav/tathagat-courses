import { Alert } from "@mantine/core";
import { IconAlertCircle } from "@tabler/icons-react";
import { Buffer } from "buffer";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import apiClient from "../api/apiClient";
import Loader from "../components/Loader";

const TestExam = () => {
	const navigate = useNavigate();
	const { testid, pkgid } = useParams();
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);

	function decrypt(str) {
		const text = Buffer.from(str, "base64").toString("ascii");
		console.log(text);
		return text;
	}

	const checkIfTestExists = async () => {
		if (!localStorage.getItem("token") || !localStorage.getItem("user")) {
			alert("Please login to access this test.");
			return navigate("/signin");
		}
		setLoading(true);

		const testid1 = decrypt(testid);
		const pkgid1 = decrypt(pkgid);
		const user = localStorage.getItem("user");

		const response = await apiClient.get(
			`/gettest/${testid1}/${user}/${pkgid1}`
		);
		if (response.ok) {
			localStorage.setItem("testid", testid1);
			localStorage.setItem("pkgid", pkgid1);
			navigate("/examination");
		} else {
			setError(response.problem);
		}
		setLoading(false);
	};

	useEffect(() => {
		checkIfTestExists();
	}, []);

	if (loading)
		return (
			<div className="min-h-screen">
				<Loader />
			</div>
		);

	return (
		<div
			style={{
				display: "flex",
				flexDirection: "column",
				justifyContent: "center",
				alignItems: "center",
				height: "54vh",
				overflow: "hidden",
			}}
		>
			{error && (
				<>
					<Alert
						icon={<IconAlertCircle size="1rem" />}
						title="No access!"
						color="red"
					>
						You are unable to take this test. Please visit all courses.
					</Alert>
					<button
						className="mt-8 text-white bg-blue-400 font-semibold px-4 py-2 rounded hover:bg-blue-500"
						onClick={() => navigate(`/courses`)}
					>
						All Courses
					</button>
				</>
			)}
		</div>
	);
};

export default TestExam;
