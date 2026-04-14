import CodeInput from '@/components/CodeInput';
import PrimaryButton from '@/components/PrimaryButton';
import Colors from '@/constants/Colors';
import { verifyEmail } from '@/services/cloudFunctions';
import LottieView from 'lottie-react-native';
import { useEffect, useRef, useState } from 'react';
import { View, Text } from 'react-native';
export default function EmailVerification() {
	const animationRef = useRef(null);

	const [timeLeft, setTimeLeft] = useState(0);
	const [isClick, setIsClick] = useState(false);
	const [codeInput, setCodeInput] = useState('');

	const requiredInput = 6;

	const handleSubmit = () => {
		if (codeInput.length !== requiredInput) return;

		verifyEmail();
	};

	useEffect(() => {
		const timer = setInterval(() => {
			setTimeLeft((prev) => {
				if (prev <= 0) {
					clearInterval(timer);

					return 0;
				}

				return prev - 1;
			});
		}, 1000);

		return () => clearInterval(timer);
	}, [isClick]);

	return (
		<View style={{ flex: 1, padding: 20, justifyContent: 'center' }}>
			<LottieView
				ref={animationRef}
				style={{
					alignSelf: 'center',
					aspectRatio: 1,
					width: 200
				}}
				autoPlay={false}
				loop={false}
				source={require('assets/lottie/email-send-animation.json')}
			/>
			<Text
				style={{
					textAlign: 'center',
					fontSize: 24,
					fontWeight: 'bold',
					color: Colors.textColor
				}}
			>
				Verify Your Email
			</Text>
			<Text
				style={{
					textAlign: 'center',
					marginVertical: 20,
					color: Colors.textColor + '9a'
				}}
			>
				We will send you an email verification code to your email address.
			</Text>

			<View>
				<CodeInput
					onChangeText={setCodeInput}
					value={codeInput}
					codeCount={requiredInput}
				/>

				<View style={{ marginTop: 20, rowGap: 12 }}>
					<PrimaryButton
						disabled={codeInput.length !== requiredInput}
						containerStyle={{
							borderRadius: 12,
							paddingHorizontal: 50
						}}
						handlePress={handleSubmit}
					>
						<Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 16 }}>
							Verify Account
						</Text>
					</PrimaryButton>

					<PrimaryButton
						disabled={timeLeft > 0}
						containerStyle={{
							backgroundColor: '#fff',
							borderRadius: 12,
							paddingHorizontal: 50,
							shadowColor: '#00000021'
						}}
						handlePress={() => {
							setTimeLeft((prev) => prev + 50);
							setIsClick(!isClick);
							animationRef.current?.play();
						}}
					>
						<Text style={{ color: Colors.textColor, fontWeight: 'bold', fontSize: 16 }}>
							{timeLeft > 0 ? `Resend code after ` : 'Send Code'}
							{timeLeft > 0 && <Text style={{ color: Colors.primary }}>{timeLeft}s</Text>}
						</Text>
					</PrimaryButton>
				</View>
			</View>
		</View>
	);
}
