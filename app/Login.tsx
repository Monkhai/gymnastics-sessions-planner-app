import { RectButton } from '@/Components/GeneralComponents/Buttons';
import { supabase } from '@/config/initSupabase';
import React from 'react';
import { TextInput, View, useColorScheme } from 'react-native';
import { FasterImageView } from '@candlefinance/faster-image';
import { EmphasizedTitleText } from '@/Components/GeneralComponents/Texts';
import { LOGO_DARK, LOGO, styles } from '.';

export const Login = () => {
  const colorScheme = useColorScheme();

  const [email, setEmail] = React.useState('yohaiwiener@gmail.com');
  const [password, setPassword] = React.useState('12345678');

  const handleSignIn = async () => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      alert(error.message);
    }
  };

  const handleSingUp = async () => {
    const { error } = await supabase.auth.signUp({ email, password });

    if (error) {
      alert(error.message);
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <FasterImageView
        source={{ url: colorScheme === 'dark' ? LOGO_DARK : LOGO, resizeMode: 'contain' }}
        style={{ width: 180, height: 36 }}
      />
      <EmphasizedTitleText>Gymnastics Session Planner</EmphasizedTitleText>

      <TextInput style={[{ color: 'black' }, styles.textInput]} onChangeText={setEmail} value={email} placeholder="Email" />

      <TextInput
        style={[{ color: 'black' }, styles.textInput]}
        onChangeText={setPassword}
        value={password}
        placeholder="Password"
        secureTextEntry
      />

      <RectButton label="Login" wide onPress={handleSignIn} />

      <RectButton secondary label="Create Acount" onPress={handleSingUp} wide />
    </View>
  );
};
