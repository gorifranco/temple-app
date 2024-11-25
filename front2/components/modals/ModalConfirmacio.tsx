import { View, Text, Modal, Pressable, StyleSheet } from 'react-native'
import { useThemeStyles } from '@/themes/theme'
import { useText } from '@/hooks/useText'

interface propsType {
    titol: string
    modalVisible: boolean
    closeModal: Function
    missatge: string
    confirmar: Function
}

export default function ModalConfirmacio(props: propsType) {
    const texts = useText();
    const { modalVisible, closeModal, missatge, confirmar, titol } = props
    const themeStyles = useThemeStyles()

    return (
        <Modal
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => {
                closeModal()
            }}>
            <Pressable style={styles.backdrop} onPress={() => closeModal()}>
                <View style={themeStyles.modalConfirmContent}>
                    <Text style={themeStyles.titol1}>{titol}</Text>
                    <Text style={themeStyles.text}>{missatge}</Text>
                    <View style={{ flexDirection: 'row', gap: 10, justifyContent: 'center' }}>
                        <Pressable style={themeStyles.buttonDanger} onPress={() => {
                            closeModal()
                        }}>
                            <Text style={themeStyles.button1Text}>{texts.Cancel}</Text>
                        </Pressable>
                        <Pressable style={themeStyles.buttonSuccess} onPress={() => {
                            confirmar()
                            closeModal()
                        }}>
                            <Text style={themeStyles.button1Text}>{texts.Confirm}</Text>
                        </Pressable>
                    </View>
                </View>
            </Pressable>

        </Modal>
    )
}

const styles = StyleSheet.create({
    backdrop: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        zIndex: 100,
    },
});