import { themeStyles } from '@/themes/theme'
import { View, Text, Modal, Pressable } from 'react-native'

interface propsType {
    modalVisible: boolean
    closeModal: Function
    missatge: string
    confirmar: Function
}

export default function ModalConfirmacio(props: propsType) {
    const { modalVisible, closeModal, missatge, confirmar } = props

    return (
        <Modal
        style={{ overflow: 'hidden' }}
        animationType="fade"
        transparent={false}
        visible={modalVisible}
        onRequestClose={() => {
            closeModal()
        }}>
            <View>
                <Text style={themeStyles.text}>{missatge}</Text>
                <Pressable style={themeStyles.buttonWarning} onPress={() => {
                    closeModal()
                }}>
                    <Text style={themeStyles.button1Text}>Cancelar</Text>
                </Pressable>
                <Pressable style={themeStyles.buttonSuccess} onPress={() => {
                    confirmar()
                    closeModal()
                }}>
                    <Text style={themeStyles.button1Text}>Confirmar</Text>
                </Pressable>
                
            </View>
        </Modal>

    )
}