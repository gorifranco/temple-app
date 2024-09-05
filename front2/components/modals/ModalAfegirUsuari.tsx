import { Pressable, View, Text, Modal, StyleSheet } from 'react-native'
import { AntDesign, EvilIcons } from '@expo/vector-icons'
import { themeStyles } from '@/themes/theme'
import { useState, useContext } from 'react'
import TextInput from '@/components/inputs/TextInput'
import { nameValidator } from '@/helpers/nameValidator'
import AuthContext, { AuthContextType } from '@/app/AuthContext'
import { Redirect } from 'expo-router';

interface propsType {
    modalVisible: boolean
    closeModal: Function
    compartir: Function
    crearUsuariFictici: Function
}

export default function ModalAfegirUsuari(props: propsType) {
    const { modalVisible, closeModal, compartir, crearUsuariFictici } = props
    const [crearFictici, setCrearFictici] = useState(false)
    const [nom, setNom] = useState('')
    const [errors, setErrors] = useState({
        nom: '',
    });
    const authContext = useContext<AuthContextType | undefined>(AuthContext);

    if (!authContext) {
        throw new Error("AuthProvider is missing. Please wrap your component tree with AuthProvider.");
    }

    const { user } = authContext;
    if (!user) {
        return <Redirect href="/(auth)" />
    }


    function submit() {
        const nameError = nameValidator(nom)
        if (nameError) {
            setErrors({
                nom: nameError,
            })
            return
        }
        setNom('')
        crearUsuariFictici(nom)
        closeModal()
    }


    return (
        <Modal
            style={{ overflow: 'hidden' }}
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
                    <Text style={themeStyles.titol1}>Afegir alumne</Text>
                    <Text style={themeStyles.text}>Codi d'entrenador: #{user.codiEntrenador}</Text>
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
                        <Text style={themeStyles.button1Text}>Crear alumne</Text>
                    </Pressable>
                </View>
            ) : (
                <View>
                    <Text style={themeStyles.titol1}>Crear alumne</Text>
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
                        <Text style={themeStyles.button1Text}>Crear alumne</Text>
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