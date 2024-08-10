import { DefaultTheme } from 'react-native-paper'
import { StyleSheet } from 'react-native'

export const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    text: '#000000',
    primary: '#560CCE',
    secondary: '#414757',
    error: '#f13a59',
  }
}

export const themeStyles = StyleSheet.create({
  titol1: {
    fontSize: 25,
    marginTop: 20,
    color: 'black',
    textAlign: 'center',
  },
  text: {
    fontSize: 15,
    color: "black",
  },
})
