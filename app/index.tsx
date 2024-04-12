import { jwtDecode } from 'jwt-decode';
import { AnimatedPressable, RectButton } from '@/Components/GeneralComponents/Buttons';
import { EmphasizedTitleText } from '@/Components/GeneralComponents/Texts';
import { LabeledTextInput } from '@/Components/Lists/LabeledTextInput';
import Colors from '@/Constants/Colors';
import logo from '@/assets/logo/logo.png';
import logoDark from '@/assets/logo/logo_dark.png';
import { supabase } from '@/config/initSupabase';
import { FasterImageView } from '@candlefinance/faster-image';
import React from 'react';
import { Image, Keyboard, StyleSheet, View, useColorScheme } from 'react-native';
import { GoogleSignin, GoogleSigninButton, statusCodes } from '@react-native-google-signin/google-signin';
import Animated, { FadeIn } from 'react-native-reanimated';

const LOGO = Image.resolveAssetSource(logo).uri;
const LOGO_DARK = Image.resolveAssetSource(logoDark).uri;

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

  return (
    <AnimatedPressable
      onPress={() => Keyboard.dismiss()}
      entering={FadeIn.duration(500)}
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        gap: 32,
        backgroundColor: Colors[colorScheme ?? 'light'].bg.elevated,
      }}
    >
      <View style={{ gap: 8, justifyContent: 'center', alignItems: 'center' }}>
        <FasterImageView
          source={{ url: colorScheme === 'dark' ? LOGO_DARK : LOGO, resizeMode: 'contain' }}
          style={{ width: 180, height: 36 }}
        />
        <EmphasizedTitleText>Gymnastics Session Planner</EmphasizedTitleText>
      </View>

      <View style={{ gap: 16, width: '100%', justifyContent: 'center', alignItems: 'center' }}>
        <GoogleSigninButton
          size={GoogleSigninButton.Size.Wide}
          color={colorScheme === 'dark' ? GoogleSigninButton.Color.Dark : GoogleSigninButton.Color.Light}
          onPress={async () => {
            try {
              await GoogleSignin.hasPlayServices();
              const userInfo = await GoogleSignin.signIn();

              if (userInfo.idToken) {
                const { data, error } = await supabase.auth.signInWithIdToken({
                  provider: 'google',
                  token: userInfo.idToken,
                });
                console.log('data: ', data);
                console.log('error: ', error);
              } else {
                console.log('no id token');
              }
            } catch (error: any) {
              if (error.cod === statusCodes.SIGN_IN_CANCELLED) {
                // user cancelled the login flow
                console.log('cancelled');
              } else if (error.code === statusCodes.IN_PROGRESS) {
                console.log('in progress');
              } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
                console.log('play services not available or outdated');
              } else {
                console.log('error', error);
              }
            }
          }}
        />
      </View>

      <View style={{ gap: 16, width: '100%', justifyContent: 'center', alignItems: 'center' }}>
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

      <View style={{ gap: 16, width: '100%', justifyContent: 'center', alignItems: 'center' }}>
        <RectButton label="Login" wide onPress={handleSignIn} />
        <RectButton secondary label="Create Acount" onPress={handleSingUp} wide />
      </View>
    </AnimatedPressable>
  );
};

export default Login;

const styles = StyleSheet.create({
  textInput: {
    borderColor: 'gray',
    borderWidth: 1,
    width: '70%',
    margin: 10,
    padding: 10,
  },
  loginButton: {
    backgroundColor: 'blue',
    width: '70%',
    padding: 10,
    margin: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },

  signUpButton: {
    backgroundColor: 'transparent',
    width: '70%',
    padding: 10,
    margin: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
