import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginAndSignup from '../screens/LoginAndSignupScreen/LoginAndSignup';
import Dashboard from '../screens/Dashboard/Dashboard';
import BottomTabs from './BottomTabs';

const Stack = createNativeStackNavigator();

const AuthStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Login" component={LoginAndSignup} />
      <Stack.Screen name="Dashboard" component={Dashboard} />
    </Stack.Navigator>
  );
};

export default AuthStack;
