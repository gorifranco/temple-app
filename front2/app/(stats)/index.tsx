import { Text, View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import React from 'react';
import { useAxios } from '@/app/api';
import { useThemeStyles } from '@/themes/theme';
import ExerciciLinearGrafic from '@/components/grafics/ExerciciLinearGrafic';
import AutocompleteExercicis from '@/components/inputs/selects/AutocompleteExercicis';
import { AutocompleteDropdownContextProvider } from 'react-native-autocomplete-dropdown'

export default function Index() {
    const api = useAxios();
    const themeStyles = useThemeStyles();
    const [exerciciSeleccionat, setExerciciSeleccionat] = React.useState<number | null>(null);



    return (
        <AutocompleteDropdownContextProvider>
            <ScrollView style={themeStyles.background}>
                <Text style={themeStyles.titol1}>Estadístiques</Text>

                <View style={{ width: "80%", marginBottom: 10, marginHorizontal: "auto" }}>
                    <AutocompleteExercicis onSubmit={(id: number) => setExerciciSeleccionat(id)} />
                </View>

                <View style={{ margin: "auto" }}>
                    <ExerciciLinearGrafic />
                </View>


            </ScrollView>
        </AutocompleteDropdownContextProvider>
    )
}