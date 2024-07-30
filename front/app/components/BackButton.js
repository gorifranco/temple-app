import React from 'react'
import { Image, StyleSheet } from 'react-native'
import { getStatusBarHeight } from 'react-native-status-bar-height'
import { Link } from 'expo-router'

export default function BackButton({href}) {
  return (
    <Link asChild href={{href}}>
      <div style={styles.container}>
      <Image
        style={styles.image}
        source={require('../assets/arrow_back.png')}
      />
      </div>        
    </Link>
  )
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 10 + getStatusBarHeight(),
    left: 4,
  },
  image: {
    width: 24,
    height: 24,
  },
})
