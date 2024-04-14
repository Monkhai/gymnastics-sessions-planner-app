import { LinearGradient } from 'expo-linear-gradient';
import { AnimatedPressable, ContainerButton, RectButton } from '@/Components/GeneralComponents/Buttons';
import { EmphasizedTitleText } from '@/Components/GeneralComponents/Texts';
import { LabeledTextInput } from '@/Components/Lists/LabeledTextInput';
import Colors from '@/Constants/Colors';
import signInWIthGoogle from '@/assets/logo/Sign-in-with-Google.png';
import logo from '@/assets/logo/logo.png';
import logoDark from '@/assets/logo/logo_dark.png';
import { supabase } from '@/config/initSupabase';
import { FasterImageView } from '@candlefinance/faster-image';
import { GoogleSignin, statusCodes } from '@react-native-google-signin/google-signin';
import React from 'react';
import { Alert, Image, Keyboard, StyleSheet, View, useColorScheme } from 'react-native';
import { FadeIn } from 'react-native-reanimated';

const LOGO = Image.resolveAssetSource(logo).uri;
const LOGO_DARK = Image.resolveAssetSource(logoDark).uri;
const SIGN_IN_WITH_GOOGLE = Image.resolveAssetSource(signInWIthGoogle).uri;

const Login = () => {
  GoogleSignin.configure({
    // scopes: ['https://www.googleapis.com/auth/drive.readonly'], // what API you want to access on behalf of the user, default is email and profile
    webClientId: '903093166492-gc7ql9a3j34n5mi8sfv436oqjf9jvdi1.apps.googleusercontent.com',
    iosClientId: '903093166492-vvrddauiobk4ovsp7lk3irl8vs56er63.apps.googleusercontent.com',
  });
  const colorScheme = useColorScheme();

  const [email, setEmail] = React.useState<string | undefined>();
  const [password, setPassword] = React.useState<string | undefined>();

  const handleSignIn = async () => {
    if (!email || !password) {
      alert('Please enter email and password');
      return;
    }

    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      alert(error.message);
    }
  };

  const handleSingUp = async () => {
    if (!email || !password) {
      alert('Please enter email and password');
      return;
    }

    const { error } = await supabase.auth.signUp({ email, password });

    if (error) {
      alert(error.message);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();

      if (userInfo.idToken) {
        const { data, error } = await supabase.auth.signInWithIdToken({
          provider: 'google',
          token: userInfo.idToken,
        });

        if (error) {
          throw error;
        }
      } else {
        Alert.alert('Something went wrong', 'Please try again later', [{ text: 'OK' }], { cancelable: false });
      }
    } catch (error: any) {
      if (error.cod === statusCodes.SIGN_IN_CANCELLED) {
        console.log('cancelled', error);
      } else if (error.code === statusCodes.IN_PROGRESS) {
        Alert.alert('Something went wrong', 'Please try again later', [{ text: 'OK' }], { cancelable: false });
        console.log('in progress', error);
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        Alert.alert('Something went wrong', 'Please try again later', [{ text: 'OK' }], { cancelable: false });
        console.log('play services not available or outdated', error);
      } else {
        Alert.alert('Something went wrong', 'Please try again later', [{ text: 'OK' }], { cancelable: false });
        console.log('error', error);
      }
    }
  };

  return (
    <>
      <LinearGradient style={{ ...StyleSheet.absoluteFillObject }} colors={Colors[colorScheme ?? 'light'].bg.gradient} />
      <AnimatedPressable onPress={() => Keyboard.dismiss()} entering={FadeIn.duration(500)} style={styles.container}>
        <View style={styles.groupContainer}>
          <FasterImageView source={{ url: colorScheme === 'dark' ? LOGO_DARK : LOGO, resizeMode: 'contain' }} style={styles.logo} />
          <EmphasizedTitleText>FlexiPlan</EmphasizedTitleText>
        </View>

        <ContainerButton onPress={handleGoogleSignIn} delay={false} style={styles.groupContainer}>
          <FasterImageView source={{ url: SIGN_IN_WITH_GOOGLE, resizeMode: 'contain' }} style={{ width: 300, height: 54 }} />
        </ContainerButton>

        <View style={styles.groupContainer}>
          <LabeledTextInput label="Email" value={email} onChangeText={setEmail} placeholder="Email" keyboardType="default" />
          <LabeledTextInput
            label="Password"
            value={password}
            onChangeText={setPassword}
            placeholder="Password"
            keyboardType="default"
            secureTextEntry
          />
        </View>

        <View style={styles.groupContainer}>
          <RectButton label="Login" wide onPress={handleSignIn} />
          <RectButton secondary label="Create Acount" onPress={handleSingUp} wide />
        </View>
      </AnimatedPressable>
    </>
  );
};

export default Login;

const styles = StyleSheet.create({
  groupContainer: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 16,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 32,
  },
  logo: {
    width: 100,
    height: 100,
  },
});
