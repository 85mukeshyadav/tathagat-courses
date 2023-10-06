export const secondsToMinutes = (seconds) => {
	const minutes = Math.floor(seconds / 60);
	const sec = seconds % 60;

	if (minutes === 0) {
		return `${sec}s`;
	}

	return `${minutes}m ${sec}s`;
};
