import { ActivityIndicator, View } from 'react-native'
import { useLoading } from '@/hooks/LoadingContext';

export default function ModalLoading() {
    const { isLoading } = useLoading();

    if (!isLoading) return null;
    return (
        <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0, 0, 0, 0.6)', zIndex: 100 }}>
            <ActivityIndicator style={{position: 'absolute', top: '50%', left: '50%', marginTop: -50, marginLeft: -20}} size={50} color={'white'} />
        </View>
    )
}

