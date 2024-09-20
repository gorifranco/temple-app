import React, { useState } from 'react';
import { Image, StyleSheet, View } from 'react-native';
import { router } from 'expo-router';
import { Pressable } from 'react-native';
import { useAppTheme } from '@/themes/theme';
import AntDesign from '@expo/vector-icons/AntDesign';

export default function BackButton({ href }) {
  const [isPressed, setIsPressed] = useState(false);
  const theme = useAppTheme();

  return (
    <View style={styles.divContainer}>
      <Pressable
        onPressIn={() => setIsPressed(true)}
        onPressOut={() => {
          setIsPressed(false);
          router.navigate(href);
        }}
        style={({ pressed }) => [
          {
            opacity: pressed ? 0.5 : 1,
          },
          styles.image,
        ]}
      >
        <AntDesign name="arrowleft" size={24} color={theme.colors.text} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  image: {
    width: 24,
    height: 24,
    transform: [{ scale: 1 }],
  },
  imagePressed: {
    transform: [{ scale: 0.9 }]
  },
  divContainer: {
    position: 'absolute',
    top: 25,
    left: 25,
    display: 'flex',
    width: 'auto',
    height: 30,
    zIndex: 100,
  },
});
