import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { IconAlertCircle } from "@tabler/icons-react";
import { Alert, Button } from "@mantine/core";
import apiClient from "../api/apiClient";

const TestExam = () => {
	const navigate = useNavigate();
	const { testid, user, pkgid } = useParams();
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);

	const checkIfTestExists = async () => {
		setLoading(true);
		const response = await apiClient.get(`/gettest/${testid}/${user}/${pkgid}`);
		if (response.ok) {
			console.log(response.data);
			localStorage.setItem("testid", testid);
			localStorage.setItem("user", user);
			localStorage.setItem("pkgid", pkgid);
			navigate("/examination");
		} else {
			console.log(response.problem, response.data);
			setError(response.problem);
			// navigate("/courses");
		}
		setLoading(false);
	};

	return (
		<div
			style={{
				display: "flex",
				flexDirection: "column",
				justifyContent: "center",
				alignItems: "center",
				height: "100vh",
			}}
		>
			<Button
				// color="blue"
				className="mb-2 text-white bg-blue-400 font-semibold"
				onClick={checkIfTestExists}
				loading={loading}
			>
				Start Test
			</Button>
			{error && (
				<Alert
					icon={<IconAlertCircle size="1rem" />}
					title="No access!"
					color="red"
				>
					You do not have access to this test. Please buy the course to access
					this test.
				</Alert>
			)}
		</div>
	);
};

export default TestExam;
