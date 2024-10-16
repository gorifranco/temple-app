import React from 'react'
import { View, Text } from 'react-native'
import { TextInput as Input } from 'react-native-paper'
import { useAppTheme, useThemeStyles } from '@/themes/theme'

export default function TextInput({ ...props }) {
  const themeStyles = useThemeStyles();
  const theme = useAppTheme();

  return (
    <View style={props.containerStyle}>
      <Input
        maxLength={props.maxLength}
        style={props.inputStyle}
        selectionColor={theme.colors.primary}
        underlineColor="transparent"
        mode="outlined"
        {...props}
        multiline={props.multiline}
        numberOfLines={props.numberOfLines}
        editable={props.editable}
      />
      {props.errorText ? <Text style={themeStyles.textInputError}>{props.errorText}</Text> : null}
    </View>
  )
}