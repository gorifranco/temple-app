import { View, Text, Pressable } from 'react-native';
import React, { useEffect, useState } from 'react';
import { StyleSheet } from 'react-native'
import { useAxios } from '../api';
import * as types from '../../types/apiTypes';
import { router } from 'expo-router';
import { themeStyles } from '@/themes/theme';
import ModalAfegirUsuari from '@/components/modals/ModalAfegirUsuari';
import Toast from 'react-native-toast-message';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useDispatch } from 'react-redux';
import { addAlumne, updateAlumnes } from '@/store/alumnesSlice';
import { setReserves, updateReserves } from '@/store/reservesSlice';
import { AlumneType } from '../../types/apiTypes';
import ViewRutina from '@/components/viewers/ViewRutina';
import { updateRutines } from '@/store/rutinesSlice';
import { ScrollView } from 'react-native-gesture-handler';
import { RutinaType } from '@/types/apiTypes';

export default function Index() {
    const rutines = useSelector((state: RootState) => state.rutines);
    const rutinesArray = Object.values(rutines);
    const api = useAxios();
    const [afegirAlumneVisible, setAfegirAlumneVisible] = useState(false)
    const reserves = useSelector((state: RootState) => state.reserves);
    const reservesArray = Object.values(reserves);
    const alumnes = useSelector((state: RootState) => state.alumnes);
    const alumnesArray = Object.values(alumnes);
    const dispatch = useDispatch();

    useEffect(() => {
        if (rutinesArray.length === 0) {
            fetchRutinesAPI()
        }
            fetchAlumnesAPI()
        fetchReserves()
        fetchReservesAPI()
    }, [dispatch]);

    async function fetchRutinesAPI() {
        const response = await api.get('/rutines/rutinesEntrenador');
        if (response.status === 200) {
            const fetchedRutines: RutinaType[] = response.data.data;
            dispatch(updateRutines({ data: fetchedRutines }));
        }
    }


    async function fetchReserves() {
        const reservesData = await AsyncStorage.getItem('reserves');
        if (reservesData) {
            dispatch(setReserves(JSON.parse(reservesData)));
        }
    }

    async function fetchReservesAPI() {
        const response = await api.get(`/entrenador/reserves`);
        if (response.status === 200) {
            const fetchedReserves: types.ReservaType[] = response.data.data;
            dispatch(updateReserves({ data: fetchedReserves }));

        }
    }


    async function fetchAlumnesAPI() {
        const response = await api.get(`/entrenador/alumnes`);
        if (response.status === 200) {
            const fetchedAlumnes = response.data.data;
            let alumnesArray: AlumneType[] = [];
            fetchedAlumnes.forEach((alumne:any) => {
                alumnesArray.push({
                    ID: alumne.ID,
                    Nom: alumne.Nom,
                    Entrenos: alumne.Entrenos,
                    Reserves: alumne.Reserves,
                    RutinaAssignada: alumne.RutinaActual
                })
            });

            dispatch(updateAlumnes({ data: alumnesArray }));
        }
    }


    function compartir() {
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
                Entrenos: [],
                Reserves: [],
                RutinaAssignada: null
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
        <ScrollView>
            <Text style={themeStyles.titol1}>Alumnes ({!alumnesArray ? '0' : alumnesArray.length}/12)</Text>
            <View>
                {alumnesArray && alumnesArray.map((alumne) => (
                    <Pressable key={alumne.ID} style={styles.salaContainer} onPress={() => {
                        router.push({ pathname: `../(alumnes)/${alumne.ID}` })
                    }}>
                        <Text style={styles.text}>{alumne.Nom}</Text>
                    </Pressable>
                ))}

                {!alumnesArray || alumnesArray.length < 12 && (
                    <Pressable
                        style={themeStyles.button1}
                        onPress={() => {
                            setAfegirAlumneVisible(true)
                        }}
                    >
                        <Text style={styles.buttonText}>Afegeix un alumne</Text>
                    </Pressable>
                )}
            </View>

            <View
                style={{
                    borderBottomColor: 'black',
                    borderBottomWidth: StyleSheet.hairlineWidth,
                    width: '80%',
                    marginTop: 20,
                    alignSelf: 'center',
                }}
            />

            <View>
                <Text style={themeStyles.titol1}>Entrenos d'avui</Text>
                {!reserves || reservesArray.length === 0 ? (
                    <Text style={themeStyles.text}>Avui no tens més entrenos</Text>
                ) : (
                    reservesArray.map((reserva) => (
                        <View key={reserva.ID} style={styles.rutinaContainer}>
                            <Text>{reserva.Usuari.Nom}</Text>
                            <Text>{reserva.Hora.toLocaleTimeString()}</Text>
                        </View>
                    ))
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

            <View
                style={{
                    borderBottomColor: 'black',
                    borderBottomWidth: StyleSheet.hairlineWidth,
                    width: '80%',
                    marginTop: 20,
                    alignSelf: 'center',
                }}
            />
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
                    }}><Text style={styles.buttonText}>Crea una rutina</Text></Pressable>
                <Pressable
                    style={[themeStyles.button1, { marginBottom: 20 }]}
                    onPress={() => {
                        router.replace("../(rutines)/rutinesPubliques")
                    }}><Text style={styles.buttonText}>Rutines públiques</Text></Pressable>
            </View>

            <ModalAfegirUsuari
                modalVisible={afegirAlumneVisible}
                closeModal={() => setAfegirAlumneVisible(false)}
                compartir={compartir}
                crearUsuariFictici={crearUsuariFictici} />
        </ScrollView>
    )
}


const styles = StyleSheet.create({
    primeraSala: {
        fontSize: 20,
        marginTop: 20,
        color: 'black',
        textAlign: 'center',
    },
    salaInput: {
        width: '80%',
        margin: "auto",
    },
    buttonText: {
        color: 'white',
        fontSize: 15,
    },
    text: {
        fontSize: 15,
        lineHeight: 21,
        textAlign: 'center',
        color: "black",
    },
    salaContainer: {
        margin: 20,
        borderWidth: 1,
        borderColor: "black",
        padding: 10,
        borderRadius: 10,
    },
    rutinaContainer: {
        marginVertical: 20,
        marginHorizontal: "auto",
        borderWidth: 1,
        borderColor: "black",
        padding: 10,
        borderRadius: 10,
        width: '80%',
    },
    modal: {
        padding: 20,
        alignSelf: 'center',
        alignItems: 'center',
        justifyContent: 'center',
    }
})