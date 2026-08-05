export function onScroll(scrollRef) {
	return ({ nativeEvent }) => {
		if (nativeEvent.contentOffset.y < 0) {
			scrollRef.current?.scrollTo({ x: 0, y: 0 });
		}
	};
}
