import React, { useState } from 'react'
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
}

export default function Entreno(props: propsType) {
    const { alumneID } = props
    const exercicis = useAppSelector(selectExercicis);
    const themeStyles = useThemeStyles()
    const alumne = useAppSelector(state => selectAlumneByID(state, alumneID));

    if (!alumne) {
        return <Text>Error al recuperar los datos</Text>
    }
    console.log(alumne)
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


    const exercicisArray = rutina!.exercicis;

    return (
        <View>
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
                                value={diaActual == diaSeleccionat && setmanaSeleccionada == setmanaActual ? resultats.filter(f => f.exerciciRutinaID == e.exerciciID)[0].series.toString() : e.numSeries.toString()}
                                onChangeText={(text: string) => { setResultats(resultats.map(f => f.exerciciRutinaID == e.exerciciID ? { exerciciRutinaID: f.exerciciRutinaID, repeticions: f.repeticions, series: Number(text.replace(/[^0-9]/g, '')), pes: f.pes } : f)) }} />
                            <TextInput
                                label={<Text style={{ fontSize: 12 }}>Repes</Text>}
                                style={{ width: 65 }}
                                inputMode="numeric"
                                value={diaActual == diaSeleccionat && setmanaSeleccionada == setmanaActual ? resultats.filter(f => f.exerciciRutinaID == e.exerciciID)[0].repeticions.toString() : e.numRepes.toString()}
                                onChangeText={(text: string) => { setResultats(resultats.map(f => f.exerciciRutinaID == e.exerciciID ? { exerciciRutinaID: f.exerciciRutinaID, repeticions: Number(text.replace(/[^0-9]/g, '')), series: f.series, pes: f.pes } : f)) }} />
                            <TextInput
                                label={<Text style={{ fontSize: 12 }}>Pes</Text>}
                                style={{ width: 65 }}
                                inputMode="numeric"
                                value={diaActual == diaSeleccionat && setmanaSeleccionada == setmanaActual ? resultats.filter(f => f.exerciciRutinaID == e.exerciciID)[0].pes.toString() + "Kg" : e.percentatgeRM.toString() + "%"}
                                onChangeText={(text: string) => { setResultats(resultats.map(f => f.exerciciRutinaID == e.exerciciID ? { exerciciRutinaID: f.exerciciRutinaID, repeticions: f.repeticions, series: f.series, pes: Number(text.replace(/[^0-9]/g, '')) } : f)) }} />
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