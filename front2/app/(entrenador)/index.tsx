import { View, Text, Pressable } from 'react-native';
import React, { useState } from 'react';
import { StyleSheet } from 'react-native'
import TextInput from '@/components/TextInput';
import { nomSalaValidator } from '../../helpers/validators';
import { useAxios } from '../api';
import Toast from 'react-native-toast-message';
import { theme } from '../../themes/theme';

export default function Index() {
  const [nomSala, setNomSala] = useState('')
  const [errors, setErrors] = useState({
    nomSala: '',
  });
  const api = useAxios();

  async function crearSala() {
    const nomSalaError = nomSalaValidator(nomSala)
    if (nomSalaError) {
      setErrors({ ...errors, nomSala: nomSalaError })
      return
    }
    try {
      const response = await api.post('/sales', { nom: nomSala });
    } catch (error) {
      console.error('Error creating sala', error);
    }
  }




  return (
    <View>
      <Text style={styles.primeraSala}>Crea la teva primera sala</Text>
      <TextInput
        style={styles.salaInput}
        label="Nom de la sala"
        returnKeyType="next"
        value={nomSala}
        onChangeText={(text: string) => setNomSala(text)}
        error={!!errors.nomSala}
        errorText={errors.nomSala}
        autoCapitalize="none"
      />
      <Pressable
      style={styles.button}
        onPress={() => {
          crearSala()
        }}
      >
        <Text style={styles.buttonText}>Crear</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  primeraSala: {
    fontSize: 20,
    marginTop: 20,
    color: 'black',
    textAlign: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 15,
  },
  salaInput: {
    width: '80%',
    margin: "auto",
  },
  button: {
    backgroundColor: theme.colors.primary,
    padding: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginTop: 20,
    alignSelf: 'center',
  }
})