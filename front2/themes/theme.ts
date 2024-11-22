import { DefaultTheme, MD2DarkTheme } from 'react-native-paper';
import { StyleSheet, TextStyle, useColorScheme, ViewStyle } from 'react-native'
import { Platform, StatusBar } from 'react-native';
import { useEffect, useState } from 'react';
import { Theme } from 'react-native-calendars/src/types';


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
    error: '#cf0216',
    background: '#ffffff',
    background2: '#f9f9f9',
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
    error: '#b00011',
    background: '#121212',
    background2: '#383838',
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

  type Styles = {
    authBackground: ViewStyle;
    box: ViewStyle;
    basicContainer: ViewStyle;
    background: ViewStyle;
    authContainer: ViewStyle;
    header: TextStyle;
    titol1: TextStyle;
    text: TextStyle;
    button1: ViewStyle;
    buttonDanger: ViewStyle;
    buttonWarning: ViewStyle;
    buttonSuccess: ViewStyle;
    button1Text: TextStyle;
    inputContainer: ViewStyle;
    crearRutinaContainer: ViewStyle;
    mainContainer1: ViewStyle;
    textInputError: TextStyle;
    row: ViewStyle;
    link: TextStyle;
    hr: TextStyle;
    diaHorariContainer: ViewStyle;
    alumneContainer: ViewStyle;
    //calendarTheme: ViewStyle;
    modalConfirmContent: ViewStyle;
  };
  

  return StyleSheet.create<Styles>({
    background: {
      backgroundColor: theme.colors.background,
      height: "100%",
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
      backgroundColor: theme.colors.error,
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
      flexDirection: "column",
      alignItems: "center",
      marginHorizontal: "auto",
      marginVertical: 5,
      width: '80%',
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
      width: '90%',
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
      width: '90%',
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
    },
    box: {
      width: "90%",
      borderRadius: 20,
      backgroundColor: theme.colors.background2,
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.23,
      shadowRadius: 2.62,

      elevation: 4,
    },
    alumneContainer: {
      marginHorizontal: "auto",
      width: "80%", 
      marginVertical: 10,
      padding: 10,
      borderRadius: 20,
      paddingLeft: 10,
      display: "flex",
      flexDirection: "row",
      backgroundColor: theme.colors.background2,
      shadowOffset: {
        width: 0,
        height: 1,
      },
      shadowOpacity: 0.23,
      shadowRadius: 1.3,

      elevation: 3,
    },
    basicContainer: {
      marginTop: 20,
      flexDirection: "row",
      flexWrap: "wrap",
      justifyContent: "space-around",
      margin: "auto",
    },
    modalConfirmContent: {
      width: '80%',
      height: 190,
      backgroundColor: theme.colors.background2,
      margin: "auto"
    }
  })
}


const theme = useAppTheme();
export const calendarTheme:Theme = {
  calendarBackground: theme.colors.background2,
  dayTextColor: theme.colors.text,
  textDisabledColor: "gray",
  monthTextColor: theme.colors.text,
  todayTextColor: theme.colors.primary,
  textSectionTitleColor: theme.colors.primary,
  arrowColor: theme.colors.primary,
  selectedDayBackgroundColor: theme.colors.primary,
  selectedDayTextColor: "white",
}
