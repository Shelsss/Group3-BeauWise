import AnimatedTabs from '@/components/AnimatedTabs';
import CreateAccountButton from '@/components/CreateAccountButton';
import CustomHeader from '@/components/CustomHeader';
import Card from '@/components/history/Card';
import Disclaimer from '@/components/history/Disclaimer';
import GuestModeView from '@/components/history/GuessModeView';
import HistoryBottomSheet from '@/components/history/HistoryBottomSheet';
import SearchBar from '@/components/SearchBar';
import SearchFilter from '@/components/SearchFilter';
import SingleSidedShadow from '@/components/SingleSidedShadow';
import Colors from '@/constants/Colors';
import PagePadding from '@/constants/PagePadding';
import { auth } from '@/services/auth';
import { useAuthStore } from '@/stores/useAuthStore';
import { doc, getDoc, getFirestore, query as firestoreQuery } from '@react-native-firebase/firestore';
import { router } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import {
    Text,
    View,
    TouchableWithoutFeedback,
    Keyboard,
    SectionList,
    Vibration
} from 'react-native';
import PagerView from 'react-native-pager-view';
import { Shadow } from 'react-native-shadow-2';

const mockData = [
    {
        title: 'today',
        data: [
            { title: 'Hydrating Hyaluronic Acid Serum', time: '08:15 AM', status: 'safe' },
            {
                title: 'Midnight Repair Night Cream (Batch B)',
                time: '09:45 AM',
                status: 'warn'
            },
            { title: 'Organic Tea Tree Essential Oil', time: '10:30 AM', status: 'safe' },
            { title: 'Ultra-Matte Longwear Foundation', time: '11:20 AM', status: 'unsafe' },
            { title: 'Mineral SPF 50 Sunscreen', time: '01:05 PM', status: 'safe' },
            { title: 'Rosewater Revitalizing Toner', time: '02:50 PM', status: 'warn' },
            { title: 'Exfoliating Glycolic Acid Peel', time: '04:15 PM', status: 'unsafe' }
        ]
    },
    {
        title: 'yesterday',
        data: [
            { title: 'Hydrating Hyaluronic Acid Serum', time: '08:15 AM', status: 'safe' },
            {
                title: 'Midnight Repair Night Cream (Batch B)',
                time: '09:45 AM',
                status: 'warn'
            },
            { title: 'Organic Tea Tree Essential Oil', time: '10:30 AM', status: 'safe' },
            { title: 'Ultra-Matte Longwear Foundation', time: '11:20 AM', status: 'unsafe' },
            { title: 'Mineral SPF 50 Sunscreen', time: '01:05 PM', status: 'safe' },
            { title: 'Rosewater Revitalizing Toner', time: '02:50 PM', status: 'warn' },
            { title: 'Exfoliating Glycolic Acid Peel', time: '04:15 PM', status: 'unsafe' }
        ]
    }
];

