import { createAlumneFictici, selectAllAlumnes, selectAlumnesStatus } from '@/store/alumnesSlice';  
import { useAppDispatch, useAppSelector } from '@/store/reduxHooks';
import { useThemeStyles } from '@/themes/theme';
import { router } from 'expo-router';
import React, { useState } from 'react'
import { View, Text, ScrollView, Pressable } from 'react-native'
import ModalAfegirUsuari from '../modals/ModalAfegirUsuari';
import { actions, status as st } from '@/types/apiTypes';


export default function AlumnesList() {
    const [afegirAlumneVisible, setAfegirAlumneVisible] = useState(false)
    const alumnes = useAppSelector(selectAllAlumnes);
    const statusAlumnes = useAppSelector(selectAlumnesStatus)
    const themeStyles = useThemeStyles();
    const dispatch = useAppDispatch();

    return (
        <View>
            <Text style={themeStyles.titol1}>Alumnes ({alumnes.length}/12)</Text>
            <View>
                {statusAlumnes[actions.index] == st.failed && <Text style={themeStyles.text}>Error al recuperar alumnes</Text>}
                {statusAlumnes[actions.index] == st.pending && <Text style={themeStyles.text}>Carregant alumnes</Text>}
                {statusAlumnes[actions.index] == st.succeeded && alumnes.length === 0 && <Text style={themeStyles.text}>Encara no tens alumnes</Text>}
                {statusAlumnes[actions.index] == st.succeeded && alumnes.length > 0 && (
                    <ScrollView style={{ maxHeight: 200, width: "85%", alignContent: "center", alignSelf: "center" }}>
                        {alumnes.map((alumne, i) => (
                            <Pressable key={i} style={themeStyles.mainContainer1} onPress={() => {
                                router.push({ pathname: `../(alumnes)/${alumne.id}` })
                            }}>
                                <Text style={themeStyles.text}>{alumne.nom}</Text>
                            </Pressable>
                        ))}
                    </ScrollView>
                )}

                {statusAlumnes[actions.index] === st.succeeded && alumnes.length < 12 && (
                    <Pressable
                        style={themeStyles.button1}
                        onPress={() => {
                            setAfegirAlumneVisible(true)
                        }}
                    >
                        <Text style={themeStyles.button1Text}>Afegeix un alumne</Text>
                    </Pressable>
                )}
            </View>
            <ModalAfegirUsuari
                    modalVisible={afegirAlumneVisible}
                    closeModal={() => setAfegirAlumneVisible(false)}
                    crearUsuariFictici={(nom:string) => dispatch(createAlumneFictici({ nom }))} />
        </View>
    )
}