import React, { memo, useState } from 'react'
import { AutocompleteDropdown } from 'react-native-autocomplete-dropdown'
import { useSelector } from 'react-redux'
import { themeStyles } from '@/themes/theme';
import { View, Dimensions, Text } from 'react-native';


function AutocompleteExercicis(props) {
    const { onSubmit, setSelectedValue } = props;
    const exercicis = useSelector((state) => state.exercicis);
    const dataSet = exercicis.map((exercici) => ({
        id: exercici.ID.toString(),
        title: exercici.Nom
    }));

    function handleSubmit(id) {
        setSelectedValue(id);
        onSubmit(id)
    }

    return (
        <View style={{ width: "80%", margin: "auto", marginBottom: 0 }}>
            <AutocompleteDropdown
            style={{marginBottom: 0}}
                clearOnFocus={false}
                closeOnBlur={true}
                onSelectItem={(item) => handleSubmit(item?.id)}
                dataSet={dataSet}
                suggestionsListMaxHeight={Dimensions.get('window').height * 0.3}
                inputContainerStyle={{ backgroundColor: "#e7e0ec", paddingVertical: 5 }}
                renderItem={(item, text) => (
                    <Text style={[themeStyles.text, { padding: 15 }]}>
                        {item.title}
                    </Text>
                )}
            />
        </View>
    )
}

export default memo(AutocompleteExercicis)
