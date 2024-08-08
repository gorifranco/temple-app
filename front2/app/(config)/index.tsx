import { View, Text, Pressable } from 'react-native';
import React from 'react';
import { useContext } from 'react';
import AuthContext, { AuthContextType } from '../AuthContext';

export default function Index() {
  const authContext = useContext<AuthContextType | undefined>(AuthContext);

  if (!authContext) {
    throw new Error("AuthProvider is missing. Please wrap your component tree with AuthProvider.");
  }
  const { logout } = authContext;

  return (
    <View>
      <Pressable onPress={() => logout()}>
        <Text style={{ color: 'black' }}>Logout</Text>
        </Pressable>
    </View>
  );
}