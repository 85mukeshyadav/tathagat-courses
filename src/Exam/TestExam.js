import { Alert } from "@mantine/core";
import { IconAlertCircle } from "@tabler/icons-react";
import { Buffer } from "buffer";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import apiClient from "../api/apiClient";
import Loader from "../components/Loader";

const TestExam = () => {
	const navigate = useNavigate();
	const { testid, user, pkgid } = useParams();
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);

	function decrypt(str) {
		const text = Buffer.from(str, "base64").toString("ascii");
		console.log(text);
		return text;
	}

	const checkIfTestExists = async () => {
		if (!localStorage.getItem("token")) {
			alert("Please login to access this test.");
			return navigate("/signin");
		}

		setLoading(true);
		const testid1 = decrypt(testid);
		const user1 = decrypt(user);
		const pkgid1 = decrypt(pkgid);
		console.log(testid1, user1, pkgid1);
		const response = await apiClient.get(
			`/gettest/${testid1}/${user1}/${pkgid1}`
		);
		if (response.ok) {
			console.log(response.data);
			localStorage.setItem("testid", testid1);
			localStorage.setItem("user", user1);
			localStorage.setItem("pkgid", pkgid1);
			navigate("/examination");
		} else {
			console.log(response.problem, response.data);
			setError(response.problem);
		}
		setLoading(false);
	};

	useEffect(() => {
		checkIfTestExists();
	}, []);

	if (loading) return <Loader />;

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
						You do not have access to this test. Please buy the course to access
						this test.
					</Alert>
					<button
						className="mt-8 text-white bg-blue-400 font-semibold px-4 py-2 rounded hover:bg-blue-500"
						onClick={() => navigate(`/courses`)}
					>
						Buy Course
					</button>
				</>
			)}
		</div>
	);
};

export default TestExam;
