import { RectButton } from '@/Components/GeneralComponents/Buttons';
import { EmphasizedTitleText } from '@/Components/GeneralComponents/Texts';
import { LabeledTextInput } from '@/Components/Lists/LabeledTextInput';
import Colors from '@/Constants/Colors';
import logo from '@/assets/logo/logo.png';
import logoDark from '@/assets/logo/logo_dark.png';
import { supabase } from '@/config/initSupabase';
import { FasterImageView } from '@candlefinance/faster-image';
import React from 'react';
import { Image, StyleSheet, View, useColorScheme } from 'react-native';
import { GoogleSignin, GoogleSigninButton, statusCodes } from '@react-native-google-signin/google-signin';

const LOGO = Image.resolveAssetSource(logo).uri;
const LOGO_DARK = Image.resolveAssetSource(logoDark).uri;

const Login = () => {
  GoogleSignin.configure({
    scopes: ['https://www.googleapis.com/auth/drive.readonly'], // what API you want to access on behalf of the user, default is email and profile
    //  webClientId: '<FROM DEVELOPER CONSOLE>',
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
    <View
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
    </View>
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
