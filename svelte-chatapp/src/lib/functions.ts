function getUserIdFromToken(token: string): string | null {
	try {
		const payload = JSON.parse(atob(token.split('.')[1]));
		return payload.id; // ← حسب ما backend يضعه في التوكن
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
	} catch (e) {
		return null;
	}
}

function formatTime(timestamp: string) {
	const date = new Date(timestamp);
	return `${date.getHours()}:${date.getMinutes().toString().padStart(2, '0')}`;
}

export { getUserIdFromToken, formatTime };
