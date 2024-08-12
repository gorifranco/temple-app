import { View, Text } from 'react-native';
import React from 'react';
import SelectExercicis from '@/components/SelectExercicis';
import { themeStyles } from '@/themes/theme';

export default function CrearRutina() {
    return (
        <View>
            <Text style={themeStyles.titol1}>Crear rutina</Text>
            <SelectExercicis />
        </View>
    )
}