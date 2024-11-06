import BackButton from '@/components/buttons/BackButton';
import { selectAllAlumnes, selectAlumnesStatus } from '@/store/alumnesSlice';
import { useAppSelector } from '@/store/reduxHooks';
import { useThemeStyles } from '@/themes/theme';
import { actions, status as st } from '@/types/apiTypes';
import { router } from 'expo-router';
import { ScrollView, Text, View, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import FontAwesome from '@expo/vector-icons/FontAwesome';

export default function Alumnes() {
    const alumnes = useAppSelector(selectAllAlumnes);
    const alumnesStatus = useAppSelector(selectAlumnesStatus);
    const themeStyles = useThemeStyles();


    return (
        <SafeAreaView style={[themeStyles.background, { height: '100%', alignItems: "center"}]}>
            <View style={{ height: 10 }} />
            <View style={{ display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "space-between", position: "relative" }}>
                <Text style={themeStyles.titol1}>Alumnes</Text>
                <BackButton href={"../"} styles={{ left: -100 }} />
            </View>
            <ScrollView style={{width: "100%"}}>
                {alumnesStatus[actions.index] == st.pending && <Text style={themeStyles.text}>Carregant alumnes...</Text>}
                {alumnesStatus[actions.index] == st.succeeded && (
                    <Pressable style={themeStyles.button1}>
                        <Text style={themeStyles.button1Text}>Afegir alumne</Text>
                    </Pressable>
                )}
                <View style={{ height: 20 }} />
                {alumnesStatus[actions.index] == st.succeeded && alumnes.map((alumne) => {
                    return ( 
                        <Pressable key={alumne.id} style={themeStyles.alumneContainer} onPress={() => router.push({ pathname: `../(alumnes)/${alumne.id}` })}>
                            <FontAwesome name="user-circle" size={40} color="lightgray" />
                            <View style={{ marginLeft: 10, display: "flex", flexDirection: "column"}}>
                                <Text style={[themeStyles.text, {textAlign: "left", width: "100%"}]}>{alumne.nom}</Text>
                                <Text style={[themeStyles.text, {textAlign: "left", width: "100%"}]}>Rutina: {alumne.rutinaActual || "Sense rutina"}</Text>
                            </View>
                        </Pressable>
                    )
                })}
            </ScrollView>
        </SafeAreaView>
    )
}
