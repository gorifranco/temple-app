import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Pressable } from 'react-native';
import { Calendar, DateData, LocaleConfig } from 'react-native-calendars';
import { Picker } from '@react-native-picker/picker';
import { Text } from 'react-native';
import { calendarTheme, useThemeStyles } from '@/themes/theme';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ScrollView } from 'react-native-gesture-handler';
import RNDateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { useAppDispatch } from '@/store/reduxHooks';
import { createReservaAlumne } from '@/store/reservesSlice';


// Configurar el idioma
LocaleConfig.locales['es'] = {
  monthNames: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'],
  monthNamesShort: ['Ene.', 'Feb.', 'Mar.', 'Abr.', 'May.', 'Jun.', 'Jul.', 'Ago.', 'Sep.', 'Oct.', 'Nov.', 'Dic.'],
  dayNames: ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'],
  dayNamesShort: ['Dom.', 'Lun.', 'Mar.', 'Mié.', 'Jue.', 'Vie.', 'Sáb.'],
  today: 'Hoy',
};
LocaleConfig.defaultLocale = 'es';

export default function Index() {
  const today = new Date()
  const [selectedDay, setSelectedDay] = useState<DateData>({year: today.getFullYear(), month: today.getMonth()+1, day: today.getDate(),
     timestamp: today.getMilliseconds(), dateString: `${today.getFullYear()}-${today.getMonth()+1}-${today.getDate()}`});
  const [selectedHour, setSelectedHour] = useState('');
  const [selectedTime, setSelectedTime] = useState<Date>(new Date())
  const [errors, setErrors] = useState({
    Dia: ''
  });
  const [modalReservarVisible, setModalReservarVisible] = useState(false)
  const themeStyles = useThemeStyles();
  const dispatch = useAppDispatch()


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
                  setSelectedTime(new Date(selectedDay.timestamp))
                }}>
                  <Text style={themeStyles.button1Text}>Reservar</Text>
                </Pressable>
              </View>}
            </View>
          </View>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={selectedHour}
              onValueChange={(itemValue) => setSelectedHour(itemValue)}
              style={styles.picker}
            >
              <Picker.Item label="Selecciona una hora" value="" />
              <Picker.Item label="08:00" value="08:00" />
              <Picker.Item label="09:00" value="09:00" />
              <Picker.Item label="10:00" value="10:00" />
              <Picker.Item label="11:00" value="11:00" />
              <Picker.Item label="12:00" value="12:00" />
              <Picker.Item label="13:00" value="13:00" />
              <Picker.Item label="14:00" value="14:00" />
              <Picker.Item label="15:00" value="15:00" />
              <Picker.Item label="16:00" value="16:00" />
              <Picker.Item label="17:00" value="17:00" />
              <Picker.Item label="18:00" value="18:00" />
              <Picker.Item label="19:00" value="19:00" />
              <Picker.Item label="20:00" value="20:00" />
            </Picker>
          </View>

          {/* Next reservations */}
          <View style={themeStyles.box}>
            <Text style={[themeStyles.text, { paddingVertical: 20 }]}>Pròxims entrenos</Text>
          </View>

          <Text style={themeStyles.text}>Entrenos setmanals disponibles</Text>

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
      </ScrollView>
    </SafeAreaView>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  pickerContainer: {
    margin: 'auto',
    marginTop: 20,
    width: '90%'
  },
  picker: {
    paddingLeft: 10,
    height: 50,
    width: '100%',
  },
  wrapperCustom: {
    padding: 7,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#09f',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
