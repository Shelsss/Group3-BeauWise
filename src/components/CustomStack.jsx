import { withLayoutContext } from 'expo-router';
import { createBlankStackNavigator } from 'react-native-screen-transitions/blank-stack';

const { Navigator } = createBlankStackNavigator();

export const Stack = withLayoutContext(Navigator);
