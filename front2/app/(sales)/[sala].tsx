import { View, Text } from 'react-native'
import React from 'react'
import { Stack, useLocalSearchParams } from 'expo-router'
import { themeStyles } from '@/themes/theme'

export default function Index() {
    const { sala } = useLocalSearchParams()

    return (
        <View>
            <Text style={themeStyles.titol1}>{sala}</Text>
        </View>
    )
}