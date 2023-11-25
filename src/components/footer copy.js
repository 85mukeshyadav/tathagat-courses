//import liraries
import React from "react";
import { Link } from "react-router-dom";

// create a component
const Footer = () => {
	const openmenuHandler = (e) => {
		let menu = document.getElementById("meunId");
		menu.style.display = "block";
	};
	const closeMenuHandler = (e) => {
		let menu = document.getElementById("meunId");
		menu.style.display = "none";
	};

	return (
		// <Router>
		<footer className="footer-1 bg-grey-500 py-2 sm:py-12 md:py-2">
			<div className="mx-auto px-4">
				<div className="sm:flex sm:flex-wrap justify-center items-center sm:-mx-4 mt-6 pt-6 sm:mt-12 sm:pt-12 lg:pt-1">
					<div className="sm:w-full px-4 md:w-1/3 flex flex-col items-baseline">
						<img src="https://www.tathagat.co.in/assets/img/logo.png"></img>
						<Link to="tel:9205534439" className="text-left text-white">
							{" "}
							9205534439{" "}
						</Link>
						<Link
							to="mailTo:info@tathagat.co.in"
							className="text-left text-white"
						>
							{" "}
							info@tathagat.co.in{" "}
						</Link>
					</div>
					<div className="px-4 text-left sm:w-1/2 md:w-1/3 mt-4 md:mt-0 text-white">
						<h6 className="font-bold mb-2">Address</h6>
						<address className="not-italic mb-4 text-sm">
							113, 1st Floor, New Delhi House Connaught Place
							<br />
							New Delhi - 110001
							<br />
						</address>
					</div>
					<div className="text-white px-4 text-left md:ml-20">
						<ul className="font-semibold">
							<li className="py-1">
								<a href="/about-us">About us</a>
							</li>
							<li className="py-1">
								<a href="/contact">Contact Us</a>
							</li>
							<li className="py-1">
								<a href="/privacy-policy">Privacy Policy</a>
							</li>
							<li className="py-1">
								<a href="/terms-conditions">Terms & Conditions</a>
							</li>
							<li className="py-1">
								<a href="/refund-policy">Refund Policy</a>
							</li>
						</ul>
					</div>
				</div>
			</div>
			<div className="text-center">
				<h6 className="mt-4 text-gray-200 mb-2">
					Copyright © 2021 Tathagat. Brands are the property of their respective
					owners.
				</h6>
			</div>
		</footer>
	);
};

export default Footer;
