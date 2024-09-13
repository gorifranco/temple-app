import React, { useState, useContext } from 'react'
import { StyleSheet, View } from 'react-native'
import { Text } from 'react-native-paper'
import { Link, router } from 'expo-router';
import AuthContext from '../AuthContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Button } from 'react-native-paper';
import { emailValidator } from '@/helpers/emailValidator';
import { passwordValidator } from '@/helpers/passwordValidator';
import Background from '@/components/Background';
import Logo from '@/components/Logo';
import Header from '@/components/Header';
import TextInput from '@/components/inputs/TextInput';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { AuthContextType } from '../AuthContext';
import { useAxios } from '@/app/api';
import { useThemeStyles } from '@/themes/theme';

export default function Index() {
  const themeStyles = useThemeStyles();
  const api = useAxios();
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errors, setErrors] = useState({
    email: '',
    password: '',
  });

  const authContext = useContext<AuthContextType | undefined>(AuthContext);

  if (!authContext) {
    throw new Error("AuthProvider is missing. Please wrap your component tree with AuthProvider.");
  }

  const { login } = authContext;

  const onLoginPressed = async () => {
    const emailError = emailValidator(email)
    const passwordError = passwordValidator(password)
  
    if (emailError || passwordError) {
      setErrors({ ...errors, email: emailError })
      setErrors({ ...errors, password: passwordError })
      return
    }
    //login
    try {
      // Lógica de autenticación aquí
      const response = await api.post('/login', { email, password });

      login(response.data.user);
      router.replace('/');
      
    } catch (error) {
      console.error('Error logging in', error);
    }
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
      />
      <TextInput
        label="Password"
        returnKeyType="done"
        value={password}
        onChangeText={(text: string) => setPassword(text)} 
        error={!!errors.password}
        errorText={errors.password}
        secureTextEntry
      />
      <View>
        <TouchableOpacity
          onPress={() => router.replace('/ResetPasswordScreen')}
        >
          <Text style={{width: "100%", marginBottom: 24, alignItems: "flex-end"}}>Forgot your password?</Text>
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