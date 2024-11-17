import React, { memo } from 'react'
import { AutocompleteDropdown } from 'react-native-autocomplete-dropdown'
import { Dimensions, Text } from 'react-native';
import { useThemeStyles } from '@/themes/theme';
import { useAppSelector } from '@/store/reduxHooks';
import { selectExercicis } from '@/store/exercicisSlice';


function AutocompleteExercicis(props) {
    const { onSubmit } = props;
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
            style={{marginBottom: 0}}
                clearOnFocus={false}
                closeOnBlur={true}
                onSelectItem={(item) => handleSubmit(item?.id)}
                dataSet={dataSet}
                suggestionsListMaxHeight={Dimensions.get('window').height * 0.3}
                inputContainerStyle={{ backgroundColor: "#e7e0ec", paddingVertical: 5 }}
                textInputProps={{
                    style: { color: "black" },
                }}
                containerStyle={{color: "black"}}
                renderItem={(item, text) => (
                    <Text key={item.id} style={[themeStyles.text, { padding: 15 }]}>
                        {item.title}
                    </Text>
                )}
            />
    )
}

export default memo(AutocompleteExercicis)
