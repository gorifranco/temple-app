import { View, Text } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useLocalSearchParams } from 'expo-router'
import { useAxios } from '../api';
import { UsuariType } from '@/types/apiTypes'
import { useSelector } from 'react-redux'
import { RootState } from '@/store'

export default function AlumneScreen() {
    const { alumneID } = useLocalSearchParams();
    const api = useAxios();

    const alumne = useSelector((state: RootState) => state.alumnes[Number(alumneID)]);

    function getAlumne() {
        let response = api.get(`/alumnes/${alumneID}`)
        console.log(response)
    }


    return (
        <View>
            <Text>Alumne</Text>
        </View>
    )
}