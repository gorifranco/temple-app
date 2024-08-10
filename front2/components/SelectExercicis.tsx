import React, { useEffect, useState } from 'react';
import { ExerciciType } from '../types/apiTypes';
import { useAxios } from '../app/api';
import Autocomplete from 'react-native-autocomplete-input';
import { Text, TouchableOpacity, StyleSheet, View } from 'react-native';

export default function SelectExercicis() {
    const api = useAxios();
    const [exercicis, setExercicis] = useState<ExerciciType[]>([]);
    const [filteredExercicis, setFilteredExercicis] = useState<ExerciciType[]>([]);
    const [selectedValue, setSelectedValue] = useState<ExerciciType>();

    useEffect(() => {
        api.get('/exercicis').then((response) => {
            setExercicis(response.data.data);
            setFilteredExercicis(response.data.data);
        });
    }, []);

    const findExercici = (text: string) => {
        if (text) {
            const filtered = exercicis.filter((item) => {
                return item.Nom.toLowerCase().includes(text.toLowerCase());
            });
            setFilteredExercicis(filtered);
            console.log(filtered)
        } else {
            setFilteredExercicis(exercicis);
        }
    };

    return (
            <Autocomplete
                autoCapitalize="none"
                autoCorrect={false}
                data={filteredExercicis}
                defaultValue={selectedValue ? selectedValue.Nom : ''}
                onChangeText={(text) => findExercici(text)}
                placeholder="Exercicis disponibles"
                flatListProps={{
                    keyExtractor: (item) => item.ID.toString(),
                    renderItem: ({ item }) =>
                        <TouchableOpacity
                            onPress={() => {
                                setSelectedValue(item);
                                setFilteredExercicis([item]);
                            }}>
                            <Text style={styles.itemText}>
                                {item.Nom}
                            </Text>
                        </TouchableOpacity>
                }}
            />
    );
}

const styles = StyleSheet.create({
    itemText: {
        fontSize: 16,
    },
});