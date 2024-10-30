import React, { useState } from 'react'
import { View } from 'react-native'
import { Text } from 'react-native-paper'
import { Link, router } from 'expo-router';
import { Button } from 'react-native-paper';
import { emailValidator } from '@/helpers/emailValidator';
import { passwordValidator } from '@/helpers/passwordValidator';
import Background from '@/components/Background';
import Logo from '@/components/Logo';
import Header from '@/components/Header';
import TextInput from '@/components/inputs/TextInput';
import { useThemeStyles } from '@/themes/theme';
import Toast from 'react-native-toast-message';
import { Pressable } from 'react-native';
import { useAppDispatch, useAppSelector } from '@/store/reduxHooks';
import { loginRedux, selectUser, selectUserError, selectUserStatus } from '@/store/authSlice';


export default function Index() {
  const themeStyles = useThemeStyles();
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectUser);
  const userStatus = useAppSelector(selectUserStatus);
  const userError = useAppSelector(selectUserError);
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errors, setErrors] = useState({
    email: '',
    password: '',
  });

  if (user != null) {
    router.replace('/');
  }

  const onLoginPressed = async () => {
    const emailError = emailValidator(email)
    const passwordError = passwordValidator(password)

    if (emailError || passwordError) {
      setErrors({ ...errors, email: emailError })
      setErrors({ ...errors, password: passwordError })
      return
    }
    dispatch(loginRedux({ email, password }));
  };

  if (userStatus == 'failed'){
    Toast.show({
      type: 'error',
      text1: userError as string,
      position: 'top',
    });
  }
  if (userStatus == 'succeeded'){
    router.replace('/');
  }

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