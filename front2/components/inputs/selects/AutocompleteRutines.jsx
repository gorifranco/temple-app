import React, { memo } from 'react'
import { AutocompleteDropdown } from 'react-native-autocomplete-dropdown'
import { Dimensions, Text } from 'react-native';
import { useAppSelector } from '@/store/reduxHooks';
import { useThemeStyles } from '@/themes/theme';
import { selectAllRutines } from '@/store/rutinesSlice';
import { useText } from '@/hooks/useText';
import { useAppTheme } from '@/themes/theme';
import { View } from 'react-native';


function AutocompleteRutines(props) {
    const texts = useText();
    const appTheme = useAppTheme();
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

    if (dataSet.length === 0) {
        dataSet.push({ id: -1, title: texts.WithoutRoutines })
    }

    const errorStyle = {
        ...(error ? { borderColor: 'red' } : { borderColor: 'transparent' }),
        boxSizing: 'border-box',
        borderWidth: 1,
        borderRadius: 5
    };


    return (
        <AutocompleteDropdown
            containerStyle={{ backgroundColor: appTheme.colors.surface }}
            rightButtonsContainerStyle={{ paddingRight: 20 }}
            clearOnFocus={false}
            closeOnBlur={true}
            onSelectItem={(item) => handleSubmit(item?.id)}
            dataSet={dataSet}
            textInputProps={{
                style: { color: appTheme.colors.surface },
            }}
            suggestionsListMaxHeight={Dimensions.get('window').height * 0.3}
            inputContainerStyle={{ backgroundColor: appTheme.colors.surface, paddingVertical: 5, marginVertical: 0 }}
            renderItem={(item, text) => (
                <View style={{ backgroundColor: appTheme.colors.surface }}>
                    <Text key={item.id} style={{ fontSize: 15, alignSelf: 'center', padding: 15, color: appTheme.colors.backgroundº }}>
                    {item.title}
                </Text>
                </ View>

            )}
        />
            )
}

            export default memo(AutocompleteRutines)
