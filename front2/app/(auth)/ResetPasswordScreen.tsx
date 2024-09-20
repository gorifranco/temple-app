import React, { useState } from 'react'
import Background from '@/components/Background'
import BackButton from '@/components/buttons/BackButton'
import Logo from '@/components/Logo'
import Header from '@/components/Header'
import TextInput from '@/components/inputs/TextInput'
import Button from '@/components/Button'
import { emailValidator } from '@/helpers/emailValidator'
import { router } from 'expo-router'

export default function ResetPasswordScreen() {
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
      <BackButton href={"/LoginScreen"}/>
      <Logo />
      <Header>Restore Password</Header>
      <TextInput
        label="E-mail address"
        returnKeyType="done"
        value={email.value}
        onChangeText={(text:string) => setEmail({ value: text, error: '' })}
        error={!!email.error}
        errorText={email.error}
        autoCapitalize="none"
        autoCompleteType="email"
        textContentType="emailAddress"
        keyboardType="email-address"
        description="You will receive email with password reset link."
      />
      <Button
        mode="contained"
        onPress={sendResetPasswordEmail}
        style={{ marginTop: 16 }}
      >
        Send Instructions
      </Button>
    </Background>
  )
}
