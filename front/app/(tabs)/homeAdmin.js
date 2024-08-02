import React, { useState, useEffect } from 'react';
import api from '../api';
import { View, Text } from 'react-native';
import AuthContext from '../AuthContext';
import { useContext } from 'react';

export default function HomeAdmin() {
  const [sales, setSales] = useState([]);
  const { user } = useContext(AuthContext);

  async function getSales() {
    api.get('/sales').then((response) => {
      setSales(response.data);
    });

  }

  useEffect(() => {
    getSales();
    console.log(user)
  }, []);

  return (
    <View>
      <Text>Sales</Text>
    
      {sales.length === 0 ?
       (<Text>No hi ha cap venda</Text>)
       :
       (sales.map((sale) => (
        <Text key={sale.id}>{sale.nom}</Text>
      )))
      }
    </View>
  );
}