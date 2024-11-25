import { Pressable, View, Text, Modal, Share } from 'react-native'
import { EvilIcons } from '@expo/vector-icons'
import { useState } from 'react'
import TextInput from '@/components/inputs/TextInput'
import { nameValidator } from '@/helpers/nameValidator'
import { useThemeStyles } from '@/themes/theme'
import CloseButton from '../buttons/CloseButton'
import { useAppSelector } from '@/store/reduxHooks'
import { useText } from '@/hooks/useText'


interface propsType {
    modalVisible: boolean
    closeModal: Function
    crearUsuariFictici: Function
}

export default function ModalAfegirUsuari(props: propsType) {
    const texts = useText();
    const auth = useAppSelector(state => state.auth);
    const themeStyles = useThemeStyles()
    const { modalVisible, closeModal, crearUsuariFictici } = props
    const [crearFictici, setCrearFictici] = useState(false)
    const [nom, setNom] = useState('')
    const [errors, setErrors] = useState({
        nom: '',
    });

    async function share() {
        try {
            const result = await Share.share({
              message: 'Convida a un usuari al grup',
                title: 'Convidar al grup',
                url: 'http://temple-app.com/join/4866331548'
            });
            if (result.action === Share.sharedAction) {
              if (result.activityType) {
                // shared with activity type of result.activityType
              } else {
                // shared
              }
            } else if (result.action === Share.dismissedAction) {
              // dismissed
            }
          } catch (error: any) {
          }
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
            style={{ height: '100%' }}
            animationType="fade"
            transparent={false}
            visible={modalVisible}
            onRequestClose={() => {
                closeModal()
            }}>
            <CloseButton
                onPress={() => closeModal()} />

            {!crearFictici ? (
                <View style={[themeStyles.background, { height: '100%' }]}>
                    <View style={{marginTop: 12}}/>
                    <Text style={themeStyles.titol1}>{texts.AddStudent}</Text>
                    <Text style={themeStyles.text}>{texts.TrainerCode}: #{auth?.user?.codiEntrenador ?? ''}</Text>
                    <Pressable
                        onPress={() => {
                            share()
                        }}
                        style={themeStyles.button1}>
                        <View style={{ display: "flex", flexDirection: "row", alignItems: "center" }}>
                            <Text style={themeStyles.button1Text}>{texts.Share}</Text>
                            <EvilIcons name="share-google" size={24} color="white" />
                        </View>
                    </Pressable>
                    <Pressable
                        onPress={() => {
                            setCrearFictici(true)
                        }}
                        style={themeStyles.button1}>
                        <Text style={themeStyles.button1Text}>{texts.CreateStudent}</Text>
                    </Pressable>
                </View>
            ) : (
                <View style={[themeStyles.background, { height: '100%' }]}>
                    <Text style={themeStyles.titol1}>{texts.CreateStudent}</Text>
                    <View style={{ width: "80%", alignSelf: "center" }}>
                        <TextInput
                            label="Nom"
                            enterKeyHint="next"
                            value={nom}
                            onChangeText={(text: string) => setNom(text)}
                            error={!!errors.nom}
                            errorText={errors.nom}
                        />
                    </View>
                    <Pressable
                        onPress={() => {
                            submit()
                        }}
                        style={themeStyles.button1}>
                        <Text style={themeStyles.button1Text}>{texts.CreateStudent}</Text>
                    </Pressable>
                </View>
            )}
        </Modal>
    )
}

