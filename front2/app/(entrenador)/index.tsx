import { getAlumnes, selectAlumnesStatus } from '@/store/alumnesSlice';
import { getConfig, selectConfigStatus } from '@/store/configSlice';
import { getExercicis, selectExercicisStatus } from '@/store/exercicisSlice';
import { useAppDispatch, useAppSelector } from '@/store/reduxHooks';
import { getReserves, selectReservesStatus } from '@/store/reservesSlice';
import { getRutinesEntrenador, selectRutinesStatus } from '@/store/rutinesSlice';
import { useThemeStyles } from '@/themes/theme';
import { status, actions } from '@/types/apiTypes';
import { router } from 'expo-router';
import React, { useEffect } from 'react';
import { View, StyleSheet, Pressable, Text } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { SafeAreaView } from 'react-native-safe-area-context';


export default function Index() {
    const themeStyles = useThemeStyles();
    const dispatch = useAppDispatch();
    const rutinesStatus = useAppSelector(selectRutinesStatus);
    const exercicisStatus = useAppSelector(selectExercicisStatus);
    const alumnesStatus = useAppSelector(selectAlumnesStatus);
    const reservesStatus = useAppSelector(selectReservesStatus);
    const configStatus = useAppSelector(selectConfigStatus);

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

                <View style={[styles.container]}>
                    <View style={[themeStyles.box, { height: 300 }]}>
                        <Text style={[themeStyles.text, { fontSize: 20, textAlign: "center", marginTop: 25 }]}>Calendari</Text>
                    </View>
                </View>

                <View style={[styles.container, { marginBottom: 30}]}>
                    <Pressable style={[themeStyles.box, { marginBottom: 20 }]} onPress={() => {router.push("/(alumnes)/alumnes")}}>
                        <Text style={[themeStyles.text, { fontSize: 20, textAlign: "center", marginTop: 25 }]}>Alumnes (2/3)</Text>
                        <Text style={[themeStyles.text, { fontSize: 15, textAlign: "center", paddingTop: 110 }]}>Veure tots</Text>
                    </Pressable>
                    <Pressable style={[themeStyles.box]}>
                        <Text style={[themeStyles.text, { fontSize: 20, textAlign: "center", marginTop: 25 }]}>Rutines (3/15)</Text>
                        <Text style={[themeStyles.text, { fontSize: 15, textAlign: "center", paddingTop: 110 }]}>Veure totes</Text>
                    </Pressable>
                </View>

                {/* Alumnes */}
                {/* <AlumnesList /> */}

                {/* Reserves */}
                {/* <ReservesList /> */}

                {/* Rutines */}
                {/* <RutinesList /> */}
            </ScrollView>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        marginTop: 20,
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "space-around",
        margin: "auto",
    },
});