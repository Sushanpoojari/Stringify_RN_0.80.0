import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Comments from '../screens/Dashboard/components/Comments';
import BottomTabs from './BottomTabs';

const Stack = createNativeStackNavigator();

const AppStack = () => {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
             <Stack.Screen name="BottomTabs" component={BottomTabs} />
             <Stack.Screen name="Comments" component={Comments} />
        </Stack.Navigator>
    );
};

export default AppStack;
