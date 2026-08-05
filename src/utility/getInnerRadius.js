export const getInnerRadius = (outerRadius, padding) => {
	return Math.max(0, outerRadius - padding);
};
