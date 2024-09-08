import { View, Text, Modal, Pressable, StyleSheet, ScrollView } from 'react-native'
import { useState } from 'react'
import { themeStyles } from '@/themes/theme'
import AutocompleteRutines from '@/components/inputs/selects/AutocompleteRutines'
import { AntDesign } from '@expo/vector-icons'
import { AutocompleteDropdownContextProvider } from 'react-native-autocomplete-dropdown'


interface propsType {
    modalVisible: boolean
    closeModal: Function
}

export default function ModalRutines(props: propsType) {
    const { modalVisible, closeModal } = props
    const [rutinaSeleccionada, setRutinaSeleccionada] = useState<number | null>(null)

    async function assignarRutina() {

    }


    return (
        <AutocompleteDropdownContextProvider>
            <Modal
              presentationStyle="overFullScreen"
            style={{height: '100%'}}
                animationType="fade"
                transparent={false}
                visible={modalVisible}
                onRequestClose={() => {
                    closeModal()
                }}>
                    <Text style={[themeStyles.titol1, { marginTop: 75 }]}>Assignar rutina</Text>
                <View style={styles.closeButton}>
                    <Pressable
                        onPress={() => {
                            closeModal()
                        }}>
                        <AntDesign name="close" size={24} color="black" />
                    </Pressable>
                </View>
                <ScrollView style={{marginTop: 15, width: "80%", marginHorizontal: "auto", marginVertical: 0 }} keyboardShouldPersistTaps="handled">
                    <AutocompleteRutines
                        onSubmit={(id: number) => setRutinaSeleccionada(id)}
                    />
                </ScrollView>

                <Pressable
                    style={themeStyles.button1}
                    onPress={() => {
                        closeModal()
                    }}>
                    <Text style={themeStyles.button1Text}>Assignar rutina</Text>
                </Pressable>
            </Modal>
            </AutocompleteDropdownContextProvider>
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
