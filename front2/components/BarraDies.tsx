import { themeStyles } from '@/themes/theme';
import { View, Text, StyleSheet, Pressable, Dimensions } from 'react-native';

interface propsType {
    dies: number,
    afegeixDia?: () => void;
    canviaDia: Function,
    currentDia: number,
    editable: boolean
}


export default function BarraDies(props: propsType) {
    const { dies, afegeixDia, canviaDia, currentDia, editable } = props;

    const screenWidth = Dimensions.get('window').width;
    const pressableWidth = editable ? screenWidth * 0.8 / 7 : screenWidth*0.8/dies; 

    return (
        <View style={[styles.container, { width: screenWidth * 0.8+1 }]}>
            {Array.from({ length: dies }, (_, i) => {
                const letter = String.fromCharCode(65 + i);
                return (
                    <Pressable
                        key={i}
                        style={[
                            styles.pressable,
                            {width: pressableWidth},
                            i === currentDia ? { backgroundColor: 'lightgray' } : null,
                            i === 0 ? { borderTopLeftRadius: 10, borderBottomLeftRadius: 10 } : null,
                            i === 6? { borderTopRightRadius: 10, borderBottomRightRadius: 10, borderRightWidth: 0 } : null,
                        ]}
                        onPress={() => canviaDia(i)}
                    >
                        <Text style={[themeStyles.text, { fontSize: 18 }]}>{letter}</Text>
                    </Pressable>
                );
            })}
            {editable && dies < 7 && (
                <Pressable
                    key={"afegir"}
                    style={[styles.pressable, { borderRightWidth: 0, width: 45 }]}
                    onPress={() => {
                        if(afegeixDia) afegeixDia()
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