import React from "react";

export default function Contact() {
	return (
		<div className="font-semibold text-gray-700">
			<div className="mt-10">
				<h3 className="text-3xl mb-5 font-bold text-gray-700">
					Connaught Place Centre
				</h3>
				<p>
					106, 1st Floor, New Delhi House <br />
					Barakhamba Road, New Delhi – 110001
				</p>
				<p>+91 9205534439</p>

				<div className="mt-10">
					<h3 className="text-3xl mb-5 font-bold text-gray-700">
						Franchisee Enquiry
					</h3>
					<p>
						TathaGat is actively looking for franchise partners. If interested,
						kindly call on +91 78388 04491
					</p>
				</div>

				<div>
					<h3 className="text-3xl mb-5 font-bold text-gray-700 mt-10">
						Mail Info
					</h3>
					<p>
						Email:
						<span
							onClick={() => {
								window.open("mailto:info@tathagat.co.in");
							}}
							className="font-semibold text-gray-700 hover:text-gray-800 hover:transition hover:cursor-pointer ml-1"
						>
							info@tathagat.co.in
						</span>
					</p>
				</div>
			</div>

			<div className="mt-10">
				<h3 className="text-3xl mb-5 font-bold text-gray-700">
					Lucknow Centre
				</h3>
				<p>
					C - 18, J Road, Mahanagar Extension
					<br />
					Lucknow - 226006
				</p>
				<p>PHONE: +91 7007713981</p>
			</div>
			<h3 className="text-3xl mt-10 mb-5 font-bold text-gray-700">Reach Us</h3>
			<iframe
				className="mb-20 mx-auto"
				src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3501.9880753184952!2d77.22105901446626!3d28.630119490942224!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390cfd36ace8b84d%3A0x3315288728be019b!2sTathagat!5e0!3m2!1sen!2sin!4v1517753349883"
				width="80%"
				height="450"
				frameborder="3"
				allowfullscreen
			></iframe>
		</div>
	);
}
