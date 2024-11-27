import { getAlumnes, selectAllAlumnes, selectAlumnesStatus } from '@/store/alumnesSlice';
import { getConfig, selectConfigStatus } from '@/store/configSlice';
import { getExercicis, selectExercicisStatus } from '@/store/exercicisSlice';
import { useAppDispatch, useAppSelector } from '@/store/reduxHooks';
import { selectReservesStatus, deleteReservesSlice, selectUpcomingReserves, selectReservesByDay, selectReservesByMes, getReservesPerMes, getReserves } from '@/store/reservesSlice';
import { deleteRutinesSlice, getRutinesEntrenador, selectAllRutines, selectRutinesStatus } from '@/store/rutinesSlice';
import { calendarTheme, useThemeStyles } from '@/themes/theme';
import { status, actions } from '@/types/apiTypes';
import { router } from 'expo-router';
import React, { memo, useEffect, useMemo, useState } from 'react';
import { View, Pressable, Text, ViewStyle } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAppTheme } from '@/themes/theme';
import { Calendar, DateData } from 'react-native-calendars';
import Entreno from '@/components/viewers/Entreno';
import { MarkedDates } from 'react-native-calendars/src/types';
import { useText } from '@/hooks/useText';
import Toast from 'react-native-toast-message';


export default function Index() {
    const texts = useText();
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
    const today = new Date()
    const [selectedDay, setSelectedDay] = useState<DateData>({
        year: today.getFullYear(), month: today.getMonth() + 1, day: today.getDate(),
        timestamp: today.getTime(), dateString: `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`
    });
    const [selectedMonth, setSelectedMonth] = useState<DateData>({
        year: today.getFullYear(), month: today.getMonth() + 1, day: today.getDate(),
        timestamp: today.getTime(), dateString: `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`
    })
    const reservesMes = useAppSelector(state => selectReservesByMes(state, selectedMonth));
    const reservesAvui = useAppSelector(state => selectReservesByDay(state, selectedDay));
    
    const monthMarks = useMemo(() => {
        return reservesMes.reduce((acc, reserva) => {
            const dateString = reserva.hora.split("T")[0];
            acc[dateString] = {
                marked: true,
                dotColor: 'green',
            };
            return acc;
        }, {} as MarkedDates);
    }, [selectedMonth]);

    const markedDates = useMemo(() => {
        return {
            ...monthMarks,
            [selectedDay.dateString]: {
                selected: true,
                selectedColor: appTheme.colors.primary,
            },
        };
    }, [monthMarks, selectedDay]);

    // useEffect(
    //     () => {
    //         dispatch(getConfig())
    //         dispatch(getRutinesEntrenador())
    //         dispatch(getExercicis())
    //         dispatch(getReserves())
    //         dispatch(getAlumnes())
    //     }
    //     , []);

    useEffect(() => { dispatch(getReservesPerMes({ mes: selectedMonth.month, year: selectedMonth.year })) }, [selectedMonth]);

    useEffect(() => {
        if (rutinesStatus == "idle") dispatch(getRutinesEntrenador())
        if (exercicisStatus == "idle") dispatch(getExercicis())
        if (configStatus == "idle") dispatch(getConfig())
        if (alumnesStatus[actions.index] == status.idle) dispatch(getAlumnes())
        if(reservesStatus == "idle") dispatch(getReserves())
            reservesStatus == "failed" && Toast.show({
                type: 'error',
                text1: texts.ErrorFetchingReserves,
                position: 'top',
            });
    }, []);

    return (
        <SafeAreaView style={themeStyles.background}>
            <ScrollView>
                <View style={themeStyles.basicContainer}>
                    <View style={themeStyles.box}>
                        <Text style={themeStyles.titol1}>{texts.Calendar}</Text>
                        <Calendar
                            firstDay={1}
                            onDayPress={(day: DateData) => {
                                setSelectedDay(day)
                            }}
                            onMonthChange={(mes: DateData) => {
                                setSelectedMonth(mes);
                            }}
                            theme={calendarTheme}
                            style={{ marginHorizontal: 5, marginBottom: 10 }}
                            markedDates={markedDates}
                        />
                    </View>
                </View>

                <View style={[themeStyles.basicContainer, { marginBottom: 30 }]}>

                    <View style={[themeStyles.box, { marginBottom: 20 }]}>
                        <Text style={[themeStyles.text, { fontSize: 20, textAlign: "center", marginTop: 20, marginBottom: 20 }]}>
                            {texts.Reservations} (
                            {selectedDay ? selectedDay.day : today.getDate()}/
                            {selectedDay ? selectedDay.month : today.getMonth() + 1}/
                            {selectedDay ? selectedDay.year : today.getFullYear()}
                            )
                        </Text>
                        {reservesAvui && reservesAvui.length == 0 && (<Text style={[themeStyles.text, { marginBottom: 20 }]}>{texts.NotReservationsForThisDay}</Text>)}
                        {reservesAvui && reservesAvui.length > 0 && (
                            reservesAvui.map((r, i) => {
                                return (
                                    <Entreno alumneID={r.usuariID} hora={r.hora.split("T")[1].split("+")[0]} key={i} />
                                )
                            })
                        )}
                    </View>

                    <Pressable style={[themeStyles.box, { marginBottom: 20 }]} onPress={() => { router.push("/(alumnes)/alumnes") }}>
                        <Text style={[themeStyles.text, { fontSize: 20, textAlign: "center", marginTop: 20 }]}>{texts.Students} ({alumnes.length}/{process.env.EXPO_PUBLIC_MAX_ALUMNES})</Text>
                        <Text style={[themeStyles.text, { fontSize: 15, textAlign: "center", paddingTop: 13, color: appTheme.colors.primary, marginBottom: 20 }]}>{texts.SeeEvery}</Text>
                    </Pressable>
                    <Pressable style={[themeStyles.box]} onPress={() => { router.push("/(rutines)/rutines") }}>
                        <Text style={[themeStyles.text, { fontSize: 20, textAlign: "center", marginTop: 20 }]}>{texts.Rutines} ({rutines.length}/{process.env.EXPO_PUBLIC_MAX_RUTINES})</Text>
                        <Text style={[themeStyles.text, { fontSize: 15, textAlign: "center", paddingTop: 13, color: appTheme.colors.primary, marginBottom: 20 }]}>{texts.SeeEveryFem}</Text>
                    </Pressable>
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}