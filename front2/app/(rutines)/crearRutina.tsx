import { View, Text, Pressable, StyleSheet, SafeAreaView } from 'react-native';
import React, { useEffect, useState } from 'react';
import { themeStyles } from '@/themes/theme';
import BackButton from '@/components/BackButton';
import { ExerciciRutinaType, ExerciciType } from '@/types/apiTypes';
import { useAxios } from '@/app/api';
import { useDispatch } from 'react-redux';
import { setExercicis } from '@/store/exercicisSlice';
import { TextInput } from 'react-native-paper';
import { ScrollView } from 'react-native-gesture-handler';
import Entypo from '@expo/vector-icons/Entypo';
import { AutocompleteDropdownContextProvider } from 'react-native-autocomplete-dropdown'
import AutocompleteExercicis from '@/components/AutocompleteExercicis';
import BarraDies from '@/components/BarraDies';


export default function CrearRutina() {
    const api = useAxios();
    const [cicles, setCicles] = useState(null);
    const [dies, setDies] = useState(1);
    const [currentDia, setCurrentDia] = useState(0);
    const [exercicisElegits, setExercicisElegits] = useState<(ExerciciRutinaType)[]>([]);
    const [nom, setNom] = useState("");
    const [descripcio, setDescripcio] = useState("");
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

    function guardarRutina() {
        console.log("guardar rutina")
    }

    return (
        <AutocompleteDropdownContextProvider>
            <SafeAreaView style={styles.container}>
                <BackButton href={"(entrenador)"} />
                <Text style={themeStyles.titol1}>Creador de rutines</Text>
                <ScrollView>
                    <TextInput
                        label={<Text>Nom de la rutina</Text>}
                        style={themeStyles.inputContainer}
                        onChangeText={(text: string) => setNom(text)}
                        value={nom}
                    />

                    <TextInput
                        placeholder='Descripció'
                        style={[themeStyles.inputContainer, { paddingHorizontal: 0 }]}
                        multiline={true}
                        contentStyle={{ paddingHorizontal: 0, width: 200 }}
                        numberOfLines={4}
                        maxLength={150}
                        onChangeText={(text: string) => setDescripcio(text)}
                        value={descripcio}
                    />

                    <View style={{alignContent: "space-between"}}>
                        <TextInput 
                        placeholder="Dies"
                        style={{width: "35%"}}
                        keyboardType="numeric"
                        value={dies ? dies.toString() : ""}
                        />
                    </View>

                    <BarraDies
                        dies={dies}
                        afegeixDia={() => setDies(dies + 1)}
                        canviaDia={(dia: number) => setCurrentDia(dia)}
                        currentDia={currentDia}
                    />

                    {exercicisElegits.map((exercici, i) => {
                        if (exercici.DiaRutina == currentDia)
                            return (
                                <View key={i} style={themeStyles.crearRutinaContainer}>
                                    <View style={styles.iconContainer}>
                                        <Entypo name="menu" size={24} color="black" style={{ paddingLeft: 10 }} />
                                    </View>
                                    <View style={{ display: "flex", flexDirection: "column", width: "100%", margin: "auto" }}>
                                        <AutocompleteExercicis
                                            onSubmit={(id: number) => {
                                                const updatedExercicisElegits = [...exercicisElegits];
                                                updatedExercicisElegits[i] = {
                                                    ...updatedExercicisElegits[i],
                                                    ID: id,
                                                };
                                                setExercicisElegits(updatedExercicisElegits);
                                            }}
                                            selectedValue={exercici.Nom}
                                            setSelectedValue={(text: string) => console.log(text)}
                                        />
                                        <View style={{ display: "flex", flexDirection: "row", gap: 25, margin: "auto" }}>
                                            <TextInput
                                                label={<Text style={{ fontSize: 12 }}>Series</Text>}
                                                style={{ width: 65 }}
                                                keyboardType="numeric"
                                                value={exercici.NumSeries === 0 ? "" : exercici.NumSeries.toString()}
                                                onChangeText={(text: string) => {
                                                    const updatedExercicisElegits = [...exercicisElegits];
                                                    updatedExercicisElegits[i] = {
                                                        ...updatedExercicisElegits[i],
                                                        NumSeries: Number(text.replace(/[^0-9]/g, '')),
                                                    };
                                                    setExercicisElegits(updatedExercicisElegits);
                                                }} />
                                            <TextInput
                                                label={<Text style={{ fontSize: 12 }}>Repes</Text>}
                                                style={{ width: 65 }}
                                                keyboardType="numeric"
                                                value={exercici.NumRepes === 0 ? "" : exercici.NumRepes.toString()}
                                                onChangeText={(text: string) => {
                                                    const updatedExercicisElegits = [...exercicisElegits];
                                                    updatedExercicisElegits[i] = {
                                                        ...updatedExercicisElegits[i],
                                                        NumRepes: Number(text.replace(/[^0-9]/g, '')),
                                                    };
                                                    setExercicisElegits(updatedExercicisElegits);
                                                }} />
                                            <TextInput
                                                label={<Text style={{ fontSize: 12 }}>% RM</Text>}
                                                keyboardType="numeric"
                                                style={{ width: 65 }}
                                                value={exercici.PercentatgeRM === 0 ? "" : exercici.PercentatgeRM.toString()}
                                                onChangeText={(text: string) => {
                                                    const updatedExercicisElegits = [...exercicisElegits];
                                                    updatedExercicisElegits[i] = {
                                                        ...updatedExercicisElegits[i],
                                                        PercentatgeRM: Number(text.replace(/[^0-9]/g, '')),
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
                                    Ordre: exercicisElegits.length,
                                    NumSeries: 0,
                                    NumRepes: 0,
                                    Cicle: 0,
                                    PercentatgeRM: 0,
                                    DiaRutina: currentDia,
                                },
                            ]);
                        }}
                    >
                        <Text style={themeStyles.button1Text}>Afegir exercici</Text>
                    </Pressable>

                    <Pressable
                        style={[themeStyles.button1, { zIndex: -1 }]}
                        onPress={() => guardarRutina()}
                    >
                        <Text style={themeStyles.button1Text}>Guardar rutina</Text>
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
