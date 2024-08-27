import { View, Text } from 'react-native';
import React, { useEffect, useState } from 'react';
import { themeStyles } from '@/themes/theme';
import BackButton from '@/components/BackButton';
import { ExerciciRutinaType, ExerciciType } from '@/types/apiTypes';
import { useAxios } from '@/app/api';
import { Pressable } from 'react-native';
import { useDispatch } from 'react-redux';
import { setExercicis } from '@/store/exercicisSlice';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import Autocomplete from '@/components/AutocompleteCustom';
import { TextInput } from 'react-native-paper';
import { StyleSheet } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import Entypo from '@expo/vector-icons/Entypo';


export default function CrearRutina() {
    const api = useAxios();
    const [exercicisElegits, setExercicisElegits] = useState<(ExerciciRutinaType)[]>([]);
    const dispatch = useDispatch();

    const exercicis = useSelector((state: RootState) => state.exercicis);

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
        <View style={styles.container}>
            <BackButton href={"(entrenador)"} />
            <Text style={themeStyles.titol1}>Creador de rutines</Text>
            <ScrollView>
                {exercicisElegits.map((exercici, i) => {
                    return (
                        <View key={i} style={themeStyles.crearRutinaContainer}>
                            <View style={styles.iconContainer}>
                                <Entypo name="menu" size={24} color="black" style={{paddingLeft: 10}} />
                            </View>
                            <View style={{display: "flex", flexDirection: "column", width: "100%", margin: "auto" }}>
                                <View style={{ width: '100%', margin: "auto" }}>
                                    <Autocomplete
                                        key={i}
                                        maxItems={6}
                                        value={exercici.Nom}
                                        style={[themeStyles.autocompleteStyle1, {zIndex: 100}]}
                                        containerStyle={[themeStyles.autocompleteDropdown1, {zIndex: 100}]}
                                        data={Object.values(exercicis).map((exercici) => exercici.Nom)}
                                        menuStyle={themeStyles.autocompleteDropdown1}
                                        onChange={(text: string) => {
                                            const updatedExercicisElegits = [...exercicisElegits];
                                            updatedExercicisElegits[i] = {
                                                ...updatedExercicisElegits[i],
                                                Nom: text,
                                            };
                                            setExercicisElegits(updatedExercicisElegits);
                                        }}
                                    />
                                </View>
                                <View style={{ display: "flex", flexDirection: "row", gap: 25, margin: "auto", zIndex: 0 }}>
                                    <TextInput
                                        label={"Series"}
                                        style={{ width: 100, zIndex: 0 }}
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
                                        style={{ width: 100, zIndex: 0 }}
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
                    style={themeStyles.button1}
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
        </View>
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
