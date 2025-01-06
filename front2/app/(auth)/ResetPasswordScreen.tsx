import React, { useState } from 'react'
import Background from '@/components/Background'
import BackButton from '@/components/buttons/BackButton'
import Logo from '@/components/Logo'
import Header from '@/components/Header'
import TextInput from '@/components/inputs/TextInput'
import { emailValidator } from '@/helpers/emailValidator'
import { router } from 'expo-router'
import { useText } from '@/hooks/useText'
import { Pressable } from 'react-native'
import { useThemeStyles } from '@/themes/theme'
import { Text } from 'react-native'

export default function ResetPasswordScreen() {
  const themeStyles = useThemeStyles()
  const texts = useText()
  const [email, setEmail] = useState({ value: '', error: '' })



  const sendResetPasswordEmail = () => {
    const emailError = emailValidator(email.value)
    if (emailError) {
      setEmail({ ...email, error: emailError })
      return
    }
    router.navigate('..')
  }

  return (
    <Background>
      <BackButton href={"/"} />
      <Logo />
      <Header>{texts.RestorePassword}</Header>
      <TextInput
        label="Email"
        enterKeyHint="done"
        value={email.value}
        onChangeText={(text: string) => setEmail({ value: text, error: '' })}
        error={!!email.error}
        errorText={email.error}
        autoCapitalize="none"
        autoCompleteType="email"
        textContentType="emailAddress"
        inputMode="email"
        description="You will receive email with password reset link."
      />
      <Pressable
        onPress={sendResetPasswordEmail}
        style={[themeStyles.button1, { marginBottom: 7 }]}
      ><Text style={themeStyles.button1Text}>{texts.SendInstructions}</Text></Pressable>
    </Background>
  )
}
