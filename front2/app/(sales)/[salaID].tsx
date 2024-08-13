import { View, Text } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useLocalSearchParams } from 'expo-router'
import { themeStyles } from '@/themes/theme'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { useAxios } from '../api'
import { useDispatch, useSelector } from 'react-redux'
import { setSales, updateSala } from '../../store/salesSlice'
import { RootState } from '../../store'
import { SalaType, UsuariType } from '../../types/apiTypes'
import BackButton from '@/components/BackButton'
import { Pressable } from 'react-native'
import ModalAfegirUsuari from '@/components/ModalAfegirUsuari'
import { StyleSheet } from 'react-native'
import { Modal } from 'react-native-paper'


export default function Index() {
    const { salaID } = useLocalSearchParams();
    const api = useAxios();
    const dispatch = useDispatch();
    const [modalVisible, setModalVisible] = useState(false)
    const [crearFictici, setCrearFictici] = useState(false)

    // Obtén la sala desde el estado global (Redux)
    const sala = useSelector((state: RootState) => state.sales[Number(salaID)]);

    useEffect(() => {
        fetchSalas();
        fetchApi();
    }, [dispatch, salaID]);

    // Cargar las salas desde AsyncStorage al inicializar
    async function fetchSalas() {
        const salesData = await AsyncStorage.getItem('sales');
        if (salesData) {
            dispatch(setSales(JSON.parse(salesData)));
        }
    }

    // Sincronizar la sala desde el servidor
    async function fetchApi() {
        const response = await api.get(`/sales/${salaID}`);
        if (response.status === 200) {
            const fetchedSala: SalaType = response.data.data;
            if (!sala || sala.ID !== fetchedSala.ID) {
                dispatch(updateSala({ id: Number(salaID), data: fetchedSala }));
            }
        }
    }

    function convidarUsuari() {

    }

    function crearUsuariFictici() {

    }

    function compartir() {
    }


    if (!sala) {
        return (
            <View>
                <BackButton href={"../"} />
                <Text style={themeStyles.titol1}>Carregant la sala</Text>
            </View>
        );
    }

    return (
        <View style={{overflow: 'hidden'}}>
            <BackButton href={"../"} />
            <Text style={themeStyles.titol1}>{sala.Nom}</Text>

            <Text style={themeStyles.titol1}>Pupilos</Text>

            {!sala.Usuaris ? (
                <Text style={themeStyles.text}>No hi ha usuaris al grup</Text>
            ) : (
                sala.Usuaris.map((usuari: UsuariType) => (
                    <View key={usuari.ID} style={styles.usuariContainer}>
                        <Text>{usuari.Nom}</Text>
                        <Text>{usuari.Email}</Text>
                    </View>
                ))
            )}

            <Pressable style={themeStyles.button1} onPress={() => {
                setModalVisible(true)
            }}>
                <Text style={themeStyles.button1Text}>Afegir usuari</Text>
            </Pressable>
            <ModalAfegirUsuari
                modalVisible={modalVisible}
                closeModal={() => setModalVisible(false)}
                compartir={() => compartir()}
                sala={sala}
                crearUsuariFictici={() => crearUsuariFictici()} />
        </View >
    );
}

const styles = StyleSheet.create({
    usuariContainer: {
        margin: 20,
        borderWidth: 1,
        borderColor: "black",
        padding: 10,
        borderRadius: 10,
    }
});