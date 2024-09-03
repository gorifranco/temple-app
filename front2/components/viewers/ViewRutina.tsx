import { RutinaType } from '@/types/apiTypes'
import { View, Text, Pressable } from 'react-native'
import React, { useState } from 'react'
import { StyleSheet } from 'react-native'
import FletxaDesplegar from '@/components/icons/FletxaDesplegar'
import BarraDies from '../BarraDies'
import { themeStyles } from '@/themes/theme'
import ModalConfirmacio from '../ModalConfirmacio'

interface propsType {
    rutina: RutinaType,
}

export default function ViewRutina(props: propsType) {
    const { rutina } = props
    const [desplegat, setDesplegat] = useState(false)
    const [dia, setDia] = useState(0)
    const [modalVisible, setModalVisible] = useState(false)
    const [confirmVisible, setConfirmVisible] = useState(false)
    const [confirmConfirmar, setConfirmConfirmar] = useState(false)

    function editarRutina() {
        console.log("editar")
    }

    function eliminarRutina() {
        console.log("eliminar")
    }

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
                <View style={{ marginTop: 10 }}>
                    <BarraDies
                        editable={false}
                        dies={rutina.DiesDuracio}
                        canviaDia={(d: number) => setDia(d)}
                        currentDia={dia} />

                    <View style={{ display: "flex", flexDirection: "row", justifyContent: "space-between", marginTop: 10, width: "95%" }}>
                        <Text style={{ width: "50%", fontWeight: "bold" }}>Exercici</Text>
                        <Text style={{ fontWeight: "bold" }}>Repes</Text>
                        <Text style={{ fontWeight: "bold" }}>Series</Text>
                        <Text style={{ fontWeight: "bold" }}>%RM</Text>
                    </View>
                    {rutina.Exercicis && rutina.Exercicis.map((exercici, i) => {
                        if (exercici.DiaRutina == dia) {
                            return (
                                <View key={i} style={{ display: "flex", flexDirection: "row", justifyContent: "space-between", marginTop: 10, width: "95%" }}>
                                    <Text style={{ width: "50%" }}>{exercici.Nom}</Text>
                                    <Text>{exercici.NumRepes}</Text>
                                    <Text>{exercici.NumSeries}</Text>
                                    <Text>{exercici.PercentatgeRM}</Text>
                                </View>
                            )
                        }
                    })}
                    <View style={{ display: "flex", flexDirection: "row", justifyContent: "space-between", marginTop: 10, width: "90%", margin: "auto" }}>
                        <Pressable
                            style={[themeStyles.buttonDanger, { width: "40%" }]}
                            onPress={() => setModalVisible(true)}>
                            <Text style={themeStyles.button1Text}>Eliminar</Text>
                        </Pressable>
                        <Pressable
                            style={[themeStyles.button1, { width: "40%" }]}
                            onPress={() => editarRutina()}>
                            <Text style={themeStyles.button1Text}>Editar</Text>
                        </Pressable>
                    </View>
                </View>
            )}
            <ModalConfirmacio
                modalVisible={modalVisible}
                closeModal={() => setModalVisible(false)}
                missatge="Estàs segur que vols eliminar la rutina?"
                titol='Eliminar rutina'
                confirmar={() => eliminarRutina()} />
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