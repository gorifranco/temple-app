import { getAlumnes, selectAllAlumnes, selectAlumnesStatus } from '@/store/alumnesSlice';
import { getConfig, selectConfigStatus } from '@/store/configSlice';
import { getExercicis, selectExercicisStatus } from '@/store/exercicisSlice';
import { useAppDispatch, useAppSelector } from '@/store/reduxHooks';
import { getReserves, selectAllReserves, selectReservesStatus } from '@/store/reservesSlice';
import { getRutinesEntrenador, selectAllRutines, selectRutinesStatus } from '@/store/rutinesSlice';
import { useThemeStyles } from '@/themes/theme';
import { status, actions } from '@/types/apiTypes';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { View, Pressable, Text } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAppTheme } from '@/themes/theme';
import { Calendar, DateData } from 'react-native-calendars';
import * as Notifications from 'expo-notifications';


export default function Index() {
    const themeStyles = useThemeStyles();
    const appTheme = useAppTheme();
    const dispatch = useAppDispatch();
    const rutinesStatus = useAppSelector(selectRutinesStatus);
    const exercicisStatus = useAppSelector(selectExercicisStatus);
    const alumnesStatus = useAppSelector(selectAlumnesStatus);
    const reservesStatus = useAppSelector(selectReservesStatus);
    const configStatus = useAppSelector(selectConfigStatus);
    const alumnes = useAppSelector(selectAllAlumnes);
    const rutines = useAppSelector(selectAllRutines);
    const reserves = useAppSelector(selectAllReserves);
    const today = new Date();
    const [selectedDay, setSelectedDay] = useState<DateData>();

    Notifications.scheduleNotificationAsync({
        content: {
          title: "Time's up!",
          body: 'Change sides!',
        },
        trigger: {
          seconds: 60,
          repeats: true,
        },
      });
      

    /*     useEffect(
            () => { dispatch(getConfig())
                dispatch(getRutinesEntrenador())
                dispatch(getExercicis())
                dispatch(getReserves())
                dispatch(getAlumnes())
             }
            , []); */

    useEffect(() => {
        if (rutinesStatus == "idle") dispatch(getRutinesEntrenador())
        if (exercicisStatus == "idle") dispatch(getExercicis())
        if (reservesStatus == "idle") dispatch(getReserves())
        if (configStatus == "idle") dispatch(getConfig())
        if (alumnesStatus[actions.index] == status.idle) dispatch(getAlumnes())
    }, []);

    return (
        <SafeAreaView style={themeStyles.background}>
            <ScrollView>
                <View style={[themeStyles.basicContainer]}>
                    <View style={[themeStyles.box]}>
                        <Text style={[themeStyles.text, { fontSize: 20, textAlign: "center", marginTop: 25 }]}>Calendari</Text>
                        <Calendar
                            firstDay={1}
                            onDayPress={(day: DateData) => { setSelectedDay(day) }}
                            theme={themeStyles.calendarTheme}
                            style={{ margin: 5 }}
                            markedDates={
                                selectedDay && {
                                    [selectedDay.dateString]: { selected: true }
                                }}

                        />
                    </View>
                </View>

                <View style={[themeStyles.basicContainer, { marginBottom: 30 }]}>

                    <View style={[themeStyles.box, { marginBottom: 20 }]}>
                        <Text style={[themeStyles.text, { fontSize: 20, textAlign: "center", marginTop: 20, marginBottom: 20 }]}>
                            Reserves (
                            {selectedDay ? selectedDay.day : today.getDate()}/
                            {selectedDay ? selectedDay.month : today.getMonth() + 1}/
                            {selectedDay ? selectedDay.year : today.getFullYear()}
                            )
                        </Text>
                        {reserves.length == 0 && <Text style={[themeStyles.text, { marginBottom: 20 }]}>No hi ha reserves per aquest dia</Text>}
                    </View>

                    <Pressable style={[themeStyles.box, { marginBottom: 20 }]} onPress={() => { router.push("/(alumnes)/alumnes") }}>
                        <Text style={[themeStyles.text, { fontSize: 20, textAlign: "center", marginTop: 20 }]}>Alumnes ({alumnes.length}/{process.env.EXPO_PUBLIC_MAX_ALUMNES})</Text>
                        <Text style={[themeStyles.text, { fontSize: 15, textAlign: "center", paddingTop: 13, color: appTheme.colors.primary, marginBottom: 20 }]}>Veure tots</Text>
                    </Pressable>
                    <Pressable style={[themeStyles.box]} onPress={() => { router.push("/(rutines)/rutines") }}>
                        <Text style={[themeStyles.text, { fontSize: 20, textAlign: "center", marginTop: 20 }]}>Rutines ({rutines.length}/{process.env.EXPO_PUBLIC_MAX_RUTINES})</Text>
                        <Text style={[themeStyles.text, { fontSize: 15, textAlign: "center", paddingTop: 13, color: appTheme.colors.primary, marginBottom: 20 }]}>Veure totes</Text>
                    </Pressable>
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}