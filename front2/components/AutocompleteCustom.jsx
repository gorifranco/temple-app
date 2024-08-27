import React, { memo, useState } from 'react'
import { Text } from 'react-native'
import { AutocompleteDropdown } from 'react-native-autocomplete-dropdown'
import { useSelector } from 'react-redux'
import { RootState } from '@/store'

function AutocompleteExercicis() {
  const [selectedItem, setSelectedItem] = useState(null)
  const exercicis = useSelector((state) => state.exercicis);

  return (
    <>
      <AutocompleteDropdown
        clearOnFocus={false}
        closeOnBlur={true}
        onSelectItem={setSelectedItem}
        dataSet={[
          { id: '1', title: 'Gori' },
          { id: '2', title: 'Tomeu' },
          { id: '3', title: 'Tofol' }
        ]}
        suggestionsListMaxHeight={500}
        renderItem={(item, text) => (
          <Text style={{ color: '#f00', padding: 28, textAlign: 'center', fontWeight: 'bold', fontSize: 16 }}>
            -= {item.title} =-
          </Text>
        )}
      />
      <Text style={{ color: '#668', fontSize: 13 }}>Selected item: {JSON.stringify(selectedItem)}</Text>
    </>
  )
}

export default memo(AutocompleteCustom)
