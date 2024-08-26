import { View, Text } from 'react-native';
import React, { useEffect, useState } from 'react';
import { themeStyles } from '@/themes/theme';
import BackButton from '@/components/BackButton';
import { ExerciciRutinaType, ExerciciType } from '@/types/apiTypes';
import { useAxios } from '@/app/api';
import { Pressable } from 'react-native';
import { useDispatch } from 'react-redux';
import { setExercicis } from '@/store/exercicisSlice';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import AutocompleteCustom from '@/components/AutocompleteCustom';


export default function CrearRutina() {
    const api = useAxios();
    const [exercicisElegits, setExercicisElegits] = useState<(ExerciciRutinaType | null)[]>([]);
    const dispatch = useDispatch();

    const exercicis = useSelector((state: RootState) => state.exercicis);

    useEffect(() => {
        fetchApiExercicis();
    }, [dispatch]);

    async function fetchApiExercicis() {
        const response = await api.get(`exercicis`);
        if (response.status === 200) {
            const fetchedExercicis: ExerciciType[] = response.data.data;
            dispatch(setExercicis(fetchedExercicis));
        }
    }

    return (
        <View>
            <BackButton href={"(entrenador)"} />
            <Text style={themeStyles.titol1}>Creador de rutines</Text>
            <AutocompleteCustom data={}/>

            <Pressable
                style={themeStyles.button1}
                onPress={() => {
                    setExercicisElegits([
                        ...exercicisElegits,
                        {
                            ID: null,
                            Nom: "",
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
