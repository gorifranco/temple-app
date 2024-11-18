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

interface propsType {
    alumneID: number,
    hora: string
}

export default function Entreno(props: propsType) {
    const { alumneID, hora } = props
    const exercicis = useAppSelector(selectExercicis);
    const themeStyles = useThemeStyles()
    const alumne = useAppSelector(state => selectAlumneByID(state, alumneID));

    if (!alumne) {
        return <Text>Error al recuperar los datos</Text>
    }
    if (!alumne.rutinaActual) {
        return <Text>No té cap rutina assignada</Text>;
    }

    const rutina = useAppSelector(state => selectRutinaById(state, alumne.rutinaActual!));

    if (!rutina) {
        return <Text>Error al recuperar la rutina</Text>
    }

    const diaActual = alumne.resultatsRutinaActual.length % rutina.diesDuracio
    const setmanaActual = Math.floor(alumne.resultatsRutinaActual.length / rutina.diesDuracio) + 1
    const [diaSeleccionat, setDiaSeleccionat] = useState<number>(diaActual);
    const [setmanaSeleccionada, setSetmanaSeleccionada] = useState<number>(setmanaActual);
    const [resultats, setResultats] = useState<ResultatsExercici[]>([]);

    useEffect(() => {
        buildResultats()
    }, [])

    function buildResultats() {
        const resultatsTmp: ResultatsExercici[] = []
        rutina?.exercicis.forEach(e => {
            if (e.diaRutina == diaActual) {
                const tmp: ResultatsExercici = {
                    exerciciRutinaID: e.id,
                    repeticions: e.numRepes,
                    series: e.numSeries,
                    pes: e.percentatgeRM,
                }
                resultatsTmp.push(tmp)
            }
        })
        setResultats(resultatsTmp)
    }

    const exercicisArray = rutina!.exercicis;

    return (
        <View>
            <Text>{alumne.nom + " - " + hora}</Text>
            <Text style={[themeStyles.text, { marginTop: 5, marginBottom: 10 }]}>Setmana {setmanaSeleccionada}</Text>
            <BarraDies editable={false} dies={rutina!.diesDuracio} canviaDia={(d: number) => setDiaSeleccionat(d)} currentDia={diaSeleccionat} />
            {exercicisArray.map(e => {
                return e.diaRutina == diaSeleccionat && setmanaSeleccionada == e.cicle && (
                    <View style={{ marginTop: 15 }} key={e.exerciciID}>
                        <Text style={themeStyles.text}>{exercicis.find(exercici => exercici.id == e.exerciciID)?.nom}</Text>
                        <View style={{ display: "flex", flexDirection: "row", gap: 25, margin: "auto", marginTop: 6 }}>
                            <TextInput
                                label={<Text style={{ fontSize: 12 }}>Series</Text>}
                                style={{ width: 65 }}
                                inputMode="numeric"
                                value={diaSeleccionat == diaActual && setmanaSeleccionada == setmanaActual ? resultats.find(f => f.exerciciRutinaID == e.id)?.series.toString() : e.numSeries.toString()}
                                onChangeText={(text: string) => {
                                    const updatedResultats = resultats.map(f => {
                                        if (f.exerciciRutinaID === e.id) {
                                            return {
                                                ...f,
                                                series: Number(text.replace(/[^0-9]/g, ''))
                                            };
                                        }
                                        return f;
                                    });
                                    setResultats(updatedResultats);
                                }} />
                            <TextInput
                                label={<Text style={{ fontSize: 12 }}>Repes</Text>}
                                style={{ width: 65 }}
                                inputMode="numeric"
                                value={diaSeleccionat == diaActual && setmanaSeleccionada == setmanaActual ? resultats.find(f => f.exerciciRutinaID == e.id)?.repeticions.toString() : e.numRepes.toString()}
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
                                label={<Text style={{ fontSize: 12 }}>Pes</Text>}
                                style={{ width: 65 }}
                                inputMode="numeric"
                                value={diaSeleccionat == diaActual && setmanaSeleccionada == setmanaActual ? resultats.find(f => f.exerciciRutinaID == e.id)?.pes.toString() : e.percentatgeRM.toString() + "%"}
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
                <Text>Guardar</Text>
            </Pressable>
        </View>
    )
}