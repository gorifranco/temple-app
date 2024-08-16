import { View, Text } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useLocalSearchParams } from 'expo-router'
import { useAxios } from '../api';
import { AlumneType, UsuariType } from '@/types/apiTypes'
import { useSelector } from 'react-redux'
import { RootState } from '@/store'
import BackButton from '@/components/BackButton';
import { useDispatch } from 'react-redux';
import { setSales, updateSala, setAlumne, updateAlumne } from '../../store/slices';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function AlumneScreen() {
    const { alumneID } = useLocalSearchParams();
    const api = useAxios();
    const dispatch = useDispatch();

    const alumne = useSelector((state: RootState) => state.alumnes[Number(alumneID)]);

    useEffect(() => {
        fetchAlumne();
        fetchApi();
    }, [dispatch, alumneID]);

    async function fetchAlumne() {
        const salesData = await AsyncStorage.getItem('sales');
        if (salesData) {
            dispatch(setAlumne(JSON.parse(salesData)));
        }
    }

    async function fetchApi() {
        const response = await api.get(`/sales/${alumneID}`);
        if (response.status === 200) {
            const fetchedAlumne: AlumneType = response.data.data;
            if (!alumne || alumne.ID !== fetchedAlumne.ID) {
                dispatch(updateAlumne({ id: Number(alumneID), data: fetchedAlumne }));
            }
        }
    }


    return (
        <View>
            <BackButton href={"../"}/>
            <Text>Alumne</Text>
        </View>
    )
}