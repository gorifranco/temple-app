import React, { memo } from 'react'
import { AutocompleteDropdown } from 'react-native-autocomplete-dropdown'
import { Dimensions, Text } from 'react-native';
import { useAppSelector } from '@/store/reduxHooks';
import { useThemeStyles } from '@/themes/theme';
import { selectAllRutines } from '@/store/rutinesSlice';


function AutocompleteRutines(props) {
    const themeStyles = useThemeStyles()
    const { onSubmit, error } = props;
    const rutines = useAppSelector(selectAllRutines);
    const dataSet = rutines.map((rutina) => ({
        id: rutina.id,
        title: rutina.nom
    }));
    function handleSubmit(id) {
        onSubmit(id)
    }

    const errorStyle = {
        ...(error ? { borderColor: 'red' } : { borderColor: 'transparent' }),
        boxSizing: 'border-box',
        borderWidth: 1,
        borderRadius: 5
    };


    return (
        <AutocompleteDropdown
            containerStyle={errorStyle}
            rightButtonsContainerStyle={{ paddingRight: 20 }}
            clearOnFocus={false}
            closeOnBlur={true}
            onSelectItem={(item) => handleSubmit(item?.id)}
            dataSet={dataSet}
            textInputProps={{
                style: { color: "black" },
            }}
            suggestionsListMaxHeight={Dimensions.get('window').height * 0.3}
            inputContainerStyle={{ backgroundColor: "#e7e0ec", paddingVertical: 5, marginVertical: 0 }}
            renderItem={(item, text) => (
                <Text key={item.id} style={[themeStyles.text, { padding: 15 }]}>
                    {item.title}
                </Text>
            )}
        />
    )
}

export default memo(AutocompleteRutines)
