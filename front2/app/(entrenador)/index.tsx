import { View, Text, Pressable } from 'react-native';
import React, { useEffect, useState } from 'react';
import { router } from 'expo-router';
import ModalAfegirUsuari from '@/components/modals/ModalAfegirUsuari';
import ViewRutina from '@/components/viewers/ViewRutina';
import { getRutinesEntrenador, selectAllRutines, selectRutinesStatus } from '@/store/rutinesSlice';
import { ScrollView } from 'react-native-gesture-handler';
import { useThemeStyles } from '@/themes/theme';
import { stringDiaToDate } from '@/helpers/timeHelpers';
import { SafeAreaView } from 'react-native-safe-area-context';
import FentEntreno from '@/components/viewers/FentEntreno';
import { useAppDispatch, useAppSelector } from '@/store/reduxHooks';
import { createAlumneFictici, getAlumnes, selectAllAlumnes } from '@/store/alumnesSlice';
import { getConfig } from '@/store/configSlice';
import { getExercicis } from '@/store/exercicisSlice';
import { getReserves, selectAllReserves } from '@/store/reservesSlice';


export default function Index() {
    const [entrenoDesplegat, setEntrenoDesplegat] = useState<null | number>(null)
    const themeStyles = useThemeStyles();
    const rutines = useAppSelector(selectAllRutines);
    const [afegirAlumneVisible, setAfegirAlumneVisible] = useState(false)
    const reserves = useAppSelector(selectAllReserves);
    const alumnes = useAppSelector(selectAllAlumnes);
    const dispatch = useAppDispatch();

    useEffect(() => {
        dispatch(getRutinesEntrenador())
        dispatch(getExercicis())
        dispatch(getAlumnes())
        dispatch(getReserves())
        dispatch(getConfig())
    }, [dispatch]);

    return (
        <SafeAreaView style={themeStyles.background}>
            <ScrollView>
                <Text style={themeStyles.titol1}>Alumnes ({alumnes.length}/12)</Text>
                <View>
                    <ScrollView style={{ maxHeight: 200, width: "85%", alignContent: "center", alignSelf: "center" }}>
                        {alumnes.map((alumne) => (
                            <Pressable key={alumne.ID} style={themeStyles.mainContainer1} onPress={() => {
                                router.push({ pathname: `../(alumnes)/${alumne.ID}` })
                            }}>
                                <Text style={themeStyles.text}>{alumne.Nom}</Text>
                            </Pressable>
                        ))}
                    </ScrollView>

                    {alumnes.length < 12 && (
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

                <View style={themeStyles.hr} />

                <View>
                    <Text style={themeStyles.titol1}>Entrenos d'avui</Text>
                    {reserves.length === 0 ? (
                        <Text style={themeStyles.text}>Avui no tens més entrenos</Text>
                    ) : (
                        reserves.map((reserva, i) => {
                            const hora: Date = stringDiaToDate(reserva.Hora);
                            const ahora: Date = new Date();
                            ahora.setHours(ahora.getHours() - 2);

                            if (hora >= ahora) {
                                return (
                                    //getUserByID(alumnes, reserva.UsuariID).Nom
                                    <FentEntreno
                                        key={i}
                                        reserva={reserva}
                                        hora={hora}
                                        desplegat={entrenoDesplegat != null && entrenoDesplegat == i}
                                        onPress={() => {
                                            setEntrenoDesplegat(i)
                                        }
                                        } />
                                );
                            }
                        })
                    )}
                </View>

                <View style={themeStyles.hr} />
                <Text style={themeStyles.titol1}>Rutines</Text>
                <View>
                    {rutines.length === 0 && <Text style={themeStyles.text}>Encara no tens cap rutina</Text>}
                    {rutines.length > 0 && rutines.map((rutina) => (
                        <ViewRutina rutinaID={rutina.ID} key={rutina.ID} />
                    ))}
                </View>

                <View>
                    <Pressable
                        style={themeStyles.button1}
                        onPress={() => {
                            router.replace("../(rutines)/crearRutina")
                        }}><Text style={themeStyles.button1Text}>Crea una rutina</Text></Pressable>
                    <Pressable
                        style={[themeStyles.button1, { marginBottom: 60 }]}
                        onPress={() => {
                            router.replace("../(rutines)/rutinesPubliques")
                        }}><Text style={themeStyles.button1Text}>Rutines públiques</Text></Pressable>
                </View>

                <ModalAfegirUsuari
                    modalVisible={afegirAlumneVisible}
                    closeModal={() => setAfegirAlumneVisible(false)}
                    crearUsuariFictici={(nom:string) => dispatch(createAlumneFictici({ nom }))} />
            </ScrollView>
        </SafeAreaView>
    )
}