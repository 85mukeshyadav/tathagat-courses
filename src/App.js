import { MantineProvider } from "@mantine/core";
import { ModalsProvider } from "@mantine/modals";
import { useEffect, useState } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { BrowserRouter as Router } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import "./App.css";
import Rout from "./Routes";
import Page500 from "./components/500";
import Header from "./components/Header";
import Footer from "./components/footer";
import hideNavContext from "./context/AllprojectsContext";
import AuthContext from "./context/AuthCntx";
import { loadScript } from "./utils/loadScript";

function App() {
	const [isAuth, setAuth] = useState(false);
	const [hidenav, sethidenav] = useState(false);
	const nav = { hidenav, sethidenav };
	const Auth = { isAuth, setAuth };

	const isTokenExpired = (token) => {
		const expiry = JSON.parse(atob(token.split(".")[1])).exp;
		return Math.floor(new Date().getTime() / 1000) >= expiry;
	};

	useEffect(() => {
		loadScript("https://checkout.razorpay.com/v1/checkout.js");
		let token = localStorage.getItem("token");
		if (token) {
			let expired = isTokenExpired(token);
			if (expired == false) {
				setAuth(true);
			} else {
				setAuth(false);
			}
		}
	}, []);

	return (
		<ErrorBoundary FallbackComponent={Page500}>
			<MantineProvider withGlobalStyles withNormalizeCSS>
				<ModalsProvider>
					<div className="App">
						<AuthContext.Provider value={Auth}>
							<hideNavContext.Provider value={nav}>
								<Router className="relative">
									{hidenav ? null : <Header />}
									<Rout />
									{hidenav ? null : <Footer />}
								</Router>
							</hideNavContext.Provider>
						</AuthContext.Provider>
						<ToastContainer limit={1} />
					</div>
				</ModalsProvider>
			</MantineProvider>
		</ErrorBoundary>
	);
}

export default App;
