import { StyleSheet } from 'react-native';
import { SafeAreaView, Text } from 'react-native';


export default function ConfigScreen() {
  return (
    <SafeAreaView>
      <Text>Configuració</Text>
    </SafeAreaView>
  
  );
}

const styles = StyleSheet.create({
  headerImage: {
    color: '#808080',
    bottom: -90,
    left: -35,
    position: 'absolute',
  },
  titleContainer: {
    flexDirection: 'row',
    gap: 8,
  },
});
