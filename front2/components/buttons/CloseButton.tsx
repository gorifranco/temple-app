import { View, Pressable, StyleSheet } from 'react-native'
import { AntDesign } from '@expo/vector-icons'
import { useAppTheme } from '@/themes/theme'


interface propsType {
    onPress: Function
}

export default function CloseButton(props: propsType) {
    const { onPress } = props
    const themeStyles = useAppTheme()

    return (
        <View style={styles.closeButton}>
            <Pressable
                onPress={() => {
                    onPress()
                }}>
                <AntDesign name="close" size={24} color={themeStyles.colors.text} />
            </Pressable>
        </View>
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