import { DefaultTheme } from 'react-native-paper'
import { StyleSheet } from 'react-native'
import AutocompleteInput from 'react-native-autocomplete-input'

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
  buttonDanger: {
    backgroundColor: '#bf1b1b',
    padding: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginTop: 20,
    alignSelf: 'center',
  },
  buttonWarning: {
    backgroundColor: '#f5a623',
    padding: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginTop: 20,
    alignSelf: 'center',
  },
  buttonSuccess: {
    backgroundColor: '#00b894',
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
  crearRutinaContainer: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    margin: "auto",
    width: '90%',
    borderWidth: 1,
    borderColor: "black",
    padding: 10,
    borderRadius: 10,
    marginBottom: 10,
  }
})
