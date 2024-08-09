import { View, Text, Pressable } from 'react-native';
import React, { useState } from 'react';
import { StyleSheet } from 'react-native'
import TextInput from '@/components/TextInput';
import { nomSalaValidator } from '../../helpers/validators';
import { useAxios } from '../api';
import Toast from 'react-native-toast-message';
import { theme } from '../../themes/theme';
import * as types from '../../types/apiTypes';

export default function Index() {
  const [nomSala, setNomSala] = useState('')
  const [errors, setErrors] = useState({
    nomSala: '',
  });
  const [sales, setSales] = useState<types.SalaType[]>([])
  const api = useAxios();

  async function getSales() {
    let response = await api.get('/sales/salesEntrenador')
    setSales(response.data.data)
  }

  async function crearSala() {
    let nomSalaError = nomSalaValidator(nomSala)
    if (nomSalaError) {
      setErrors({ ...errors, nomSala: nomSalaError })
      return
    }
    let response = await api.post('/sales', { nom: nomSala });
    if (response.status === 200) {
      Toast.show({
        type: 'success',
        text1: 'Sala creada',
        position: 'top',
      });
      getSales()
    } else {
      Toast.show({
        type: 'error',
        text1: 'Error creant la sala',
        position: 'top',
      });
    }
  }

  if (sales.length === 0) {
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
  }else{
    return (
      <View>
        <Text>Sala {sales[0].nom}</Text>
      </View>
    )
  }
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