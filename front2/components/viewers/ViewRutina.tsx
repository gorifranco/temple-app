import { RutinaType } from '@/types/apiTypes'
import { View, Text, Pressable } from 'react-native'
import React, { useState } from 'react'
import { StyleSheet } from 'react-native'
import FletxaDesplegar from '@/components/icons/FletxaDesplegar'
import BarraDies from '../BarraDies'
import ModalConfirmacio from '../modals/ModalConfirmacio'
import { useAxios } from '@/app/api'
import Toast from 'react-native-toast-message'
import { deleteRutina } from '@/store/rutinesSlice'
import { useDispatch } from 'react-redux'
import { RootState } from '@/store'
import { useSelector } from 'react-redux'
import { router } from 'expo-router'
import { useThemeStyles } from '@/themes/theme'
import { getExerciciByID } from '@/store/exercicisSlice'


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
    const rutina = useSelector((state: RootState) => state.rutines[rutinaID])
    const api = useAxios();
    const dispatch = useDispatch();
    const exercicis = useSelector((state: RootState) => state.exercicis);

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

    async function eliminarRutina() {
        const response = await api.delete(`/rutines/${rutina.ID}`)
        if (response.status === 200) {
            Toast.show({
                type: 'success',
                text1: 'Rutina eliminada',
                position: 'top',
            });
            dispatch(deleteRutina({ id: rutina.ID }))
        } else {
            Toast.show({
                type: 'error',
                text1: 'Error eliminant la rutina',
                position: 'top',
            });
        }
    }

    return (
        <View key={rutina.ID} style={themeStyles.mainContainer1}>
            <View style={{ display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "space-between", position: "relative" }}>
                <Text style={themeStyles.text}>{rutina.Nom}</Text>
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
                        <Text style={[themeStyles.text, { width: "50%", fontWeight: "bold" }]}>Exercici</Text>
                        <Text style={[themeStyles.text, { fontWeight: "bold" }]}>Repes</Text>
                        <Text style={[themeStyles.text, { fontWeight: "bold" }]}>Series</Text>
                        <Text style={[themeStyles.text, { fontWeight: "bold" }]}>%RM</Text>
                    </View>
                    {rutina.Exercicis && rutina.Exercicis.map((exercici, i) => {
                        if (exercici.DiaRutina == dia && exercici.Cicle == 0) {
                            const e = exercici.ExerciciID ? getExerciciByID(exercicis, exercici.ExerciciID) : null;
                            return (
                                <View key={i} style={{ display: "flex", flexDirection: "row", justifyContent: "space-between", marginTop: 10, width: "95%" }}>
                                    {e != null && <Text style={[themeStyles.text, { width: "50%" }]}>{e.Nom}</Text>}
                                    <Text style={[themeStyles.text]}>{exercici.NumRepes}</Text>
                                    <Text style={[themeStyles.text]}>{exercici.NumSeries}</Text>
                                    <Text style={[themeStyles.text]}>{exercici.PercentatgeRM}</Text>
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
                confirmar={() => { versio == 0 ? eliminarRutina() : handleAcabar() }} />
        </View>
    )
}
