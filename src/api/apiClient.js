import { create } from "apisauce";

const apiClient = create({
	baseURL: process.env.REACT_APP_API,
	headers: {
		Authorization: `Bearer ${localStorage.getItem("token")}`,
	},
});

export default apiClient;
