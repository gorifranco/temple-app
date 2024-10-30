import React, { useState, useEffect } from 'react';
import { SafeAreaView, StyleSheet, View, Pressable } from 'react-native';
import { Calendar, LocaleConfig } from 'react-native-calendars';
import { Picker } from '@react-native-picker/picker';
import { Text } from 'react-native';
import { ActivityIndicator } from 'react-native';


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
  const [loading, setLoading] = useState(true);
  const [selectedDay, setSelectedDay] = useState('');
  const [selectedHour, setSelectedHour] = useState('');

  useEffect(() => {
  }, []);

  const handleDayPress = (day: { dateString: React.SetStateAction<string>; }) => {
    setSelectedDay(day.dateString);
  };

  const handleSubmit = () => {
    if (selectedDay !== '' && selectedHour !== '') {
      alert(`Día: ${selectedDay}, Hora: ${selectedHour}`);
    } else {
      alert('Por favor selecciona una fecha y una hora');
    }
  };

  if (loading) {
    return <ActivityIndicator size="large" color="#00ff00" />
  }
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.calendarContainer}>1
        <Calendar
          firstDay={1}
          onDayPress={handleDayPress}
          markedDates={{
            [selectedDay]: { selected: true, marked: true, selectedColor: 'blue' }
          }}
        />
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
      <View style={styles.buttonContainer}>
        <Pressable
          onPress={() => {
            handleSubmit()
          }}
          style={({ pressed }) => [
            {
              backgroundColor: pressed ? 'rgb(210, 230, 255)' : 'white',
            },
            styles.wrapperCustom,
          ]}>
          {({ pressed }) => (
            <Text style={styles.buttonText}>Reservar</Text>
          )}
        </Pressable>
      </View>
      <Text style={styles.text}>Pròxims entrenos</Text>
      <Text style={styles.text}>Entrenos setmanals disponibles</Text>
    </SafeAreaView>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  calendarContainer: {
    margin: 20,
  },
  pickerContainer: {
    margin: 20,
  },
  picker: {
    paddingLeft: 10,
    height: 50,
    width: '100%',
  },
  buttonContainer: {
    margin: 20,
  },
  text: {
    textAlign: 'center',
    marginBottom: 10,
  },
  wrapperCustom: {
    padding: 7,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#09f',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: '#09f',
    fontSize: 20,
  },
});
