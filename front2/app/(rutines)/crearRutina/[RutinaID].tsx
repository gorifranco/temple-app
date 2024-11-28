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
import { useText } from '@/hooks/useText';
import Toast from 'react-native-toast-message';


export default function CrearRutina() {
    const texts = useText();
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
        nom: "",
        descripcio: "",
        dies: "",
        cicles: "",
    })


    async function guardarRutina() {
        const tmp = exercicisElegits.filter((exercici) => exercici.diaRutina <= dies)

        const exercicisEnviats = [];
        for (let ciclo = 0; ciclo < Number(cicles); ciclo++) {
            const ejerciciosParaEsteCiclo: ExerciciRutinaType[] = tmp.map((exercici) => ({
                ...exercici,
                cicle: ciclo,
            }));
            exercicisEnviats.push(...ejerciciosParaEsteCiclo);
        }
        console.log(exercicisEnviats)

        if (!checkErrors(exercicisEnviats)) {
            const dataRutina: RutinaType = {
                id: 0,
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
        } else {
            Toast.show({
                type: 'error',
                text1: 'Error al crear la rutina',
                position: 'top',
            });
        }
    }

    function checkErrors(exercicis: ExerciciRutinaType[]) {
        const errors = exercicisValidator(exercicis)
        const errNom = nomSalaValidator(nom)
        const errDesc = descripcioValidator(descripcio)
        const errCicles = ciclesValidator(cicles)
        const errDies = diesValidator(dies)

        setErrors({ nom: errNom, descripcio: errDesc, cicles: errCicles, dies: errDies })
        setErrorsExercicis(errors.errors)

        return (errNom != "" || errDesc != "" || errCicles != "" || errDies != "" || errors.error)
    }

    return (
        <AutocompleteDropdownContextProvider>
            <SafeAreaView style={[themeStyles.background, { height: '100%' }]}>
                <BackButton href={"../"} styles={{ top: 27 }} />
                <Text style={themeStyles.titol1}>{texts.CreatorOfRoutines}</Text>
                <ScrollView>
                    <View style={{ width: "80%", alignSelf: "center" }}>
                        <TextInput
                            label={texts.Name}
                            error={errors.nom != ""}
                            value={nom}
                            onChangeText={(text: string) => setNom(text)}
                            errorText={errors.nom} />
                        {errors.nom && errors.nom != "" ? <Text style={themeStyles.textInputError}>* {errors.nom}</Text> : null}
                    </View>
                    <View style={{ width: "80%", alignSelf: "center" }}>
                        <TextInput
                            label={texts.Description}
                            error={errors.descripcio != ""}
                            value={descripcio}
                            onChangeText={(text: string) => setDescripcio(text)}
                            errorText={errors.descripcio}
                            multiline={true}
                            numberOfLines={4}
                            maxLength={150} />
                    </View>

                    {errors.descripcio && errors.descripcio != "" ? <Text style={themeStyles.textInputError}>* {errors.descripcio}</Text> : null}

                    <View style={{ display: "flex", flexDirection: "row", justifyContent: "space-between", marginHorizontal: "auto", marginBottom: 10, width: "80%" }}>
                        <View style={{ display: "flex", flexDirection: "column", width: "47%" }}>
                            <TextInput
                                error={errors.dies != ""}
                                errorText={errors.dies}
                                label={texts.Days}
                                inputMode="numeric"
                                style={{ width: "100%" }}
                                value={dies ? dies.toString() : ""}
                                onChangeText={(text: string) => setDies(Number(text.replace(/[^0-7]/g, '')))}
                            />
                            {errors.dies && errors.dies != "" ? <Text style={themeStyles.textInputError}>* {errors.dies}</Text> : null}
                        </View>
                        <View style={{ display: "flex", flexDirection: "column", width: "47%" }}>
                            <TextInput
                                errorText={errors.cicles}
                                error={errors.cicles != ""}
                                label={texts.Cycles}
                                style={{ width: "100%" }}
                                inputMode="numeric"
                                value={cicles ? cicles.toString() : ""}
                                onChangeText={(text: string) => setCicles(Number(text.replace(/[^0-9]/g, '')))}
                            />
                            {errors.cicles && errors.cicles != "" ? <Text style={[themeStyles.textInputError, { marginHorizontal: 0 }]}>* {errors.cicles}</Text> : null}
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
                                                    label={<Text style={{ fontSize: 12 }}>{texts.Series}</Text>}
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
                                                    label={<Text style={{ fontSize: 12 }}>{texts.Repetitions}</Text>}
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

                    {/* Add exercise button */}
                    <Pressable
                        style={[themeStyles.button1, { zIndex: -1 }]}
                        onPress={() => {
                            const ordre = exercicisElegits.filter( d => d.diaRutina == currentDia).length
                            setExercicisElegits([
                                ...exercicisElegits,
                                {
                                    id: 0,
                                    nom: "",
                                    rutinaID: 0,
                                    exerciciID: -1,
                                    ordre: ordre,
                                    numSeries: 0,
                                    numRepes: 0,
                                    cicle: 0,
                                    percentatgeRM: 0,
                                    diaRutina: currentDia,
                                },
                            ]);
                        }}
                    >
                        <Text style={themeStyles.button1Text}>{texts.AddExercise}</Text>
                    </Pressable>

                    {/* Save routine button */}
                    <Pressable
                        style={[themeStyles.button1, { zIndex: -1, marginBottom: 20 }]}
                        onPress={() => guardarRutina()}
                    >
                        <Text style={themeStyles.button1Text}>{texts.SaveRoutine}</Text>
                    </Pressable>
                </ScrollView >
            </SafeAreaView >
        </AutocompleteDropdownContextProvider >
    )
}

const styles = StyleSheet.create({
    container2: {
        display: "flex",
        flexDirection: "column",
        marginHorizontal: "auto",
    }
});
