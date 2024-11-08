import React, { useEffect, useState } from 'react'
import { View, Text, Pressable } from 'react-native'
import { useThemeStyles } from '@/themes/theme'
import DiaHorari from './DiaHorari'
import Toast from 'react-native-toast-message'
import { HorariType } from '@/types/apiTypes'
import { validarHoraris } from '@/helpers/horarisValidator'
import { guardarHoraris, selectConfig } from '@/store/configSlice'
import { useAppDispatch, useAppSelector } from '@/store/reduxHooks'

export default function HorariConfig() {
    const themeStyles = useThemeStyles()
    const horaris:HorariType[] = useAppSelector(selectConfig).horaris;
    const [horarisMap, setHorarisMap] = useState<Map<number, { desde: string|null; fins: string|null }[]>>(new Map());
    const [errorsHorarisMap, setErrorsHorarisMap] = useState<Map<number, { errDesde: string|null; errFins: string|null }[]>>(new Map());
    const dies = ["Dilluns", "Dimarts", "Dimecres", "Dijous", "Divendres", "Dissabte", "Diumenge"];
    const dispatch = useAppDispatch();

    console.log(horaris)

    useEffect(() => {
        if (horaris && horaris.length > 0) {
            const transformedHoraris = transformHoraris(horaris);
            setHorarisMap(transformedHoraris);
        }
    }, [horaris]);

    function transformHoraris(horaris: HorariType[]) {
        return horaris.reduce((acc: Map<number, { desde: string; fins: string }[]>, horari: HorariType) => {
            if (!acc.has(horari.diaSetmana)) {
                acc.set(horari.diaSetmana, []);
            }
            acc.get(horari.diaSetmana)!.push({ desde: horari.desde, fins: horari.fins });
            return acc;
        }, new Map());
    }

    async function handleGuardarHoraris() {
        if(validarHoraris(horarisMap).status){
            Toast.show({
                type: 'error',
                text1: 'Error guardant la configuració',
                position: 'top',
            });
            setErrorsHorarisMap(validarHoraris(horarisMap).errors);
            return;
        }
        const horarisArray: HorariType[] = Array.from(horarisMap.entries()).flatMap(([diaSetmana, horaris]) => {
            return horaris.map(horari => ({
                diaSetmana: diaSetmana ?? 0,
                desde: horari.desde ?? "",
                fins: horari.fins ?? ""
            }));
        });

        dispatch(guardarHoraris({ horari: horarisArray }));
    }

    function afegirHorari(i: number) {
        setHorarisMap(prevMap => {
            const updatedMap = new Map(prevMap);
            const horariArray = updatedMap.get(i) || [];
            horariArray.push({ desde: null, fins: null });
            updatedMap.set(i, horariArray);

            return updatedMap;
        });
    }

    function handleCanviarHorari(dia:string, index:number, hora:string, dof:number){ //dof = desde o fins
        const d = dies.indexOf(dia);
        setHorarisMap(prevMap => {
            const updatedMap = new Map(prevMap);
            const horariArray = updatedMap.get(d) || [];
            dof == 0 ? horariArray[index].desde = hora : horariArray[index].fins = hora;
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
                onPress={() => handleGuardarHoraris()}>
                <Text style={themeStyles.button1Text}>Guardar horaris</Text>
            </Pressable>
        </View>
    )
}