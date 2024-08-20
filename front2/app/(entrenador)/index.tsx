import { View, Text, Pressable } from 'react-native';
import React, { useEffect, useState } from 'react';
import { StyleSheet } from 'react-native'
import { useAxios } from '../api';
import * as types from '../../types/apiTypes';
import { router } from 'expo-router';
import { themeStyles } from '@/themes/theme';
import ModalAfegirUsuari from '@/components/ModalAfegirUsuari';
import Toast from 'react-native-toast-message';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useDispatch } from 'react-redux';
import { setAlumne, updateAlumnes } from '../../store/slices';
import { AlumneType } from '../../types/apiTypes';

export default function Index() {
    //const [sales, setSales] = useState<types.SalaType[]>([])
    const [rutines, setRutines] = useState<types.RutinaType[]>([])
    const api = useAxios();
    // const [crearSalaVisible, setCrearSalaVisible] = useState(false)
    const [afegirAlumneVisible, setAfegirAlumneVisible] = useState(false)

    const alumnes = useSelector((state: RootState) => state.alumnes);
    const alumnesArray = Object.values(alumnes);

    const dispatch = useDispatch();

    useEffect(() => {
        getRutines()
        fetchAlumnes()
        fetchAlumnesAPI()
    }, [dispatch]);


    /*     async function getSales() {
            let response = await api.get('/sales/salesEntrenador')
            setSales(response.data.data)
        } */

    async function getRutines() {
        let response = await api.get('/rutines/rutinesEntrenador')
        setRutines(response.data.data)
    }

    async function fetchAlumnes() {
        const alumnesData = await AsyncStorage.getItem('alumnes');
        if (alumnesData) {
            dispatch(setAlumne(JSON.parse(alumnesData)));
        }
    }

    async function fetchAlumnesAPI() {
        const response = await api.get(`/entrenador/alumnes`);
        if (response.status === 200) {
            const fetchedAlumnes: AlumneType[] = response.data.data;
            dispatch(updateAlumnes({ data: fetchedAlumnes }));

        }
    }


    function compartir() {
    }

    async function crearUsuariFictici(nom: string) {
        const response = await api.post(`/entrenador/usuarisFicticis`, { nom });
        if (response.status === 200) {
            fetchAlumnesAPI()
            Toast.show({
                type: 'success',
                text1: 'Usuari creat',
                position: 'top',
            });
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
        <View>
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

            {rutines.length === 0 ? (
                <View>
                    <Pressable
                        style={themeStyles.button1}
                        onPress={() => {
                            router.replace("../(rutines)/crearRutina")
                        }}><Text style={styles.buttonText}>Crea una rutina</Text></Pressable>
                    <Pressable
                        style={themeStyles.button1}
                        onPress={() => {
                            router.replace("../(rutines)/rutinesPubliques")
                        }}><Text style={styles.buttonText}>Rutines públiques</Text></Pressable>
                </View>
            ) : (
                <View>
                    {rutines.map((rutina) => (
                        <View key={rutina.ID} style={styles.rutinaContainer}>
                            <Text>{rutina.Nom}</Text>
                            <Text>{rutina.Descripcio}</Text>
                        </View>
                    ))}
                </View>
            )}

            <ModalAfegirUsuari
                modalVisible={afegirAlumneVisible}
                closeModal={() => setAfegirAlumneVisible(false)}
                compartir={compartir}
                crearUsuariFictici={crearUsuariFictici} />
        </View>
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
        margin: 20,
        borderWidth: 1,
        borderColor: "black",
        padding: 10,
        borderRadius: 10,
    },
    modal: {
        padding: 20,
        alignSelf: 'center',
        alignItems: 'center',
        justifyContent: 'center',
    }
})