import BatchHeader from '@/components/batch/Header';
import BatchSelect from '@/components/batch/Select';
import Batch from '@/components/icons/Batch';
import Colors from '@/constants/Colors';
import { useRouter } from 'expo-router';
import { CircleCheck } from 'lucide-react-native';
import {
    Keyboard,
    Pressable,
    StyleSheet,
    Text,
    TouchableWithoutFeedback,
    Vibration,
    View
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Shadow } from 'react-native-shadow-2';

import { useRef, useState } from 'react';
import BatchBottomSheet from '@/components/batch/BatchBottomSheet';
import BatchInput from '@/components/batch/Input';
import { getFirestore, Timestamp, arrayUnion, doc, updateDoc } from '@react-native-firebase/firestore';
import { auth } from '@/services/auth';
export default function BatchScreen() {
    const router = useRouter();
    const { bottom, top } = useSafeAreaInsets();
    const batchSheetModalRef = useRef(null);

    const [brandValue, setBrandValue] = useState("");
    const [codeValue, setCodeValue] = useState("");

    const handlePresentModalPress = () => {
        batchSheetModalRef.current?.present();
        Vibration.vibrate(50);
    };

    const checkBatchCode = (brand, code) => {
        const response = fetch('https://www.cosmeticcheck.app/api/decode?t=1779393293466', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ "brand": brand, "code": code })
        })

        return response;
    }

    const getCurrentAge = (years, months, days) => {
        let ageString = "";

        if (years) {
            ageString += years + " Year";
            if (years > 1) {
                ageString += "s";
            }
            ageString += " "
        }
        if (months) {
            ageString += months + " Month";
            if (months > 1) {
                ageString += "s";
            }
            ageString += " "
        }
        if (days) {
            ageString += days + " Day";
            if (days > 1) {
                ageString += "s";
            }
            ageString += " "
        }

        return ageString;
    }

    const getMonthName = (month) => {
        switch (month) {
            case 1:
                return "January";
            case 2:
                return "February";
            case 3:
                return "March";
            case 4:
                return "April";
            case 5:
                return "May";
            case 6:
                return "June";
            case 7:
                return "July";
            case 8:
                return "August";
            case 9:
                return "September";
            case 10:
                return "October";
            case 11:
                return "November";
            case 12:
                return "December";
        }
    }

    const handlePress = () => {
        checkBatchCode(brandValue.value, codeValue).then(result => {
            if (result.ok) {
                result.json().then(data => {
                    console.log(data);

                    let resultType = '';
                    let currentAgeString = '';
                    const manufactureDate = getMonthName(data?.body?.month ?? 0) + " " +
                        (data?.body?.date ?? '1') + ", " + data?.body?.year;
                    const estimatedExpiration = getMonthName(data?.body?.month ?? 0) + " " +
                        (data?.body?.date ?? '1') + ", " + (parseInt(data?.body?.year ?? 2026) + 3);

                    if (parseInt(data.error) > 0) {
                        resultType = 'warn'
                    } else {
                        const day = data?.body?.date ?? 1;
                        const month = data?.body?.month ?? 1;
                        const year = data?.body?.year ?? 2026;
                        const resultDate = new Date(year, month, day);
                        const estExpiryDate = new Date(year + 3, month, day);
                        const currentAge = new Date(Date.now() - resultDate);
                        const currentAgeYear = Math.abs(currentAge.getUTCFullYear() - 1970);
                        const currentAgeMonth = Math.abs(currentAge.getUTCMonth());
                        const currentAgeDay = Math.abs(currentAge.getUTCDay() - 1);
                        console.log(currentAgeMonth)
                        currentAgeString = getCurrentAge(currentAgeYear, currentAgeMonth, currentAgeDay);

                        if (Date.now() > estExpiryDate) {
                            resultType = 'unsafe';
                        } else {
                            resultType = 'safe';
                        }
                    }

                    //Save to db
                    const newHistoryObj = {
                        createdAt: Timestamp.now(),
                        query: {
                            brandName: brandValue.text,
                            batchCode: codeValue,
                        },
                        results: {
                            resultType: resultType,
                            brandName: brandValue.text,
                            batchCode: codeValue,
                            manufactureDate: manufactureDate,
                            estimatedExpiration: estimatedExpiration,
                            currentAge: currentAgeString,
                            error: data.error ?? "0"
                        },
                        resultType: resultType,
                    }

                    const db = getFirestore();
                    const docRef = doc(db, "users", auth.currentUser.uid);
                    updateDoc(docRef, {
                        batchHistory: arrayUnion(newHistoryObj)
                    })

                    router.push({
                        pathname: '/batch/results',
                        params: {
                            resultType: resultType,
                            brandName: brandValue.text,
                            batchCode: codeValue,
                            manufactureDate: manufactureDate,
                            estimatedExpiration: estimatedExpiration,
                            currentAge: currentAgeString,
                            error: data.error ?? "0"
                        }
                    });
                })
            }
        })
    };

    return (
        <TouchableWithoutFeedback
            touchSoundDisabled={true}
            onPress={Keyboard.dismiss}
            accessible={false}
        >
            <View style={styles.container}>
                <BatchHeader title='Product Freshness' />

                <View
                    style={{
                        justifyContent: 'center',
                        alignItems: 'center',
                        flex: 1,
                        gap: 12,

                        paddingHorizontal: 24,
                        marginBottom: bottom + 20
                    }}
                >
                    <Text
                        style={{
                            paddingTop: top + 10,
                            color: Colors.textColor + '7a',
                            fontWeight: 400,
                            fontSize: 14,
                            textAlign: 'center',
                            width: 300
                        }}
                    >
                        Select a brand and enter the batch code to see if your cosmetic is fresh or
                        expired.
                    </Text>

                    <View>
                        <Batch size={250} />
                    </View>

                    <Shadow
                        stretch={true}
                        distance={2}
                        startColor='#00000010'
                        offset={[0, 1]}
                        containerStyle={{
                            width: '100%'
                        }}
                    >
                        <View
                            style={{
                                backgroundColor: Colors.backgroundColor,
                                padding: 16,
                                borderRadius: 24,
                                rowGap: 24
                            }}
                        >
                            <View>
                                <Text
                                    style={{
                                        color: Colors.textColor,
                                        fontWeight: 500
                                    }}
                                >
                                    Brand
                                </Text>
                                <BatchSelect handleSelect={handlePresentModalPress} brandValue={brandValue} />
                            </View>

                            <View>
                                <Text
                                    style={{
                                        color: Colors.textColor,
                                        fontWeight: 500
                                    }}
                                >
                                    Batch Code
                                </Text>
                                <BatchInput onCodeValueChanged={setCodeValue} />
                                <Text
                                    style={{
                                        marginTop: 8,
                                        marginLeft: 2,
                                        fontSize: 12,
                                        color: Colors.textColor + '7a'
                                    }}
                                >
                                    Usually found on the bottom of the container.
                                </Text>
                            </View>

                            {/* This should be a primary button component */}

                            <Shadow stretch={true} distance={1} startColor='#0000002f' offset={[0, 1]}>
                                <Pressable
                                    onPress={handlePress}
                                    style={{
                                        columnGap: 12,
                                        flexDirection: 'row',
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        backgroundColor: Colors.primary,
                                        padding: 16,
                                        borderRadius: 16
                                    }}
                                >
                                    <Text
                                        style={{
                                            fontSize: 16,
                                            fontWeight: 600,
                                            color: Colors.backgroundColor
                                        }}
                                    >
                                        Check Freshness
                                    </Text>
                                    <CircleCheck size={16} color={Colors.backgroundColor} />
                                </Pressable>
                            </Shadow>
                        </View>
                    </Shadow>
                </View>

                <BatchBottomSheet batchSheetModalRef={batchSheetModalRef} onBrandValueChanged={setBrandValue} />
            </View>
        </TouchableWithoutFeedback>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8fafc'
    }
});
