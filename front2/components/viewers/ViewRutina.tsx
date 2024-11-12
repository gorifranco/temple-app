import { View, Text, Pressable } from 'react-native'
import React, { useState } from 'react'
import FletxaDesplegar from '@/components/icons/FletxaDesplegar'
import BarraDies from '../BarraDies'
import ModalConfirmacio from '../modals/ModalConfirmacio'
import { router } from 'expo-router'
import { useThemeStyles } from '@/themes/theme'
import { useAppDispatch, useAppSelector } from '@/store/reduxHooks'
import { deleteRutina, selectRutinaById } from '@/store/rutinesSlice'
import { selectExercicis } from '@/store/exercicisSlice'


interface propsType {
    rutinaID: number,
    versio?: number
    acabarRutina?: Function
}

export default function ViewRutina(props: propsType) {
    const themeStyles = useThemeStyles()
    const { rutinaID, versio = 0, acabarRutina } = props
    const [desplegat, setDesplegat] = useState(false)
    const [dia, setDia] = useState(0)
    const [modalVisible, setModalVisible] = useState(false)
    const rutina = useAppSelector(state => selectRutinaById(state, rutinaID));
    const dispatch = useAppDispatch();
    const exercicis = useAppSelector(selectExercicis);

    function editarRutina() {
        console.log("editar")
    }

    function canviarRutina() {
        console.log("canviar")
    }

    function handleAcabar() {
        if (!acabarRutina) {
            router.replace("..")
        } else {
            acabarRutina()
        }
    }

    async function handleEliminarRutina() {
        dispatch(deleteRutina({ id: rutina!.id }))
    }

    return rutina &&  (
        <View key={rutina.id} style={themeStyles.mainContainer1}>
            <View style={{ display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "space-between", position: "relative" }}>
                <Text style={themeStyles.text}>{rutina.nom}</Text>
                <FletxaDesplegar
                    amunt={desplegat}
                    containerStyle={{ position: "absolute", right: 0, top:   0 }}
                    size={24}
                    onPress={() => setDesplegat(!desplegat)} />
            </View>
            {desplegat && (
                <View style={{ marginTop: 10 }}>
                    <BarraDies
                        editable={false}
                        dies={rutina.diesDuracio}
                        canviaDia={(d: number) => setDia(d)}
                        currentDia={dia} />

                    <View style={{ display: "flex", flexDirection: "row", justifyContent: "space-between", marginTop: 10, width: "95%" }}>
                        <Text style={[themeStyles.text, { width: "50%", fontWeight: "bold" }]}>Exercici</Text>
                        <Text style={[themeStyles.text, { fontWeight: "bold" }]}>Repes</Text>
                        <Text style={[themeStyles.text, { fontWeight: "bold" }]}>Series</Text>
                        <Text style={[themeStyles.text, { fontWeight: "bold" }]}>%RM</Text>
                    </View>
                    {rutina.exercicis && rutina.exercicis.map((exercici, i) => {
                        if (exercici.diaRutina == dia && exercici.cicle == 0) {
                            return (
                                <View key={i} style={{ display: "flex", flexDirection: "row", justifyContent: "space-between", marginTop: 10, width: "95%" }}>
                                    <Text style={[themeStyles.text, { width: "50%" }]}>{exercici.nom}</Text>
                                    <Text style={[themeStyles.text]}>{exercici.numRepes}</Text>
                                    <Text style={[themeStyles.text]}>{exercici.numSeries}</Text>
                                    <Text style={[themeStyles.text]}>{exercici.percentatgeRM}</Text>
                                </View>
                            )
                        }
                    })}
                    <View style={{ display: "flex", flexDirection: "row", justifyContent: "space-between", marginTop: 10, width: "90%", margin: "auto" }}>
                        <Pressable
                            style={[themeStyles.buttonDanger, { width: "40%" }]}
                            onPress={() => {
                                setModalVisible(true)
                            }}>
                            <Text style={themeStyles.button1Text}>{versio == 0 ? "Eliminar" : "Acabar"}</Text>
                        </Pressable>
                        <Pressable
                            style={[themeStyles.button1, { width: "40%" }]}
                            onPress={() => {
                                if (versio == 0) {
                                    editarRutina()
                                }
                                else {
                                    canviarRutina()
                                }
                            }}>
                            <Text style={themeStyles.button1Text}>{versio == 0 ? "Editar" : "Canviar"}</Text>
                        </Pressable>
                    </View>
                </View>
            )}
            <ModalConfirmacio
                modalVisible={modalVisible}
                closeModal={() => setModalVisible(false)}
                missatge={versio == 0 ? "Estàs segur que vols eliminar la rutina?" : "Es donarà per finalitzada la rutina"}
                titol={versio == 0 ? 'Eliminar rutina' : 'Acabar rutina'}
                confirmar={() => { versio == 0 ? handleEliminarRutina() : handleAcabar() }} />
        </View>
    )
}
