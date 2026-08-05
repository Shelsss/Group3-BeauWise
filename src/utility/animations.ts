import {
	withTiming,
	LayoutAnimation,
	EntryAnimationsValues,
	StyleProps,
	withSpring,
	ExitAnimationsValues,
	withDelay
} from 'react-native-reanimated';

export const scaleAnimation = (values: EntryAnimationsValues): LayoutAnimation => {
	'worklet';

	const animations: StyleProps = {
		opacity: withTiming(1, { duration: 500 }),
		transform: [{ scale: withSpring(1, { stiffness: 120, mass: 0.8 }) }]
	};

	const initialValues: StyleProps = {
		opacity: 0,
		transform: [{ scale: 0.7 }]
	};

	const callback = (finished: boolean) => {};

	return {
		initialValues,
		animations,
		callback
	};
};

export const exitScaleAnimation = (values: ExitAnimationsValues): LayoutAnimation => {
	'worklet';

	const animations: StyleProps = {
		opacity: withDelay(80, withTiming(0, { duration: 400 })),
		height: withTiming(0, { duration: 740 })
	};

	const initialValues: StyleProps = {
		height: values.currentHeight,
		opacity: 1
	};

	const callback = (finished: boolean) => {};

	return {
		initialValues,
		animations,
		callback
	};
};

export const entryScaleHeight = (values: EntryAnimationsValues): LayoutAnimation => {
	'worklet';

	const animations: StyleProps = {
		opacity: withDelay(200, withTiming(1, { duration: 400 }))
	};

	const initialValues: StyleProps = {
		opacity: 0
	};

	const callback = (finished: boolean) => {};

	return {
		initialValues,
		animations,
		callback
	};
};

export const staggerCardAnimation = (index: number) => {
	return (values: EntryAnimationsValues): LayoutAnimation => {
		'worklet';

		const animations: StyleProps = {
			opacity: withDelay(index * 200, withTiming(1, { duration: 400 })),
			transform: [
				{ translateY: withDelay(index * 200, withSpring(0, { duration: 700 })) }
			]
		};

		const initialValues: StyleProps = {
			opacity: 0,
			transform: [{ translateY: 50 }]
		};

		const callback = (finished: boolean) => {};

		return {
			initialValues,
			animations,
			callback
		};
	};
};

export const exitStaggerCardAnimation = (index: number) => {
	return (values: EntryAnimationsValues): LayoutAnimation => {
		'worklet';

		const animations: StyleProps = {
			opacity: withDelay(index * 120, withTiming(0, { duration: 200 })),
			transform: [
				{ translateY: withDelay(index * 20, withSpring(80, { duration: 300 })) },
				{ scaleX: withDelay(index * 20, withSpring(0, { duration: 300 })) }
			]
		};

		const initialValues: StyleProps = {
			opacity: 1,
			transform: [{ translateY: 0 }, { scaleX: 1 }]
		};

		const callback = (finished: boolean) => {};

		return {
			initialValues,
			animations,
			callback
		};
	};
};

export const exitSlideLeft = (values: ExitAnimationsValues): LayoutAnimation => {
	'worklet';

	const animations: StyleProps = {
		transform: [{ translateX: withTiming(-200, { duration: 220 }) }],
		opacity: withTiming(0, { duration: 220 })
	};

	const initialValues: StyleProps = {
		opacity: 1,
		transform: [{ translateX: 0 }]
	};

	const callback = (finished: boolean) => {};

	return {
		initialValues,
		animations,
		callback
	};
};

export const exitSlideRight = (values: ExitAnimationsValues): LayoutAnimation => {
	'worklet';

	const animations: StyleProps = {
		transform: [{ translateX: withTiming(200, { duration: 280 }) }],
		opacity: withTiming(0, { duration: 280 })
	};

	const initialValues: StyleProps = {
		opacity: 1,
		transform: [{ translateX: 0 }]
	};

	const callback = (finished: boolean) => {};

	return {
		initialValues,
		animations,
		callback
	};
};
export const entrySlideLeft = (values: EntryAnimationsValues): LayoutAnimation => {
	'worklet';

	const animations: StyleProps = {
		transform: [{ translateX: withTiming(0, { duration: 280 }) }],
		opacity: withTiming(1, { duration: 280 })
	};

	const initialValues: StyleProps = {
		opacity: 0.7,
		transform: [{ translateX: -200 }]
	};

	const callback = (finished: boolean) => {};

	return {
		initialValues,
		animations,
		callback
	};
};

export const entrySlideRight = (values: EntryAnimationsValues): LayoutAnimation => {
	'worklet';

	const animations: StyleProps = {
		transform: [{ translateX: withTiming(0, { duration: 280 }) }],
		opacity: withTiming(1, { duration: 280 })
	};

	const initialValues: StyleProps = {
		opacity: 0.7,
		transform: [{ translateX: 200 }]
	};

	const callback = (finished: boolean) => {};

	return {
		initialValues,
		animations,
		callback
	};
};

export const entrySpringDown = (values: EntryAnimationsValues): LayoutAnimation => {
	'worklet';

	const animations: StyleProps = {
		transform: [{ translateY: withSpring(0, { damping: 80 }) }],
		opacity: withTiming(1, { duration: 280 })
	};

	const initialValues: StyleProps = {
		opacity: 0,
		transform: [{ translateY: -70 }]
	};

	const callback = (finished: boolean) => {};

	return {
		initialValues,
		animations,
		callback
	};
};

export const exitSpringUp = (values: ExitAnimationsValues): LayoutAnimation => {
	'worklet';

	const animations: StyleProps = {
		transform: [{ translateY: withSpring(-10, { damping: 80 }) }],
		opacity: withTiming(0, { duration: 120 })
	};

	const initialValues: StyleProps = {
		opacity: 0.2,
		pointerEvents: 'none',
		transform: [{ translateY: 0 }]
	};

	const callback = (finished: boolean) => {};

	return {
		initialValues,
		animations,
		callback
	};
};
