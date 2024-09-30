import React from 'react'
import { LineChart } from 'react-native-chart-kit';
import { Dimensions } from 'react-native';

interface propsType {

}
export default function ExerciciLinearGrafic(props: propsType) {
    return (
        <LineChart
            height={250}
            width={Dimensions.get("window").width * 0.8}
            data={{
                labels: ["Gen", "", "Feb", "Mar", "Abr", "Mai", "Jun"],
                datasets: [
                    {
                        data: [
                            Math.random() * 100,
                            Math.random() * 100,
                            Math.random() * 100,
                            Math.random() * 100,
                            Math.random() * 100,
                            Math.random() * 100,
                            Math.random() * 100
                        ]
                    }
                ]
            }}
            chartConfig={{
                backgroundColor: "#c4c4c4",
                color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                style: {
                    borderRadius: 16
                },
                propsForDots: {
                    r: "6",
                    strokeWidth: "2",
                    stroke: "#ffa726"
                }
            }}
        />
    )
}