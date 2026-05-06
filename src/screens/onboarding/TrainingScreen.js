import { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, ScrollView } from 'react-native';
import { colors, spacing, font } from '../../theme';
import { saveProfile } from '../../storage/userProfile';
import StepBar from './components/StepBar';

const GOALS = [
  { id: 'muscle', label: '💪 Build Muscle' },
  { id: 'lose_weight', label: '🔥 Lose Weight' },
  { id: 'maintain', label: '⚖️ Maintain' },
  { id: 'strength', label: '🏋️ Strength' },
  { id: 'athletic', label: '⚡ Athletic Performance' },
];

const LEVELS = [
  { id: 'beginner', label: 'Beginner', sub: 'Under 1 year' },
  { id: 'intermediate', label: 'Intermediate', sub: '1–3 years' },
  { id: 'advanced', label: 'Advanced', sub: '3+ years' },
];

const SPLITS = [
  { id: 'full_body', label: 'Full Body' },
  { id: 'upper_lower', label: 'Upper / Lower' },
  { id: 'ppl', label: 'Push Pull Legs' },
  { id: 'bro', label: 'Bro Split' },
  { id: 'custom', label: 'No Preference' },
];

const GYM_DAYS = [2, 3, 4, 5, 6];

export default function TrainingScreen({ navigation }) {
  const [goal, setGoal] = useState(null);
  const [level, setLevel] = useState(null);
  const [gymDays, setGymDays] = useState(null);
  const [split, setSplit] = useState(null);

  const canContinue = goal && level;

  async function handleNext() {
    await saveProfile({ goal, fitnessLevel: level, gymDays, workoutSplit: split });
    navigation.navigate('NutritionSetup');
  }

  return (
    <SafeAreaView style={styles.container}>
      <StepBar current={4} total={7} />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.question}>Training{'\n'}preferences</Text>

        <Section label="Primary Goal">
          <View style={styles.chipGrid}>
            {GOALS.map(g => (
              <TouchableOpacity
                key={g.id}
                style={[styles.chip, goal === g.id && styles.chipActive]}
                onPress={() => setGoal(g.id)}
              >
                <Text style={[styles.chipText, goal === g.id && styles.chipTextActive]}>{g.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </Section>

        <Section label="Experience Level">
          <View style={styles.levelRow}>
            {LEVELS.map(l => {
              const active = level === l.id;
              return (
                <TouchableOpacity
                  key={l.id}
                  style={[styles.levelCard, active && styles.levelCardActive]}
                  onPress={() => setLevel(l.id)}
                >
                  <Text style={[styles.levelLabel, active && styles.levelLabelActive]}>{l.label}</Text>
                  <Text style={styles.levelSub}>{l.sub}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </Section>

        <Section label="Days Per Week">
          <View style={styles.daysRow}>
            {GYM_DAYS.map(d => (
              <TouchableOpacity
                key={d}
                style={[styles.dayBtn, gymDays === d && styles.dayBtnActive]}
                onPress={() => setGymDays(d)}
              >
                <Text style={[styles.dayText, gymDays === d && styles.dayTextActive]}>{d}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </Section>

        <Section label="Workout Split (optional)">
          <View style={styles.chipGrid}>
            {SPLITS.map(s => (
              <TouchableOpacity
                key={s.id}
                style={[styles.chip, split === s.id && styles.chipActive]}
                onPress={() => setSplit(s.id)}
              >
                <Text style={[styles.chipText, split === s.id && styles.chipTextActive]}>{s.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </Section>

        <TouchableOpacity style={styles.skipBtn} onPress={() => navigation.navigate('NutritionSetup')}>
          <Text style={styles.skipText}>Skip for now</Text>
        </TouchableOpacity>
      </ScrollView>

      <View style={styles.footer}>
        <NavButtons onBack={() => navigation.goBack()} onNext={handleNext} nextDisabled={!canContinue} />
      </View>
    </SafeAreaView>
  );
}

function Section({ label, children }) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionLabel}>{label}</Text>
      {children}
    </View>
  );
}

function NavButtons({ onBack, onNext, nextDisabled }) {
  return (
    <View style={styles.navRow}>
      <TouchableOpacity style={styles.backButton} onPress={onBack}>
        <Text style={styles.backButtonText}>Back</Text>
      </TouchableOpacity>
      <TouchableOpacity style={[styles.primaryButton, nextDisabled && styles.disabled]} onPress={onNext} disabled={nextDisabled}>
        <Text style={styles.primaryButtonText}>Continue</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { paddingHorizontal: spacing.xl, paddingTop: spacing.xxl, paddingBottom: spacing.xl, gap: spacing.xl },
  question: { fontSize: font.sizes.xxl, fontWeight: font.weights.black, color: colors.text, lineHeight: 44 },
  section: { gap: spacing.md },
  sectionLabel: { fontSize: font.sizes.md, fontWeight: font.weights.semibold, color: colors.textSecondary },
  chipGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  chip: { paddingVertical: spacing.sm, paddingHorizontal: spacing.md, borderRadius: 20, borderWidth: 1.5, borderColor: colors.border },
  chipActive: { borderColor: colors.primary, backgroundColor: colors.primary + '15' },
  chipText: { fontSize: font.sizes.sm, color: colors.textSecondary, fontWeight: font.weights.medium },
  chipTextActive: { color: colors.primary },
  levelRow: { flexDirection: 'row', gap: spacing.sm },
  levelCard: { flex: 1, padding: spacing.md, borderRadius: 12, borderWidth: 1.5, borderColor: colors.border, backgroundColor: colors.card, gap: 4 },
  levelCardActive: { borderColor: colors.primary, backgroundColor: colors.primary + '10' },
  levelLabel: { fontSize: font.sizes.sm, fontWeight: font.weights.bold, color: colors.text },
  levelLabelActive: { color: colors.primary },
  levelSub: { fontSize: font.sizes.xs, color: colors.textSecondary },
  daysRow: { flexDirection: 'row', gap: spacing.sm },
  dayBtn: { flex: 1, paddingVertical: spacing.md, borderRadius: 10, borderWidth: 1.5, borderColor: colors.border, alignItems: 'center' },
  dayBtnActive: { borderColor: colors.primary, backgroundColor: colors.primary + '15' },
  dayText: { fontSize: font.sizes.md, fontWeight: font.weights.bold, color: colors.textSecondary },
  dayTextActive: { color: colors.primary },
  skipBtn: { alignSelf: 'center', paddingVertical: spacing.sm },
  skipText: { fontSize: font.sizes.sm, color: colors.textMuted, textDecorationLine: 'underline' },
  footer: { paddingHorizontal: spacing.xl, paddingBottom: spacing.xl },
  navRow: { flexDirection: 'row', gap: spacing.md },
  backButton: { flex: 1, borderRadius: 14, paddingVertical: spacing.lg, alignItems: 'center', borderWidth: 1.5, borderColor: colors.border },
  backButtonText: { fontSize: font.sizes.md, fontWeight: font.weights.bold, color: colors.text },
  primaryButton: { flex: 2, backgroundColor: colors.primary, borderRadius: 14, paddingVertical: spacing.lg, alignItems: 'center' },
  disabled: { opacity: 0.3 },
  primaryButtonText: { fontSize: font.sizes.md, fontWeight: font.weights.bold, color: colors.background },
});
