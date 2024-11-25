import { View, Text, Pressable, ScrollView, useColorScheme } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import React, { useState } from 'react';
import { useLocalSearchParams, router } from 'expo-router';
import BackButton from '@/components/buttons/BackButton';
import { Calendar, DateData } from 'react-native-calendars';
import ModalConfirmacio from '@/components/modals/ModalConfirmacio';
import Toast from 'react-native-toast-message';
import ViewRutina from '@/components/viewers/ViewRutina';
import { AutocompleteDropdownContextProvider } from 'react-native-autocomplete-dropdown'
import AutocompleteRutines from '@/components/inputs/selects/AutocompleteRutines';
import { calendarTheme, useAppTheme, useThemeStyles } from '@/themes/theme';
import RNDateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker'
import { acabarRutina, assignarRutina, expulsarAlumne, selectAlumneByID, selectAlumnesError, selectAlumnesStatus } from '@/store/alumnesSlice';
import { useAppDispatch, useAppSelector } from '@/store/reduxHooks';
import { createReserva, selectUpcomingReservesByAlumneID } from '@/store/reservesSlice';
import { useText } from '@/hooks/useText';


export default function AlumneScreen() {
    const texts = useText();
    const today = new Date()
    const themeStyles = useThemeStyles()
    const appTheme = useAppTheme()
    const alumneStatus = useAppSelector(selectAlumnesStatus);
    const alumneError = useAppSelector(selectAlumnesError);
    const [modalVisible, setModalVisible] = useState(false)
    const [assignarRutinaID, setAssignarRutinaID] = useState<number | null>(null)
    const [autocompleteRutinaError, setAutocompleteRutinaError] = useState("")
    const { alumneID } = useLocalSearchParams();
    const [selectedDay, setSelectedDay] = useState<DateData>({
        year: today.getFullYear(), month: today.getMonth() + 1, day: today.getDate(),
        timestamp: today.getMilliseconds(), dateString: `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`
    });
    const [selectedTime, setSelectedTime] = useState<Date>(new Date())
    const dispatch = useAppDispatch();
    const [modalReservarVisible, setModalReservarVisible] = useState(false)
    const [errors, setErrors] = useState({
        Hora: "",
        Dia: "",
    })


    const alumne = useAppSelector(state => selectAlumneByID(state, Number(alumneID)));
    const reservesAlumne = useAppSelector(state => selectUpcomingReservesByAlumneID(state, Number(alumneID)));

    //If student doesn't exist redirect to home
    if (!alumne) {
        router.replace("../")
        Toast.show({
            type: 'error',
            text1: texts.ErrorLoadingStudent,
            position: 'top',
        });
    }

    function handleDayPress(day: DateData) {
        setSelectedDay(day);
    }

    function formatDate(date: Date) {
        return date.toISOString().split('T')[0];
    };

    async function reservar(hora: Date) {
        if (!selectedDay) {
            setErrors({ ...errors, Dia: texts.SelectDay });
            return;
        }
        const horaUTC = new Date(hora.getTime() - hora.getTimezoneOffset() * 60000);
        console.log(`hora: ${horaUTC.toISOString()}, date: ${new Date(horaUTC.toISOString())}`)
        dispatch(createReserva({ usuariID: alumne!.id, hora: horaUTC.toISOString() }));
    }

    function handleExpulsarUsuari() {
        dispatch(expulsarAlumne({ id: alumne!.id }));

    }

    function handleAssignarRutina() {
        if (assignarRutinaID == null) return;
        dispatch(assignarRutina({ rutinaID: assignarRutinaID, alumneID: alumne!.id }));
    }

    async function handleAcabarRutina() {
        dispatch(acabarRutina({ UsuariID: alumne!.id }));
    }

    if (!alumne) {
        return (<View><Text>{texts.LoadingStudent}</Text></View>)
    }

    return (
        <AutocompleteDropdownContextProvider>
            <SafeAreaView style={[themeStyles.background, { height: '100%', alignItems: "center", width: "100%" }]}>
                <ScrollView>
                    <View style={{ paddingTop: 10 }} />
                    <BackButton href={"../"} styles={{ top: 37, left: 36 }} />
                    <Text style={[themeStyles.titol1,]}>{alumne.nom}</Text>
                    <View style={themeStyles.basicContainer}>
                        <View style={[themeStyles.box, { marginBottom: 20 }]}>
                            <Calendar
                                firstDay={1}
                                onDayPress={(day: DateData) => handleDayPress(day)}
                                markedDates={
                                    selectedDay && {
                                        [selectedDay.dateString]: { selected: true }
                                    }}
                                theme={calendarTheme}
                                style={{ margin: 5 }}
                            />

                            <View style={{ width: "100%" }}>
                                {selectedDay && selectedDay.dateString >= formatDate(new Date()) && <View>
                                    <Pressable style={[themeStyles.button1, { marginBottom: 20, marginTop: 0 }]} onPress={() => {
                                        setModalReservarVisible(true)
                                        setSelectedTime(new Date(selectedDay.timestamp))
                                    }}>
                                        <Text style={themeStyles.button1Text}>{texts.Reservate}</Text>
                                    </Pressable>
                                </View>}
                            </View>
                        </View>

                        {modalReservarVisible && selectedDay && < RNDateTimePicker
                            mode='time'
                            display="spinner"
                            is24Hour={true}
                            value={new Date(selectedDay.timestamp)}
                            minuteInterval={30}
                            positiveButton={{ label: texts.Reservate, textColor: appTheme.colors.primary }}
                            negativeButton={{ label: texts.Cancel, textColor: appTheme.colors.text }}
                            onChange={(e: DateTimePickerEvent, time: Date | undefined) => {
                                if (time && e.type == "set") {
                                    reservar(new Date(e.nativeEvent.timestamp))
                                }
                                e.nativeEvent && setModalReservarVisible(false)
                            }} />
                        }

                        {/* Entrenos */}
                        <View style={[themeStyles.box, { marginBottom: 20 }]}>
                            <Text style={[themeStyles.titol1]}>{texts.IncomingTrainings}</Text>
                            {reservesAlumne.length === 0 ? (
                                <Text style={[themeStyles.text, { marginBottom: 20 }]}>{texts.WithoutReservations}</Text>
                            ) : (
                                reservesAlumne.map((reserva) => (
                                    <View key={reserva.id} style={{ marginBottom: 20 }}>
                                        <Text style={themeStyles.text}>{reserva.hora.split("T")[0] + " - " + reserva.hora.split("T")[1].split("+")[0].substring(0, 5)}</Text>
                                    </View>
                                ))
                            )}
                        </View>

                        {/* Rutina */}
                        <View style={[themeStyles.box, { paddingBottom: 20 }]}>
                            <Text style={[themeStyles.titol1,]}>{texts.CurrentRoutine}</Text>
                            {alumne.rutinaActual ? (<ViewRutina rutinaID={alumne.rutinaActual} versio={1} acabarRutina={acabarRutina} />
                            ) : (
                                <View>
                                    <Text style={themeStyles.text}>{texts.WithoutAssignedRoutine}</Text>
                                    <View style={{ marginHorizontal: "auto", marginVertical: 10, width: "80%" }}>
                                        <AutocompleteRutines
                                            onSubmit={(id: number) => setAssignarRutinaID(id)}
                                            error={autocompleteRutinaError} />
                                    </View>
                                    <Pressable style={themeStyles.button1} onPress={() => {
                                        handleAssignarRutina()
                                    }}>
                                        <Text style={themeStyles.button1Text}>{texts.AssignRoutine}</Text>
                                    </Pressable>
                                </View>
                            )}
                        </View>


                        <Pressable style={[themeStyles.buttonDanger, { marginBottom: 40 }]} onPress={() => {
                            setModalVisible(true)
                        }}>
                            <Text style={themeStyles.button1Text}>{texts.Kick}</Text>
                        </Pressable>
                        <ModalConfirmacio
                            titol={texts.KickStudent}
                            missatge={texts.SureWantKickStudent}
                            modalVisible={modalVisible}
                            closeModal={() => setModalVisible(false)}
                            confirmar={() => handleExpulsarUsuari()} />

                        {/*                 <ModalReservarHora
                    modalVisible={modalReservarVisible}
                    closeModal={() => setModalReservarVisible(false)}
                    onSubmit={(time: Date) => reservar(time)} /> */}
                    </View>
                </ScrollView>
            </SafeAreaView>
        </AutocompleteDropdownContextProvider >
    )
}