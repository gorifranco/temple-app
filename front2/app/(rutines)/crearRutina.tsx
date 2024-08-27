import { View, Text } from 'react-native';
import React, { useEffect, useState } from 'react';
import { theme, themeStyles } from '@/themes/theme';
import BackButton from '@/components/BackButton';
import { ExerciciRutinaType, ExerciciType } from '@/types/apiTypes';
import { useAxios } from '@/app/api';
import { Pressable } from 'react-native';
import { useDispatch } from 'react-redux';
import { setExercicis } from '@/store/exercicisSlice';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import { TextInput } from 'react-native-paper';
import { StyleSheet } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import Entypo from '@expo/vector-icons/Entypo';
import { SafeAreaView } from 'react-native'
import { AutocompleteDropdownContextProvider } from 'react-native-autocomplete-dropdown'
import AutocompleteExercicis from '@/components/AutocompleteExercicis';


export default function CrearRutina() {
    const api = useAxios();
    const [exercicisElegits, setExercicisElegits] = useState<(ExerciciRutinaType)[]>([]);
    const dispatch = useDispatch();

    useEffect(() => {
        fetchApiExercicis();
    }, [dispatch]);

    async function fetchApiExercicis() {
        const response = await api.get(`exercicis`);
        if (response.status === 200) {
            const fetchedExercicis: ExerciciType[] = response.data.data;
            dispatch(setExercicis(fetchedExercicis));
        }
    }

    return (
        <AutocompleteDropdownContextProvider>
            <SafeAreaView style={styles.container}>
                <BackButton href={"(entrenador)"} />
                <Text style={themeStyles.titol1}>Creador de rutines</Text>
                <ScrollView>
                    {exercicisElegits.map((exercici, i) => {
                        return (
                            <View key={i} style={themeStyles.crearRutinaContainer}>
                                <View style={styles.iconContainer}>
                                    <Entypo name="menu" size={24} color="black" style={{ paddingLeft: 10 }} />
                                </View>
                                <View style={{ display: "flex", flexDirection: "column", width: "100%", margin: "auto" }}>
                                    <AutocompleteExercicis
                                    onSubmit={(id:number) => {
                                        const updatedExercicisElegits = [...exercicisElegits];
                                        updatedExercicisElegits[i] = {
                                            ...updatedExercicisElegits[i],
                                            ID: id,
                                        };
                                        setExercicisElegits(updatedExercicisElegits);
                                    }}
                                    selectedValue={exercici.Nom}
                                    setSelectedValue={(text:string) => console.log(text)}
                                     />
                                    <View style={{ display: "flex", flexDirection: "row", gap: 25, margin: "auto" }}>
                                        <TextInput
                                            label={"Series"}
                                            style={{ width: 100 }}
                                            onChangeText={(text: string) => {
                                                const updatedExercicisElegits = [...exercicisElegits];
                                                updatedExercicisElegits[i] = {
                                                    ...updatedExercicisElegits[i],
                                                    NumSeries: Number(text.replace(/[^0-9]/g, '')),
                                                };
                                                setExercicisElegits(updatedExercicisElegits);
                                            }} />
                                        <TextInput
                                            label={"Repes"}
                                            style={{ width: 100 }}
                                            onChangeText={(text: string) => {
                                                const updatedExercicisElegits = [...exercicisElegits];
                                                updatedExercicisElegits[i] = {
                                                    ...updatedExercicisElegits[i],
                                                    NumRepes: Number(text.replace(/[^0-9]/g, '')),
                                                };
                                                setExercicisElegits(updatedExercicisElegits);
                                            }} />
                                    </View>
                                </View>
                            </View>

                        );
                    })}


                    <Pressable
                        style={[themeStyles.button1, { zIndex: -1 }]}
                        onPress={() => {
                            setExercicisElegits([
                                ...exercicisElegits,
                                {
                                    ID: null,
                                    Nom: "",
                                    RutinaID: null,
                                    ExerciciID: 0,
                                    Ordre: 0,
                                    NumSeries: 0,
                                    NumRepes: 0,
                                    Cicle: 0,
                                    PercentatgeRM: 0,
                                    DiaRutina: 0,
                                },
                            ]);
                        }}
                    >
                        <Text style={themeStyles.button1Text}>Afegir exercici</Text>
                    </Pressable>
                </ScrollView>
            </SafeAreaView>
        </AutocompleteDropdownContextProvider>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
        padding: 16,
    },
    iconContainer: {
        height: "100%",
        width: 40,
        justifyContent: "center",
        alignItems: "center",
        flex: 1,
    },
});
