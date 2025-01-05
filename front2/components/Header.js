import React from 'react'
import { Text } from 'react-native-paper'
import { useThemeStyles } from '@/themes/theme'

export default function Header(props) {
  const themeStyles = useThemeStyles();

  return <Text style={[themeStyles.header, {fontSize: 25}]} {...props} />
}