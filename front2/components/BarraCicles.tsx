import { themeStyles } from '@/themes/theme';
import { View, Text, StyleSheet, Pressable, Dimensions } from 'react-native';

interface propsType {
    cicles: number,
    afegeixCicle: Function,
    canviaCicle: Function,
    currentCicle: number,
}


export default function BarraCicles(props: propsType) {
    const { cicles, afegeixCicle, canviaCicle, currentCicle } = props;

    const screenWidth = Dimensions.get('window').width;
    const pressableWidth = screenWidth * 0.8 / 7; 

    return (
        <View style={[styles.container, { width: screenWidth * 0.8+1 }]}>
            {Array.from({ length: cicles }, (_, i) => {
                const letter = String.fromCharCode(65 + i);
                return (
                    <Pressable
                        key={i}
                        style={[
                            styles.pressable,
                            {width: pressableWidth},
                            i === currentCicle ? { backgroundColor: 'lightgray' } : null,
                            i === 0 ? { borderTopLeftRadius: 10, borderBottomLeftRadius: 10 } : null,
                            i === 6? { borderTopRightRadius: 10, borderBottomRightRadius: 10, borderRightWidth: 0 } : null,
                        ]}
                        onPress={() => canviaCicle(i)}
                    >
                        <Text style={[themeStyles.text, { fontSize: 18 }]}>{letter}</Text>
                    </Pressable>
                );
            })}
            {cicles < 7 && (
                <Pressable
                    key={"afegir"}
                    style={[styles.pressable, { borderRightWidth: 0, width: 45 }]}
                    onPress={() => {
                        console.log("aqui")
                        afegeixCicle()
                    }}
                >
                    <Text style={[themeStyles.text, { color: 'gray', fontSize: 25, fontWeight: 'bold' }]}>+</Text>
                </Pressable>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
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
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        borderRightWidth: 2,
        borderTopColor: 'transparent',
        borderBottomColor: 'transparent',
        borderRightColor: '#560CCE',
    },
});