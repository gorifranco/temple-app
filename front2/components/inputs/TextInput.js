import React from 'react'
import { View, StyleSheet, Text } from 'react-native'
import { TextInput as Input } from 'react-native-paper'
import { useAppTheme, useThemeStyles } from '@/themes/theme'

export default function TextInput({ errorText, ...props }) {
  const themeStyles = useThemeStyles();
  const theme = useAppTheme();

  return (
    <View style={styles.container}>
      <Input
        style={styles.input}
        selectionColor={theme.colors.primary}
        underlineColor="transparent"
        mode="outlined"
        {...props}
      />
      {errorText ? <Text style={themeStyles.textInputError}>{errorText}</Text> : null}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginVertical: 12,
  },
})
