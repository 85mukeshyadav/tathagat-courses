import React from "react";

export default function About() {
	return (
		<div>
			<h1 className="text-4xl font-bold text-gray-700 mt-10">About Tathagat</h1>
			<div className="py-10 sm:px-20 px-10">
				<p className="text-left font-semibold text-gray-700">
					Tathagat was established in 2007.The focus here is to forgo the beaten
					track and attend to prevailing issues in higher education coaching
					with a fresh and rational approach. In this endeavor, the academy has
					engaged a highly qualified and experienced senior faculty for regular
					& weekend classroom sessions.
				</p>
				<h3 className="mt-8 text-2xl font-bold text-gray-700 text-left">
					Why Tathagat?
				</h3>
				<ul className="list-disc text-left mt-5 space-y-1 font-semibold text-gray-600">
					<li>
						Excellent comprehensive study material in an attractive booklet
					</li>
					<li>Concept oriented learning packages by our esteemed faculty</li>
					<li>
						Subject-wise test papers covering each and every corner of the
						topics
					</li>
					<li>
						Subject-wise weekly test-paper-tips in every topic for effective
						study
					</li>
					<li>Special focus on previous years question papers</li>
					<li>Limited batch-size to ensure totally personalized attention</li>
				</ul>
			</div>
		</div>
	);
}
