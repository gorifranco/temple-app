import { themeStyles } from '@/themes/theme';
import { View, Text, StyleSheet, Pressable } from 'react-native';

interface propsType {
    cicles: number,
    afegeixCicle: Function,
    canviaCicle: Function,
}


export default function BarraCicles(props: propsType) {
    const { cicles, afegeixCicle, canviaCicle } = props;

    return (
        <View style={styles.container}>
            {Array.from({ length: cicles }, (_, i) => {
                const letter = String.fromCharCode(65 + i);
                return (
                    <Pressable
                        key={i}
                        style={styles.pressable}
                        onPress={() => canviaCicle(i)}
                    >
                        <Text style={[themeStyles.text, { fontSize: 18 }]}>{letter}</Text>
                    </Pressable>
                );
            })}
            {cicles < 5 && (
                <Pressable
                    key={"afegir"}
                    style={[styles.pressable, { borderRightWidth: 0, width: 45 }]}
                    onPress={() => {
                        console.log("aqui")
                        afegeixCicle()}}
                >
                    <Text style={[themeStyles.text, { color: 'gray', fontSize: 25, fontWeight: 'bold' }]}>+</Text>
                </Pressable>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        width: '80%',
        height: 40,
        alignSelf: 'center',
        marginBottom: 10,
        borderWidth: 1,
        borderColor: '#560CCE',
        borderRadius: 10,
        flexDirection: 'row',
        alignItems: 'center',
    },
    pressable: {
        width: 60,
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        borderRightWidth: 2,
        borderTopColor: 'transparent',
        borderBottomColor: 'transparent',
        borderRightColor: '#560CCE',
    },
});