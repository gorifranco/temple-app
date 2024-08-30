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
                    <BarraDies editable={false}/>
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