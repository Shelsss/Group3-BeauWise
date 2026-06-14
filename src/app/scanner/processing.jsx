import Colors from '@/constants/Colors';
import { scanIngredient } from '@/services/cloudFunctions';
import { useAuthStore } from '@/stores/useAuthStore';
import { useScanStore } from '@/stores/useScanStore';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Redirect, router, useLocalSearchParams, usePathname } from 'expo-router';
import LottieView from 'lottie-react-native';
import { Text, View } from 'react-native';
import Toast from 'react-native-toast-message';

import {
	arrayUnion,
	doc,
	getFirestore,
	updateDoc
} from '@react-native-firebase/firestore';
import { auth } from '@/services/auth';
import { useEffect, useRef } from 'react';

const db = getFirestore();

const saveScanHistory = async (ingredients) => {
	await updateDoc(doc(db, 'users', auth.currentUser.uid), {
		scanHistory: arrayUnion(ingredients)
	});
};

export default function Processing() {
	const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
	const params = useLocalSearchParams();
	const imageBase64 = useScanStore((state) => state.imageBase64);
	const setIngredients = useScanStore((state) => state.setIngredients);
	const resetIngredients = useScanStore((state) => state.resetIngredients);
	const { data, isSuccess, isPending, isError } = useQuery({
		queryKey: [imageBase64],
		queryFn: () => scanIngredient(imageBase64),
		gcTime: 0
	});
	const queryClient = useQueryClient();

	const { mutate: handleSaveHistory } = useMutation({
		mutationFn: saveScanHistory,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: [auth.currentUser?.uid] });
		}
	});

	const hasSaved = useRef(false);

	useEffect(() => {
		if (data?.length > 0 && !isPending && !hasSaved.current) {
			resetIngredients();
			setIngredients([...data]);

			if (isAuthenticated) {
				handleSaveHistory({
					date: new Date().toISOString()
				});
			}

			hasSaved.current = true;
			router.replace('scanner/details');
		}
	}, [data, isPending, isAuthenticated]);

	useEffect(() => {
		if (isSuccess && data?.length === 0) {
			Toast.show({
				type: 'error',
				visibilityTime: 3000,
				text1: 'No ingredients detected',
				text2: 'Please ensure that the image has an ingredients list.'
			});
			params?.from === 'library' ? router.replace('scanner') : router.back();
		}
	}, [isSuccess, data]);

	useEffect(() => {
		if (isError) {
			Toast.show({
				type: 'error',
				visibilityTime: 3000,
				text1: 'Error occurred',
				text2: 'Please try again later.'
			});
			params?.from === 'library' ? router.replace('scanner') : router.back();
		}
	}, [isError]);

	return (
		<View
			style={{
				flex: 1,
				justifyContent: 'center',
				alignItems: 'center'
			}}
		>
			<View style={{ alignItems: 'center', justifyContent: 'center' }}>
				<LottieView
					style={{
						aspectRatio: 1,
						width: 600
					}}
					resizeMode='contain'
					speed={1.5}
					autoPlay
					loop={true}
					source={require('assets/lottie/flask-loading.json')}
				/>
				<Text
					style={{
						position: 'absolute',
						top: 400,
						fontSize: 30,
						fontWeight: 600,
						color: Colors.textColor
					}}
				>
					Loading
				</Text>
			</View>
		</View>
	);
}
