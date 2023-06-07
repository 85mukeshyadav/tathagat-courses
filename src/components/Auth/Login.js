import axios from "axios";
import React, { useContext, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import AuthContext from "../../context/AuthCntx";

const Login = () => {
	const params = useParams();
	const navigate = useNavigate();
	const { isAuth, setAuth } = useContext(AuthContext);
	const { token, user } = params;
	if (token && user) {
		axios
			.get(process.env.REACT_APP_API + `/user_info/${user}`)
			.then((res) => {
				localStorage.setItem(
					"user_info",
					JSON.stringify({
						name: res.data.username,
						email: res.data.email_Id,
						phone: res.data.mobileNumber,
						type: res.data.user_type,
					})
				);
			})
			.catch((err) => {
				console.log(err);
			});
		localStorage.setItem("token", token);
		localStorage.setItem("user", user);
		setAuth(true);
		navigate("/myCourses");
	}

	useEffect(() => {
		if (isAuth) {
			navigate("/myCourses");
		}
	}, []);

	return (
		<div>
			<h1>Logged in successfully</h1>
		</div>
	);
};

export default Login;
