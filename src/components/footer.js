import React from "react";

const Footer = () => {
	return (
		<footer id="footer">
			<div
				className="container-fluid bg-dark text-light footer pt-5 mt-5 wow fadeIn"
				data-wow-delay="0.1s"
			>
				<div className="container py-5">
					<div className="row g-5">
						<div className="col-lg-4 col-md-6">
							<h4 className="text-white mb-3 text-left">Quick Link</h4>
							<a className="btn btn-link" href="/about-us">
								About Us
							</a>
							<a className="btn btn-link" href="/contact">
								Contact Us
							</a>
							<a className="btn btn-link" href="/privacy-policy">
								Privacy Policy
							</a>
							<a className="btn btn-link" href="/terms-conditions">
								Terms & Conditions
							</a>
							<a className="btn btn-link" href="/refund-policy">
								Refund Policy
							</a>
						</div>
						<div className="col-lg-4 col-md-6">
							<h4 className="text-white mb-3 text-left">Contact</h4>
							<p className="mb-2 text-left">
								<i className="fa fa-map-marker-alt me-3" />
								113, 1st Floor, New Delhi House Connaught Place New Delhi -
								110001
							</p>
							{/* <p class="mb-2"><i class="fa fa-phone-alt me-3"></i>+91 95355 01234</p> */}
							<p className="mb-2">
								<i className="fa fa-envelope me-3" />
								<a href="mailto:info@tathagat.co.in">info@tathagat.co.in</a>
							</p>
							<p className="mb-2">
								<i className="fa fa-phone me-3" />{" "}
								<a href="tel:+919205534439">+919205534439</a>
							</p>
							<div className="d-flex pt-2">
								<a className="btn btn-outline-light btn-social" href="">
									<i className="fab fa-twitter" />
								</a>
								<a className="btn btn-outline-light btn-social" href="">
									<i className="fab fa-facebook-f" />
								</a>
								<a className="btn btn-outline-light btn-social" href="">
									<i className="fab fa-youtube" />
								</a>
								<a className="btn btn-outline-light btn-social" href="">
									<i className="fab fa-linkedin-in" />
								</a>
							</div>
						</div>
						<div className="col-lg-4 col-md-6">
							<h4 className="text-white mb-3 text-left">Newsletter</h4>
							<p className="mb-2 text-left">
								Subscribe to our newsletter and get latest updates.
							</p>
							<div
								className="position-relative mx-auto"
								style={{ maxWidth: 400 }}
							>
								<input
									className="form-control border-0 w-100 py-3 ps-4 pe-5"
									type="text"
									placeholder="Your email"
								/>
								<button
									type="button"
									className="btn btn-primary py-2 position-absolute top-0 end-0 mt-2 me-2 bg-[#11308e]"
								>
									Sign Up
								</button>
							</div>
						</div>
					</div>
				</div>
				<div className="container">
					<div className="copyright">
						<div className="row">
							<div className="col-md-6 text-center text-md-start mb-3 mb-md-0">
								<p>
									Copyright © 2023 Tathagat. Brands are the property of their
									respective owners.
								</p>
							</div>
						</div>
					</div>
				</div>
			</div>
		</footer>
	);
};

export default Footer;
