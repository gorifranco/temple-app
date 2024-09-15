import { View, Text, Pressable } from 'react-native';
import React, { useContext, useState } from 'react';
import AuthContext, { AuthContextType } from '../AuthContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useThemeStyles } from '@/themes/theme';
import TextInput from '@/components/inputs/TextInput';
import { ConfigType } from '@/types/apiTypes';

export default function Index() {
    const themeStyles = useThemeStyles();
    const authContext = useContext<AuthContextType | undefined>(AuthContext);
    const [config, setConfig] = useState<ConfigType>({
        duracioSessions: 60,
        maxAlumnesPerSessio: 1
    });
    const [errors, setErrors] = useState({
        duracioSessions: "",
        maxAlumnesPerSessio: ""
    });

    if (!authContext) {
        throw new Error("AuthProvider is missing. Please wrap your component tree with AuthProvider.");
    }
    const { logout } = authContext;

    function borrarStorage() {
        AsyncStorage.clear();
        console.log("assync storage borrat")
    }

    function handleCanviarConfiguracio() {

    }

    return (
        <View>
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

            <Text>Horari: </Text>
            <View style={{width: "80%", marginHorizontal: "auto", marginVertical: 10, marginBottom: 10, display: "flex", flexDirection: "row"}}>
                <Text style={[themeStyles.text, {marginRight: 10}]}>Duració de les sessions (min)</Text>
                <TextInput
                    containerStyle={{width: 68}}
                    inputStyle={{textAlign: "right"}}
                    returnKeyType="done"
                    value={config.duracioSessions}
                    onChangeText={(text: string) => setConfig({ ...config, duracioSessions: Number(text.replace(/[^0-9]/g, '')) })}
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
                    value={config.maxAlumnesPerSessio}
                    onChangeText={(text: string) => setConfig({ ...config, maxAlumnesPerSessio: Number(text.replace(/[^0-9]/g, '')) })}
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

        </View>
    );
}