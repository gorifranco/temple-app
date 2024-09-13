import React from 'react'
import { ImageBackground, KeyboardAvoidingView } from 'react-native'
import { useThemeStyles } from '@/themes/theme';

export default function Background({ children }) {
  const theme = useThemeStyles();

  return (
    <ImageBackground
      source={require('../assets/images/background_dot.png')}
      //D:\gori\java\temple-app\front2\assets
      resizeMode="repeat"
      style={theme.authBackground}
    >
      <KeyboardAvoidingView style={theme.authContainer} behavior="padding">
        {children}
      </KeyboardAvoidingView>
    </ImageBackground>
  )
}
