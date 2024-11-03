import { Text, View } from 'react-native';
import React, { useState } from 'react';
import { useThemeStyles } from '@/themes/theme';
import { stringDiaToDate } from '@/helpers/timeHelpers';
import { selectAllReserves, selectReservesError, selectReservesStatus } from '@/store/reservesSlice';
import FentEntreno from './FentEntreno';
import { useAppSelector } from '@/store/reduxHooks';

export default function ReservesList() {
    const themeStyles = useThemeStyles()
    const [entrenoDesplegat, setEntrenoDesplegat] = useState<null | number>(null)
    const reserves = useAppSelector(selectAllReserves);
    const reservesStatus = useAppSelector(selectReservesStatus);
    const reservesError = useAppSelector(selectReservesError);

    return (
        <View>
            <Text style={themeStyles.titol1}>Entrenos d'avui</Text>
            {reserves.length === 0 ? (
                <Text style={themeStyles.text}>Avui no tens més entrenos</Text>
            ) : (
                reserves.map((reserva, i) => {
                    const hora: Date = stringDiaToDate(reserva.hora);
                    const ahora: Date = new Date();
                    ahora.setHours(ahora.getHours() - 2);

                    if (hora >= ahora) {
                        return (
                            //getUserByID(alumnes, reserva.UsuariID).Nom
                            <FentEntreno
                                key={i}
                                reserva={reserva}
                                hora={hora}
                                desplegat={entrenoDesplegat != null && entrenoDesplegat == i}
                                onPress={() => {
                                    setEntrenoDesplegat(i)
                                }
                                } />
                        );
                    }
                })
            )}
        </View>
    )
}