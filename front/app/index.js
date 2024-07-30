import { Text, View } from 'react-native';
import { useNavigation } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect } from 'react';

export default function Index() {
  const navigation = useNavigation();

  useEffect(() => {
    const checkUser = async () => {
      try {
        const user = await AsyncStorage.getItem('user');
        if (!user) {
          navigation.navigate('(auth)');
        }else{
          navigation.navigate('(tabs)');
        }
      } catch (error) {
        console.error('Error checking user', error);
      }
    };

    checkUser();
  }, []);
  return (

        <Text style={{"color": "wihte"}}>Index</Text>

  );
}