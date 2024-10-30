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
import { useAxios } from '@/app/api';
import { useThemeStyles } from '@/themes/theme';
import { useDispatch } from 'react-redux';
import { login } from '@/services/authService';
import { AppDispatch } from '@/store';
import Toast from 'react-native-toast-message';
import { Pressable } from 'react-native';


export default function Index() {
  const themeStyles = useThemeStyles();
  const api = useAxios();
  const dispatch = useDispatch<AppDispatch>();
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
    const result: boolean = await dispatch(login({ email, password })).unwrap();
    result ? router.replace('/') : Toast.show({
      type: 'error',
      text1: 'Error login',
      position: 'top',
    });

  };

  return (
    <Background>
      <Logo />
      <Header>Welcome back.</Header>
      <TextInput
        label="Email"
        enterKeyHint="next"
        value={email}
        onChangeText={(text: string) => setEmail(text)}
        error={!!errors.email}
        errorText={errors.email}
        autoCapitalize="none"
        autoCompleteType="email"
        textContentType="emailAddress"
        inputMode="email"
        containerStyle={{ width: "80%", marginBottom: 10 }}
      />
      <TextInput
        label="Password"
        enterKeyHint="done"
        value={password}
        onChangeText={(text: string) => setPassword(text)}
        error={!!errors.password}
        errorText={errors.password}
        secureTextEntry
        containerStyle={{ width: "80%", marginBottom: 7 }}
      />
      <View>
        <Pressable
          style={({ pressed }) => [
            {
              opacity: pressed ? 0.2 : 1,
            },]}
          onPress={() => router.replace('/ResetPasswordScreen')}
        >
          <Text style={{ width: "100%", marginBottom: 24, alignItems: "flex-end" }}>Forgot your password?</Text>
        </Pressable>
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