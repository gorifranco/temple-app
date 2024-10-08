import { View, Text, Pressable, StyleSheet, SafeAreaView } from 'react-native';
import React, { useEffect, useState } from 'react';
import BackButton from '@/components/buttons/BackButton';
import { ExerciciRutinaType, ExerciciType } from '@/types/apiTypes';
import { useAxios } from '@/app/api';
import { useDispatch } from 'react-redux';
import { setExercicis } from '@/store/exercicisSlice';
import TextInput from '@/components/inputs/TextInput';
import { ScrollView } from 'react-native-gesture-handler';
import Entypo from '@expo/vector-icons/Entypo';
import { AutocompleteDropdownContextProvider } from 'react-native-autocomplete-dropdown'
import AutocompleteExercicis from '@/components/inputs/selects/AutocompleteExercicis';
import BarraDies from '@/components/BarraDies';
import { exercicisValidator, nomSalaValidator, descripcioValidator, ciclesValidator, diesValidator } from '@/helpers/validators';
import { ExerciciErrorType, RutinaType } from '@/types/apiTypes';
import { router } from 'expo-router';
import Toast from 'react-native-toast-message';
import { afegirRutina } from '@/store/rutinesSlice';
import { useThemeStyles } from '@/themes/theme';


export default function CrearRutina() {
    const themeStyles = useThemeStyles();
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

    async function guardarRutina() {
        let exercicisEnviats = exercicisElegits.filter((exercici) => exercici.DiaRutina <= dies)

        if (!checkErrors(exercicisEnviats)) {
            const dataRutina: RutinaType = {
                ID: -1,
                Nom: nom,
                Descripcio: descripcio,
                Cicles: Number(cicles) ?? -1,
                DiesDuracio: dies,
                Exercicis: exercicisEnviats,
            }
            const response = await api.post(`/rutines`, dataRutina)
            if (response.status === 200) {
                Toast.show({
                    type: 'success',
                    text1: 'Rutina creada',
                    position: 'top',
                });
                dataRutina.ID = response.data.data.ID
                dispatch(afegirRutina({ id: response.data.data.ID, data: dataRutina }))
                router.replace("/(entrenador)")
            } else {
                Toast.show({
                    type: 'error',
                    text1: 'Error creant la rutina',
                    position: 'top',
                });
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
                <BackButton href={"(entrenador)"} styles={{ top: 60 }} />
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
                                keyboardType="numeric"
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
                                keyboardType="numeric"
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
                                                    ExerciciID: id,
                                                };
                                                setExercicisElegits(updatedExercicisElegits);
                                            }}
                                            selectedValue={exercici.Nom}
                                        />
                                        {errorsExercicis && errorsExercicis.get(i) && errorsExercicis.get(i)!.ExerciciID !== "" ? (
                                            <Text style={themeStyles.textInputError}>* {errorsExercicis.get(i)!.ExerciciID}</Text>
                                        ) : null}

                                        <View style={{ display: "flex", flexDirection: "row", gap: 25, margin: "auto", marginTop: 6 }}>
                                            <View style={styles.container2}>
                                                <TextInput
                                                    errorText={errorsExercicis && errorsExercicis.get(i) && errorsExercicis.get(i)!.NumSeries}
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
                                                {errorsExercicis && errorsExercicis.get(i) && errorsExercicis.get(i)!.NumSeries !== "" ? (
                                                    <Text style={themeStyles.textInputError}>{"(*)"}</Text>
                                                ) : null}
                                            </View>

                                            <View style={styles.container2}>
                                                <TextInput
                                                    errorText={errorsExercicis && errorsExercicis.get(i) && errorsExercicis.get(i)!.NumRepes}
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
                                                {errorsExercicis && errorsExercicis.get(i) && errorsExercicis.get(i)!.NumRepes !== "" ? (
                                                    <Text style={themeStyles.textInputError}>{"(*)"}</Text>
                                                ) : null}
                                            </View>


                                            <View style={styles.container2}>
                                                <TextInput
                                                    errorText={errorsExercicis && errorsExercicis.get(i) && errorsExercicis.get(i)!.PercentatgeRM !== ""}
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
                                                {errorsExercicis && errorsExercicis.get(i) && errorsExercicis.get(i)!.PercentatgeRM !== "" ? (
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
                                    ID: null,
                                    Nom: "",
                                    RutinaID: null,
                                    ExerciciID: -1,
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
