import React from 'react';
import { Provider } from 'react-redux';
import { store } from '@store';
import { GlobalSpinner } from '@components';
import Toast from 'react-native-toast-message';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { LoginScreen } from '@features/auth';
import { TabNavigator } from '@components';
import { navigationRef } from '@utils/navigateUtils';
import { AppStackParamList } from '@types';

function App() {
  const Stack = createNativeStackNavigator<AppStackParamList>();

  return (
    <Provider store={store}>
      <NavigationContainer ref={navigationRef}>
        <Stack.Navigator initialRouteName="Login" screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Main" component={TabNavigator} />
        </Stack.Navigator>
      </NavigationContainer>

      <GlobalSpinner />
      <Toast />
    </Provider>
  );
}

export default App;
