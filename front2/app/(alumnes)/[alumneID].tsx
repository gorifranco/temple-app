import { View, Text, Pressable, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import React, { useEffect, useState } from 'react';
import { useLocalSearchParams, router } from 'expo-router'
import { useAxios } from '../api';
import { ReservaType } from '@/types/apiTypes';
import { useSelector, useDispatch } from 'react-redux'
import { RootState } from '@/store'
import BackButton from '@/components/buttons/BackButton';
import { updateAlumne, deleteAlumnne } from '@/store/alumnesSlice';
import { Calendar, DateData } from 'react-native-calendars';
import ModalConfirmacio from '@/components/modals/ModalConfirmacio';
import Toast from 'react-native-toast-message';
import ViewRutina from '@/components/viewers/ViewRutina';
import { AutocompleteDropdownContextProvider } from 'react-native-autocomplete-dropdown'
import AutocompleteRutines from '@/components/inputs/selects/AutocompleteRutines';
import { useThemeStyles } from '@/themes/theme';
import RNDateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker'
import { addReserva } from '@/store/reservesSlice';
import { assignarRutinaAPI } from '@/app/api';
import { stringDiaToDate } from '@/helpers/timeHelpers';

export default function AlumneScreen() {
    const themeStyles = useThemeStyles()
    const [modalVisible, setModalVisible] = useState(false)
    const [assignarRutinaID, setAssignarRutinaID] = useState<number | null>(null)
    const [autocompleteRutinaError, setAutocompleteRutinaError] = useState("")
    const { alumneID } = useLocalSearchParams();
    const [selectedDay, setSelectedDay] = useState<DateData>();
    const [selectedTime, setSelectedTime] = useState<Date>(new Date())
    const api = useAxios();
    const dispatch = useDispatch();
    const [modalReservarVisible, setModalReservarVisible] = useState(false)
    const [errors, setErrorts] = useState({
        Hora: "",
        Dia: "",
    })

    const alumne = useSelector((state: RootState) => state.alumnes[Number(alumneID)]);

    useEffect(() => {
    }, [dispatch, alumneID]);

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
        const response = await api.post(`/reserves`, { hora: horaUTC, usuariID: alumne.ID });
        if (response.status === 200) {
            const reserva: ReservaType = { ID: Number(response.data.data), UsuariID: alumne.ID, Hora: horaUTC.toISOString(), Confirmada: false };
            dispatch(addReserva({ id: reserva.ID, data: reserva }));
            Toast.show({
                type: 'success',
                text1: 'Reserva creada',
                position: 'top',
            });
        } else {
            Toast.show({
                type: 'error',
                text1: 'Error creant la reserva',
                position: 'top',
            });
        }
    }

    async function expulsarUsuari() {
        const response = await api.get(`/entrenador/expulsarUsuari/${alumne.ID}`);

        if (response.status === 200) {
            dispatch(deleteAlumnne({ id: alumne.ID }))
            router.replace("../")
            Toast.show({
                type: 'success',
                text1: 'Usuari eliminat',
                position: 'top',
            });
        } else {
            Toast.show({
                type: 'error',
                text1: 'Error eliminant l\'usuari',
                position: 'top',
            })
        }
    }

    async function assignarRutina() {
        if (assignarRutinaID == null) {
            setAutocompleteRutinaError("Selecciona una rutina")
            return
        } else {
            setAutocompleteRutinaError("")
            const response = await assignarRutinaAPI(assignarRutinaID, alumne.ID)
            if (response == true) {
                const updatedAlumne = {
                    ...alumne,
                    RutinaAssignada: assignarRutinaID
                };
                dispatch(updateAlumne({ id: alumne.ID, data: updatedAlumne }))
            }
        }
    }

    async function acabarRutina() {
        const response = await api.post(`/entrenador/acabarRutina`, { usuariID: alumne.ID })
        if (response.status === 200) {
            Toast.show({
                type: 'success',
                text1: 'Rutina acabada',
                position: 'top',
            });
            let alumneUpdated = {
                ...alumne,
                RutinaAssignada: null
            }
            dispatch(updateAlumne({ id: alumne.ID, data: alumneUpdated }))
        } else {
            Toast.show({
                type: 'error',
                text1: 'Error acabant la rutina',
                position: 'top',
            });
        }
    }

    if (!alumne) {
        return (<View><Text>Carregant alumne</Text></View>)
    }

    return (
        <AutocompleteDropdownContextProvider>
            <SafeAreaView style={[themeStyles.background, {height: '100%'}]}>
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
                                assignarRutina()
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
                        confirmar={expulsarUsuari} />

                    {/*                 <ModalReservarHora
                    modalVisible={modalReservarVisible}
                    closeModal={() => setModalReservarVisible(false)}
                    onSubmit={(time: Date) => reservar(time)} /> */}

                </ScrollView>
            </SafeAreaView>
        </AutocompleteDropdownContextProvider>
    )
}