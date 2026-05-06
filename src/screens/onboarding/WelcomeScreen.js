import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView } from 'react-native';
import { colors, spacing, font } from '../../theme';

export default function WelcomeScreen({ navigation }) {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.logoArea}>
          <Text style={styles.logo}>IRON</Text>
          <Text style={styles.tagline}>Your body. Your data. Your coach.</Text>
        </View>

        <View style={styles.pillars}>
          <PillarItem icon="🧠" label="AI Coach that knows you" />
          <PillarItem icon="🔥" label="Social feed that keeps you going" />
          <PillarItem icon="📚" label="Learn in the moment" />
        </View>
      </View>

      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.primaryButton}
          onPress={() => navigation.navigate('Name')}
        >
          <Text style={styles.primaryButtonText}>Get Started</Text>
        </TouchableOpacity>
        <Text style={styles.disclaimer}>Takes about 2 minutes</Text>
      </View>
    </SafeAreaView>
  );
}

function PillarItem({ icon, label }) {
  return (
    <View style={styles.pillarRow}>
      <Text style={styles.pillarIcon}>{icon}</Text>
      <Text style={styles.pillarLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    justifyContent: 'space-between',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: spacing.xl,
  },
  logoArea: {
    marginBottom: spacing.xxl,
  },
  logo: {
    fontSize: 72,
    fontWeight: font.weights.black,
    color: colors.primary,
    letterSpacing: 8,
  },
  tagline: {
    fontSize: font.sizes.lg,
    color: colors.textSecondary,
    marginTop: spacing.sm,
  },
  pillars: {
    gap: spacing.lg,
  },
  pillarRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  pillarIcon: {
    fontSize: 24,
  },
  pillarLabel: {
    fontSize: font.sizes.md,
    color: colors.text,
    fontWeight: font.weights.medium,
  },
  footer: {
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.xl,
    gap: spacing.md,
  },
  primaryButton: {
    backgroundColor: colors.primary,
    borderRadius: 14,
    paddingVertical: spacing.lg,
    alignItems: 'center',
  },
  primaryButtonText: {
    fontSize: font.sizes.md,
    fontWeight: font.weights.bold,
    color: colors.background,
  },
  disclaimer: {
    textAlign: 'center',
    color: colors.textSecondary,
    fontSize: font.sizes.sm,
  },
});
