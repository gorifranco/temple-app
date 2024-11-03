import { router } from "expo-router";
import React from "react";
import { Pressable, Text, View } from "react-native";
import { useAppSelector } from "@/store/reduxHooks";
import { selectAllRutines, selectRutinesError, selectRutinesStatus } from "@/store/rutinesSlice";
import { useThemeStyles } from "@/themes/theme";
import ViewRutina from "./ViewRutina";

export default function RL() {
  const themeStyles = useThemeStyles();
  const rutines = useAppSelector(selectAllRutines);
  const rutinesStatus = useAppSelector(selectRutinesStatus);
  const rutinesError = useAppSelector(selectRutinesError);


  return (
    <View>
      <Text style={themeStyles.titol1}>Rutines</Text>
      <View>
        {rutines.length === 0 && (
          <Text style={themeStyles.text}>Encara no tens cap rutina</Text>
        )}
        {rutines.length > 0 &&
          rutines.map((rutina, i) => (
            <ViewRutina rutinaID={rutina.id} key={i} />
          ))}
      </View>

      <View>
        <Pressable
          style={themeStyles.button1}
          onPress={() => {
            router.replace("../(rutines)/crearRutina");
          }}
        >
          <Text style={themeStyles.button1Text}>Crea una rutina</Text>
        </Pressable>
        <Pressable
          style={[themeStyles.button1, { marginBottom: 60 }]}
          onPress={() => {
            router.replace("../(rutines)/rutinesPubliques");
          }}
        >
          <Text style={themeStyles.button1Text}>Rutines públiques</Text>
        </Pressable>
      </View>
    </View>
  )
}
  

