import { RutinaType } from '@/types/apiTypes'
import { View, Text } from 'react-native'
import React, { useState } from 'react'
import { StyleSheet } from 'react-native'
import FletxaDesplegar from '@/components/icons/FletxaDesplegar'
import BarraDies from '../BarraDies'

interface propsType {
    rutina: RutinaType,
}

export default function ViewRutina(props: propsType) {
    const { rutina } = props
    const [desplegat, setDesplegat] = useState(false)
    const [dia, setDia] = useState(0)
    console.log(rutina)

    return (
        <View key={rutina.ID} style={styles.rutinaContainer}>
            <View style={{ display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "space-between", position: "relative" }}>
                <Text>{rutina.Nom}</Text>
                <Text>{rutina.Descripcio}</Text>
                <FletxaDesplegar
                    amunt={desplegat}
                    containerStyle={{ position: "absolute", right: 0, top: 0 }}
                    size={24}
                    onPress={() => setDesplegat(!desplegat)} />
            </View>
            {desplegat && (
                <View>
                    <BarraDies
                        editable={false}
                        dies={rutina.DiesDuracio}
                        canviaDia={(d: number) => setDia(d)}
                        currentDia={dia} />

                    <View style={{display: "flex", flexDirection: "row", justifyContent: "space-between", marginTop: 10, width: "95%"}}>
                        <Text style={{width: "50%"}}>Exercici</Text>
                        <Text>Repes</Text>
                        <Text>Series</Text>
                        <Text>%RM</Text>
                    </View>
                    {rutina.Exercicis && rutina.Exercicis.map((exercici, i) => {
                        return (
                            <View key={i} style={{display: "flex", flexDirection: "row", justifyContent: "space-between", marginTop: 10, width: "95%"}}>
                                <Text style={{width: "50%"}}>{exercici.Nom}</Text>
                                <Text>{exercici.NumRepes}</Text>
                                <Text>{exercici.NumSeries}</Text>
                                <Text>{exercici.PercentatgeRM}</Text>
                            </View>
                        )
                    })}
                </View>
            )}
        </View>
    )
}

const styles = StyleSheet.create({
    rutinaContainer: {
        margin: 20,
        borderWidth: 1,
        borderColor: "black",
        padding: 10,
        borderRadius: 10,
    },
})