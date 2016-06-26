
export function isFloat(number) {
	return !isNaN(number) && number.toString().indexOf('.') !== -1;
}
