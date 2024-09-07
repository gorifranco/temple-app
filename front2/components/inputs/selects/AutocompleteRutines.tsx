import React, { memo, useState } from 'react'
import { AutocompleteDropdown } from 'react-native-autocomplete-dropdown'
import { themeStyles } from '@/themes/theme';
import { View, Dimensions, Text } from 'react-native';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux'
import { setRutines } from '@/store/rutinesSlice'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { RootState } from '@/store'
import { useAxios } from '@/app/api'


interface propsType {
    onSubmit: Function
}


function AutocompleteRutines(props: propsType) {
    const { onSubmit } = props;
    const rutines = useSelector((state: RootState) => state.rutines);
    const rutinesArray = Object.values(rutines);
    const dataSet = rutinesArray.map((rutina) => ({
        id: rutina.ID,
        title: rutina.Nom
    }));

    function handleSubmit(id: number) {
        onSubmit(id)
    }

    return (
        <View style={{ width: "80%", marginHorizontal: "auto", marginVertical: 0 }}>
            <AutocompleteDropdown
                clearOnFocus={false}
                closeOnBlur={true}
                onSelectItem={(item) => {
                    if (item && item.id !== undefined) {
                        handleSubmit(Number(item.id));
                    }
                }}
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
