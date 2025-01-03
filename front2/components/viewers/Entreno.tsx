import React, { useEffect, useState } from 'react'
import { View, Text, Pressable } from 'react-native'
import BarraDies from '../BarraDies'
import { useAppTheme, useThemeStyles } from '@/themes/theme'
import TextInput from '@/components/inputs/TextInput';
import { useAppDispatch, useAppSelector } from '@/store/reduxHooks'
import { selectExercicis } from '@/store/exercicisSlice'
import { selectRutinaById } from '@/store/rutinesSlice'
import { assignarRutina, selectAlumneByID } from '@/store/alumnesSlice'
import { useText } from '@/hooks/useText'
import FletxaDesplegar from '../icons/FletxaDesplegar'
import AutocompleteRutines from '../inputs/selects/AutocompleteRutines'
import { finishTraining } from '@/store/alumnesSlice'
import { selectAllRms } from '@/store/rmsSlice'
import { ResultatExercici } from '@/types/apiTypes'

interface propsType {
    alumneID: number,
    data: string
}

export default function Entreno(props: propsType) {
    const texts = useText();
    const { alumneID, data } = props
    const exercicis = useAppSelector(selectExercicis);
    const themeStyles = useThemeStyles()
    const appTheme = useAppTheme()
    const dispatch = useAppDispatch();
    const alumne = useAppSelector(state => selectAlumneByID(state, alumneID));
    const rms = useAppSelector(selectAllRms);
    const rutina = useAppSelector(state => alumne?.rutinaActual ? selectRutinaById(state, alumne.rutinaActual) : null);
    const diaActual = alumne ? alumne.resultatsRutinaActual.length % (rutina?.diesDuracio || 1) : 0;
    const setmanaActual = alumne ? Math.floor(alumne.resultatsRutinaActual.length / (rutina?.diesDuracio || 1)) + 1 : 1;
    const [diaSeleccionat, setDiaSeleccionat] = useState<number>(diaActual);
    const [setmanaSeleccionada, setSetmanaSeleccionada] = useState<number>(setmanaActual);
    const [resultats, setResultats] = useState<ResultatExercici[]>([]);
    const [desplegat, setDesplegat] = useState(false);


    useEffect(() => {
        buildResultats();
    }, []);

    function handleAssignarRutina(rutinaId: number) {
        dispatch(assignarRutina({ rutinaID: rutinaId, alumneID: alumneID }));
    }

    function handleFinishTraining() {
        const resultatEntreno:ResultatExercici[] = resultats.map(r => ({
            usuariRutinaID: alumneID,
            exerciciRutinaID: r.exerciciRutinaID,
            repeticions: r.repeticions,
            series: r.series,
            pes: r.pes,
            dia: data
        }));
        dispatch(finishTraining({data: resultatEntreno}));
    }

    function buildResultats() {
        if (!rutina) return;


        const resultatsTmp: ResultatExercici[] = rutina.exercicis
            .filter(e => e.diaRutina === diaActual && setmanaActual-1 === e.cicle)
            .map(e => ({
                dia: data,
                usuariRutinaID: alumneID,
                exerciciRutinaID: e.id,
                repeticions: e.numRepes,
                series: e.numSeries,
                pes: e.percentatgeRM * (rms.find(f => f.exerciciID === e.exerciciID && f.usuariID === alumneID)?.pes ?? 1) /100,
            })); // Genera el array de resultados.

        setResultats(resultatsTmp);
    }
    const exercicisArray = rutina?.exercicis || [];

    return (
        <Pressable onPress={() => setDesplegat(!desplegat)}>
            <View style={themeStyles.mainContainer1}>
                <Text style={themeStyles.text}>
                    {alumne!.nom + "  " + data.substring(10, 15)}
                </Text>
                <FletxaDesplegar
                    amunt={desplegat}
                    containerStyle={{ position: "absolute", right: 13, top: 9 }}
                    size={24}
                    onPress={() => setDesplegat(!desplegat)} />
                {desplegat && rutina && (
                    <View>
                        <Text style={[themeStyles.text, { marginTop: 5, marginBottom: 10 }]}>{texts.Week} {setmanaSeleccionada}</Text>
                        <BarraDies editable={false} dies={rutina!.diesDuracio} canviaDia={(d: number) => setDiaSeleccionat(d)} currentDia={diaSeleccionat} />
                        {exercicisArray.map(e => {
                            const resultat = resultats.find(f => f.exerciciRutinaID === e.id);

                            return e.diaRutina === diaSeleccionat && setmanaSeleccionada-1 === e.cicle && (
                                <View style={{ marginTop: 15 }} key={e.exerciciID}>
                                    <Text style={themeStyles.text}>{exercicis.find(exercici => exercici.id === e.exerciciID)?.nom}</Text>
                                    <View style={{ display: "flex", flexDirection: "row", gap: 25, margin: "auto", marginTop: 6 }}>
                                        <TextInput
                                            label={<Text style={{ fontSize: 12 }}>{texts.Series}</Text>}
                                            style={{ width: 65, backgroundColor: appTheme.colors.background2, borderRadius: 50, padding: 'offset', textAlign: 'center' }}
                                            inputMode="numeric"
                                            value={resultat?.series?.toString() ?? e.numSeries.toString()}
                                            onChangeText={(text: string) => {
                                                const updatedResultats = resultats.map(f => {
                                                    if (f.exerciciRutinaID === e.id) {
                                                        return { ...f, series: Number(text) };
                                                    }
                                                    return f;
                                                });
                                                setResultats(updatedResultats);
                                            }}
                                        />
                                        <TextInput
                                            label={<Text style={{ fontSize: 12 }}>{texts.Reps}</Text>}
                                            style={{ width: 65, backgroundColor: appTheme.colors.background2, borderRadius: 50, padding: 'offset', textAlign: 'center' }}
                                            inputMode="numeric"
                                            value={resultat?.repeticions?.toString() ?? e.numRepes.toString()}
                                            onChangeText={(text: string) => {
                                                const updatedResultats = resultats.map(f => {
                                                    if (f.exerciciRutinaID === e.id) {
                                                        return {
                                                            ...f,
                                                            repeticions: Number(text)
                                                        };
                                                    }
                                                    return f;
                                                });
                                                setResultats(updatedResultats);
                                            }} />
                                        <TextInput
                                            label={<Text style={{ fontSize: 12 }}>{texts.Weight}</Text>}
                                            style={{ width: 65, backgroundColor: appTheme.colors.background2, borderRadius: 50, padding: 'offset', textAlign: 'center' }}
                                            inputMode="numeric"
                                            value={(resultat ? (resultat?.pes).toFixed(0) : e.percentatgeRM.toString() + "%")} 
                                            onChangeText={(text: string) => {
                                                const updatedResultats = resultats.map(f => {
                                                    if (f.exerciciRutinaID === e.id) {
                                                        return {
                                                            ...f,
                                                            pes: Number(text)
                                                        };
                                                    }
                                                    return f;
                                                });
                                                setResultats(updatedResultats);
                                            }} />
                                    </View>
                                </View>
                            )
                        })}

                        <Pressable
                            style={[themeStyles.button1, { marginBottom: 15, marginTop: 30 }]}
                            onPress={() => handleFinishTraining()}
                        >
                            <Text style={themeStyles.button1Text}>{texts.FinishTraining}</Text>
                        </Pressable>
                    </View>

                )}

                {desplegat && !rutina && (
                    <View style={{ width: "97%", margin: "auto" }}>
                        <Text style={[themeStyles.text, { marginVertical: 5 }]}>{texts.AssignRoutine}</Text>
                        <AutocompleteRutines onSubmit={(rutinaId: number) => handleAssignarRutina(rutinaId)} />
                    </View>
                )}
            </View>
        </Pressable>
    )
}