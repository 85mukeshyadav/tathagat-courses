import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import "font-awesome/css/font-awesome.min.css";
import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import "./index.css";

const queryClient = new QueryClient();
ReactDOM.render(
	<React.StrictMode>
		<QueryClientProvider client={queryClient}>
			<App />
			<ReactQueryDevtools />
		</QueryClientProvider>
	</React.StrictMode>,
	document.getElementById("root")
);
