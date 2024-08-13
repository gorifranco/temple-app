import { Pressable, View, Text } from 'react-native'
import { Modal } from 'react-native'
import { AntDesign } from '@expo/vector-icons'
import { EvilIcons } from '@expo/vector-icons'
import { themeStyles } from '@/themes/theme'
import { StyleSheet } from 'react-native'
import { useState } from 'react'
import { SalaType } from '../types/apiTypes'
import TextInput from './TextInput'
import { nameValidator } from '../helpers/nameValidator'

interface propsType {
    modalVisible: boolean
    closeModal: Function
    compartir: Function
    sala: SalaType
    crearUsuariFictici: Function
}

export default function ModalAfegirUsuari(props: propsType) {
    const { modalVisible, closeModal, compartir, sala, crearUsuariFictici } = props
    const [crearFictici, setCrearFictici] = useState(false)
    const [nom, setNom] = useState('')
    const [errors, setErrors] = useState({
        nom: '',
    });

    function submit() {
        const nameError = nameValidator(nom)
        if (nameError) {
            setErrors({
                nom: nameError,
            })
            return
        }

        crearUsuariFictici()
        closeModal()
    }


    return (
        <Modal
        style={{overflow: 'hidden'}}
            animationType="fade"
            transparent={false}
            visible={modalVisible}
            onRequestClose={() => {
                closeModal()
            }}>
            <View style={styles.closeButton}>
                <Pressable
                    onPress={() => {
                        closeModal()
                    }}>
                    <AntDesign name="close" size={24} color="black" />
                </Pressable>
            </View>

            {!crearFictici ? (
                <View>
                    <Text style={themeStyles.titol1}>Crear usuari</Text>
                    <Text style={themeStyles.text}>Codi del grup: #{sala.CodiSala}</Text>
                    <Pressable
                        onPress={() => {
                            compartir()
                        }}
                        style={themeStyles.button1}>
                        <View style={{ display: "flex", flexDirection: "row", alignItems: "center" }}>
                            <Text style={themeStyles.button1Text}>Compartir  </Text>
                            <EvilIcons name="share-google" size={24} color="white" />
                        </View>
                    </Pressable>
                    <Pressable
                        onPress={() => {
                            setCrearFictici(true)
                        }}
                        style={themeStyles.button1}>
                        <Text style={themeStyles.button1Text}>Crear usuari</Text>
                    </Pressable>
                </View>
            ) : (
                <View>
                    <Text style={themeStyles.titol1}>Crear usuari</Text>
                    <TextInput
                        style={themeStyles.inputContainer}
                        label="Nom"
                        returnKeyType="next"
                        value={nom}
                        onChangeText={(text: string) => setNom(text)}
                        error={!!errors.nom}
                        errorText={errors.nom}
                    />
                    <Pressable
                        onPress={() => {
                            submit()
                        }}
                        style={themeStyles.button1}>
                        <Text style={themeStyles.button1Text}>Crear usuari</Text>
                    </Pressable>
                </View>
            )}
        </Modal>
    )
}


const styles = StyleSheet.create({
    closeButton: {
        position: 'absolute',
        top: 25,
        left: 25,
        width: 50, 
        height: 50,  
        zIndex: 100, 
        justifyContent: 'center',
        alignItems: 'center', 
    },
});