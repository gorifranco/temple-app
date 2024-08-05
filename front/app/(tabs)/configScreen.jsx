import { StyleSheet } from 'react-native';
import { SafeAreaView, Text } from 'react-native';
import { Button } from 'react-native-paper';
import { useContext } from 'react';
import AuthContext from '../AuthContext';
import { useNavigation } from 'expo-router';


export default function ConfigScreen() {

  const {logout, user } = useContext(AuthContext);

  const navigation = useNavigation();

  function doLogout() {
    logout();
    navigation.navigate('(auth)');
  }

  function printUser(){
    console.log(user)
  }
  return (
    <SafeAreaView>
      <Text>Configuració</Text>
      <Button onPress={doLogout}>Logout</Button>
      <Button onPress={printUser}>Print user</Button>
    </SafeAreaView>
  
  );
}

