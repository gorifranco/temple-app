import RNDateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker'
import React, { useState } from 'react'
import { View, Text, Modal, Pressable } from 'react-native'
import { useThemeStyles } from '@/themes/theme'
import CloseButton from '@/components/buttons/CloseButton'
import { useText } from '@/hooks/useText'

interface propsType {
    modalVisible: boolean
    closeModal: Function
    onSubmit: Function
}

export default function ModalReservarHora(props: propsType) {
    const texts = useText();
    const themeStyles = useThemeStyles()
    const { modalVisible, closeModal, onSubmit } = props
    const [selectedTime, setSelectedTime] = useState<Date>(new Date())

    function handleSubmit() {
        onSubmit(selectedTime)
    }

    return (
        <Modal
            style={{ overflow: 'hidden' }}
            transparent={false}
            visible={modalVisible}
            onRequestClose={() => {
                closeModal()
            }}>
            <CloseButton onPress={() => closeModal()} />
            <RNDateTimePicker
                mode='time'
                display="spinner"
                is24Hour={true}
                value={selectedTime}
                minuteInterval={30}
                onChange={(e: DateTimePickerEvent, time: Date | undefined) => {
                    time && setSelectedTime(time)
                }} />

            <Pressable style={themeStyles.button1} onPress={() => {
                handleSubmit()
            }}>
                <Text style={themeStyles.button1Text}>{texts.Reservate}</Text>
            </Pressable>
        </Modal>
    )
}