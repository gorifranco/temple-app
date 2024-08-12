import { View, Text } from 'react-native'
import React, { useEffect } from 'react'
import { Stack, useLocalSearchParams } from 'expo-router'
import { themeStyles } from '@/themes/theme'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { SalaType } from '@/types/apiTypes'

export default function Index() {
    const { sala } = useLocalSearchParams()
    console.log(sala)

    useEffect(() => {
        AsyncStorage.getItem('sala', sala<SalaType>(
    },[])

    return (
        <View>
            <Text style={themeStyles.titol1}>{sala}</Text>
        </View>
    )
}