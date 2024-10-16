import React from 'react'
import { View, Text, Pressable } from 'react-native'
import { useThemeStyles } from '@/themes/theme'
import { ReservaType } from '@/types/apiTypes'
import { useSelector } from 'react-redux'
import { RootState } from '@/store'
import { getUserByID } from '@/store/alumnesSlice'
import Entreno from './Entreno'
import { getRutinaByID } from '@/store/rutinesSlice'

interface propsType {
    reserva: ReservaType,
    hora: Date,
    desplegat: boolean,
    onPress: Function
}

export default function FentEntreno(props: propsType) {
    const { reserva, hora, desplegat, onPress } = props
    const themeStyles = useThemeStyles()
    const usuaris = useSelector((state: RootState) => state.alumnes);
    const alumne = getUserByID(usuaris, reserva.UsuariID);
    const rutines = useSelector((state: RootState) => state.rutines);
    const rutina = alumne.RutinaActual ? getRutinaByID(rutines, alumne.RutinaActual) : null;


    return !desplegat ? (
        <Pressable onPress={() => onPress()}>
            <View style={themeStyles.mainContainer1}>
                <Text style={themeStyles.text}>
                    {alumne.Nom + " - " + hora.getHours() + ":" + hora.getMinutes().toString().padStart(2, '0')}
                </Text>
            </View>
        </Pressable>

    ) : (
        <View style={themeStyles.mainContainer1}>
            <Text style={themeStyles.text}>
                {alumne.Nom + " - " + hora.getHours() + ":" + hora.getMinutes().toString().padStart(2, '0')}
            </Text>
            {alumne.RutinaActual == 0 || rutina == null ? (
                <Text style={[themeStyles.text, {marginVertical: 10}]}>No té cap rutina assignada</Text>
            ) : (
                <Entreno rutina={rutina} entrenos={alumne.ResultatsRutinaActual} />
            )}
        </View>
    )
}