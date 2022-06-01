export function isDeFined(data) {
	return data !== undefined && data !== null;
}
export function isEmptyObject(data) {
	return JSON.stringify(data) === '{}';
}
