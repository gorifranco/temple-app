import React, { useState } from 'react'
import { View, Text, Pressable } from 'react-native'
import BarraDies from '../BarraDies'
import { ExerciciType, RutinaType } from '@/types/apiTypes'
import { ResultatsExercici } from '@/types/apiTypes'
import { useThemeStyles } from '@/themes/theme'
import { getExerciciByID } from '@/store/exercicisSlice'
import { useSelector } from 'react-redux'
import { RootState } from '@/store'
import TextInput from '@/components/inputs/TextInput';

interface propsType {
    rutina: RutinaType,
    entrenos: ResultatsExercici[]
}

export default function Entreno(props: propsType) {
    const { rutina, entrenos } = props
    const exercicis = useSelector((state: RootState) => state.exercicis);
    const themeStyles = useThemeStyles()
    const diaActual = entrenos.length % rutina.DiesDuracio
    const setmanaActual = Math.floor(entrenos.length / rutina.DiesDuracio) + 1
    const [diaSeleccionat, setDiaSeleccionat] = useState<number>(diaActual);
    const [setmanaSeleccionada, setSetmanaSeleccionada] = useState<number>(setmanaActual);
    const [resultats, setResultats] = useState<ResultatsExercici[]>(
        rutina.Exercicis.filter(e => e.DiaRutina == diaActual && e.Cicle == setmanaActual).map(f => ({ ExerciciRutinaID: f.ExerciciID, Repeticions: f.NumRepes, Series: f.NumSeries, Pes: 50 }))
    );

    const exercicisArray = Object.values(rutina.Exercicis);

    return (
        <View>
            <Text style={[themeStyles.text, { marginTop: 5, marginBottom: 10 }]}>Setmana {setmanaSeleccionada}</Text>
            <BarraDies editable={false} dies={rutina.DiesDuracio} canviaDia={(d: number) => setDiaSeleccionat(d)} currentDia={diaSeleccionat} />
            {exercicisArray.map(e => {
                return e.DiaRutina == diaSeleccionat && setmanaSeleccionada == e.Cicle && (
                    <View style={{ marginTop: 15 }} key={e.ExerciciID}>
                        <Text style={themeStyles.text}>{getExerciciByID(exercicis, e.ExerciciID).Nom}</Text>
                        <View style={{ display: "flex", flexDirection: "row", gap: 25, margin: "auto", marginTop: 6 }}>
                            <TextInput
                                label={<Text style={{ fontSize: 12 }}>Series</Text>}
                                style={{ width: 65 }}
                                inputMode="numeric"
                                value={diaActual == diaSeleccionat && setmanaSeleccionada == setmanaActual ? resultats.filter(f => f.ExerciciRutinaID == e.ExerciciID)[0].Series.toString() : e.NumSeries.toString()}
                                onChangeText={(text: string) => {setResultats(resultats.map(f => f.ExerciciRutinaID == e.ExerciciID ? { ExerciciRutinaID: f.ExerciciRutinaID, Repeticions: f.Repeticions, Series: Number(text.replace(/[^0-9]/g, '')), Pes: f.Pes } : f))}} />
                            <TextInput
                                label={<Text style={{ fontSize: 12 }}>Repes</Text>}
                                style={{ width: 65 }}
                                inputMode="numeric"
                                value={diaActual == diaSeleccionat && setmanaSeleccionada == setmanaActual ? resultats.filter(f => f.ExerciciRutinaID == e.ExerciciID)[0].Repeticions.toString() : e.NumRepes.toString()}
                                onChangeText={(text: string) => {setResultats(resultats.map(f => f.ExerciciRutinaID == e.ExerciciID ? { ExerciciRutinaID: f.ExerciciRutinaID, Repeticions: Number(text.replace(/[^0-9]/g, '')), Series: f.Series, Pes: f.Pes } : f))}} />
                            <TextInput
                                label={<Text style={{ fontSize: 12 }}>Pes</Text>}
                                style={{ width: 65 }}
                                inputMode="numeric"
                                value={diaActual == diaSeleccionat && setmanaSeleccionada == setmanaActual ? resultats.filter(f => f.ExerciciRutinaID == e.ExerciciID)[0].Pes.toString() + "Kg" : e.PercentatgeRM.toString() + "%"}
                                onChangeText={(text: string) => {setResultats(resultats.map(f => f.ExerciciRutinaID == e.ExerciciID ? { ExerciciRutinaID: f.ExerciciRutinaID, Repeticions: f.Repeticions, Series: f.Series, Pes: Number(text.replace(/[^0-9]/g, '')) } : f))}} />
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