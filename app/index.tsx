import { supabase } from '@/config/initSupabase';
import React from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View, useColorScheme } from 'react-native';

const Login = () => {
  const theme = useColorScheme();

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
    <View style={{ flex: 1, justifyContent: 'flex-start', alignItems: 'center' }}>
      <Text style={{ fontSize: 24 }}>Login</Text>

      <TextInput style={[{ color: 'black' }, styles.textInput]} onChangeText={setEmail} value={email} placeholder="Email" />

      <TextInput
        style={[{ color: 'black' }, styles.textInput]}
        onChangeText={setPassword}
        value={password}
        placeholder="Password"
        secureTextEntry
      />

      <TouchableOpacity onPress={handleSignIn} style={styles.loginButton}>
        <Text style={{ color: 'white', fontSize: 17 }}>Login</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={handleSingUp} style={styles.signUpButton}>
        <Text style={{ color: theme === 'dark' ? 'white' : 'black', fontSize: 17 }}>Create Account</Text>
      </TouchableOpacity>
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
