import React from 'react';
import { Provider } from 'react-redux';
import { store } from '@store';
import { GlobalSpinner } from '@components';
import Toast from 'react-native-toast-message';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from '@screens/HomeScreen';
import LoginScreen from '@screens/LoginScreen';
import { RootStackParamList } from '@types';
import { navigationRef } from '@/app/shared/utils/navigateUtils';


function App() {
  const Stack = createNativeStackNavigator<RootStackParamList>();

  return (
    <Provider store={store}>
      <NavigationContainer ref={navigationRef}>
        <Stack.Navigator initialRouteName="Login" screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="Login" component={LoginScreen} />
        </Stack.Navigator>
      </NavigationContainer>

      <GlobalSpinner />
      <Toast />
    </Provider>
  );
}

export default App;
