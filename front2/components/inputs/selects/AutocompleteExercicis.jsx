import React, { memo } from 'react'
import { AutocompleteDropdown } from 'react-native-autocomplete-dropdown'
import { Dimensions, Text } from 'react-native';
import { useThemeStyles } from '@/themes/theme';
import { useAppSelector } from '@/store/reduxHooks';
import { selectExercicis } from '@/store/exercicisSlice';
import { useAppTheme } from '@/themes/theme';
import { View } from 'react-native';


function AutocompleteExercicis(props) {
    const { onSubmit } = props;
    const appTheme = useAppTheme();
    const themeStyles = useThemeStyles();
    const exercicis = useAppSelector(selectExercicis);
    const dataSet = exercicis.map((exercici) => ({
        id: exercici.id,
        title: exercici.nom
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
            containerStyle={{ color: "black" }}
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

export default memo(AutocompleteExercicis)
