import { DefaultTheme, MD2DarkTheme } from 'react-native-paper';
import { StyleSheet, useColorScheme } from 'react-native'
import { Platform, StatusBar } from 'react-native';
import { useEffect, useState } from 'react';


export const useAppTheme = () => {
  const colorScheme = useColorScheme(); // 'light' o 'dark'
  return colorScheme === 'dark' ? darkTheme : lightTheme;
};


const lightTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    text: '#000000',
    primary: '#560CCE',
    secondary: '#414757',
    error: '#f13a59',
    background: '#ffffff',
    surface: '#f5f5f5',
  },
};

const darkTheme = {
  ...MD2DarkTheme,
  colors: {
    ...MD2DarkTheme.colors,
    text: '#ffffff',
    primary: '#bb86fc',
    secondary: '#414757',
    error: '#cf6679',
    background: '#121212',
    surface: '#f5f5f5',
  },
};


export function useThemeStyles() {
  const theme = useAppTheme();
  const [statusBarHeight, setStatusBarHeight] = useState(0);

  useEffect(() => {
    if (Platform.OS === 'android') {
      setStatusBarHeight(StatusBar.currentHeight || 0);
    }
  }, []);

  return StyleSheet.create({
    background: {
      backgroundColor: theme.colors.background,
      paddingTop: statusBarHeight,
    },
    authBackground: {
      flex: 1,
      width: '100%',
      backgroundColor: theme.colors.background,
    },
    authContainer: {
      flex: 1,
      padding: 20,
      width: '100%',
      maxWidth: 340,
      alignSelf: 'center',
      alignItems: 'center',
      justifyContent: 'center',
    },
    header: {
      fontSize: 21,
      color: theme.colors.primary,
      fontWeight: 'bold',
      paddingVertical: 12,
    },
    titol1: {
      fontSize: 25,
      marginTop: 20,
      marginBottom: 20,
      color: theme.colors.text,
      textAlign: 'center',
    },
    text: {
      fontSize: 15,
      color: theme.colors.text,
      alignSelf: 'center',
    },
    button1: {
      backgroundColor: theme.colors.primary,
      paddingVertical: 10,
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
      backgroundColor: '#F5A623',
      padding: 10,
      paddingHorizontal: 20,
      borderRadius: 10,
      marginTop: 20,
      alignSelf: 'center',
    },
    buttonSuccess: {
      backgroundColor: '#0a822a',
      padding: 10,
      paddingHorizontal: 20,
      borderRadius: 10,
      marginTop: 20,
      alignSelf: 'center',
    },

    button1Text: {
      textAlign: "center",
      color: 'white',
      fontSize: 15,
    },
    inputContainer: {
      width: '80%',
      marginTop: 12,
      marginBottom: 4,
      marginHorizontal: "auto",
      backgroundColor: theme.colors.background,
      padding: 15,
      borderRadius: 10,
      borderWidth: 1,
      borderColor: "lightgray"
    },
    crearRutinaContainer: {
      display: "flex",
      flexDirection: "row",
      alignItems: "center",
      margin: "auto",
      width: '90%',
      borderWidth: 1,
      borderColor: theme.colors.primary,
      padding: 10,
      borderRadius: 10,
      marginBottom: 10,
    },
    mainContainer1: {
        marginVertical: 10,
        marginHorizontal: "auto",
        borderWidth: 1,
        borderColor: theme.colors.primary,
        padding: 10,
        borderRadius: 10,
        width: '80%',
    },
    textInputError: {
      fontSize: 13,
      color: theme.colors.error,
      paddingTop: 0,
      width: "80%",
      margin: "auto",
    },
    row: {
      flexDirection: 'row',
      marginTop: 4,
    },
    link: {
      fontWeight: 'bold',
      color: theme.colors.primary,
    },
    hr: {
      borderBottomColor: theme.colors.primary,
      borderBottomWidth: StyleSheet.hairlineWidth,
      width: '80%',
      marginTop: 20,
      alignSelf: 'center',
    },
    diaHorariContainer: {
      marginVertical: 10,
      width: "100%",
      margin: "auto",
      borderColor: "lightgray",
      borderWidth: 1,
      padding: 10,
      borderRadius: 10,
      backgroundColor: theme.colors.background,
      shadowColor: theme.colors.text,
      shadowOffset: {
          width: 0,
          height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 6,
      elevation: 5,
    }
  })
}
