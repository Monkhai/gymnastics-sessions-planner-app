import { AnimatedPressable, ContainerButton, RectButton } from '@/Components/GeneralComponents/Buttons';
import { EmphasizedTitleText } from '@/Components/GeneralComponents/Texts';
import { LabeledTextInput } from '@/Components/Lists/LabeledTextInput';
import Colors from '@/Constants/Colors';
import signInWIthGoogle from '@/assets/logo/Sign-in-with-Google.png';
import logo from '@/assets/logo/logo.png';
import logoDark from '@/assets/logo/logo_dark.png';
import { supabase } from '@/config/initSupabase';
import { GoogleSignin, statusCodes } from '@react-native-google-signin/google-signin';
import * as AppleAuthentication from 'expo-apple-authentication';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { Alert, Image, Keyboard, KeyboardAvoidingView, Platform, StyleSheet, TextInput, View, useColorScheme } from 'react-native';
import { FadeIn } from 'react-native-reanimated';

const LOGO = Image.resolveAssetSource(logo).uri;
const LOGO_DARK = Image.resolveAssetSource(logoDark).uri;
const SIGN_IN_WITH_GOOGLE = Image.resolveAssetSource(signInWIthGoogle).uri;

const Login = () => {
  GoogleSignin.configure({
    webClientId: '453151625874-tha6pnf6uvkgn76rc873ver29vsk04tu.apps.googleusercontent.com',
    iosClientId: '453151625874-vgh6ht3lpuci3258n4m3ii287iorgj9s.apps.googleusercontent.com',
  });
  const colorScheme = useColorScheme();

  const [email, setEmail] = React.useState<string | undefined>();
  const [password, setPassword] = React.useState<string | undefined>();

  const passwordRef = React.useRef<TextInput>(null);
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

  const somethingWentWrongAlert = () => {
    Alert.alert('Something went wrong', 'Please try again later', [{ text: 'OK' }], { cancelable: false });
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
        somethingWentWrongAlert();
      }
    } catch (error: any) {
      if (error.cod === statusCodes.SIGN_IN_CANCELLED) {
        console.log('cancelled', error);
      } else if (error.code === statusCodes.IN_PROGRESS) {
        somethingWentWrongAlert();
        console.log('in progress', error);
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        somethingWentWrongAlert();
        console.log('play services not available or outdated', error);
      } else {
        somethingWentWrongAlert();
        console.log('error', error);
      }
    }
  };

  const handleAppleSignIn = async () => {
    try {
      const credential = await AppleAuthentication.signInAsync({
        requestedScopes: [AppleAuthentication.AppleAuthenticationScope.FULL_NAME, AppleAuthentication.AppleAuthenticationScope.EMAIL],
      });
      // Sign in via Supabase Auth.
      if (credential.identityToken) {
        const { error } = await supabase.auth.signInWithIdToken({
          provider: 'apple',
          token: credential.identityToken,
        });
        if (error) {
          throw error;
        }
      } else {
        throw new Error('No identityToken.');
      }
    } catch (e: any) {
      if (e.code === 'ERR_REQUEST_CANCELED') {
        // handle that the user canceled the sign-in flow
      } else {
        console.log(e);
        somethingWentWrongAlert();
      }
    }
  };

  return (
    <>
      <LinearGradient style={{ ...StyleSheet.absoluteFillObject }} colors={Colors[colorScheme ?? 'light'].bg.gradient} />
      <AnimatedPressable onPress={() => Keyboard.dismiss()} entering={FadeIn.duration(500)} style={styles.container}>
        <View style={styles.groupContainer}>
          <Image source={{ uri: colorScheme === 'dark' ? LOGO_DARK : LOGO }} style={styles.logo} />
          <EmphasizedTitleText>FlexiPlan</EmphasizedTitleText>
        </View>

        <KeyboardAvoidingView style={styles.groupContainer}>
          <LabeledTextInput
            textContentType="emailAddress"
            onSubmitEditing={() => passwordRef.current?.focus()}
            label="Email"
            value={email}
            onChangeText={setEmail}
            placeholder="Email"
            keyboardType="default"
          />
          <LabeledTextInput
            textContentType="password"
            textInputRef={passwordRef}
            label="Password"
            value={password}
            onChangeText={setPassword}
            placeholder="Password"
            keyboardType="default"
            secureTextEntry
          />
        </KeyboardAvoidingView>

        <View style={styles.groupContainer}>
          <RectButton label="Login" wide onPress={handleSignIn} />
          <RectButton secondary label="Create Acount" onPress={handleSingUp} wide />
          <ContainerButton onPress={handleGoogleSignIn} delay={false} style={[styles.groupContainer, { width: 'auto' }]}>
            <Image source={{ uri: SIGN_IN_WITH_GOOGLE }} style={{ width: 300, height: 54, resizeMode: 'contain' }} />
          </ContainerButton>
          {Platform.OS === 'ios' && (
            <AppleAuthentication.AppleAuthenticationButton
              onPress={handleAppleSignIn}
              buttonType={AppleAuthentication.AppleAuthenticationButtonType.CONTINUE}
              buttonStyle={AppleAuthentication.AppleAuthenticationButtonStyle.BLACK}
              cornerRadius={5}
              style={{ width: 280, height: 54 }}
            />
          )}
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
    resizeMode: 'contain',
    width: 100,
    height: 100,
  },
});
