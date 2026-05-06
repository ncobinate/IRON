import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { useEffect, useState } from 'react';
import { getProfile } from '../storage/userProfile';

import LoadingScreen from '../screens/onboarding/LoadingScreen';
import UnitSelectionScreen from '../screens/onboarding/UnitSelectionScreen';
import ProfileScreen from '../screens/onboarding/ProfileScreen';
import BodyInfoScreen from '../screens/onboarding/BodyInfoScreen';
import TrainingScreen from '../screens/onboarding/TrainingScreen';
import NutritionSetupScreen from '../screens/onboarding/NutritionSetupScreen';
import FoodPreferencesScreen from '../screens/onboarding/FoodPreferencesScreen';
import NutritionGoalScreen from '../screens/onboarding/NutritionGoalScreen';
import MainScreen from '../screens/MainScreen';

const Stack = createStackNavigator();

export default function Navigation() {
  const [initialRoute, setInitialRoute] = useState(null);

  useEffect(() => {
    getProfile().then(profile => {
      setInitialRoute(profile.onboardingComplete ? 'Main' : 'Loading');
    });
  }, []);

  if (!initialRoute) return null;

  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName={initialRoute}
        screenOptions={{ headerShown: false, animation: 'slide_from_right' }}
      >
        <Stack.Screen name="Loading" component={LoadingScreen} />
        <Stack.Screen name="UnitSelection" component={UnitSelectionScreen} />
        <Stack.Screen name="Profile" component={ProfileScreen} />
        <Stack.Screen name="BodyInfo" component={BodyInfoScreen} />
        <Stack.Screen name="Training" component={TrainingScreen} />
        <Stack.Screen name="NutritionSetup" component={NutritionSetupScreen} />
        <Stack.Screen name="FoodPreferences" component={FoodPreferencesScreen} />
        <Stack.Screen name="NutritionGoal" component={NutritionGoalScreen} />
        <Stack.Screen name="Main" component={MainScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
