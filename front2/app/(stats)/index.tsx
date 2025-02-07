import AutocompleteAlumnes from '@/components/inputs/selects/AutocompleteAlumnes';
import TextInput from '@/components/inputs/TextInput';
import { selectAllAlumnes } from '@/store/alumnesSlice';
import { selectExercicis } from '@/store/exercicisSlice';
import { useAppDispatch, useAppSelector } from '@/store/reduxHooks';
import { clearRmsError, clearRmsStatus, selectAllRms, selectRmsError, selectRmsStatus, updateRm } from '@/store/rmsSlice';
import { useThemeStyles } from '@/themes/theme';
import React, { useEffect, useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { AutocompleteDropdownContextProvider } from 'react-native-autocomplete-dropdown';
import { ScrollView } from 'react-native-gesture-handler';
import { SafeAreaView } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';
import { actions, status } from '@/types/apiTypes';
import { selectUser } from '@/store/authSlice';

export default function Index() {
    const dispatch = useAppDispatch();
    const user = useAppSelector(selectUser);
    const themeStyles = useThemeStyles();
    const alumnes = useAppSelector(selectAllAlumnes)
    const exercicis = useAppSelector(selectExercicis);
    const rms = useAppSelector(selectAllRms);
    const rmsStatus = useAppSelector(selectRmsStatus);
    const rmsError = useAppSelector(selectRmsError);
    const [selectedStudent, setSelectedStudent] = useState<number>(user!.tipusUsuari == 'Entrenador' ? alumnes && alumnes.length > 0 ? alumnes[0].id : user!.id : user!.id)
    const mainExercises = ["Press de banca", "Sentadilla", "Peso muerto", "Press militar"];
    const [displayedExercises, setDisplayedExercises] = useState<string[]>(mainExercises);
    const allExercises = [...mainExercises].concat(exercicis.map(ex => ex.nom).filter(ex => !mainExercises.includes(ex)));
    const [editing, setEditing] = useState<number | null>(null);
    const [values, setValues] = useState<number[]>([0, 0, 0, 0])

    useEffect(() => {
        const newValues = displayedExercises.map((exerciseName) => {
            const exercise = exercicis.find((ex) => ex.nom === exerciseName);
            if (!exercise) return 0;

            const rm = rms.find(
                (rm) => rm.usuariID === selectedStudent && rm.exerciciID === exercise.id
            );
            return rm ? rm.pes : 0;
        });

        setValues(newValues);
    }, [selectedStudent, displayedExercises, rms]);

    useEffect(() => {
        if (rmsStatus[actions.update] == status.failed && rmsError[actions.update]) {
            Toast.show({
                type: 'error',
                text1: rmsError[actions.update],
                position: 'top',
            });
            dispatch(clearRmsError(actions.update));
        }

        if (rmsStatus[actions.update] == status.succeeded) {
            Toast.show({
                type: 'success',
                text1: 'RM actualitzat',
                position: 'top',
            });
            dispatch(clearRmsStatus(actions.update));
        }
    }, [rmsStatus]);


    function handleSave(index: number) {
        console.log(user)
        dispatch(updateRm({ usuariID: user!.tipusUsuari == 'Entrenador' ? selectedStudent : user!.id, exerciciID: editing!, pes: values[index] }));
        if (rmsStatus[actions.update] == status.pending) {
            Toast.show({
                type: 'success',
                text1: 'Guardant l\'RM',
                position: 'top',
            });
        }
    }


    return user?.tipusUsuari == 'Entrenador' && (!alumnes || alumnes.length == 0) ? (
        <View>
            <Text style={themeStyles.titol1}>Aún no tienes alumnos</Text>
        </View>
    ) : (
        <AutocompleteDropdownContextProvider>
            <SafeAreaView style={[themeStyles.background, { height: '100%' }]}>
                <ScrollView>
                    <Text style={themeStyles.titol1}>RMs</Text>

                    {/* Picker alumnes */}
                    {user!.tipusUsuari == 'Entrenador' && (
                        <View style={{ width: "90%", marginVertical: 15, margin: 'auto' }}>
                            <AutocompleteAlumnes
                                onSubmit={(id: number) => setSelectedStudent(id)}
                                initialValue={alumnes.find(a => a.id == selectedStudent)} />
                        </View>
                    )}

                    {values && displayedExercises.map((exerciseName, i) => {
                        const exercise = exercicis.find((ex) => ex.nom === exerciseName);
                        if (!exercise) return null;

                        return (
                            <View key={i} style={themeStyles.mainContainer1}>
                                <View
                                    style={{
                                        display: "flex",
                                        flexDirection: "row",
                                        justifyContent: "space-between",
                                    }}
                                >
                                    <Text style={themeStyles.text}>{exerciseName}</Text>
                                    <TextInput
                                        inputMode="numeric"
                                        style={{
                                            height: 50,
                                            width: 100,
                                            borderWidth: 1,
                                            borderRadius: 5,
                                            padding: 5,
                                        }}
                                        value={values[i]?values[i].toString():0}
                                        onFocus={() => {
                                            setEditing(exercise.id);
                                        }}
                                        onChangeText={(text: string) => {
                                            const newValues = [...values];
                                            newValues[i] = Number(text.replace(/[^0-9]/g, ""));
                                            setValues(newValues);
                                        }}
                                    />
                                </View>
                                {editing === exercise.id && (
                                    <Pressable
                                        style={[themeStyles.button1, { marginTop: 5 }]}
                                        onPress={() => handleSave(i)}
                                    >
                                        <Text style={themeStyles.button1Text}>Guardar</Text>
                                    </Pressable>
                                )}
                            </View>
                        );
                    })}
                    {displayedExercises.length == mainExercises.length ? (
                        <Pressable style={{ marginBottom: 20 }} onPress={() => setDisplayedExercises(allExercises)}>
                            <Text style={themeStyles.subtitle}>Ver mas</Text>
                        </Pressable>
                    ) : (
                        <Pressable style={{ marginBottom: 20 }} onPress={() => setDisplayedExercises(mainExercises)}>
                            <Text style={themeStyles.subtitle}>Ver menos</Text>
                        </Pressable>
                    )}


                    {/* <View style={{ width: "80%", marginBottom: 10, marginHorizontal: "auto" }}>
                        <AutocompleteExercicis
                            onSubmit={(id: number) => setExerciciSeleccionat(id)}
                            selectedValue={exerciciSeleccionat} />
                    </View> */}

                    {/* 
                    <Text style={themeStyles.titol1}>Progrés</Text>
                    <View style={{ margin: "auto" }}>
                        <ExerciciLinearGrafic />
                    </View> */}


                </ScrollView>
            </SafeAreaView>
        </AutocompleteDropdownContextProvider>
    )
}