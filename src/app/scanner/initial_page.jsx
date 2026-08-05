import Card from '@/components/scanner/Card';
import Colors from '@/constants/Colors';
import PagePadding from '@/constants/PagePadding';
import { useRouter } from 'expo-router';
import { Camera, Images, Keyboard, X } from 'lucide-react-native';
import { useRef } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as ImagePicker from 'expo-image-picker';
import { ImageManipulator } from 'expo-image-manipulator';
import { useScanStore } from '@/stores/useScanStore';
export default function ScannerScreen() {
    const router = useRouter();
    const scrollViewRef = useRef(null);
    const { top, bottom } = useSafeAreaInsets();
    const setImageBase64 = useScanStore((state) => state.setImageBase64);

    return (
        <View style={styles.container}>
            <Pressable
                testID='back-button'
                accessibilityRole='button'
                style={[styles.closeButton, { top: top }]}
                onPress={() => router.back()}
            >
                <X color='#181818' size={28} />
            </Pressable>

            <ScrollView
                ref={scrollViewRef}
                showsVerticalScrollIndicator={false}
                onScroll={({ nativeEvent }) => {
                    if (nativeEvent.contentOffset.y <= 0) {
                        scrollViewRef.current?.scrollTo({ x: 0, y: 0 });
                    }
                }}
                contentContainerStyle={{
                    rowGap: 35,
                    marginTop: top + 60,
                    paddingBottom: PagePadding.config.paddingBottom + bottom,
                    justifyContent: 'center'
                }}
            >
                <Card
                    onPress={() => router.push('scanner/scan')}
                    title={'Camera Scan'}
                    description={
                        'Point your camera at any product label to instantly identify and analyze ingredients.'
                    }
                    color={Colors.primary}
                >
                    <Camera color={Colors.primary} size={50} />
                </Card>

                <Card
                    onPress={async () => {
                        let result = await ImagePicker.launchImageLibraryAsync({
                            mediaTypes: ['images'],
                            base64: true,
                            selectionLimit: 1,
                            allowsEditing: true,
                            allowsMultipleSelection: false,
                            aspect: [3, 4],
                            quality: 1
                        });

                        if (result.canceled) return;

                        setImageBase64(result.assets[0].base64);
                        router.replace({
                            pathname: 'scanner/processing',
                            params: { from: 'library' }
                        });
                    }}
                    title={'Upload Image'}
                    description={
                        'Choose a photo from your gallery or library. Perfect for screenshots or saved product photos.'
                    }
                    color={'#FF8585'}
                >
                    <Images color={'#FF8585'} size={50} />
                </Card>

                <Card
                    onPress={() => router.push('scanner/details')}
                    title={'Manual Input'}
                    description={`Don't have a photo? Type or paste the ingredients list manually to get a full safety report.`}
                    color={'#0F766E'}
                >
                    <Keyboard color={'#0F766E'} size={50} />
                </Card>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fefeff',
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: PagePadding.config.paddingHorizontal + 25
    },
    closeButton: {
        position: 'absolute',
        left: 20,
        zIndex: 10,
        padding: 8
    }
});
