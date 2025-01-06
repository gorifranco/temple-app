import React, { useState } from 'react'
import { View, Switch } from 'react-native'
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
import { useAppTheme, useThemeStyles } from '@/themes/theme'
import { useText } from '@/hooks/useText'
import { useAppDispatch } from '@/store/reduxHooks'
import { register } from '@/store/authSlice'
import { RegisterCredentials } from '@/types/apiTypes'
import { SafeAreaView } from 'react-native-safe-area-context'
import { StyleSheet } from 'react-native'

export default function RegisterScreen() {
  router.replace("/(auth)/verifyEmail")
  
  const dispatch = useAppDispatch();
  const texts = useText()
  const themeStyles = useThemeStyles()
  const theme = useAppTheme()
  const [credentials, setCredentials] = useState<RegisterCredentials>({
    nom: "",
    email: "",
    password: "",
    tipusUsuariID: 2,
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
        password: passwordError,
      })
      return
    }
    dispatch(register({ data: credentials }));
  }

  return (
    <SafeAreaView style={themeStyles.background}>
      <Background>
        <BackButton href={"/"} />
        <Logo />
        <Header>{texts.CreateAccount}</Header>
        <Switch
          trackColor={{ false: theme.colors.secondary, true: theme.colors.primary }}
          thumbColor={"white"}
          onValueChange={(value) => setCredentials({ ...credentials, tipusUsuariID: value ? 2 : 3 })}
          value={credentials.tipusUsuariID == 2}
          style={styles.switch}
        />
        <Text style={[themeStyles.text, {fontSize: 20, marginBottom: 15}]}>{credentials.tipusUsuariID == 3 ? "Entrenador" : "Alumne"}</Text>
        <TextInput
          label={texts.Name}
          enterKeyHint="next"
          value={credentials.nom}
          onChangeText={(text: string) => setCredentials({ ...credentials, nom: text })}
          error={!!errors.nom}
          errorText={errors.nom}
          containerStyle={{ width: "80%", marginBottom: 10 }}
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
          containerStyle={{ width: "80%", marginBottom: 10 }}
        />
        <TextInput
          label={texts.Password}
          enterKeyHint="done"
          value={credentials.password}
          onChangeText={(text: string) => setCredentials({ ...credentials, password: text })}
          error={!!errors.password}
          errorText={errors.password}
          secureTextEntry
          containerStyle={{ width: "80%", marginBottom: 10 }}
        />
        <Button
          mode="contained"
          onPress={onSignUpPressed}
          style={{ marginTop: 24 }}
        >
          {texts.SignUp}
        </Button>
        <View style={themeStyles.row}>
          <Text style={{marginRight: 5}}>{texts.AlreadyHaveAccount}</Text>
          <Link href={'/'} style={themeStyles.link}>{texts.SignIn}</Link>
        </View>
      </Background>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  switch: {

    transform: [{ scale: 1.3 }],
  },
});
