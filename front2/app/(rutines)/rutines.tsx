import { useAppSelector } from '@/store/reduxHooks';
import { selectAllRutines, selectRutinesError, selectRutinesStatus } from '@/store/rutinesSlice';
import { useThemeStyles } from '@/themes/theme';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import BackButton from '@/components/buttons/BackButton';
import { status as st, actions } from '@/types/apiTypes';
import ViewRutina from '@/components/viewers/ViewRutina';
import { router } from 'expo-router';


export default function rutines() {
    const rutines = useAppSelector(selectAllRutines);
    const rutinesStatus = useAppSelector(selectRutinesStatus);
    const rutinesError = useAppSelector(selectRutinesError);
    const themeStyles = useThemeStyles();

    function handlePressCrearRutina() {
        router.push({
            pathname: '/crearRutina/[RutinaID]',
            params: { RutinaID: -1 },
        })
    }

    return (
        <SafeAreaView style={[themeStyles.background, { height: '100%', alignItems: "center" }]}>
            <View style={{ height: 15 }} />
            <View style={{ display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "space-between", position: "relative" }}>
                <Text style={themeStyles.titol1}>Rutines</Text>
                <BackButton href={"../"} styles={{ left: -100 }} />
            </View>
            <ScrollView style={{ width: "100%", marginBottom: 10}}>
                {rutinesStatus == st.pending && <Text style={themeStyles.text}>Carregant rutines...</Text>}
                {rutinesStatus == st.succeeded && (
                    <Pressable style={themeStyles.button1} onPress={() => handlePressCrearRutina()}>
                        <Text style={themeStyles.button1Text}>Afegir rutina</Text>
                    </Pressable>
                )}
                <View style={{ height: 20 }} />
                {rutinesStatus == st.succeeded && rutines.map((rutina) => {
                    return (
                        <ViewRutina rutinaID={rutina.id} key={rutina.id} />
                    )
                })}
            </ScrollView>
        </SafeAreaView>
    )
}