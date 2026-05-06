import { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { useTheme } from '../../theme/ThemeContext';
import IronLogo from '../../components/IronLogo';

export default function LoadingScreen({ navigation }) {
  const { colors, font, spacing } = useTheme();
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
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Animated.View style={[styles.logoWrap, { opacity, transform: [{ scale }] }]}>
        <IronLogo size={96} />
        <Text style={[styles.wordmark, { color: colors.primary, letterSpacing: 10, fontSize: font.sizes.xxl, fontWeight: font.weights.black }]}>
          IRON
        </Text>
        <Text style={[styles.tagline, { color: colors.textSecondary, fontSize: font.sizes.sm }]}>
          Your body. Your data. Your coach.
        </Text>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  logoWrap: { alignItems: 'center', gap: 16 },
  wordmark: {},
  tagline: { letterSpacing: 0.5 },
});
