import RNDateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker'
import React, { useState } from 'react'
import { View, Text, Modal } from 'react-native'

interface propsType {
    modalVisible: boolean
    closeModal: Function
    onSubmit: Function
}

export default function ModalReservarHora(props: propsType) {
    const { modalVisible, closeModal, onSubmit } = props
    const [selectedTime, setSelectedTime] = useState<Date>(new Date())

    function handleSubmit() {

    }

    return (
        <Modal
            style={{ overflow: 'hidden' }}
            transparent={false}
            visible={modalVisible}
            onRequestClose={() => {
                closeModal()
            }}>

                <RNDateTimePicker
                mode='time'
                display="spinner"
                is24Hour={true}
                value={selectedTime}
                onChange={(e:DateTimePickerEvent, time:Date|undefined) => {
                    time && setSelectedTime(time)
                }} />
        
            <Text>Reservar hora</Text>
        </Modal>
    )
}