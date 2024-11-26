import React, { useEffect, useState } from 'react'
import { View, Text, Pressable } from 'react-native'
import BarraDies from '../BarraDies'
import { ResultatsExercici } from '@/types/apiTypes'
import { useThemeStyles } from '@/themes/theme'
import TextInput from '@/components/inputs/TextInput';
import { useAppSelector } from '@/store/reduxHooks'
import { selectExercicis } from '@/store/exercicisSlice'
import { selectRutinaById } from '@/store/rutinesSlice'
import { selectAlumneByID } from '@/store/alumnesSlice'
import { useText } from '@/hooks/useText'

interface propsType {
    alumneID: number,
    hora: string
}

export default function Entreno(props: propsType) {
    const texts = useText();
    const { alumneID, hora } = props
    const exercicis = useAppSelector(selectExercicis);
    const themeStyles = useThemeStyles()
    const alumne = useAppSelector(state => selectAlumneByID(state, alumneID));
    const rutina = useAppSelector(state => alumne?.rutinaActual ? selectRutinaById(state, alumne.rutinaActual) : null);
    const diaActual = alumne ? alumne.resultatsRutinaActual.length % (rutina?.diesDuracio || 1) : 0;
    const setmanaActual = alumne ? Math.floor(alumne.resultatsRutinaActual.length / (rutina?.diesDuracio || 1)) + 1 : 1;
    const [diaSeleccionat, setDiaSeleccionat] = useState<number>(diaActual);
    const [setmanaSeleccionada, setSetmanaSeleccionada] = useState<number>(setmanaActual);
    const [resultats, setResultats] = useState<ResultatsExercici[]>([]);
    const [desplegat, setDesplegat] = useState(false);

    useEffect(() => {
        buildResultats();
    }, []); // Recalcula los resultados cuando cambia el día o la rutina.

    if (!alumne) {
        console.log("Error al recuperar alumne")
        return <Text>{texts.ErrorLoadingStudent}</Text>
    }
    if (!alumne.rutinaActual) {
        console.log("Alumne sense rutina")
        console.log(alumne)
        return <Text>{texts.WithoutAssignedRoutine}</Text>;
    }
    if (!rutina) {
        console.log("Error al recuperar rutina")
        return <Text>{texts.ErrorLoadingRoutine}</Text>
    }

    function buildResultats() {
        if (!rutina) return;

        const resultatsTmp: ResultatsExercici[] = rutina.exercicis
            .filter(e => e.diaRutina === diaActual) // Filtra los ejercicios del día actual
            .map(e => ({
                exerciciRutinaID: e.id,
                repeticions: e.numRepes,
                series: e.numSeries,
                pes: e.percentatgeRM,
            })); // Genera el array de resultados.

        setResultats(resultatsTmp);
    }
    const exercicisArray = rutina?.exercicis || [];

    return !desplegat ? (
        <Pressable onPress={() => setDesplegat(!desplegat)}>
            <View style={themeStyles.mainContainer1}>
                <Text style={themeStyles.text}>
                    {alumne.nom + " - " + hora}
                </Text>
            </View>
        </Pressable>
    ) : (
        <View>
            <Text>{alumne.nom + " - " + hora}</Text>
            <Text style={[themeStyles.text, { marginTop: 5, marginBottom: 10 }]}>{texts.Week} {setmanaSeleccionada}</Text>
            <BarraDies editable={false} dies={rutina!.diesDuracio} canviaDia={(d: number) => setDiaSeleccionat(d)} currentDia={diaSeleccionat} />
            {exercicisArray.map(e => {
                const resultat = resultats.find(f => f.exerciciRutinaID === e.id);

                return e.diaRutina === diaSeleccionat && setmanaSeleccionada === e.cicle && (
                    <View style={{ marginTop: 15 }} key={e.exerciciID}>
                        <Text style={themeStyles.text}>{exercicis.find(exercici => exercici.id === e.exerciciID)?.nom}</Text>
                        <View style={{ display: "flex", flexDirection: "row", gap: 25, margin: "auto", marginTop: 6 }}>
                            <TextInput
                                label={<Text style={{ fontSize: 12 }}>{texts.Series}</Text>}
                                style={{ width: 65 }}
                                inputMode="numeric"
                                value={resultat?.series?.toString() || e.numSeries.toString()}
                                onChangeText={(text: string) => {
                                    const updatedResultats = resultats.map(f => {
                                        if (f.exerciciRutinaID === e.id) {
                                            return { ...f, series: Number(text.replace(/[^0-9]/g, '')) };
                                        }
                                        return f;
                                    });
                                    setResultats(updatedResultats);
                                }}
                            />
                            <TextInput
                                label={<Text style={{ fontSize: 12 }}>{texts.Repetitions}</Text>}
                                style={{ width: 65 }}
                                inputMode="numeric"
                                value={resultat?.repeticions?.toString() || e.numRepes.toString()}
                                onChangeText={(text: string) => {
                                    const updatedResultats = resultats.map(f => {
                                        if (f.exerciciRutinaID === e.id) {
                                            return {
                                                ...f,
                                                repeticions: Number(text.replace(/[^0-9]/g, ''))
                                            };
                                        }
                                        return f;
                                    });
                                    setResultats(updatedResultats);
                                }} />
                            <TextInput
                                label={<Text style={{ fontSize: 12 }}>{texts.Weight}</Text>}
                                style={{ width: 65 }}
                                inputMode="numeric"
                                value={resultat?.pes?.toString() || e.percentatgeRM.toString() + "%"}
                            onChangeText={(text: string) => {
                                const updatedResultats = resultats.map(f => {
                                    if (f.exerciciRutinaID === e.id) {
                                        return {
                                            ...f,
                                            pes: Number(text.replace(/[^0-9]/g, ''))
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
            >
                <Text>{texts.Save}</Text>
            </Pressable>
        </View>
    )
}