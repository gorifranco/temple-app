import { View, Text, Pressable } from 'react-native';
import React, { useEffect, useState } from 'react';
import { StyleSheet } from 'react-native'
import { nomSalaValidator } from '../../helpers/validators';
import { useAxios } from '../api';
import Toast from 'react-native-toast-message';
import { theme } from '../../themes/theme';
import * as types from '../../types/apiTypes';
import { router } from 'expo-router';
import { Modal } from 'react-native';
import TextInput from '@/components/TextInput';

export default function Index() {
    const [nomSala, setNomSala] = useState('')
    const [errors, setErrors] = useState({
        nomSala: '',
    });
    const [sales, setSales] = useState<types.SalaType[]>([])
    const [rutines, setRutines] = useState<types.RutinaType[]>([])
    const api = useAxios();
    const [crearSalaVisible, setCrearSalaVisible] = useState(false)

    useEffect(() => {
        getSales()
        getRutines()
    }, [])

    async function getSales() {
        let response = await api.get('/sales/salesEntrenador')
        setSales(response.data.data)
    }

    async function getRutines() {
        let response = await api.get('/rutines/rutinesEntrenador')
        setRutines(response.data.data)
    }

    async function crearSala() {
        let nomSalaError = nomSalaValidator(nomSala)
        if (nomSalaError) {
            setErrors({ ...errors, nomSala: nomSalaError })
            return
        }
        let response = await api.post('/sales', { nom: nomSala });
        if (response.status === 200) {
            Toast.show({
                type: 'success',
                text1: 'Sala creada',
                position: 'top',
            });
            getSales()
        } else {
            Toast.show({
                type: 'error',
                text1: 'Error creant la sala',
                position: 'top',
            });
        }
    }

    return (
        <View style={styles.text}>
            <Text style={styles.titol}>Sales ({sales.length}/3)</Text>

            <View>
                {sales.map((sala) => (
                    <View key={sala.ID} style={styles.salaContainer}>
                        <Text>{sala.Nom} - {sala.CodiSala}</Text>
                        {!sala.Usuaris && <Text>Afegeix usuaris</Text>}
                        {sala.Usuaris && sala.Usuaris.map((usuari) => (
                            <View key={usuari.ID}>
                                <Text>{usuari.Nom}</Text>
                                <Text>{usuari.Email}</Text>
                            </View>
                        ))}
                    </View>
                ))}
                {sales.length < 3 && (<Pressable
                    style={styles.button}
                    onPress={() => {
                        setCrearSalaVisible(true)
                    }}
                >
                    <Text style={styles.buttonText}>Crear sala</Text>
                </Pressable>)}
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
            <Text style={styles.titol}>Rutines</Text>

            {rutines.length === 0 ? (
                <View>
                    <Pressable
                        style={styles.button}
                        onPress={() => {
                            //RutaCrearRutina
                        }}><Text style={styles.buttonText}>Crea la teva primera rutina</Text></Pressable>
                    <Pressable
                        style={styles.button}
                        onPress={() => {
                            router.replace("../(rutines)/rutinesPubliques")
                        }}><Text style={styles.buttonText}>Rutines publiques</Text></Pressable>
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
            <Modal
            animationType="fade"
            transparent={false}
            visible={crearSalaVisible}
            onRequestClose={() => {
                setCrearSalaVisible(false)
            }}
            >
                <View style={styles.modal}>
                    <Text style={styles.titol}>Crear sala</Text>
                    <TextInput
                        label="Nom"
                        returnKeyType="done"
                        value={nomSala}
                        onChangeText={(text:string) => setNomSala(text)}
                        error={!!errors.nomSala}
                        errorText={errors.nomSala}
                        autoCapitalize="none"
                    />
                        <Pressable
                            onPress={() => {
                                crearSala()
                                setCrearSalaVisible(false)
                            }}
                            style= {styles.button}
    >
                                <Text style={styles.buttonText}>Crear sala</Text>
                        </Pressable>
                    </View>
            </Modal>
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
    button: {
        backgroundColor: theme.colors.primary,
        padding: 10,
        paddingHorizontal: 20,
        borderRadius: 10,
        marginTop: 20,
        alignSelf: 'center',
    },
    buttonText: {
        color: 'white',
        fontSize: 15,
    },
    text: {
        fontSize: 15,
        lineHeight: 21,
        textAlign: 'center',
        marginBottom: 12,
        color: "black",
    },
    salaContainer: {
        margin: 20,
        borderWidth: 1,
        borderColor: "black",
        padding: 10,
        borderRadius: 10,
    },
    titol: {
        fontSize: 25,
        marginTop: 20,
        color: 'black',
        textAlign: 'center',
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