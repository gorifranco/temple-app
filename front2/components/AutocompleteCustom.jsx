import { View } from "react-native";
import { Menu, TextInput } from "react-native-paper";
import React, { useState } from "react";

const Autocomplete = ({
    value: origValue,
    data,
    containerStyle,
    onChange: origOnChange,
    style = {},
    menuStyle = {},
    right = () => { },
    left = () => { },
}) => {
    const [value, setValue] = useState(origValue);
    const [menuVisible, setMenuVisible] = useState(false);
    const [filteredData, setFilteredData] = useState([]);

    const filterData = (text) => {
        return data.filter(
            (val) => val?.toLowerCase()?.indexOf(text?.toLowerCase()) > -1
        );
    };
    return (
        <View style={[containerStyle]}>
            <TextInput
                onFocus={() => {
                    if (value.length === 0) {
                        setMenuVisible(true);
                    }
                }}
                onBlur={() => setMenuVisible(false)}
                label={""}
                right={right}
                left={left}
                style={style}
                onChangeText={(text) => {
                    origOnChange(text);
                    if (text && text.length > 0) {
                        setFilteredData(filterData(text));
                    } else if (text && text.length === 0) {
                        setFilteredData(data);
                    }
                    setMenuVisible(true);
                    setValue(text);
                }}
                value={value}
            />
            {menuVisible && filteredData && (
                <View
                    style={{
                        margin: "auto",
                        width: '80%',
                        flex: 1,
                        backgroundColor: 'white',
                        borderWidth: 1,
                        flexDirection: 'column',
                        borderColor: 'grey',
                    }}
                >
                    {filteredData.map((datum, i) => (
                        <Menu.Item
                            key={i}
                            style={[{ width: '100%' }, menuStyle]}
                            onPress={() => {
                                setValue(datum);
                                origOnChange(datum);
                                setMenuVisible(false);
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