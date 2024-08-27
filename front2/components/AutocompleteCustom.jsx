import { View } from "react-native";
import { Menu, TextInput } from "react-native-paper";
import React, { useState } from "react";
import { themeStyles } from '@/themes/theme';

const Autocomplete = ({
    value: origValue,
    data,
    containerStyle,
    onChange: origOnChange,
    style = {},
    maxItems,
}) => {
    const [value, setValue] = useState(origValue);
    const [menuVisible, setMenuVisible] = useState(false);
    const [filteredData, setFilteredData] = useState([]);

    function changeText(text) {
        setValue(text)
        origOnChange(text)
    }

    function filterData(text) {
        const filteredData = data.filter(
            (val) => val?.toLowerCase()?.indexOf(text?.toLowerCase()) > -1
        );
    
        return filteredData.slice(0, maxItems);
    };

    return (
        <View style={containerStyle}>
            <TextInput
                onFocus={() => {
                    if (value.length === 0) {
                        setMenuVisible(true);
                    }
                }}
                label={""}
                style={style}
                onChangeText={(text) => {
                    if (text && text.length > 0) {
                        setFilteredData(filterData(text));
                    } else if (text && text.length === 0) {
                        setFilteredData(data);
                    }
                    changeText(text)
                    setMenuVisible(true)
                }}
                value={value}
            />
            {menuVisible && filteredData && (
                <View style={themeStyles.autocompleteItems}>
                    {filteredData.map((datum, i) => (
                        <Menu.Item
                            key={i}
                            style={themeStyles.autocompleteDivs}
                            onPress={(e) => {
                                changeText(datum)
                                setMenuVisible(false)
                            }}
                            title={datum}
                        />
                    ))}
                </View>
            )}
        </View>
    );
};

export default Autocomplete;