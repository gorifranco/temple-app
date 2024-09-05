import { View, Text, Modal, Pressable, StyleSheet } from 'react-native'
import { useEffect, useState } from 'react'
import { RootState } from '@/store'
import { useSelector, useDispatch } from 'react-redux'
import { themeStyles } from '@/themes/theme'
import { setRutines } from '@/store/rutinesSlice'
import AsyncStorage from '@react-native-async-storage/async-storage';
import AutocompleteRutines from '@/components/inputs/selects/AutocompleteRutines'
import { AutocompleteDropdownContextProvider } from 'react-native-autocomplete-dropdown'
import { AntDesign } from '@expo/vector-icons'


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
                <AutocompleteRutines
                    onSubmit={(id: number) => setRutinaSeleccionada(id)}
                />
                <Pressable
                    style={themeStyles.button1}
                    onPress={() => {
                        closeModal()
                    }}>
                    <Text style={themeStyles.titol1}>Assignar rutina</Text>
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
