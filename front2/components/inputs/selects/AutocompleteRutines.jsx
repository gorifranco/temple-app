import React, { memo } from 'react'
import { AutocompleteDropdown } from 'react-native-autocomplete-dropdown'
import { themeStyles } from '@/themes/theme';
import { View, Dimensions, Text } from 'react-native';
import { useSelector } from 'react-redux'


function AutocompleteRutines(props) {
    const { onSubmit } = props;
    const rutinesArray = Object.values(useSelector((state) => state.rutines));
    const dataSet = rutinesArray.map((rutina) => ({
        id: rutina.ID,
        title: rutina.Nom
    }));
    console.log(dataSet)

    function handleSubmit(id) {
        onSubmit(id)
    }

    return (
            <AutocompleteDropdown
            rightButtonsContainerStyle={{paddingRight: 10}}
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
    )
}

export default memo(AutocompleteRutines)
