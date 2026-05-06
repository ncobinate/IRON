import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { colors, font, spacing } from '../theme';

import FeedScreen from '../screens/main/FeedScreen';
import CoachScreen from '../screens/main/CoachScreen';
import LearnScreen from '../screens/main/LearnScreen';
import ProfileScreen from '../screens/main/ProfileScreen';

const Tab = createBottomTabNavigator();

const TABS = [
  { name: 'Feed', icon: '🔥', label: 'Feed' },
  { name: 'Coach', icon: '🧠', label: 'Coach' },
  { name: 'Learn', icon: '📚', label: 'Learn' },
  { name: 'Profile', icon: '👤', label: 'Profile' },
];

function TabBar({ state, descriptors, navigation }) {
  return (
    <View style={styles.tabBar}>
      {state.routes.map((route, index) => {
        const focused = state.index === index;
        const tab = TABS.find(t => t.name === route.name);

        return (
          <TouchableOpacity
            key={route.key}
            style={styles.tabItem}
            onPress={() => navigation.navigate(route.name)}
          >
            <Text style={styles.tabIcon}>{tab?.icon}</Text>
            <Text style={[styles.tabLabel, focused && styles.tabLabelActive]}>
              {tab?.label}
            </Text>
            {focused && <View style={styles.tabIndicator} />}
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

export default function MainTabs() {
  return (
    <Tab.Navigator
      tabBar={props => <TabBar {...props} />}
      screenOptions={{ headerShown: false }}
      initialRouteName="Coach"
    >
      <Tab.Screen name="Feed" component={FeedScreen} />
      <Tab.Screen name="Coach" component={CoachScreen} />
      <Tab.Screen name="Learn" component={LearnScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingBottom: spacing.sm,
    paddingTop: spacing.sm,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    gap: 3,
    position: 'relative',
  },
  tabIcon: { fontSize: 20 },
  tabLabel: {
    fontSize: font.sizes.xs,
    color: colors.textSecondary,
    fontWeight: font.weights.medium,
  },
  tabLabelActive: {
    color: colors.primary,
    fontWeight: font.weights.bold,
  },
  tabIndicator: {
    position: 'absolute',
    bottom: -spacing.sm,
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.primary,
  },
});
