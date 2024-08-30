import { View, Text, Pressable } from 'react-native'
import React from 'react'
import AntDesign from '@expo/vector-icons/AntDesign';

interface propsType {
    amunt: boolean,
    onPress: Function,
    size: number
    containerStyle?: object
}

export default function FletxaDesplegar(props: propsType) {
    const { amunt, onPress, size, containerStyle } = props;
    const [amuntState, setAmuntState] = React.useState(amunt);

    function handlePress() {
        setAmuntState(!amuntState);
        onPress();
    }

    return (
        <View style={containerStyle}>
            <Pressable onPress={handlePress} style={{ width: size, height: size }}>
                <AntDesign name={amuntState ? "up" : "down"} size={size} color="black" />
            </Pressable>
        </View>
    );
}