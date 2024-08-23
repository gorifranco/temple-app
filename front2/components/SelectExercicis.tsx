import React, { useState } from 'react';
import Autocomplete from 'react-native-autocomplete-input';
import { Text, TouchableOpacity, StyleSheet, View } from 'react-native';
import { themeStyles } from '@/themes/theme';

interface propsType {
    data: Map<Number, string>,
    selectedValue: string,
    setSelectedValue: Function,
    dropdownVisible: boolean,
}

export default function SelectExercicis(props: propsType) {
    const { data, dropdownVisible, selectedValue, setSelectedValue } = props;
    const [filteredData, setFilteredData] = useState<Map<Number, string>>(data);


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
    };

    return (
        <View style={themeStyles.autocompleteStyle1}>
            <Autocomplete
                hideResults={!dropdownVisible}
                autoCapitalize="none"
                autoCorrect={false}
                data={Array.from(filteredData.values())}
                defaultValue={selectedValue}
                onChangeText={(text) => find(text)}
                placeholder="Exercicis disponibles"
                flatListProps={{
                    keyExtractor: (item) => item.toString(),
                    renderItem: ({ item }) =>
                        <TouchableOpacity
                            style={themeStyles.autocompleteDropdown1}
                            onPress={() => {
                                setSelectedValue(item);
                            }}>
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