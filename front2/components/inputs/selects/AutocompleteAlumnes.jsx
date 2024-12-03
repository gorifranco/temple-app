import React, { memo } from 'react'
import { AutocompleteDropdown } from 'react-native-autocomplete-dropdown'
import { Dimensions, Text } from 'react-native';
import { useThemeStyles } from '@/themes/theme';
import { useAppSelector } from '@/store/reduxHooks';
import { selectAllAlumnes } from '@/store/alumnesSlice';
import { useAppTheme } from '@/themes/theme';
import { View } from 'react-native';


function AutocompleteAlumnes(props) {
    const { onSubmit, initialValue } = props;
    const appTheme = useAppTheme();
    const alumnes = useAppSelector(selectAllAlumnes);
    const dataSet = alumnes.map((alumne) => ({
        id: alumne.id,
        title: alumne.nom
    }));

    function handleSubmit(id) {
        onSubmit(id)
    }

    return (
        <AutocompleteDropdown
            style={{ marginBottom: 0 }}
            clearOnFocus={false}
            closeOnBlur={true}
            onSelectItem={(item) => handleSubmit(item?.id)}
            dataSet={dataSet}
            suggestionsListMaxHeight={Dimensions.get('window').height * 0.3}
            inputContainerStyle={{ backgroundColor: "#e7e0ec", paddingVertical: 5 }}
            textInputProps={{
                style: { color: "black" },
            }}
            initialValue={initialValue ?? {}}
            containerStyle={{ color: "black" }}
            renderItem={(item, text) => (
                <View style={{ backgroundColor: appTheme.colors.surface }}>
                    <Text key={item.id} style={{ fontSize: 15, alignSelf: 'center', padding: 15, color: appTheme.colors.background }}>
                        {item.title}
                    </Text>
                </ View>
            )}
        />
    )
}

export default memo(AutocompleteAlumnes)
