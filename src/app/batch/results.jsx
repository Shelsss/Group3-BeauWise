import Disclaimer from '@/components/batch/Disclaimer';
import BatchHeader from '@/components/batch/Header';
import Colors from '@/constants/Colors';
import { useGlobalSearchParams } from 'expo-router';
import { CircleAlert, CircleCheckBig, CircleQuestionMark } from 'lucide-react-native';
import { useEffect } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Shadow } from 'react-native-shadow-2';
const resultSchema = [
    {
        type: 'safe',
        headerContent: 'Product is Fresh',
        footerContent: 'Valid batch code detected',
        icon: (size, color) => <CircleCheckBig color={color} size={size} />,
        themeColor: '#20c997',
        note: {
            title: 'Safety Note',
            message: `This product is within its standard 36-month unopened shelf life. Please remember to check the PAO (Period After Opening) symbol on the back of the bottle. If the symbol says "12M", discard the product 12 months after you open it, regardless of the estimated expiry above.`
        }
    },

    {
        type: 'unsafe',
        headerContent: 'Product is Expired',
        footerContent: `This product's batch code indicates it is past its recommended shelf life.`,
        icon: (size, color) => <CircleAlert color={color} size={size} />,
        themeColor: '#ff7a7c',
        note: {
            title: 'Warning',
            message: `This product has exceeded its recommended unopened shelf life. Using expired cosmetics can lead to bacterial infections, skin irritation, and reduced efficacy of active ingredients. We strongly advise disposing of this item.`
        }
    },

    {
        type: 'warn',
        headerContent: 'Invalid Code or Not Found',
        footerContent: `We could not decode this batch code. It might be invalid or not yet in our database.`,
        icon: (size, color) => <CircleQuestionMark color={color} size={size} />,
        themeColor: '#ffc53d',
        note: {
            title: 'Actionable Advice',
            message: `Make sure you are typing the Batch Code (usually 4 to 7 alphanumeric characters printed on the bottom of the bottle or the crimp of the tube), not the Barcode. If the code is correct, the brand may have recently updated its batch coding algorithm.`
        }
    }
];

const mockBrandResult = {
    name: 'Z',
    batchCode: '54W200',
    dateManufactured: 'October 2025',
    currentAge: '5 Months',
    estimatedExpiration: 'Octoboder 2028'
};

export default function BatchResultsScreen(/*{ resultType = 'invalid' }*/) {
    const { bottom } = useSafeAreaInsets();
    const { resultType, brandName, batchCode, manufactureDate, estimatedExpiration, currentAge, error } = useGlobalSearchParams();
    const schema = resultSchema.find((item) => item.type === resultType);
    
    return (
        <View style={{ flex: 1, backgroundColor: '#f8fafc', paddingBottom: bottom }}>
            <BatchHeader title='Batch Analysis' />
            <View style={{ paddingHorizontal: 24, paddingTop: 22, rowGap: 28, flex: 1 }}>
                <View
                    style={{
                        justifyContent: 'center',
                        alignItems: 'center',
                        rowGap: 8
                    }}
                >
                    <View
                        style={{
                            backgroundColor: schema.themeColor + '1a',
                            borderRadius: 100,
                            padding: 16
                        }}
                    >
                        {schema.icon(30, schema.themeColor)}
                    </View>

                    <Text style={{ color: schema.themeColor, fontWeight: 700, fontSize: 24 }}>
                        {schema.headerContent}
                    </Text>
                    <Text
                        style={{
                            color: Colors.textColor,
                            lineHeight: 20,
                            fontSize: 14,
                            textAlign: 'center'
                        }}
                    >
                        {schema.footerContent}
                    </Text>
                </View>

                <Shadow stretch={true} distance={0.5} startColor='#4a4a4a2f' offset={[0, 0.5]}>
                    <View
                        style={{
                            rowGap: 24,
                            backgroundColor: Colors.backgroundColor,
                            borderRadius: 16,
                            padding: 24
                        }}
                    >
                        <View style={{ flexDirection: 'row' }}>
                            <View style={{ flex: 1 }}>
                                <Text style={STYLES.cardHeaderTitle}>brand</Text>
                                <Text style={STYLES.cardDescription}>{brandName}</Text>
                            </View>

                            <View style={{ flex: 1 }}>
                                <Text style={STYLES.cardHeaderTitle}>batch code</Text>
                                <Text style={STYLES.cardDescription}>{batchCode}</Text>
                            </View>
                        </View>

                        {
                            resultType != 'warn' &&

                            <>
                                <View style={{ flexDirection: 'row' }}>
                                    <View style={{ flex: 1 }}>
                                        <Text style={STYLES.cardHeaderTitle}>manufactured</Text>
                                        <Text style={STYLES.cardDescription}>
                                            {manufactureDate}
                                        </Text>
                                    </View>

                                    <View style={{ flex: 1 }}>
                                        <Text style={STYLES.cardHeaderTitle}>current age</Text>
                                        <Text style={STYLES.cardDescription}>{currentAge}</Text>
                                    </View>
                                </View>

                                <View style={{ borderTopWidth: 1, borderTopColor: Colors.textColor + '1a' }}>
                                    <View style={{ paddingTop: 10 }}>
                                        <Text style={STYLES.cardHeaderTitle}>estimated expiry</Text>
                                        <Text style={STYLES.cardDescription}>
                                            {estimatedExpiration}
                                        </Text>
                                    </View>
                                </View>
                            </>
                        }

                    </View>
                </Shadow>

                <Disclaimer note={schema.note} color={schema.themeColor} />

                <Shadow stretch={true} distance={1} startColor='#0000002f' offset={[0, 1]}>
                    <Pressable
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
                            Check Another Product
                        </Text>
                    </Pressable>
                </Shadow>
            </View>
        </View>
    );
}

const STYLES = StyleSheet.create({
    cardHeaderTitle: {
        textTransform: 'uppercase',
        color: Colors.textColor + '7a',
        fontWeight: 600
    },
    cardDescription: { color: Colors.textColor, fontWeight: 600 }
});
