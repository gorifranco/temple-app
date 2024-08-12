import { View, Text } from 'react-native';
import React, { useEffect, useState } from 'react';
import { themeStyles } from '../../themes/theme';
import { useAxios } from '../api';
import * as types from '../../types/apiTypes';
import { StyleSheet } from 'react-native'
import { Checkbox } from 'react-native-paper';
import BackButton from '../../components/BackButton';
import { Link } from 'expo-router';


export default function RutinesPubliques() {
    const api = useAxios();
    const [rutines, setRutines] = useState<types.RutinaType[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(false)

    async function getRutines() {
        let response = await api.get('/rutines/rutinesPubliques')
        console.log(response)
        if (response.status !== 200) {
            setError(true)
        } else {
            setRutines(response.data.data)
        }
        setLoading(false)
    }

    useEffect(() => {
        getRutines()
    }, [])

    if (error) {
        return (
            <View>
                <Text style={themeStyles.titol1}>No s'han trobat rutines</Text>
            </View>
        )
    }
    if (!error && loading) {
        return (
            <View>
                <Text style={themeStyles.titol1}>Carregant rutines</Text>
            </View>
        )
    }
    if (!error && !loading) {
        return (
            <View style={styles.container}>
                <BackButton href={"/(entrenador)"} />
                <Text style={themeStyles.titol1}>Rutines públiques</Text>

                {rutines.map((rutina) => (
                    <View key={rutina.ID} style={styles.rutinaContainer}>
                        <Checkbox status="checked" />
                        <Text>{rutina.Nom}</Text>
                        <Text>{rutina.Descripcio}</Text>
                    </View>
                ))}
            </View>
        )
    }
}

const styles = StyleSheet.create({
    rutinaContainer: {
        margin: 20,
        borderWidth: 1,
        borderColor: "black",
        padding: 10,
        borderRadius: 10,
    },
    container: {
        width: '100%',
        flex: 1,
        overflow: 'hidden',
    }
})