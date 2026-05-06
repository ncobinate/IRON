import { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView } from 'react-native';
import { colors, spacing, font } from '../../theme';
import { saveProfile } from '../../storage/userProfile';
import StepBar from './components/StepBar';

const LEVELS = [
  {
    id: 'beginner',
    label: 'Beginner',
    sub: 'New to training or getting back into it',
    detail: 'Under 1 year consistent training',
  },
  {
    id: 'intermediate',
    label: 'Intermediate',
    sub: 'Comfortable with the basics',
    detail: '1–3 years of consistent training',
  },
  {
    id: 'advanced',
    label: 'Advanced',
    sub: 'Strong foundation, pushing limits',
    detail: '3+ years, tracking lifts and macros',
  },
  {
    id: 'athlete',
    label: 'Athlete',
    sub: 'Competing or sport-specific goals',
    detail: 'Performance is the priority',
  },
];

export default function FitnessLevelScreen({ navigation }) {
  const [level, setLevel] = useState(null);

  async function handleNext() {
    await saveProfile({ fitnessLevel: level, onboardingComplete: true });
    navigation.reset({ index: 0, routes: [{ name: 'Main' }] });
  }

  return (
    <SafeAreaView style={styles.container}>
      <StepBar current={6} total={6} />

      <View style={styles.content}>
        <View>
          <Text style={styles.question}>Your training{'\n'}experience</Text>
          <Text style={styles.sub}>Be honest — this shapes your daily plan</Text>
        </View>

        <View style={styles.list}>
          {LEVELS.map(l => {
            const active = level === l.id;
            return (
              <TouchableOpacity
                key={l.id}
                style={[styles.card, active && styles.cardActive]}
                onPress={() => setLevel(l.id)}
              >
                <View style={styles.cardHeader}>
                  <Text style={[styles.cardLabel, active && styles.cardLabelActive]}>{l.label}</Text>
                  {active && <Text style={styles.check}>✓</Text>}
                </View>
                <Text style={styles.cardSub}>{l.sub}</Text>
                <Text style={styles.cardDetail}>{l.detail}</Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.primaryButton, !level && styles.disabled]}
          onPress={handleNext}
          disabled={!level}
        >
          <Text style={styles.primaryButtonText}>Build My Plan →</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { flex: 1, paddingHorizontal: spacing.xl, paddingTop: spacing.xxl, gap: spacing.xl },
  question: { fontSize: font.sizes.xxl, fontWeight: font.weights.black, color: colors.text, lineHeight: 44 },
  sub: { fontSize: font.sizes.sm, color: colors.textSecondary, marginTop: spacing.xs },
  list: { gap: spacing.sm },
  card: {
    backgroundColor: colors.card, borderRadius: 14, padding: spacing.md,
    borderWidth: 1.5, borderColor: colors.border, gap: 4,
  },
  cardActive: { borderColor: colors.primary, backgroundColor: colors.primary + '10' },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  cardLabel: { fontSize: font.sizes.md, fontWeight: font.weights.bold, color: colors.text },
  cardLabelActive: { color: colors.primary },
  check: { fontSize: 16, color: colors.primary, fontWeight: font.weights.bold },
  cardSub: { fontSize: font.sizes.sm, color: colors.textSecondary },
  cardDetail: { fontSize: font.sizes.xs, color: colors.textMuted },
  footer: { paddingHorizontal: spacing.xl, paddingBottom: spacing.xl },
  primaryButton: { backgroundColor: colors.primary, borderRadius: 14, paddingVertical: spacing.lg, alignItems: 'center' },
  disabled: { opacity: 0.3 },
  primaryButtonText: { fontSize: font.sizes.md, fontWeight: font.weights.bold, color: colors.background },
});
