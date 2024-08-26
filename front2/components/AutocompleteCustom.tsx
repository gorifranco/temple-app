import React, { useState } from 'react';
import { View } from 'react-native';
import { themeStyles } from '@/themes/theme';
import TextInput from './TextInput';

interface propsType {
    data: Map<Number, string>,
    selectedValue: string,
    setSelectedValue: Function,
}

export default function AutocompleteCustom(props: propsType) {
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
            <TextInput />
        </View>
    )
}
