import AlumnesList from '@/components/viewers/AlumnesList';
import ReservesList from '@/components/viewers/ReservesList';
import RutinesList from '@/components/viewers/RutinesList';
import { getAlumnes, selectAlumnesStatus } from '@/store/alumnesSlice';
import { getConfig, selectConfigStatus } from '@/store/configSlice';
import { getExercicis, selectExercicisStatus } from '@/store/exercicisSlice';
import { useAppDispatch, useAppSelector } from '@/store/reduxHooks';
import { getReserves, selectReservesStatus } from '@/store/reservesSlice';
import { getRutinesEntrenador, selectRutinesStatus } from '@/store/rutinesSlice';
import { useThemeStyles } from '@/themes/theme';
import { status, actions } from '@/types/apiTypes';
import React, { useEffect } from 'react';
import { View } from 'react-native';
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

                {/* Alumnes */}
                <AlumnesList />
                <View style={themeStyles.hr} />

                {/* Reserves */}
                <ReservesList />
                <View style={themeStyles.hr} />

                {/* Rutines */}
                <RutinesList />
            </ScrollView>
        </SafeAreaView>
    )
}