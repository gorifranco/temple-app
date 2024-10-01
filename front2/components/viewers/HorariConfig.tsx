import React from 'react'
import { View, Text, StyleSheet } from 'react-native'
import FletxaDesplegar from '@/components/icons/FletxaDesplegar'
import { useThemeStyles } from '@/themes/theme'
import TextInput from '../inputs/TextInput'

export default function HorariConfig() {
    const [fletxaAmunt, setFletxaAmunt] = React.useState(false)
    const themeStyles = useThemeStyles()


    return (
        <View style={{ display: "flex", flexDirection: "column", alignItems: "center", position: "relative", marginTop: 10 }}>
            <Text style={themeStyles.text}>Horari per defecte</Text>
            <View style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", marginTop: 10, width: "95%" }}>
                <View style={styles.container}>
                    <Text style={themeStyles.text}>Dilluns</Text>
                    <View style={{ display: "flex", flexDirection: "row", width: "100%" }}>
                        <TextInput
                            label="Desde"
                            returnKeyType="next"
                            value={""}
                            onChangeText={(text: string) => console.log(text)}
                            error={false}
                            errorText={""}
                            inputStyle={{ width: "45%", alignSelf: "center" }}
                        />
                        <Text style={{width: "5%", textAlign: "center", alignContent: "center"}}>a</Text>
                        <TextInput
                            label="Fins"
                            returnKeyType="next"
                            value={""}
                            onChangeText={(text: string) => console.log(text)}
                            error={false}
                            errorText={""}
                            inputStyle={{ width: "45%", alignSelf: "center" }}
                        />
                    </View>
                </View>
                <View style={styles.container}>
                    <Text style={themeStyles.text}>Dimarts</Text>
                </View>
                <View style={styles.container}>
                    <Text style={themeStyles.text}>Dimecres</Text>
                </View>
                <View style={styles.container}>
                    <Text style={themeStyles.text}>Dijous</Text>
                </View>
                <View style={styles.container}>
                    <Text style={themeStyles.text}>Divendres</Text>
                </View>
                <View style={styles.container}>
                    <Text style={themeStyles.text}>Dissabte</Text>
                </View>
                <View style={styles.container}>
                    <Text style={themeStyles.text}>Diumenge</Text>
                </View>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        marginVertical: 10,
        width: "100%",
        margin: "auto",
        borderColor: "lightgray",
        borderWidth: 1,
        padding: 10,
        borderRadius: 10,
        backgroundColor: "white",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 6,
        elevation: 5,
    },
});