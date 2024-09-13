import { View, Text, Modal, Pressable } from 'react-native'
import { useThemeStyles } from '@/themes/theme'

interface propsType {
    titol: string
    modalVisible: boolean
    closeModal: Function
    missatge: string
    confirmar: Function
}

export default function ModalConfirmacio(props: propsType) {
    const { modalVisible, closeModal, missatge, confirmar, titol } = props
    const themeStyles = useThemeStyles()

    return (
        <Modal
            style={{ overflow: 'hidden' }}
            transparent={false}
            visible={modalVisible}
            onRequestClose={() => {
                closeModal()
            }}>
            <View style={{marginTop: 20}}>
                <Text style={themeStyles.titol1}>{titol}</Text>
                <Text style={themeStyles.text}>{missatge}</Text>
                <View style={{ flexDirection: 'row', gap: 10, justifyContent: 'center' }}>
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
            </View>
        </Modal>
    )
}