import BackButton from '@/components/buttons/BackButton';
import { createAlumneFictici, selectAllAlumnes, selectAlumnesStatus } from '@/store/alumnesSlice';
import { useAppDispatch, useAppSelector } from '@/store/reduxHooks';
import { useThemeStyles } from '@/themes/theme';
import { actions, status as st } from '@/types/apiTypes';
import { router } from 'expo-router';
import { ScrollView, Text, View, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import ModalAfegirUsuari from '@/components/modals/ModalAfegirUsuari';
import { useState } from 'react';
import Toast from 'react-native-toast-message';
import { useText } from '@/hooks/useText';

export default function Alumnes() {
    const texts = useText();
    const alumnes = useAppSelector(selectAllAlumnes);
    const alumnesStatus
    = useAppSelector(selectAlumnesStatus);
    const themeStyles = useThemeStyles();
    const dispatch = useAppDispatch();
    const [ModalAfegirUsuariVisible, setModalAfegirUsuariVisible] = useState(false);

    function handlePressCrearUsuari() {
        if (alumnes.length >= Number(process.env.EXPO_PUBLIC_MAX_ALUMNES)) {
            Toast.show({
                type: 'error',
                text1: texts.MaxStudentsReached,
                position: 'top',
            });
        } else {
            setModalAfegirUsuariVisible(true);
        }
    }


    return (
        <SafeAreaView style={[themeStyles.background, { height: '100%', alignItems: "center" }]}>
            <View style={{ height: 10 }} />
            <View style={{ display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "space-between", position: "relative" }}>
                <Text style={themeStyles.titol1}>{texts.Students}</Text>
                <BackButton href={"../"} styles={{ left: -100 }} />
            </View>
            <ScrollView style={{ width: "100%" }}>
                {alumnesStatus[actions.index] == st.pending && <Text style={themeStyles.text}>{texts.ErrorLoadingStudents}</Text>}
                {alumnesStatus[actions.index] == st.succeeded && (
                    <Pressable style={themeStyles.button1} onPress={() => handlePressCrearUsuari()}>
                        <Text style={themeStyles.button1Text}>{texts.AddStudent}</Text>
                    </Pressable>
                )}
                <View style={{ height: 20 }} />
                {alumnesStatus[actions.index] == st.succeeded && alumnes.map((alumne) => {
                    return (
                        <Pressable key={alumne.id} style={themeStyles.alumneContainer} onPress={() => router.push({ pathname: `../(alumnes)/${alumne.id}` })}>
                            <FontAwesome name="user-circle" size={40} color="lightgray" />
                            <View style={{ marginLeft: 10, display: "flex", flexDirection: "column" }}>
                                <Text style={[themeStyles.text, { textAlign: "left", width: "100%" }]}>{alumne.nom}</Text>
                                <Text style={[themeStyles.text, { textAlign: "left", width: "100%" }]}>{texts.Routine}:{alumne.rutinaActual || texts.WithoutRoutine}</Text>
                            </View>
                        </Pressable>
                    )
                })}

                <ModalAfegirUsuari
                    modalVisible={ModalAfegirUsuariVisible}
                    closeModal={() => setModalAfegirUsuariVisible(false)}
                    crearUsuariFictici={(nom: string) => dispatch(createAlumneFictici({ nom }))} />
            </ScrollView>
        </SafeAreaView>
    )
}
