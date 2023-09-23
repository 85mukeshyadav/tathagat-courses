import dayjs from "dayjs";
import React from "react";
import { useLocation } from "react-router-dom";
import Analysis from "./Analysis";
import AnalysisOld from "./AnalysisOld";

export default function AnalysisProvider() {
	const { state } = useLocation();
	const { submitted_at } = state || {};

	return (
		<>
			{dayjs(submitted_at).isBefore("2023-09-23") ? (
				<AnalysisOld />
			) : (
				<Analysis />
			)}
		</>
	);
}
