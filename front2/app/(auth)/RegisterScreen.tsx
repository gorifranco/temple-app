import React, { useState } from 'react'
import { View } from 'react-native'
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
import { Link } from 'expo-router';
import { useThemeStyles } from '@/themes/theme'
import { useText } from '@/hooks/useText'
import { useAppDispatch } from '@/store/reduxHooks'
import { register } from '@/store/authSlice'
import { RegisterCredentials } from '@/types/apiTypes'

export default function RegisterScreen() {
  const dispatch = useAppDispatch();
  const texts = useText()
  const themeStyles = useThemeStyles()
  const [credentials, setCredentials] = useState<RegisterCredentials>({
    nom: "",
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({
    nom: '',
    email: '',
    password: '',
  });

  const onSignUpPressed = async () => {
    const nameError = nameValidator(credentials.nom)
    const emailError = emailValidator(credentials.email)
    const passwordError = passwordValidator(credentials.password)
    if (emailError || passwordError || nameError) {
      setErrors({
        nom: nameError,
        email: emailError,
        password: passwordError
      })
      return
    }
    dispatch(register({ data: credentials }));
  }

  return (
    <Background>
      <BackButton href={"/"} />
      <Logo />
      <Header>{texts.CreateAccount}</Header>
      <TextInput
        label={texts.Name}
        enterKeyHint="next"
        value={credentials.nom}
        onChangeText={(text: string) => setCredentials({ ...credentials, nom: text })}
        error={!!errors.nom}
        errorText={errors.nom}
      />
      <TextInput
        label="Email"
        enterKeyHint="next"
        value={credentials.email}
        onChangeText={(text: string) => setCredentials({ ...credentials, email: text })}
        error={!!errors.email}
        errorText={errors.email}
        autoCapitalize="none"
        autoCompleteType="email"
        textContentType="emailAddress"
        inputMode="email"
      />
      <TextInput
        label={texts.Password}
        enterKeyHint="done"
        value={credentials.password}
        onChangeText={(text: string) => setCredentials({ ...credentials, password: text })}
        error={!!errors.password}
        errorText={errors.password}
        secureTextEntry
      />
      <Button
        mode="contained"
        onPress={onSignUpPressed}
        style={{ marginTop: 24 }}
      >
        {texts.SignUp}
      </Button>
      <View style={themeStyles.row}>
        <Text>{texts.AlreadyHaveAccount}</Text>
        <Link href={'/'} style={themeStyles.link}>{texts.SignIn}</Link>
      </View>
    </Background>
  )
}
