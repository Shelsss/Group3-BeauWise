import { View, StyleSheet } from 'react-native';

const SingleSidedShadow = ({ children, style, hasDefaultStyle }) => (
	<View style={[hasDefaultStyle && styles.container, style]}>{children}</View>
);

const styles = StyleSheet.create({
	container: {
		borderBottomStartRadius: 16,
		borderBottomEndRadius: 16,
		overflow: 'hidden',
		paddingBottom: 1
	}
});

export default SingleSidedShadow;
