import { View, Text, Pressable, SafeAreaView, ScrollView } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useLocalSearchParams, router } from 'expo-router'
import { useAxios } from '../api';
import { AlumneType } from '@/types/apiTypes'
import { useSelector, useDispatch } from 'react-redux'
import { RootState } from '@/store'
import BackButton from '@/components/BackButton';
import { updateAlumne, deleteAlumnne } from '../../store/alumnesSlice';
import { Calendar } from 'react-native-calendars';
import ModalConfirmacio from '@/components/modals/ModalConfirmacio';
import Toast from 'react-native-toast-message';
import ViewRutina from '@/components/viewers/ViewRutina';
import { AutocompleteDropdownContextProvider } from 'react-native-autocomplete-dropdown'
import AutocompleteRutines from '@/components/inputs/selects/AutocompleteRutines';
import RNDateTimePicker from '@react-native-community/datetimepicker';
import { useThemeStyles } from '@/themes/theme';

export default function AlumneScreen() {
    const themeStyles = useThemeStyles()
    const [modalVisible, setModalVisible] = useState(false)
    // const [modalRutinaVisible, setModalRutinaVisible] = useState(false)
    const [assignarRutinaID, setAssignarRutinaID] = useState<number | null>(null)
    const [autocompleteRutinaError, setAutocompleteRutinaError] = useState("")
    const { alumneID } = useLocalSearchParams();
    const [selectedDay, setSelectedDay] = useState('');
    const api = useAxios();
    const dispatch = useDispatch();
    const [selectedTime, setSelectedTime] = useState<Date>(new Date())

    const alumne = useSelector((state: RootState) => state.alumnes[Number(alumneID)]);

    useEffect(() => {
        /*         fetchApi(); */
    }, [dispatch, alumneID]);

    function handleDayPress(day: { dateString: React.SetStateAction<string>; }) {
        setSelectedDay(day.dateString);
    }

    async function fetchApi() {
        const response = await api.get(`entrenador/alumnes/${alumneID}`);
        const a: AlumneType = {
            ID: response.data.data.ID,
            Nom: response.data.data.Nom,
            Entrenos: [],
            Reserves: [],
            RutinaAssignada: response.data.data.RutinaAssignada
        }
        if (response.status === 200) {
            const fetchedAlumne: AlumneType = response.data.data;
            if (!alumne || alumne !== fetchedAlumne) {
                dispatch(updateAlumne({ id: Number(alumneID), data: fetchedAlumne }));
            }
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
            const response = await api.post(`/entrenador/assignarRutina`, { rutinaID: assignarRutinaID, alumneID: alumne.ID })
            if (response.status === 200) {
                Toast.show({
                    type: 'success',
                    text1: 'Rutina assignada',
                    position: 'top',
                });
                const updatedAlumne = {
                    ...alumne,
                    RutinaAssignada: assignarRutinaID
                };
                dispatch(updateAlumne({ id: alumne.ID, data: updatedAlumne }))
            } else {
                Toast.show({
                    type: 'error',
                    text1: 'Error assignant la rutina',
                    position: 'top',
                });
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
        return (<View>Carregant alumne</View>)
    }

    return (
        <AutocompleteDropdownContextProvider>
            <ScrollView style={themeStyles.background}>
                <BackButton href={"../"} />
                <Text style={themeStyles.titol1}>{alumne.Nom}</Text>
                <Calendar
                    firstDay={1}
                    onDayPress={handleDayPress}
                    markedDates={{
                        [selectedDay]: { selected: true, marked: true, selectedColor: 'blue' }
                    }}
                />

                <View style={{height: "auto"}}>
                    <RNDateTimePicker
                        mode='time'
                        display="spinner"
                        is24Hour={true}
                        value={selectedTime}
                        onChange={(e) => console.log(e)} />
                </View>


                {/* Entrenos */}
                <Text style={themeStyles.titol1}>Pròxims entrenos</Text>
                {!alumne.Entrenos ? (<Text style={themeStyles.text}>No hi ha entrenos pròximament</Text>
                ) : (
                    alumne.Entrenos.map((entreno) => (
                        entreno.DiaRutina >= Date.now() && <Text key={entreno.DiaRutina} style={themeStyles.text}>{entreno.Dia_hora.toDateString()}</Text>
                    )))}

                {/* Rutina */}
                <Text style={themeStyles.titol1}>Rutina actual</Text>
                {alumne.RutinaAssignada ? (<ViewRutina rutinaID={alumne.RutinaAssignada} versio={1} acabarRutina={acabarRutina} />
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


                <Pressable style={[themeStyles.buttonDanger, { marginBottom: 30 }]} onPress={() => {
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
                {/* <ModalRutines
                    modalVisible={modalRutinaVisible}
                    closeModal={() => setModalRutinaVisible(false)}
                /> */}
            </ScrollView>
        </AutocompleteDropdownContextProvider>
    )
}