import { View, Text } from 'react-native';
import React, { useEffect, useState } from 'react';
import SelectExercicis from '@/components/SelectExercicis';
import { themeStyles } from '@/themes/theme';
import BackButton from '@/components/BackButton';
import { ExerciciRutinaType, ExerciciType } from '@/types/apiTypes';
import { useAxios } from '@/app/api';
import { Pressable } from 'react-native';


export default function CrearRutina() {
    const api = useAxios();
    const [exercicis, setExercicis] = useState<ExerciciType[]>([]);
    const [exercicisElegits, setExercicisElegits] = useState<(ExerciciRutinaType | null)[]>([]);

    useEffect(() => {
        api.get('/exercicis').then((response) => {
            setExercicis(response.data.data);
        });
    }, []);

    return (
        <View>
            <BackButton href={"(entrenador)"} />
            <Text style={themeStyles.titol1}>Creador de rutines</Text>
            {exercicisElegits.map((key, exercici) => (
                <SelectExercicis
                    data={new Map(exercicis.map((item) => [item.ID, item.Nom]))}
                    dropdownVisible={true}
                    selectedValue={exercicis.find((item) => item.ID === exercici?.ExerciciID)?.Nom ?? ""}
                    setSelectedValue={(value: string) => set }
                />
            ))}

            <Pressable
                style={themeStyles.button1}
                onPress={() => {
                    setExercicisElegits([
                        ...exercicisElegits,
                        {
                            ID: null,
                            RutinaID: null,
                            ExerciciID: 0,
                            Ordre: 0,
                            NumSeries: 0,
                            NumRepes: 0,
                            Cicle: 0,
                            PercentatgeRM: 0,
                            DiaRutina: 0,
                        },
                    ]);
                }}
            >
                <Text style={themeStyles.button1Text}>Afegir exercici</Text>
            </Pressable>
        </View>
    )
}