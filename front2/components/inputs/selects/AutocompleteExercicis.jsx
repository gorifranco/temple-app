import React, { memo } from 'react'
import { AutocompleteDropdown } from 'react-native-autocomplete-dropdown'
import { useSelector } from 'react-redux'
import { Dimensions, Text } from 'react-native';
import { useThemeStyles } from '@/themes/theme';


function AutocompleteExercicis(props) {
    const { onSubmit } = props;
    const themeStyles = useThemeStyles();
    const exercicis = useSelector((state) => state.exercicis);
    const dataSet = exercicis.map((exercici) => ({
        id: exercici.ID,
        title: exercici.Nom
    }));

    function handleSubmit(id) {
        onSubmit(id)
    }

    return (
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
    )
}

export default memo(AutocompleteExercicis)
