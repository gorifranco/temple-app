import React, { useState } from 'react'
import { View, StyleSheet } from 'react-native'
import { Text } from 'react-native-paper'
import Background from '@/components/Background'
import Logo from '@/components/Logo'
import Header from '@/components/Header'
import Button from '@/components/Button'
import TextInput from '@/components/inputs/TextInput'
import BackButton from '@/components/buttons/BackButton'
import { emailValidator } from '@/helpers/emailValidator' 
import { passwordValidator } from '@/helpers/passwordValidator'
import { nameValidator } from '@/helpers/nameValidator'
import { Link, router } from 'expo-router';
import { useAxios } from '@/app/api'
import { useThemeStyles } from '@/themes/theme'

export default function RegisterScreen() {
  const themeStyles = useThemeStyles()
  const api = useAxios();
  const [nom, setNom] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errors, setErrors] = useState({
    nom: '',
    email: '',
    password: '',
  });

  const onSignUpPressed = async () => {
    const nameError = nameValidator(nom)
    const emailError = emailValidator(email)
    const passwordError = passwordValidator(password)
    if (emailError || passwordError || nameError) {
      setErrors({
        nom: nameError,
        email: emailError,
        password: passwordError
      })
      return
    }

    try {
      const response = await api.post('/register', { nom, email, password });
      const token = response.data.token;

      router.replace('/');
    } catch (error) {
      console.error('Error logging in', error);
    }
    
  }

  return (
    <Background>
      <BackButton href={"/"} />
      <Logo />
      <Header>Create Account</Header>
      <TextInput
        label="Name"
        returnKeyType="next"
        value={nom}
        onChangeText={(text:string) => setNom(text)}
        error={!!errors.nom}
        errorText={errors.nom}
      />
      <TextInput
        label="Email"
        returnKeyType="next"
        value={email}
        onChangeText={(text:string) => setEmail(text)}
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
        onChangeText={(text:string) => setPassword(text)}
        error={!!errors.password}
        errorText={errors.password} 
        secureTextEntry
      />
      <Button
        mode="contained"
        onPress={onSignUpPressed}
        style={{ marginTop: 24 }}
      >
        Sign Up
      </Button>
      <View style={themeStyles.row}>
        <Text>Already have an account? </Text>
        <Link href={'/'} style={themeStyles.link}>Sign in</Link>
      </View>
    </Background>
  )
}