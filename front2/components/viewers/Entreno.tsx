import React, { useState } from 'react'
import { View, Text, Pressable } from 'react-native'
import BarraDies from '../BarraDies'
import { RutinaType } from '@/types/apiTypes'
import { ResultatsExercici } from '@/types/apiTypes'
import { useThemeStyles } from '@/themes/theme'
import TextInput from '@/components/inputs/TextInput';
import { useAppSelector } from '@/store/reduxHooks'
import { selectExercicis } from '@/store/exercicisSlice'

interface propsType {
    rutina: RutinaType,
    entrenos: ResultatsExercici[]
}

export default function Entreno(props: propsType) {
    const { rutina, entrenos } = props
    const exercicis = useAppSelector(selectExercicis);
    const themeStyles = useThemeStyles()
    const diaActual = entrenos.length % rutina.diesDuracio
    const setmanaActual = Math.floor(entrenos.length / rutina.diesDuracio) + 1
    const [diaSeleccionat, setDiaSeleccionat] = useState<number>(diaActual);
    const [setmanaSeleccionada, setSetmanaSeleccionada] = useState<number>(setmanaActual);
    const [resultats, setResultats] = useState<ResultatsExercici[]>([]);


    const exercicisArray = Object.values(rutina.exercicis);

    return (
        <View>
            <Text style={[themeStyles.text, { marginTop: 5, marginBottom: 10 }]}>Setmana {setmanaSeleccionada}</Text>
            <BarraDies editable={false} dies={rutina.diesDuracio} canviaDia={(d: number) => setDiaSeleccionat(d)} currentDia={diaSeleccionat} />
            {exercicisArray.map(e => {
                return e.diaRutina == diaSeleccionat && setmanaSeleccionada == e.cicle && (
                    <View style={{ marginTop: 15 }} key={e.exerciciID}>
                        <Text style={themeStyles.text}>{exercicis.find(exercici => exercici.id == e.exerciciID)?.nom}</Text>
                        <View style={{ display: "flex", flexDirection: "row", gap: 25, margin: "auto", marginTop: 6 }}>
                            <TextInput
                                label={<Text style={{ fontSize: 12 }}>Series</Text>}
                                style={{ width: 65 }}
                                inputMode="numeric"
                                value={diaActual == diaSeleccionat && setmanaSeleccionada == setmanaActual ? resultats.filter(f => f.ExerciciRutinaID == e.ExerciciID)[0].Series.toString() : e.NumSeries.toString()}
                                onChangeText={(text: string) => { setResultats(resultats.map(f => f.ExerciciRutinaID == e.ExerciciID ? { ExerciciRutinaID: f.ExerciciRutinaID, Repeticions: f.Repeticions, Series: Number(text.replace(/[^0-9]/g, '')), Pes: f.Pes } : f)) }} />
                            <TextInput
                                label={<Text style={{ fontSize: 12 }}>Repes</Text>}
                                style={{ width: 65 }}
                                inputMode="numeric"
                                value={diaActual == diaSeleccionat && setmanaSeleccionada == setmanaActual ? resultats.filter(f => f.ExerciciRutinaID == e.ExerciciID)[0].Repeticions.toString() : e.NumRepes.toString()}
                                onChangeText={(text: string) => { setResultats(resultats.map(f => f.ExerciciRutinaID == e.ExerciciID ? { ExerciciRutinaID: f.ExerciciRutinaID, Repeticions: Number(text.replace(/[^0-9]/g, '')), Series: f.Series, Pes: f.Pes } : f)) }} />
                            <TextInput
                                label={<Text style={{ fontSize: 12 }}>Pes</Text>}
                                style={{ width: 65 }}
                                inputMode="numeric"
                                value={diaActual == diaSeleccionat && setmanaSeleccionada == setmanaActual ? resultats.filter(f => f.ExerciciRutinaID == e.ExerciciID)[0].Pes.toString() + "Kg" : e.PercentatgeRM.toString() + "%"}
                                onChangeText={(text: string) => { setResultats(resultats.map(f => f.ExerciciRutinaID == e.ExerciciID ? { ExerciciRutinaID: f.ExerciciRutinaID, Repeticions: f.Repeticions, Series: f.Series, Pes: Number(text.replace(/[^0-9]/g, '')) } : f)) }} />
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