import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { useEffect, useState } from 'react';
import { getProfile } from '../storage/userProfile';

import WelcomeScreen from '../screens/onboarding/WelcomeScreen';
import NameScreen from '../screens/onboarding/NameScreen';
import BodyStatsScreen from '../screens/onboarding/BodyStatsScreen';
import GoalsScreen from '../screens/onboarding/GoalsScreen';
import ScheduleScreen from '../screens/onboarding/ScheduleScreen';
import FitnessLevelScreen from '../screens/onboarding/FitnessLevelScreen';
import MainScreen from '../screens/MainScreen';

const Stack = createStackNavigator();

export default function Navigation() {
  const [initialRoute, setInitialRoute] = useState(null);

  useEffect(() => {
    getProfile().then(profile => {
      setInitialRoute(profile.onboardingComplete ? 'Main' : 'Welcome');
    });
  }, []);

  if (!initialRoute) return null;

  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName={initialRoute}
        screenOptions={{ headerShown: false, animation: 'slide_from_right' }}
      >
        <Stack.Screen name="Welcome" component={WelcomeScreen} />
        <Stack.Screen name="Name" component={NameScreen} />
        <Stack.Screen name="BodyStats" component={BodyStatsScreen} />
        <Stack.Screen name="Goals" component={GoalsScreen} />
        <Stack.Screen name="Schedule" component={ScheduleScreen} />
        <Stack.Screen name="FitnessLevel" component={FitnessLevelScreen} />
        <Stack.Screen name="Main" component={MainScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
