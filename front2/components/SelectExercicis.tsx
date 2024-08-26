import React, { useState } from 'react';
import Autocomplete from 'react-native-autocomplete-input';
import { Text, TouchableOpacity, StyleSheet, View, Pressable } from 'react-native';
import { themeStyles } from '@/themes/theme';
import { useDispatch } from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface propsType {
    data: Map<Number, string>,
    selectedValue: string,
    setSelectedValue: Function,
}

export default function SelectExercicis(props: propsType) {
    const { data, selectedValue, setSelectedValue } = props;
    const [filteredData, setFilteredData] = useState<Map<Number, string>>(data);
    const [dropdownVisible, setDropdownVisible] = useState(false);


    const find = (text: string) => {
        if (text) {
            const filtered = new Map(
                Array.from(data).filter(([key, value]) =>
                    value.toLowerCase().includes(text.toLowerCase())
                )
            );
            setFilteredData(filtered);
        } else {
            setFilteredData(data);
        }
        setSelectedValue(text);
    };

    return (
        <View style={themeStyles.autocompleteStyle1}>
            <Autocomplete
                onFocus={() => setDropdownVisible(true)}
                onBlur={() => setDropdownVisible(false)}
                hideResults={!dropdownVisible}
                autoCapitalize="none"
                autoCorrect={false}
                data={Array.from(filteredData.values()).sort().slice(0, 7)}
                defaultValue={selectedValue}
                onChangeText={(text) => find(text)}
                placeholder="Exercicis disponibles"
                flatListProps={{
                    keyExtractor: (item) => item.toString(),
                    renderItem: ({ item }) =>
                        <TouchableOpacity onPress={() => {
                            console.log("aqui")
                            console.log(item)
                        }
                            
                        }>
                            <Text style={styles.itemText}>
                                {item}
                            </Text>
                        </TouchableOpacity>

                }}
            />
        </View>

    );
}

const styles = StyleSheet.create({
    itemText: {
        fontSize: 16,
    },
});