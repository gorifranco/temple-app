import { View, Text } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useLocalSearchParams } from 'expo-router'
import { useAxios } from '../api';
import { AlumneType, UsuariType } from '@/types/apiTypes'
import { useSelector } from 'react-redux'
import { RootState } from '@/store'
import BackButton from '@/components/BackButton';
import { useDispatch } from 'react-redux';
import { setAlumne, updateAlumne } from '../../store/slices';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Calendar } from 'react-native-calendars';
import { themeStyles } from '@/themes/theme';

export default function AlumneScreen() {
    const { alumneID } = useLocalSearchParams();
    const [selectedDay, setSelectedDay] = useState('');
    const api = useAxios();
    const dispatch = useDispatch();

    const alumne = useSelector((state: RootState) => state.alumnes[Number(alumneID)]);

    useEffect(() => {
        fetchAlumne();
        fetchApi();
    }, [dispatch, alumneID]);

    async function fetchAlumne() {
        const alumnesData = await AsyncStorage.getItem('alumnes');
        if (alumnesData) {
            dispatch(setAlumne(JSON.parse(alumnesData)));
        }
    }

    function handleDayPress(day: { dateString: React.SetStateAction<string>; }) {
        setSelectedDay(day.dateString);
    }

    async function fetchApi() {
        const response = await api.get(`entrenador/alumnes/${alumneID}`);
        if (response.status === 200) {
            const fetchedAlumne: AlumneType = response.data.data;
            if (!alumne || alumne !== fetchedAlumne) {
                dispatch(updateAlumne({ id: Number(alumneID), data: fetchedAlumne }));
            }
        }
    }

    if (!alumne) {
        return (<View>Carregant alumne</View>)
    }


    return (
        <View>
            <BackButton href={"../"}/>
            <Text style={themeStyles.titol1}>{alumne.Nom}</Text>
            <Calendar 
                firstDay={1}
                onDayPress={handleDayPress}
                markedDates={{
                    [selectedDay]: { selected: true, marked: true, selectedColor: 'blue' }
                }}
            />

            <Text style={themeStyles.titol1}>Pròxim entreno</Text>
            <Text style={themeStyles.titol1}>Rutina actual</Text>
        </View>
    )
}