export default function HistoryScreen() {
    const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
    const pageRef = useRef(null);
    const historySheetModalRef = useRef(null);

    const [tab, setTab] = useState(0);
    const [query, setQuery] = useState('');
    const [refreshing, setRefresh] = useState(false);

    const [fdaHistory, setFdaData] = useState([]);
    const [batchData, setBatchData] = useState([]);

    const handleQuery = (value) => () => setQuery(value);

    const handleTabChange = (value) => {
        if(value == 2) {
            fetchFdaData();
		}
        if(value == 1) {
            fetchBatchData();
        }
        requestAnimationFrame(() => {
            setTab(value);
            pageRef.current?.setPage(value);
        });
    };

    const handlePresentModalPress = () => {
        historySheetModalRef.current?.present();
        Vibration.vibrate(50);
    };

    const handleScanHistory = () => {
        router.push('scanner/results');
        Vibration.vibrate(50);
    };

    const handleFdaHistory = (result) => {
        console.log(JSON.stringify(result.data));
        router.push({
            pathname: '/fda/results',
            params: {
                result: result.result || 'warn',
                data: JSON.stringify(result.data)
			}
		});
    }
	
    const handleBatchHistory = (result) => {
        router.push({
            pathname: '/batch/results',
            params: result
        });
        Vibration.vibrate(50);
    }

    const formatAMPM = (date) => {
        var hours = date.getHours();
        var minutes = date.getMinutes();
        var ampm = hours >= 12 ? 'pm' : 'am';
        hours = hours % 12;
        hours = hours ? hours : 12; // the hour '0' should be '12'
        minutes = minutes < 10 ? '0' + minutes : minutes;
        var strTime = hours + ':' + minutes + ' ' + ampm;
        return strTime;
    }

    const fetchFdaData = async () => {
      setRefresh(true);
        const db = getFirestore();
        const docRef = firestoreQuery(doc(db, "users", auth.currentUser.uid));
        const data = await getDoc(docRef);
        const fdaData = [
            {
                title: "Today",
                data: data.data().fdaHistory.filter((item) => {
                    const createdAt = item.createdAt.toDate();
                    let today = new Date();
                    return (createdAt.setHours(0, 0, 0, 0) == today.setHours(0, 0, 0, 0));
                })
            },
            {
                title: "Yesterday",
                data: data.data().fdaHistory.filter((item) => {
                    const createdAt = item.createdAt.toDate();
                    let yesterday = new Date();
                    yesterday.setDate(yesterday.getDate() - 1);
                    return (createdAt.setHours(0, 0, 0, 0) == yesterday.setHours(0, 0, 0, 0));
                })
            },
            {
                title: "Older",
                data: data.data().fdaHistory.filter((item) => {
                     const createdAt = item.createdAt.toDate();
                    let today = new Date();
                    let yesterday = new Date();
                    yesterday.setDate(yesterday.getDate() - 1);
                    return !(createdAt.setHours(0, 0, 0, 0) == yesterday.setHours(0, 0, 0, 0)) && !(createdAt.setHours(0, 0, 0, 0) == today.setHours(0, 0, 0, 0));
                })
            }
        ]
        setFdaData(fdaData);
      setRefresh(false);
    }
    
     const fetchBatchData = async () => {
        setRefresh(true);
        const db = getFirestore();
        const docRef = firestoreQuery(doc(db, "users", auth.currentUser.uid));
        const data = await getDoc(docRef);
        const batchData = [
            {
                title: "Today",
                data: data.data().batchHistory.filter((item) => {
                    const createdAt = item.createdAt.toDate();
                    let today = new Date();
                    return (createdAt.setHours(0, 0, 0, 0) == today.setHours(0, 0, 0, 0));
                })
            },
            {
                title: "Yesterday",
                data: data.data().batchHistory.filter((item) => {
                    const createdAt = item.createdAt.toDate();
                    let yesterday = new Date();
                    yesterday.setDate(yesterday.getDate() - 1);
                    return (createdAt.setHours(0, 0, 0, 0) == yesterday.setHours(0, 0, 0, 0));
                })
            },
            {
                title: "Older",
                data: data.data().batchHistory.filter((item) => {
                    const createdAt = item.createdAt.toDate();
                    let today = new Date();
                    let yesterday = new Date();
                    yesterday.setDate(yesterday.getDate() - 1);
                    return !(createdAt.setHours(0, 0, 0, 0) == yesterday.setHours(0, 0, 0, 0)) && !(createdAt.setHours(0, 0, 0, 0) == today.setHours(0, 0, 0, 0));
                })
            }
          ]
        setBatchData(batchData);
       setRefresh(false);
    }

    return (
        <View style={{ flex: 1 }}>
            <TouchableWithoutFeedback
                touchSoundDisabled={true}
                onPress={Keyboard.dismiss}
                accessible={false}
            >
                <View style={{ zIndex: 2 }}>
                    <CustomHeader title={'History'} disableShadow={true} />

                    {isAuthenticated && (
                        <Shadow
                            distance={3}
                            stretch={true}
                            startColor='#00000010'
                            sides={{ top: false }}
                            offset={[0, 0]}
                        >
                            <View
                                style={{
                                    backgroundColor: Colors.backgroundColor,
                                    paddingHorizontal: PagePadding.config.paddingHorizontal,
                                    paddingBottom: 8,
                                    borderBottomStartRadius: 16,
                                    borderBottomEndRadius: 16,

                                    paddingTop: 16,
                                    rowGap: 16
                                }}
                            >
                                <View
                                    style={{
                                        flexDirection: 'row',
                                        columnGap: 10
                                    }}
                                >
                                    <SearchBar style={{ flex: 1 }} handleQuery={handleQuery} />
                                    <SearchFilter handlePress={handlePresentModalPress} />
                                </View>

                                <AnimatedTabs
                                    style={{ marginTop: 10 }}
                                    tabs={['Scans', 'Batch Code', 'FDA']}
                                    handleTabChange={handleTabChange}
                                    currentIndex={tab}
                                />
                            </View>
                        </Shadow>
                    )}
                </View>
            </TouchableWithoutFeedback>

            {!isAuthenticated && <GuestModeView />}

            {isAuthenticated && (
                <PagerView
                    offscreenPageLimit={1}
                    onPageSelected={({ nativeEvent: { position } }) => handleTabChange(position)}
                    ref={pageRef}
                    overScrollMode='never'
                    style={{ flex: 1, padding: 50 }}
                    pageMargin={100}
                    initialPage={tab}
                >
                    <View key={1} style={{ width: '100%', height: '100%', zIndex: 1 }}>
                        <SectionList
                            contentContainerStyle={{
                                rowGap: 15,
                                paddingHorizontal: PagePadding.config.paddingHorizontal,
                                paddingBottom: PagePadding.config.paddingBottom - 15,
                                paddingTop: 15
                            }}
                            sections={mockData}
                            keyExtractor={(item, index) => `${item.title}-${index}`}
                            renderItem={({ item }) => (
                                <Card
                                    onPress={handleScanHistory}
                                    time={item.time}
                                    status={item.status}
                                    title={item.title}
                                />
                            )}
                            stickySectionHeadersEnabled={true}
                            showsVerticalScrollIndicator={false}
                            renderSectionHeader={({ section }) => (
                                <SectionHeader title={section.title} />
                            )}
                        />
                    </View>

                    <View key={2} style={{ width: '100%', height: '100%' }}>
                        <SectionList
                            contentContainerStyle={{
                                rowGap: 15,
                                paddingHorizontal: PagePadding.config.paddingHorizontal,
                                paddingBottom: PagePadding.config.paddingBottom - 15,
                                paddingTop: 15
                            }}
                            onRefresh={fetchBatchData}
                            refreshing={refreshing}
                            sections={batchData}
                            keyExtractor={(item, index) => `${item.title} + ${index}`}
                            renderItem={({ item }) => (
                                <Card
                                    type='batch'
                                    onPress={() => {handleBatchHistory(item.results)}}
                                    time={formatAMPM(item.createdAt.toDate())}
                                    status={item.resultType}
                                    title={item.query.brandName}
                                />
                            )}
                            stickySectionHeadersEnabled={true}
                            showsVerticalScrollIndicator={false}
                            renderSectionHeader={({ section }) => (
                                <SectionHeader title={section.title} />
                            )}
                            ListFooterComponent={
                                <Disclaimer
                                    description={`Expiry dates are estimates for unopened products. Once opened, please follow the PAO (Period After Opening) symbol on the packaging, usually marked as 6M, 12M, etc. "Invalid" results may occur if a brand recently updated its batch code format. Always discard products that change in color, smell, or texture.`}
                                />
                            }
                        />
                    </View>

                    <View key={3} style={{ width: '100%', height: '100%' }}>
                        <SectionList
                            contentContainerStyle={{
                                rowGap: 15,
                                paddingHorizontal: PagePadding.config.paddingHorizontal,
                                paddingBottom: PagePadding.config.paddingBottom - 15,
                                paddingTop: 15
                            }}
                            sections={fdaHistory}
                            keyExtractor={(item, index) => `${item.title} + ${index}`}
                            renderItem={({ item }) => (
                                <Card
                                    type='fda'
                                    onPress={() => { handleFdaHistory(item.results) }}
                                    time={formatAMPM(item.createdAt.toDate())}
                                    status={item.resultType}
                                    title={item.query.text}
                                />
                            )}
                            stickySectionHeadersEnabled={true}
                            showsVerticalScrollIndicator={false}
                            renderSectionHeader={({ section }) => (
                                <SectionHeader title={section.title} />
                            )}
                            ListFooterComponent={
                                <Disclaimer
                                    description={`The verification statuses displayed in this history log are cached records from your previous searches. FDA product notifications are subject to expiration and revocation. BeauWise recommends running a new verification check for the most up-to-date compliance status.`}
                                />
                            }
                        />
                    </View>
                </PagerView>
            )}

            <HistoryBottomSheet historySheetModalRef={historySheetModalRef} />
        </View>
    );
}

function SectionHeader({ title }) {
    return (
        <View style={{ marginBottom: 10, marginTop: 10, backgroundColor: 'transparent' }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', columnGap: 6 }}>
                <Text
                    style={{
                        fontSize: 12,
                        letterSpacing: 1,
                        fontWeight: '700',
                        color: '#9a9a9a',
                        textTransform: 'uppercase'
                    }}
                >
                    {title}
                </Text>
                <View style={{ backgroundColor: '#9a9a9a', height: 1, flex: 1 }} />
            </View>
        </View>
    );
}
