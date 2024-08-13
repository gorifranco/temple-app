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
    marginBottom: 20,
    color: 'black',
    textAlign: 'center',
  },
  text: {
    fontSize: 15,
    color: "black",
    alignSelf: 'center',
  },
  button1: {
    backgroundColor: theme.colors.primary,
    padding: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginTop: 20,
    alignSelf: 'center',
  },
  button1Text: {
  color: 'white',
  fontSize: 15,
},
inputContainer: {
  width: '80%',
  marginVertical: 12,
  alignItems: 'center',
  alignSelf: 'center',
  marginHorizontal: "auto",
},
})
