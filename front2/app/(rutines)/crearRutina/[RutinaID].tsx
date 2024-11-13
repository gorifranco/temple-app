import { View, Text, Pressable, StyleSheet } from 'react-native';
import React, { useState } from 'react';
import BackButton from '@/components/buttons/BackButton';
import { ExerciciRutinaType } from '@/types/apiTypes';
import TextInput from '@/components/inputs/TextInput';
import { ScrollView } from 'react-native-gesture-handler';
import { AutocompleteDropdownContextProvider } from 'react-native-autocomplete-dropdown'
import AutocompleteExercicis from '@/components/inputs/selects/AutocompleteExercicis';
import BarraDies from '@/components/BarraDies';
import { exercicisValidator, nomSalaValidator, descripcioValidator, ciclesValidator, diesValidator } from '@/helpers/validators';
import { ExerciciErrorType, RutinaType } from '@/types/apiTypes';
import { useThemeStyles } from '@/themes/theme';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAppDispatch, useAppSelector } from '@/store/reduxHooks';
import { createRutina, selectRutinaById, updateRutina } from '@/store/rutinesSlice';
import { useLocalSearchParams } from 'expo-router';


export default function CrearRutina() {
    const { RutinaID } = useLocalSearchParams();
    const themeStyles = useThemeStyles();
    const [mode, setMode] = useState<"crear" | "editar">(RutinaID == '-1' ? "crear" : "editar");
    if (mode == 'editar') {
        var rutina = useAppSelector(state => selectRutinaById(state, Number(RutinaID)));
    }
    const dispatch = useAppDispatch();
    const [cicles, setCicles] = useState<(Number | null)>(mode == "editar" ? rutina!.cicles : null);
    const [dies, setDies] = useState(mode == "editar" ? rutina!.diesDuracio : 1);
    const [currentDia, setCurrentDia] = useState(0);
    const [exercicisElegits, setExercicisElegits] = useState<(ExerciciRutinaType)[]>(mode == "editar" ? rutina!.exercicis : []);
    const [nom, setNom] = useState(mode == "editar" ? rutina!.nom : "");
    const [descripcio, setDescripcio] = useState(mode == "editar" ? rutina!.descripcio : "");
    const [errorsExercicis, setErrorsExercicis] = useState(new Map<number, ExerciciErrorType>());
    const [errors, setErrors] = useState({
        Nom: "",
        Descripcio: "",
        Dies: "",
        Cicles: "",
    })


    async function guardarRutina() {
        const tmp = exercicisElegits.filter((exercici) => exercici.diaRutina <= dies)

        const exercicisEnviats = [];
        for (let ciclo = 0; ciclo < Number(cicles); ciclo++) {
            const ejerciciosParaEsteCiclo: ExerciciRutinaType[] = tmp.map((exercici) => ({
                ...exercici,
                Cicle: ciclo,
            }));
            exercicisEnviats.push(...ejerciciosParaEsteCiclo);
        }

        if (!checkErrors(exercicisEnviats)) {
            const dataRutina: RutinaType = {
                id: -1,
                nom: nom,
                descripcio: descripcio,
                cicles: Number(cicles) ?? -1,
                diesDuracio: dies,
                exercicis: exercicisEnviats,
            }
            if (mode == "crear") {
                dispatch(createRutina({ rutina: dataRutina }))
            } else {
                dispatch(updateRutina({ rutina: dataRutina }))
            }
        }
    }

    function checkErrors(exercicis: ExerciciRutinaType[]) {
        const errors = exercicisValidator(exercicis)
        const errNom = nomSalaValidator(nom)
        const errDesc = descripcioValidator(descripcio)
        const errCicles = ciclesValidator(cicles)
        const errDies = diesValidator(dies)

        setErrors({ Nom: errNom, Descripcio: errDesc, Cicles: errCicles, Dies: errDies })
        setErrorsExercicis(errors.errors)

        return (errNom != "" || errDesc != "" || errCicles != "" || errDies != "" || errors.error)
    }

    return (
        <AutocompleteDropdownContextProvider>
            <SafeAreaView style={[themeStyles.background, { height: '100%' }]}>
                <BackButton href={"../"} styles={{ top: 60 }} />
                <Text style={themeStyles.titol1}>Creador de rutines</Text>
                <ScrollView>
                    <View style={{ width: "80%", alignSelf: "center" }}>
                        <TextInput
                            label="Nom de la rutina"
                            error={errors.Nom != ""}
                            value={nom}
                            onChangeText={(text: string) => setNom(text)}
                            errorText={errors.Nom} />
                        {errors.Nom && errors.Nom != "" ? <Text style={themeStyles.textInputError}>* {errors.Nom}</Text> : null}
                    </View>
                    <View style={{ width: "80%", alignSelf: "center" }}>
                        <TextInput
                            label="Descripció"
                            error={errors.Descripcio != ""}
                            value={descripcio}
                            onChangeText={(text: string) => setDescripcio(text)}
                            errorText={errors.Descripcio}
                            multiline={true}
                            numberOfLines={4}
                            maxLength={150} />
                    </View>

                    {errors.Descripcio && errors.Descripcio != "" ? <Text style={themeStyles.textInputError}>* {errors.Descripcio}</Text> : null}

                    <View style={{ display: "flex", flexDirection: "row", justifyContent: "space-between", marginHorizontal: "auto", marginBottom: 10, width: "80%" }}>
                        <View style={{ display: "flex", flexDirection: "column", width: "47%" }}>
                            <TextInput
                                error={errors.Dies != ""}
                                errorText={errors.Dies}
                                label="Dies"
                                inputMode="numeric"
                                style={{ width: "100%" }}
                                value={dies ? dies.toString() : ""}
                                onChangeText={(text: string) => setDies(Number(text.replace(/[^0-7]/g, '')))}
                            />
                            {errors.Dies && errors.Dies != "" ? <Text style={themeStyles.textInputError}>* {errors.Dies}</Text> : null}
                        </View>
                        <View style={{ display: "flex", flexDirection: "column", width: "47%" }}>
                            <TextInput
                                errorText={errors.Cicles}
                                error={errors.Cicles != ""}
                                label="Cicles"
                                style={{ width: "100%" }}
                                inputMode="numeric"
                                value={cicles ? cicles.toString() : ""}
                                onChangeText={(text: string) => setCicles(Number(text.replace(/[^0-9]/g, '')))}
                            />
                            {errors.Cicles && errors.Cicles != "" ? <Text style={[themeStyles.textInputError, { marginHorizontal: 0 }]}>* {errors.Cicles}</Text> : null}
                        </View>
                    </View>

                    <BarraDies
                        dies={dies}
                        afegeixDia={() => setDies(dies + 1)}
                        canviaDia={(dia: number) => setCurrentDia(dia)}
                        currentDia={currentDia}
                        editable={true}
                    />

                    {exercicisElegits.map((exercici, i) => {
                        if (exercici.diaRutina == currentDia)
                            return (
                                <View key={i} style={themeStyles.crearRutinaContainer}>
                                    {/*                                     <View style={styles.iconContainer}>
                                        <Entypo name="menu" size={24} color="black" style={{ paddingLeft: 10 }} />
                                    </View> */}
                                    <View style={{ display: "flex", flexDirection: "column", width: "100%", marginHorizontal: "auto" }}>
                                        <AutocompleteExercicis
                                            onSubmit={(id: number) => {
                                                const updatedExercicisElegits = [...exercicisElegits];
                                                updatedExercicisElegits[i] = {
                                                    ...updatedExercicisElegits[i],
                                                    exerciciID: id,
                                                };
                                                setExercicisElegits(updatedExercicisElegits);
                                            }}
                                            selectedValue={exercici.nom}
                                        />
                                        {errorsExercicis && errorsExercicis.get(i) && errorsExercicis.get(i)!.exerciciID !== "" ? (
                                            <Text style={themeStyles.textInputError}>* {errorsExercicis.get(i)!.exerciciID}</Text>
                                        ) : null}

                                        <View style={{ display: "flex", flexDirection: "row", gap: 25, margin: "auto", marginTop: 6 }}>
                                            <View style={styles.container2}>
                                                <TextInput
                                                    errorText={errorsExercicis && errorsExercicis.get(i) && errorsExercicis.get(i)!.numSeries}
                                                    label={<Text style={{ fontSize: 12 }}>Series</Text>}
                                                    style={{ width: 65 }}
                                                    inputMode="numeric"
                                                    value={exercici.numSeries === 0 ? "" : exercici.numSeries.toString()}
                                                    onChangeText={(text: string) => {
                                                        const updatedExercicisElegits = [...exercicisElegits];
                                                        updatedExercicisElegits[i] = {
                                                            ...updatedExercicisElegits[i],
                                                            numSeries: Number(text.replace(/[^0-9]/g, '')),
                                                        };
                                                        setExercicisElegits(updatedExercicisElegits);
                                                    }} />
                                                {errorsExercicis && errorsExercicis.get(i) && errorsExercicis.get(i)!.numSeries !== "" ? (
                                                    <Text style={themeStyles.textInputError}>{"(*)"}</Text>
                                                ) : null}
                                            </View>

                                            <View style={styles.container2}>
                                                <TextInput
                                                    errorText={errorsExercicis && errorsExercicis.get(i) && errorsExercicis.get(i)!.numRepes}
                                                    label={<Text style={{ fontSize: 12 }}>Repes</Text>}
                                                    style={{ width: 65 }}
                                                    inputMode="numeric"
                                                    value={exercici.numRepes === 0 ? "" : exercici.numRepes.toString()}
                                                    onChangeText={(text: string) => {
                                                        const updatedExercicisElegits = [...exercicisElegits];
                                                        updatedExercicisElegits[i] = {
                                                            ...updatedExercicisElegits[i],
                                                            numRepes: Number(text.replace(/[^0-9]/g, '')),
                                                        };
                                                        setExercicisElegits(updatedExercicisElegits);
                                                    }} />
                                                {errorsExercicis && errorsExercicis.get(i) && errorsExercicis.get(i)!.numRepes !== "" ? (
                                                    <Text style={themeStyles.textInputError}>{"(*)"}</Text>
                                                ) : null}
                                            </View>


                                            <View style={styles.container2}>
                                                <TextInput
                                                    errorText={errorsExercicis && errorsExercicis.get(i) && errorsExercicis.get(i)!.percentatgeRM !== ""}
                                                    label={<Text style={{ fontSize: 12 }}>% RM</Text>}
                                                    inputMode="numeric"
                                                    style={{ width: 65 }}
                                                    value={exercici.percentatgeRM === 0 ? "" : exercici.percentatgeRM.toString()}
                                                    onChangeText={(text: string) => {
                                                        const updatedExercicisElegits = [...exercicisElegits];
                                                        updatedExercicisElegits[i] = {
                                                            ...updatedExercicisElegits[i],
                                                            percentatgeRM: Number(text.replace(/[^0-9]/g, '')),
                                                        };
                                                        setExercicisElegits(updatedExercicisElegits);
                                                    }} />
                                                {errorsExercicis && errorsExercicis.get(i) && errorsExercicis.get(i)!.percentatgeRM !== "" ? (
                                                    <Text style={themeStyles.textInputError}>{"(*)"}</Text>
                                                ) : null}
                                            </View>

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
                                    id: null,
                                    nom: "",
                                    rutinaID: null,
                                    exerciciID: -1,
                                    ordre: exercicisElegits.length,
                                    numSeries: 0,
                                    numRepes: 0,
                                    cicle: 0,
                                    percentatgeRM: 0,
                                    diaRutina: currentDia,
                                },
                            ]);
                        }}
                    >
                        <Text style={themeStyles.button1Text}>Afegir exercici</Text>
                    </Pressable>

                    <Pressable
                        style={[themeStyles.button1, { zIndex: -1, marginBottom: 20 }]}
                        onPress={() => guardarRutina()}
                    >
                        <Text style={themeStyles.button1Text}>Guardar rutina</Text>
                    </Pressable>
                </ScrollView >
            </SafeAreaView >
        </AutocompleteDropdownContextProvider >
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
    container2: {
        display: "flex",
        flexDirection: "column",
        marginHorizontal: "auto",
    }
});
