import axios from "axios";
import { useNavigate } from "react-router-dom";

const useRazorPay = () => {
	const navigate = useNavigate();
	const verifyPayment = async (paymentInfo) => {
		const res = await axios.post(
			process.env.REACT_APP_API + "/verify-payment",
			paymentInfo
		);
		console.log(
			"🚀 ~ file:useRazorpay.js ~ line 7 ~ verifyPayment ~ res",
			res.data
		);
		if (res.status === 200) {
			axios
				.post(process.env.REACT_APP_API + "/assignStudentToPackage", {
					packageId: paymentInfo.packageId,
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
						navigate("/payment-success");
					}
				})
				.catch((err) => {
					console.log(err);
				});
		}
	};

	const displayRazorpay = ({
		amount,
		currency,
		order_id,
		name,
		email,
		phone,
		packageId,
	}) => {
		const options = {
			key: "rzp_live_MGkjM1JRNckkm3",
			currency: currency,
			amount: amount,
			name: "Tathagat",
			description: "Course Payment",
			order_id: order_id,
			handler: function (response) {
				console.log(response);
				verifyPayment({
					razorpay_payment_id: response.razorpay_payment_id,
					razorpay_order_id: response.razorpay_order_id,
					razorpay_signature: response.razorpay_signature,
					packageId: packageId,
				});
			},
			prefill: {
				name: name,
				email: email,
				contact: phone,
			},
		};
		const paymentObject = new window.Razorpay(options);
		paymentObject.open();
	};

	return { displayRazorpay };
};

export default useRazorPay;
