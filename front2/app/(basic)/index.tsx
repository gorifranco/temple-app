import React, { useState, useEffect } from 'react';
import { getConfig, selectConfigStatus } from '@/store/configSlice';
import { View, Pressable } from 'react-native';
import { Calendar, DateData } from 'react-native-calendars';
import { Text } from 'react-native';
import { calendarTheme, useThemeStyles } from '@/themes/theme';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ScrollView } from 'react-native-gesture-handler';
import RNDateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { useAppDispatch, useAppSelector } from '@/store/reduxHooks';
import { createReservaAlumne, getReservesBasic, getReservesPerMes, selectAllReserves, selectReservesStatus, selectUpcomingReservesByAlumneID } from '@/store/reservesSlice';
import { selectUser } from '@/store/authSlice';
import Entreno from '@/components/viewers/Entreno';
import { actions, status } from '@/types/apiTypes';
import { useText } from '@/hooks/useText';
import { getExercicis, selectExercicisStatus } from '@/store/exercicisSlice';
import { getRmsBasic, getRmsEntrenador, selectRmsStatus } from '@/store/rmsSlice';

export default function Index() {
  const texts = useText();
  const user = useAppSelector(selectUser);
  const today = new Date()
    const [selectedDay, setSelectedDay] = useState<DateData>({
        year: today.getFullYear(), month: today.getMonth() + 1, day: today.getDate(),
        timestamp: today.getTime(), dateString: `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`
    });
    const [selectedMonth, setSelectedMonth] = useState<DateData>({
        year: today.getFullYear(), month: today.getMonth() + 1, day: today.getDate(),
        timestamp: today.getTime(), dateString: `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`
    })
  const [errors, setErrors] = useState({
    Dia: ''
  });
  const [modalReservarVisible, setModalReservarVisible] = useState(false)
  const themeStyles = useThemeStyles();
  const dispatch = useAppDispatch()
  const reserves = useAppSelector(state => selectUpcomingReservesByAlumneID(state, user!.id));
  const reservesStatus = useAppSelector(selectReservesStatus);
  const exercicisStatus = useAppSelector(selectExercicisStatus);
  const configStatus = useAppSelector(selectConfigStatus);
  const rmsStatus = useAppSelector(selectRmsStatus);
  
      useEffect(() => {
          if (exercicisStatus == "idle") dispatch(getExercicis())
          if (configStatus == "idle") dispatch(getConfig())
          if (reservesStatus[actions.index] == status.idle) dispatch(getReservesBasic())
          if (rmsStatus[actions.index] == status.idle) dispatch(getRmsBasic())
      }, []);
  

  async function reservar(hora: Date) {
    if (!selectedDay) {
      setErrors({ ...errors, Dia: "Selecciona un dia" });
      return;
    }
    const horaUTC = new Date(hora.getTime() - hora.getTimezoneOffset() * 60000);
    dispatch(createReservaAlumne({ hora: horaUTC.toISOString() }));
  }

  function formatDate(date: Date) {
    return date.toISOString().split('T')[0];
  };

  return (
    <SafeAreaView style={themeStyles.background}>
      <ScrollView>
        <View style={themeStyles.basicContainer}>
          <View style={themeStyles.box}>
            <Calendar
              firstDay={1}
              onDayPress={(day: DateData) => { setSelectedDay(day) }}
              theme={calendarTheme}
              style={{ margin: 5 }}
              markedDates={
                selectedDay && {
                  [selectedDay.dateString]: { selected: true }
                }}

            />

            <View style={{ width: "100%" }}>
              {selectedDay && selectedDay.dateString >= formatDate(new Date()) && <View>
                <Pressable style={[themeStyles.button1, { marginBottom: 20, marginTop: 0 }]} onPress={() => {
                  setModalReservarVisible(true)
                }}>
                  <Text style={themeStyles.button1Text}>{texts.Reservate}</Text>
                </Pressable>
              </View>}
            </View>
          </View>

          {/* Next reservations */}
          <View style={[themeStyles.box, { marginVertical: 20 }]}>
            <Text style={[themeStyles.text, { fontSize: 20, textAlign: "center", marginTop: 20, marginBottom: 20 }]}>
              Pròxims entrenos
            </Text>
            {reservesStatus[actions.index] == status.failed && (<Text style={[themeStyles.text, { marginBottom: 20 }]}>Error fetching reserves</Text>)}
            {reserves && reserves.length == 0 && (<Text style={[themeStyles.text, { marginBottom: 20 }]}>Sense entrenos reservats</Text>)}
            {reserves && reserves.length > 0 && (
              reserves.map((r, i) => {
                return (
                  <Entreno alumneID={r.usuariID} data={r.hora} key={i} />
                )
              })
            )}
          </View>

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
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

