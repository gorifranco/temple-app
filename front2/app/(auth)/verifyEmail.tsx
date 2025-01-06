import Background from '@/components/Background';
import { useThemeStyles } from '@/themes/theme';
import { Link, router } from 'expo-router';
import { View, Text, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function VerifyEmailScreen() {
    const themeStyles = useThemeStyles();

    return (
        <SafeAreaView style={themeStyles.background}>
            <Background>
                <Text style={themeStyles.header}>Verify your email</Text>
                <Text>We've sent a verification link to your email. Please check your inbox and click the link to verify your account.</Text>
                <Pressable style={themeStyles.button1} onPress={() => {
                    router.replace("/")
                }}><Text style={themeStyles.button1Text}>Proceed to login</Text></Pressable>

                <View style={themeStyles.row}>
                    <Text>Didn't recive the email?</Text>
                    <Link href={{ pathname: '/RegisterScreen' }} style={themeStyles.link}>Resend</Link>
                </View>

            </Background>
        </SafeAreaView>
    );
}