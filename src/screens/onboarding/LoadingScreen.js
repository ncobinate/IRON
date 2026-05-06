import { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { colors, font } from '../../theme';

export default function LoadingScreen({ navigation }) {
  const opacity = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(0.85)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(opacity, { toValue: 1, duration: 900, useNativeDriver: true }),
      Animated.spring(scale, { toValue: 1, friction: 6, useNativeDriver: true }),
    ]).start();

    const timer = setTimeout(() => {
      Animated.timing(opacity, { toValue: 0, duration: 400, useNativeDriver: true }).start(() => {
        navigation.replace('UnitSelection');
      });
    }, 2400);

    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.logoWrap, { opacity, transform: [{ scale }] }]}>
        <Text style={styles.logo}>IRON</Text>
        <Text style={styles.tagline}>Your body. Your data. Your coach.</Text>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoWrap: { alignItems: 'center', gap: 12 },
  logo: {
    fontSize: 80,
    fontWeight: font.weights.black,
    color: colors.primary,
    letterSpacing: 10,
  },
  tagline: {
    fontSize: font.sizes.md,
    color: colors.textSecondary,
    letterSpacing: 1,
  },
});
