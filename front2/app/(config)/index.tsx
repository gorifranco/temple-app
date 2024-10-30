import { View, Text, Pressable, ScrollView } from 'react-native';
import React, { useContext, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useThemeStyles } from '@/themes/theme';
import TextInput from '@/components/inputs/TextInput';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import { persistor } from '../../store';
import { ConfigType } from '@/types/apiTypes';
import HorariConfig from '@/components/viewers/HorariConfig';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch } from 'react-redux';
import { logoutRedux } from '@/store/authSlice';

export default function Index() {
    const themeStyles = useThemeStyles();
    const dispatch = useDispatch();
    const auth = useSelector((state: RootState) => state.auth);
    const config = useSelector((state: RootState) => state.config);
    const [errors, setErrors] = useState({
        duracioSessions: "",
        maxAlumnesPerSessio: "",
        horariEntrenador: []
    });
    const [configTmp, setConfigTmp] = useState<ConfigType>(config);

    if (!auth.user) {
        throw new Error("AuthProvider is missing. Please wrap your component tree with AuthProvider.");
    }

    async function borrarStorage() {
        try {
            await AsyncStorage.clear();
            console.log("AsyncStorage borrado");
            await persistor.purge();
            console.log("persistor borrat");
        } catch (e) {
            console.error("Error borrando AsyncStorage:", e);
        }
    }

    function handleCanviarConfiguracio() {

    }

    return (
        <SafeAreaView style={themeStyles.background}>
            <ScrollView>
                <Pressable
                    style={themeStyles.button1}
                    onPress={() => dispatch(logoutRedux())}>
                    <Text style={themeStyles.button1Text}>Logout</Text>
                </Pressable>
                <Pressable
                    style={themeStyles.button1}
                    onPress={() => borrarStorage()}>
                    <Text style={themeStyles.button1Text}>Borrar async storage</Text>
                </Pressable>

                {/* Horari */}
                <HorariConfig />

                <View style={{ width: "80%", marginHorizontal: "auto", marginVertical: 10, marginBottom: 10, display: "flex", flexDirection: "row" }}>
                    <Text style={[themeStyles.text, { marginRight: 10 }]}>Duració de les sessions (min)</Text>
                    <TextInput
                        containerStyle={{ width: 68 }}
                        inputStyle={{ textAlign: "right" }}
                        enterKeyHint="done"
                        value={configTmp.DuracioSessions}
                        onChangeText={(text: string) => setConfigTmp({ ...configTmp, DuracioSessions: Number(text.replace(/[^0-9]/g, '')) })}
                        error={!!errors.duracioSessions}
                        errorText={errors.duracioSessions}
                        autoCapitalize="none"
                        inputMode="numeric"
                        maxLength={3}
                    />
                </View>

                <View style={{ width: "80%", marginHorizontal: "auto", marginVertical: 10, marginBottom: 10, display: "flex", flexDirection: "row" }}>
                    <Text style={[themeStyles.text, { marginRight: 10 }]}>Alumnes per sessió</Text>
                    <TextInput
                        maxLength={3}
                        containerStyle={{ width: 68 }}
                        inputStyle={{ textAlign: "right" }}
                        enterKeyHint="done"
                        value={configTmp.MaxAlumnesPerSessio}
                        onChangeText={(text: string) => setConfigTmp({ ...configTmp, MaxAlumnesPerSessio: Number(text.replace(/[^0-9]/g, '')) })}
                        error={!!errors.maxAlumnesPerSessio}
                        errorText={errors.maxAlumnesPerSessio}
                        autoCapitalize="none"
                        inputMode="numeric"
                    />
                </View>

                <Pressable
                    style={[themeStyles.button1, { marginBottom: 25 }]}
                    onPress={() => handleCanviarConfiguracio()}>
                    <Text style={themeStyles.button1Text}>Canviar configuració</Text>
                </Pressable>
            </ScrollView>
        </SafeAreaView>
    );
}