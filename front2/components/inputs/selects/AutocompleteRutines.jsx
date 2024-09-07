import React, { memo } from 'react'
import { AutocompleteDropdown } from 'react-native-autocomplete-dropdown'
import { themeStyles } from '@/themes/theme';
import { View, Dimensions, Text } from 'react-native';
import { useSelector } from 'react-redux'
import { RootState } from '@/store'


function AutocompleteRutines(props) {
    const { onSubmit } = props;
    const rutines = useSelector((state) => state.rutines);
    const dataSet = rutines.map((rutina) => ({
        id: rutina.ID,
        title: rutina.Nom
    }));
    console.log(rutines)

    function handleSubmit(id) {
        onSubmit(id)
    }

    return (
        <View style={{ width: "80%", marginHorizontal: "auto", marginVertical: 0 }}>
            <AutocompleteDropdown
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

export default memo(AutocompleteRutines)
