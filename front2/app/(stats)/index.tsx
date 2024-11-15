import { Text, View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import React from 'react';
import { useThemeStyles } from '@/themes/theme';
import ExerciciLinearGrafic from '@/components/grafics/ExerciciLinearGrafic';
import AutocompleteExercicis from '@/components/inputs/selects/AutocompleteExercicis';
import { AutocompleteDropdownContextProvider } from 'react-native-autocomplete-dropdown'
import { SafeAreaView } from 'react-native-safe-area-context';

export default function Index() {
    const themeStyles = useThemeStyles();
    const [exerciciSeleccionat, setExerciciSeleccionat] = React.useState<number>(1);

    return (
        <AutocompleteDropdownContextProvider>
            <SafeAreaView style={[themeStyles.background, { height: '100%' }]}>
                <ScrollView>
                    <Text style={themeStyles.titol1}>Estadístiques</Text>

                    <View style={{ width: "80%", marginBottom: 10, marginHorizontal: "auto" }}>
                        <AutocompleteExercicis
                            onSubmit={(id: number) => setExerciciSeleccionat(id)}
                            selectedValue={exerciciSeleccionat} />
                    </View>

                    <View style={{ margin: "auto" }}>
                        <ExerciciLinearGrafic />
                    </View>


                </ScrollView>
            </SafeAreaView>
        </AutocompleteDropdownContextProvider>
    )
}