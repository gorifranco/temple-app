import React, { useEffect, useState } from 'react'
import { View, Text, StyleSheet, Pressable } from 'react-native'
import { useThemeStyles } from '@/themes/theme'
import DiaHorari from './DiaHorari'
import { useSelector } from 'react-redux'
import { RootState } from '@/store'
import { useAxios } from '@/app/api'
import Toast from 'react-native-toast-message'
import { HorariType } from '@/types/apiTypes'
import { validarHoraris } from '@/helpers/horarisValidator'
import { stringDiaToDate } from '@/helpers/timeHelpers'

export default function HorariConfig() {
    const themeStyles = useThemeStyles()
    const api = useAxios();
    const horaris = useSelector((state: RootState) => state.config.Horaris);
    const [horarisMap, setHorarisMap] = useState<Map<number, { Desde: string|null; Fins: string|null }[]>>(new Map());
    const [errorsHorarisMap, setErrorsHorarisMap] = useState<Map<number, { errDesde: string|null; errFins: string|null }[]>>(new Map());
    const dies = ["Dilluns", "Dimarts", "Dimecres", "Dijous", "Divendres", "Dissabte", "Diumenge"];

    useEffect(() => {
        if (horaris && horaris.length > 0) {
            const transformedHoraris = transformHoraris(horaris);
            setHorarisMap(transformedHoraris);
        }
    }, [horaris]);

    function transformHoraris(horaris: HorariType[]) {
        return horaris.reduce((acc: Map<number, { Desde: string; Fins: string }[]>, horari: HorariType) => {
            if (!acc.has(horari.DiaSetmana)) {
                acc.set(horari.DiaSetmana, []);
            }
            acc.get(horari.DiaSetmana)!.push({ Desde: horari.Desde, Fins: horari.Fins });
            return acc;
        }, new Map());
    }

    async function guardarHoraris() {
        if(validarHoraris(horarisMap).status){
            Toast.show({
                type: 'error',
                text1: 'Error guardant la configuració',
                position: 'top',
            });
            setErrorsHorarisMap(validarHoraris(horarisMap).errors);
            return;
        }
        const horarisArray = Array.from(horarisMap.entries()).flatMap(([diaSetmana, horaris]) => {
            return horaris.map(horari => ({
                diaSetmana: diaSetmana,
                desde: horari.Desde,
                fins: horari.Fins
            }));
        });

        const response = await api.post("/entrenador/guardarHorariEntrenador", horarisArray);
        if (response.status === 200) {
            Toast.show({
                type: 'success',
                text1: 'Configuració guardada',
                position: 'top',
            });
        } else {
            Toast.show({
                type: 'error',
                text1: 'Error guardant la configuració',
                position: 'top',
            });
        }
    }

    function afegirHorari(i: number) {
        setHorarisMap(prevMap => {
            const updatedMap = new Map(prevMap);
            const horariArray = updatedMap.get(i) || [];
            horariArray.push({ Desde: null, Fins: null });
            updatedMap.set(i, horariArray);

            return updatedMap;
        });
    }

    function handleCanviarHorari(dia:string, index:number, hora:string, dof:number){ //dof = desde o fins
        const d = dies.indexOf(dia);
        setHorarisMap(prevMap => {
            const updatedMap = new Map(prevMap);
            const horariArray = updatedMap.get(d) || [];
            dof == 0 ? horariArray[index].Desde = hora : horariArray[index].Fins = hora;
            updatedMap.set(d, horariArray);

            return updatedMap;
        });
    }

    function llevarHorari(i: number) {
        setHorarisMap(prevMap => {
            const updatedMap = new Map(prevMap);
            const horariArray = updatedMap.get(i) || [];
            horariArray.pop()
            updatedMap.set(i, horariArray);

            return updatedMap;
        });
    }

    return (
        <View style={{ display: "flex", flexDirection: "column", alignItems: "center", position: "relative", marginTop: 10 }}>
            <Text style={themeStyles.text}>Horari per defecte</Text>
            <View style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", marginTop: 10, width: "95%" }}>
                {dies.map((d, i) => {
                    return (
                        <DiaHorari
                            dia={d}
                            errors={errorsHorarisMap.get(i) ?? []}
                            horaris={horarisMap.get(i) ?? []}
                            afegirHorari={() => afegirHorari(i)}
                            llevarHorari={() => llevarHorari(i)} key={i} 
                            handleChange={(hora: string, index: number, dof: number) => handleCanviarHorari(d, index, hora, dof)} />
                )})}
            </View>

            <Pressable
                style={[themeStyles.button1, { marginBottom: 25 }]}
                onPress={() => guardarHoraris()}>
                <Text style={themeStyles.button1Text}>Guardar horaris</Text>
            </Pressable>
        </View>
    )
}