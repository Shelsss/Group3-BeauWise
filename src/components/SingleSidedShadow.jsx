import { View, StyleSheet } from 'react-native';

const SingleSidedShadow = ({
	children,
	style,
	hasDefaultStyle,
	topPadding = 0,
	bottomPadding = 0
}) => (
	<View
		style={[
			hasDefaultStyle && styles.container,
			style,
			{
				paddingTop: topPadding,
				paddingBottom: bottomPadding
			}
		]}
	>
		{children}
	</View>
);

const styles = StyleSheet.create({
	container: {
		overflow: 'hidden'
	}
});

export default SingleSidedShadow;
