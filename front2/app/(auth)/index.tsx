import React, { useState, useContext } from 'react'
import { StyleSheet, View } from 'react-native'
import { Text } from 'react-native-paper'
import { Link, router } from 'expo-router';
import { Button } from 'react-native-paper';
import { emailValidator } from '@/helpers/emailValidator';
import { passwordValidator } from '@/helpers/passwordValidator';
import Background from '@/components/Background';
import Logo from '@/components/Logo';
import Header from '@/components/Header';
import TextInput from '@/components/inputs/TextInput';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { useAxios } from '@/app/api';
import { useThemeStyles } from '@/themes/theme';
import { login, logout } from '@/services/authService';

export default function Index() {
  const themeStyles = useThemeStyles();
  const api = useAxios();
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errors, setErrors] = useState({
    email: '',
    password: '',
  });

  const onLoginPressed = async () => {
    const emailError = emailValidator(email)
    const passwordError = passwordValidator(password)

    if (emailError || passwordError) {
      setErrors({ ...errors, email: emailError })
      setErrors({ ...errors, password: passwordError })
      return
    }
    //login
      const result:boolean = login(email, password);
      result ? router.replace('/') : router.replace('/(auth)');
      router.replace('/');
  };

  return (
    <Background>
      <Logo />
      <Header>Welcome back.</Header>
      <TextInput
        label="Email"
        returnKeyType="next"
        value={email}
        onChangeText={(text: string) => setEmail(text)}
        error={!!errors.email}
        errorText={errors.email}
        autoCapitalize="none"
        autoCompleteType="email"
        textContentType="emailAddress"
        keyboardType="email-address"
        containerStyle={{ width: "80%", marginBottom: 10 }}
      />
      <TextInput
        label="Password"
        returnKeyType="done"
        value={password}
        onChangeText={(text: string) => setPassword(text)}
        error={!!errors.password}
        errorText={errors.password}
        secureTextEntry
        containerStyle={{ width: "80%", marginBottom: 7 }}
      />
      <View>
        <TouchableOpacity
          onPress={() => router.replace('/ResetPasswordScreen')}
        >
          <Text style={{ width: "100%", marginBottom: 24, alignItems: "flex-end" }}>Forgot your password?</Text>
        </TouchableOpacity>
      </View>
      <Button mode="contained" onPress={onLoginPressed}>
        Login
      </Button>
      <View style={themeStyles.row}>
        <Text>Don’t have an account? </Text>
        <Link href={{ pathname: '/RegisterScreen' }} style={themeStyles.link}>Sign up</Link>
      </View>
    </Background>
  )
}