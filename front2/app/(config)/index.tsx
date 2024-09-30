import { View, Text, Pressable, ScrollView } from 'react-native';
import React, { useContext, useState } from 'react';
import AuthContext, { AuthContextType } from '../AuthContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useThemeStyles } from '@/themes/theme';
import TextInput from '@/components/inputs/TextInput';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import { persistor } from '../../store';
import { ConfigType } from '@/types/apiTypes';


export default function Index() {
    const themeStyles = useThemeStyles();
    const authContext = useContext<AuthContextType | undefined>(AuthContext);
    const config = useSelector((state: RootState) => state.config);
    const [errors, setErrors] = useState({
        duracioSessions: "",
        maxAlumnesPerSessio: ""
    });
    const  [configTmp, setConfigTmp] = useState<ConfigType>(config);


    if (!authContext) {
        throw new Error("AuthProvider is missing. Please wrap your component tree with AuthProvider.");
    }
    const { logout } = authContext;

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
        <ScrollView style={themeStyles.background}>
            <Pressable
                style={themeStyles.button1}
                onPress={() => logout()}>
                <Text style={themeStyles.button1Text}>Logout</Text>
            </Pressable>
            <Pressable
                style={themeStyles.button1}
                onPress={() => borrarStorage()}>
                <Text style={themeStyles.button1Text}>Borrar async storage</Text>
            </Pressable>

            <Text style={themeStyles.text}>Horari: </Text>
            <View style={{width: "80%", marginHorizontal: "auto", marginVertical: 10, marginBottom: 10, display: "flex", flexDirection: "row"}}>
                <Text style={[themeStyles.text, {marginRight: 10}]}>Duració de les sessions (min)</Text>
                <TextInput
                    containerStyle={{width: 68}}
                    inputStyle={{textAlign: "right"}}
                    returnKeyType="done"
                    value={configTmp.duracioSessions}
                    onChangeText={(text: string) => setConfigTmp({ ...configTmp, duracioSessions: Number(text.replace(/[^0-9]/g, '')) })}
                    error={!!errors.duracioSessions}
                    errorText={errors.duracioSessions}
                    autoCapitalize="none"
                    keyboardType="numeric"
                    maxLength={3}
                />
            </View>

            <View style={{width: "80%", marginHorizontal: "auto", marginVertical: 10, marginBottom: 10, display: "flex", flexDirection: "row"}}>
            <Text style={[themeStyles.text, {marginRight: 10}]}>Alumnes per sessió</Text>
                <TextInput
                    maxLength={3}
                    containerStyle={{width: 68}}
                    inputStyle={{textAlign: "right"}}
                    returnKeyType="done"
                    value={configTmp.maxAlumnesPerSessio}
                    onChangeText={(text: string) => setConfigTmp({ ...configTmp, maxAlumnesPerSessio: Number(text.replace(/[^0-9]/g, '')) })}
                    error={!!errors.maxAlumnesPerSessio}
                    errorText={errors.maxAlumnesPerSessio}
                    autoCapitalize="none"
                    keyboardType="numeric"
                />
            </View>

            <Pressable
                style={themeStyles.button1}
                onPress={() => handleCanviarConfiguracio()}>
                <Text style={themeStyles.button1Text}>Canviar configuració</Text>
            </Pressable>

        </ScrollView>
    );
}