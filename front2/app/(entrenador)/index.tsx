import { View, Text, Pressable, StyleSheet } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useAxios } from '../api';
import { router } from 'expo-router';
import ModalAfegirUsuari from '@/components/modals/ModalAfegirUsuari';
import Toast from 'react-native-toast-message';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/store';
import { addAlumne, updateAlumnes } from '@/store/alumnesSlice';
import { setReserves } from '@/store/reservesSlice';
import ViewRutina from '@/components/viewers/ViewRutina';
import { updateRutines } from '@/store/rutinesSlice';
import { ScrollView } from 'react-native-gesture-handler';
import { RutinaType, ReservaType, AlumneType, ExerciciType } from '@/types/apiTypes';
import { useThemeStyles } from '@/themes/theme';
import { setExercicis } from '@/store/exercicisSlice';
import { setConfig } from '@/store/configSlice';
import { HorariType } from '@/types/apiTypes';
import { getUserByID } from '@/store/alumnesSlice';
import { stringDiaToDate } from '@/helpers/timeHelpers';
import { SafeAreaView } from 'react-native-safe-area-context';
import FentEntreno from '@/components/viewers/FentEntreno';


export default function Index() {
    const [entrenoDesplegat, setEntrenoDesplegat] = useState<null | number>(null)
    const themeStyles = useThemeStyles();
    const rutines = useSelector((state: RootState) => state.rutines);
    const rutinesArray = Object.values(rutines);
    const api = useAxios();
    const [afegirAlumneVisible, setAfegirAlumneVisible] = useState(false)
    const reserves = useSelector((state: RootState) => state.reserves);
    const reservesArray = Object.values(reserves);
    const alumnes = useSelector((state: RootState) => state.alumnes);
    const alumnesArray = Object.values(alumnes);
    const dispatch = useDispatch();

    /* dispatch(setReserves([])) */

    useEffect(() => {
        if (rutinesArray.length === 0) {
            fetchRutinesAPI()
        }
        fetchApiExercicis()
        fetchAlumnesAPI()
        fetchReservesAPI()
        fetchConfigAPI()
    }, [dispatch]);


    async function fetchRutinesAPI() {
        const response = await api.get('/rutines/rutinesEntrenador');
        if (response.status === 200) {
            const fetchedRutines: RutinaType[] = response.data.data;
            dispatch(updateRutines({ data: fetchedRutines }));
        }
    }

    async function fetchApiExercicis() {
        const response = await api.get(`exercicis`);
        if (response.status === 200) {
            const fetchedExercicis: ExerciciType[] = response.data.data;
            dispatch(setExercicis(fetchedExercicis));
        }
    }

    async function fetchConfigAPI() {
        const response = await api.get(`/configuracioEntrenador`);
        if (response.status == 200) {
            dispatch(setConfig(response.data.data));
        }
    }
    async function fetchReservesAPI() {
        const response = await api.get(`/entrenador/reserves`);
        if (response.status === 200) {
            const fetchedReserves: ReservaType[] = response.data.data;
            dispatch(setReserves(fetchedReserves));
        }
    }


    async function fetchAlumnesAPI() {
        const response = await api.get(`/entrenador/alumnes`);
        if (response.status === 200) {
            dispatch(updateAlumnes({ data: response.data.data }));
        }
    }

    async function crearUsuariFictici(nom: string) {
        const response = await api.post(`/entrenador/usuarisFicticis`, { nom });
        if (response.status === 200) {
            Toast.show({
                type: 'success',
                text1: 'Usuari creat',
                position: 'top',
            });
            const alumne: AlumneType = {
                ID: response.data.data.ID,
                Nom: response.data.data.Nom,
                Reserves: [],
                RutinaActual: 0,
                ResultatsRutinaActual: [],
                RMs: {}
            }
            dispatch(addAlumne({ id: alumne.ID, data: alumne }))
        } else {
            Toast.show({
                type: 'error',
                text1: 'Error creant l\'usuari',
                position: 'top',
            });
        }
    }

    /*     async function crearSala() {
            let nomSalaError = nomSalaValidator(nomSala)
            if (nomSalaError) {
                setErrors({ ...errors, nomSala: nomSalaError })
                return
            }
            let response = await api.post('/sales', { nom: nomSala });
            if (response.status === 200) {
                setCrearSalaVisible(false)
                Toast.show({
                    type: 'success',
                    text1: 'Sala creada',
                    position: 'top',
                });
                // getSales()
            } else {
                setCrearSalaVisible(false)
                Toast.show({
                    type: 'error',
                    text1: 'Error creant la sala',
                    position: 'top',
                });
            }
        } */


    return (
        <SafeAreaView style={themeStyles.background}>
            <ScrollView>
                <Text style={themeStyles.titol1}>Alumnes ({!alumnesArray ? '0' : alumnesArray.length}/12)</Text>
                <View>
                    <ScrollView style={{ maxHeight: 200, width: "85%", alignContent: "center", alignSelf: "center" }}>
                        {alumnesArray && alumnesArray.map((alumne) => (
                            <Pressable key={alumne.ID} style={themeStyles.mainContainer1} onPress={() => {
                                router.push({ pathname: `../(alumnes)/${alumne.ID}` })
                            }}>
                                <Text style={themeStyles.text}>{alumne.Nom}</Text>
                            </Pressable>
                        ))}
                    </ScrollView>

                    {!alumnesArray || alumnesArray.length < 12 && (
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
                    {!reserves || reservesArray.length === 0 ? (
                        <Text style={themeStyles.text}>Avui no tens més entrenos</Text>
                    ) : (
                        reservesArray.map((reserva, i) => {
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


                {/*
            <Text style={themeStyles.titol1}>Sales ({sales.length}/3)</Text>

             <View>
                {sales.map((sala) => (
                    <Pressable key={sala.ID} style={styles.salaContainer} onPress={() => {
                        router.push({pathname: `../(sales)/${sala.ID}`})
                    }}>
                            <Text style={styles.text}>{sala.Nom}</Text>
                    </Pressable>
                ))}
                {sales.length < 3 && (<Pressable
                    style={themeStyles.button1}
                    onPress={() => {
                        setCrearSalaVisible(true)
                    }}
                >
                    <Text style={styles.buttonText}>Crear sala</Text>
                </Pressable>)}
            </View>
             */}

                <View style={themeStyles.hr} />
                <Text style={themeStyles.titol1}>Rutines</Text>
                <View>
                    {rutinesArray.length === 0 && <Text style={themeStyles.text}>Encara no tens cap rutina</Text>}
                    {rutinesArray.length > 0 && rutinesArray.map((rutina) => (
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
                    crearUsuariFictici={crearUsuariFictici} />
            </ScrollView>
        </SafeAreaView>
    )
}