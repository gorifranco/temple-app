import React from 'react'
import { Image, StyleSheet } from 'react-native'
import { Link } from 'expo-router'
import { TouchableOpacity } from 'react-native-gesture-handler';

export default function BackButton({ href })
 {
  return (
    <div style={styles.divContainer}>
      <Link href={href} asChild>
        <TouchableOpacity >
          <Image
            style={styles.image}
            source={require('../assets/arrow_back.png')}
          />
        </TouchableOpacity>
      </Link>
    </div>
  );
}


const styles = StyleSheet.create({
  image: {
    width: 24,
    height: 24,
  },
  divContainer: {
    position: 'absolute',
    top: 25,
    left: 25,
    display: 'flex',
    width: '100%',
    height: "30px",
  },
})
