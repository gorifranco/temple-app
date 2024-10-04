import React, { useState} from 'react'
import { View, Text, Pressable } from 'react-native'
import { useThemeStyles } from '@/themes/theme'
import TextInput from '@/components/inputs/TextInput'
import RNDateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker'

interface propsType {
    dia: string
    horaris: { Desde: Date|null; Fins: Date|null }[]
    afegirHorari: Function
    llevarHorari: Function
    handleChange: Function
}

export default function DiaHorari(props: propsType) {
    const { dia, horaris, afegirHorari, llevarHorari, handleChange } = props
    const themeStyles = useThemeStyles()
    const [timePickerVisible, setTimePickerVisible] = React.useState(false)
    const [ changing, setChanging ] = useState<number>();
    const [ dof, setDof ] = useState<number>();

    return (
        <View style={themeStyles.diaHorariContainer}>
            <Text style={themeStyles.text}>{dia}</Text>

            {horaris.map((horari, i) => (
                <View style={{ flexDirection: "row", width: "100%", alignItems: "center" }} key={i}>
                    <Pressable
                        onPress={() => {
                            setTimePickerVisible(true)
                            setChanging(i)
                            setDof(0)
                        }}
                        style={{ width: "45%" }}>
                        <TextInput
                            label="Desde"
                            returnKeyType="next"
                            value={horari.Desde ? horari.Desde.getHours().toString().padStart(2, "0") + ":" + horari.Desde.getMinutes().toString().padStart(2, "0") : "_ _ : _ _"}
                            error={false}
                            errorText={""}
                            inputStyle={{ textAlign: "center", width: "100%"}}
                            editable={false}
                        />
                    </Pressable>
                    <Text style={{ width: "10%", textAlign: "center" }}>a</Text>
                    <Pressable
                        onPress={() => {
                            setTimePickerVisible(true)
                            setChanging(i)
                            setDof(1)
                        }}
                        style={{ width: "45%" }}>
                        <TextInput
                            label="Fins"
                            editable={false}
                            returnKeyType="next"
                            value={horari.Fins ? horari.Fins.getHours().toString() + ":" + horari.Fins.getMinutes().toString() : "_ _ : _ _"}
                            error={false}
                            errorText={""}
                            inputStyle={{ textAlign: "center" }}
                        />
                    </Pressable>
                </View>
            ))}

            <View style={{ display: "flex", justifyContent: "center", flexDirection: "row", gap: 15 }}>
                {horaris.length < 3 && (
                    <Pressable
                        style={themeStyles.button1}
                        onPress={() => afegirHorari()}>
                        <Text style={themeStyles.button1Text}>+</Text>
                    </Pressable>
                )}
                {horaris.length > 0 && (
                    <Pressable
                        style={themeStyles.button1}
                        onPress={() => llevarHorari()}>
                        <Text style={themeStyles.button1Text}>-</Text>
                    </Pressable>
                )}
            </View>
            {timePickerVisible && (
                <RNDateTimePicker
                    mode="time"
                    value={new Date()}
                    is24Hour={true}
                    minuteInterval={30}
                    display="spinner"
                    positiveButton={{ label: 'Seleccionar', textColor: 'white' }}
                    negativeButton={{ label: 'Cancelar', textColor: 'white' }}
                    onChange={(e: DateTimePickerEvent, time: Date | undefined) => {
                        if (time && e.type == "set") {
                            handleChange(new Date(e.nativeEvent.timestamp), changing, dof)
                        }
                        e.nativeEvent && setTimePickerVisible(false)
                    }} />

            )}
        </View>
    )
}
