import { View, Text, Pressable, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import React, { useEffect, useState } from 'react';
import { useLocalSearchParams, router } from 'expo-router';
import BackButton from '@/components/buttons/BackButton';
import { Calendar, DateData } from 'react-native-calendars';
import ModalConfirmacio from '@/components/modals/ModalConfirmacio';
import Toast from 'react-native-toast-message';
import ViewRutina from '@/components/viewers/ViewRutina';
import { AutocompleteDropdownContextProvider } from 'react-native-autocomplete-dropdown'
import AutocompleteRutines from '@/components/inputs/selects/AutocompleteRutines';
import { useThemeStyles } from '@/themes/theme';
import RNDateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker'
import { stringDiaToDate } from '@/helpers/timeHelpers';
import { acabarRutina, assignarRutina, expulsarAlumne, selectAlumneByID, selectAlumnesAction, selectAlumnesError, selectAlumnesStatus } from '@/store/alumnesSlice';
import { useAppDispatch, useAppSelector } from '@/store/reduxHooks';
import { createReserva } from '@/store/reservesSlice';
import { api } from '../api';

export default function AlumneScreen() {
    const themeStyles = useThemeStyles()
    const alumneStatus = useAppSelector(selectAlumnesStatus);
    const alumneError = useAppSelector(selectAlumnesError);
    const alumneAction = useAppSelector(selectAlumnesAction);
    const [modalVisible, setModalVisible] = useState(false)
    const [assignarRutinaID, setAssignarRutinaID] = useState<number | null>(null)
    const [autocompleteRutinaError, setAutocompleteRutinaError] = useState("")
    const { alumneID } = useLocalSearchParams();
    const [selectedDay, setSelectedDay] = useState<DateData>();
    const [selectedTime, setSelectedTime] = useState<Date>(new Date())
    const dispatch = useAppDispatch();
    const [modalReservarVisible, setModalReservarVisible] = useState(false)
    const [errors, setErrorts] = useState({
        Hora: "",
        Dia: "",
    })

    useEffect(() => {
        if (alumneAction === "delete" && alumneStatus === "failed") {
            Toast.show({
                type: 'error',
                text1: alumneError ?? 'Error mostrant l\'usuari',
                position: 'top',
            });
            router.replace("../")
        }
        if (alumneAction === "delete" && alumneStatus === "succeeded") {
            router.replace("../")
            Toast.show({
                type: 'success',
                text1: 'Usuari eliminat',
                position: 'top',
            });
        }
        if (alumneAction === "assign" && alumneStatus === "failed") {
            Toast.show({
                type: 'error',
                text1: alumneError ?? 'Error assignant la rutina',
                position: 'top',
            });
        }
        if (alumneAction === "assign" && alumneStatus === "succeeded") {
            Toast.show({
                type: 'success',
                text1: 'Rutina assignada',
                position: 'top',
            });
        }
    }, [alumneStatus]);

    const alumne = useAppSelector(state => selectAlumneByID(state, Number(alumneID)));
    //If student doesn't exist redirect to home
    if (!alumne) {
        router.replace("../")
        Toast.show({
            type: 'error',
            text1: 'Error mostrant l\'usuari',
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
            setErrorts({ ...errors, Dia: "Selecciona un dia" });
            return;
        }
        const horaUTC = new Date(hora.getTime() - hora.getTimezoneOffset() * 60000);

        dispatch(createReserva({ data: { usuariID: alumne!.ID, hora: horaUTC.toISOString()}}));
    }

    function handleExpulsarUsuari() {
        dispatch(expulsarAlumne({ id: alumne!.ID }));

    }

    function handleAssignarRutina() {
        if (assignarRutinaID == null) return;
        dispatch(assignarRutina({ rutinaID: assignarRutinaID, alumneID: alumne!.ID }));
    }

    async function handleAcabarRutina() {
        dispatch(acabarRutina({ usuariID: alumne!.ID }));
    }

    if (!alumne) {
        return (<View><Text>Carregant alumne</Text></View>)
    }

    return (
        <AutocompleteDropdownContextProvider>
            <SafeAreaView style={[themeStyles.background, { height: '100%' }]}>
                <ScrollView>
                    <BackButton href={"../"} />
                    <Text style={themeStyles.titol1}>{alumne.Nom}</Text>
                    <Calendar
                        firstDay={1}
                        onDayPress={(day: DateData) => handleDayPress(day)}
                        markedDates={
                            selectedDay && {
                                [selectedDay.dateString]: { selected: true, marked: true, selectedColor: 'blue' }
                            }}
                    />

                    {selectedDay && selectedDay.dateString >= formatDate(new Date()) && <View>
                        <Pressable style={themeStyles.button1} onPress={() => {
                            setModalReservarVisible(true)
                            setSelectedTime(new Date(selectedDay.timestamp))
                        }}>
                            <Text style={themeStyles.button1Text}>Reservar</Text>
                        </Pressable>
                    </View>}

                    {modalReservarVisible && selectedDay && < RNDateTimePicker
                        mode='time'
                        display="spinner"
                        is24Hour={true}
                        value={new Date(selectedDay.timestamp)}
                        minuteInterval={30}
                        positiveButton={{ label: 'Reservar', textColor: 'white' }}
                        negativeButton={{ label: 'Cancelar', textColor: 'white' }}
                        onChange={(e: DateTimePickerEvent, time: Date | undefined) => {
                            if (time && e.type == "set") {
                                reservar(new Date(e.nativeEvent.timestamp))
                            }
                            e.nativeEvent && setModalReservarVisible(false)
                        }} />
                    }


                    {/* Entrenos */}
                    <Text style={themeStyles.titol1}>Pròxims entrenos</Text>
                    {!alumne.Reserves ? (<Text style={themeStyles.text}>No hi ha entrenos pròximament</Text>
                    ) : (
                        alumne.Reserves.map((reserva) => (
                            stringDiaToDate(reserva.Hora).getMilliseconds() >= Date.now() && <Text key={reserva.ID} style={themeStyles.text}>{reserva.Hora}</Text>
                        )))}

                    {/* Rutina */}
                    <Text style={themeStyles.titol1}>Rutina actual</Text>
                    {alumne.RutinaActual ? (<ViewRutina rutinaID={alumne.RutinaActual} versio={1} acabarRutina={acabarRutina} />
                    ) : (
                        <View>
                            <Text style={themeStyles.text}>No té cap rutina assignada</Text>
                            <View style={{ marginHorizontal: "auto", marginVertical: 10, width: "80%" }}>
                                <AutocompleteRutines
                                    onSubmit={(id: number) => setAssignarRutinaID(id)}
                                    error={autocompleteRutinaError} />
                            </View>
                            <Pressable style={themeStyles.button1} onPress={() => {
                                handleAssignarRutina()
                            }}>
                                <Text style={themeStyles.button1Text}>Assignar rutina</Text>
                            </Pressable>
                        </View>
                    )}


                    <Pressable style={[themeStyles.buttonDanger, { marginBottom: 70 }]} onPress={() => {
                        setModalVisible(true)
                    }}>
                        <Text style={themeStyles.button1Text}>Expulsar</Text>
                    </Pressable>
                    <ModalConfirmacio
                        titol={'Expulsar usuari'}
                        missatge={'Segur que vols eliminar l\'usuari?'}
                        modalVisible={modalVisible}
                        closeModal={() => setModalVisible(false)}
                        confirmar={() => handleExpulsarUsuari()} />

                    {/*                 <ModalReservarHora
                    modalVisible={modalReservarVisible}
                    closeModal={() => setModalReservarVisible(false)}
                    onSubmit={(time: Date) => reservar(time)} /> */}

                </ScrollView>
            </SafeAreaView>
        </AutocompleteDropdownContextProvider>
    )
}