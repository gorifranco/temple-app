import TextInput from '@/components/inputs/TextInput';
import HorariConfig from '@/components/viewers/HorariConfig';
import { configValidator } from '@/helpers/validators';
import { logoutRedux } from '@/store/authSlice';
import { guardarConfiguracio, selectConfig } from '@/store/configSlice';
import { useAppDispatch, useAppSelector } from '@/store/reduxHooks';
import { useAppTheme, useThemeStyles } from '@/themes/theme';
import { ReducedConfigType } from '@/types/apiTypes';
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { persistor } from '../../store';
import RNDateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { router } from 'expo-router';

export default function Index() {
    const appTheme = useAppTheme();
    const themeStyles = useThemeStyles();
    const dispatch = useAppDispatch();
    const config = useAppSelector(selectConfig);
    const [timepickerVisible, setTimepickerVisible] = useState(false);
    const [configTmp, setConfigTmp] = useState<ReducedConfigType>({
        duracioSessions: config.duracioSessions,
        maxAlumnesPerSessio: config.maxAlumnesPerSessio,
    });
    const [errors, setErrors] = useState({
        duracioSessions: "",
        maxAlumnesPerSessio: "",
        horariEntrenador: []
    });
    const initialDate = new Date();
    const hours = Math.floor(config.duracioSessions / 60);
    const minutes = config.duracioSessions % 60;
    initialDate.setHours(hours, minutes, 0, 0);

    function handleCanviarDuracio(minutes: number) {
        setConfigTmp({ ...configTmp, duracioSessions: minutes });
    }

    function handleCanviarConfiguracio() {
        if (configValidator(configTmp)) dispatch(guardarConfiguracio({ config: configTmp }));
    }

    return (
        <SafeAreaView style={themeStyles.background}>
            <ScrollView>

                {/* Horari */}
                <HorariConfig />

                <View style={{ width: "80%", marginHorizontal: "auto", marginVertical: 10, marginBottom: 10, display: "flex", flexDirection: "row" }}>
                    <Text style={[themeStyles.text, { marginRight: 10 }]}>Duració de les sessions (min)</Text>
                    <Pressable onPress={() => setTimepickerVisible(true)}>
                        <TextInput
                            containerStyle={{ width: 68 }}
                            inputStyle={{ textAlign: "right" }}
                            enterKeyHint="done"
                            value={configTmp.duracioSessions?.toString() ?? ""}
                            onChangeText={(text: string) => setConfigTmp({ ...configTmp, duracioSessions: Number(text.replace(/[^0-9]/g, '')) })}
                            error={!!errors.duracioSessions}
                            errorText={errors.duracioSessions}
                            autoCapitalize="none"
                            inputMode="numeric"
                            maxLength={3}
                            editable={false}
                        />
                    </Pressable>
                </View>

                {/* Input max students per session */}
                <View style={{ width: "80%", marginHorizontal: "auto", marginVertical: 10, marginBottom: 10, display: "flex", flexDirection: "row" }}>
                    <Text style={[themeStyles.text, { marginRight: 10 }]}>Alumnes per sessió</Text>
                    <TextInput
                        maxLength={3}
                        containerStyle={{ width: 68 }}
                        inputStyle={[{ textAlign: "right" }]}
                        enterKeyHint="done"
                        value={configTmp.maxAlumnesPerSessio?.toString() ?? ""}
                        onChangeText={(text: string) => setConfigTmp({ ...configTmp, maxAlumnesPerSessio: Number(text.replace(/[^0-9]/g, '')) })}
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

                {/* Logout */}
                <Pressable
                    style={themeStyles.button1}
                    onPress={() => {
                        dispatch(logoutRedux())
                        router.replace("/")
                    }}>
                    <Text style={themeStyles.button1Text}>Logout</Text>
                </Pressable>

                {/* Time picker */}
                {timepickerVisible && < RNDateTimePicker
                    mode='time'
                    display="spinner"
                    is24Hour={true}
                    value={initialDate}
                    minuteInterval={15}
                    positiveButton={{ label: 'acceptar', textColor: appTheme.colors.primary }}
                    negativeButton={{ label: 'Cancelar', textColor: appTheme.colors.text }}
                    onChange={(e: DateTimePickerEvent, time: Date | undefined) => {
                        if (time && e.type === "set") {
                            handleCanviarDuracio(time.getHours() * 60 + time.getMinutes());
                        }
                        setTimepickerVisible(false);
                    }}
                />
                }
            </ScrollView>
        </SafeAreaView >
    );
}