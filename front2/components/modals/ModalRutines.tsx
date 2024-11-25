import { View, Text, Modal, Pressable, StyleSheet, ScrollView } from 'react-native'
import { useState } from 'react'
import AutocompleteRutines from '@/components/inputs/selects/AutocompleteRutines'
import { AntDesign } from '@expo/vector-icons'
import { useThemeStyles } from '@/themes/theme'
import { useText } from '@/hooks/useText'

interface propsType {
    modalVisible: boolean
    closeModal: Function
}

export default function ModalRutines(props: propsType) {
    const texts = useText();
    const themeStyles = useThemeStyles()
    const { modalVisible, closeModal } = props
    const [rutinaSeleccionada, setRutinaSeleccionada] = useState<number | null>(null)

    async function assignarRutina() {

    }


    return (
            <Modal
                animationType="fade"
                transparent={false}
                visible={modalVisible}
                onRequestClose={() => {
                    closeModal()
                }}>
                <Text style={[themeStyles.titol1, { marginTop: 75 }]}></Text>
                <View style={styles.closeButton}>
                    <Pressable
                        onPress={() => {
                            closeModal()
                        }}>
                        <AntDesign name="close" size={24} color="black" />
                    </Pressable>
                </View>
                <ScrollView style={{ marginTop: 15, width: "80%", marginHorizontal: "auto", marginVertical: 0 }} keyboardShouldPersistTaps="handled">
                    <AutocompleteRutines
                        onSubmit={(id: number) => setRutinaSeleccionada(id)}
                    />
                </ScrollView>

                <Pressable
                    style={themeStyles.button1}
                    onPress={() => {
                        closeModal()
                    }}>
                    <Text style={themeStyles.button1Text}>{texts.AssignRoutine}</Text>
                </Pressable>
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
