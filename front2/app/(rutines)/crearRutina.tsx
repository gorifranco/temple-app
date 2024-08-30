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
import { exercicisValidator, nomSalaValidator, descripcioValidator, ciclesValidator, diesValidator } from '@/helpers/validators';
import { ExerciciErrorType } from '@/types/apiTypes';


export default function CrearRutina() {
    const api = useAxios();
    const [cicles, setCicles] = useState<(Number | null)>(null);
    const [dies, setDies] = useState(1);
    const [currentDia, setCurrentDia] = useState(0);
    const [exercicisElegits, setExercicisElegits] = useState<(ExerciciRutinaType)[]>([]);
    const [nom, setNom] = useState("");
    const [descripcio, setDescripcio] = useState("");
    const dispatch = useDispatch();
    const [errorsExercicis, setErrorsExercicis] = useState(new Map<number, ExerciciErrorType>());
    const [errors, setErrors] = useState({
        Nom: "",
        Descripcio: "",
        Dies: "",
        Cicles: "",
    })


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
        checkErrors()

    }

    function checkErrors() {
        let error = false;
        const errors = exercicisValidator(exercicisElegits)
        const errNom = nomSalaValidator(nom)
        const errDesc = descripcioValidator(descripcio)
        const errCicles = ciclesValidator(cicles)
        const errDies = diesValidator(dies)

        if (errNom != "" || errDesc != "" || errCicles != "" || errDies != "") error = true

        setErrors({ Nom: errNom, Descripcio: errDesc, Cicles: errCicles, Dies: errDies })

        for (const [key, value] of errors) {
            console.log(key, value)
        }
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
                    {nomError ? <Text style={themeStyles.textInputError}>{nomError}</Text> : null}

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
                    {descripcioError ? <Text style={themeStyles.textInputError}>{descripcioError}</Text> : null}

                    <View style={{ display: "flex", flexDirection: "row", justifyContent: "space-between", marginHorizontal: "auto", marginBottom: 10, width: "80%" }}>
                        <TextInput
                            label="Dies"
                            keyboardType="numeric"
                            style={{ width: "47%" }}
                            value={dies ? dies.toString() : ""}
                            onChangeText={(text: string) => setDies(Number(text.replace(/[^0-7]/g, '')))}
                        />

                        <TextInput
                            label="Cicles"
                            style={{ width: "47%" }}
                            keyboardType="numeric"
                            value={cicles ? cicles.toString() : ""}
                            onChangeText={(text: string) => setCicles(Number(text.replace(/[^0-9]/g, '')))}
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
