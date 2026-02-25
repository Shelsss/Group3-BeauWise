export default function formatSnakeToTitle(string) {
	return string
		.replace(/(\d)_(\d)/g, '$1 - $2')
		.replace(/_/g, ' ')
		.replace(/\b\w/g, (char) => char.toUpperCase());
}
