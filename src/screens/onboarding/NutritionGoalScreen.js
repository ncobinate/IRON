import { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView } from 'react-native';
import { colors, spacing, font } from '../../theme';
import { saveProfile } from '../../storage/userProfile';
import StepBar from './components/StepBar';

const GOALS = [
  { id: 'weight_loss', icon: '🔥', label: 'Weight Loss', sub: 'Calorie deficit, fat burning' },
  { id: 'muscle_gain', icon: '💪', label: 'Muscle Gain', sub: 'High protein, calorie surplus' },
  { id: 'maintenance', icon: '⚖️', label: 'Maintenance', sub: 'Balanced intake, sustain weight' },
  { id: 'performance', icon: '⚡', label: 'Performance', sub: 'Fuel for training and recovery' },
];

export default function NutritionGoalScreen({ navigation }) {
  const [goal, setGoal] = useState(null);

  async function handleFinish() {
    await saveProfile({ nutritionGoal: goal, onboardingComplete: true });
    navigation.reset({ index: 0, routes: [{ name: 'Main' }] });
  }

  return (
    <SafeAreaView style={styles.container}>
      <StepBar current={7} total={7} />

      <View style={styles.content}>
        <View>
          <Text style={styles.question}>Nutrition{'\n'}goal</Text>
          <Text style={styles.sub}>Your coach will build your meal plan around this</Text>
        </View>

        <View style={styles.list}>
          {GOALS.map(g => {
            const active = goal === g.id;
            return (
              <TouchableOpacity
                key={g.id}
                style={[styles.card, active && styles.cardActive]}
                onPress={() => setGoal(g.id)}
              >
                <Text style={styles.icon}>{g.icon}</Text>
                <View style={styles.cardText}>
                  <Text style={[styles.cardLabel, active && styles.cardLabelActive]}>{g.label}</Text>
                  <Text style={styles.cardSub}>{g.sub}</Text>
                </View>
                {active && <Text style={styles.check}>✓</Text>}
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      <View style={styles.footer}>
        <NavButtons
          onBack={() => navigation.goBack()}
          onNext={handleFinish}
          nextLabel="Build My Plan →"
          nextDisabled={!goal}
        />
      </View>
    </SafeAreaView>
  );
}

function NavButtons({ onBack, onNext, nextLabel = 'Continue', nextDisabled }) {
  return (
    <View style={styles.navRow}>
      <TouchableOpacity style={styles.backButton} onPress={onBack}>
        <Text style={styles.backButtonText}>Back</Text>
      </TouchableOpacity>
      <TouchableOpacity style={[styles.primaryButton, nextDisabled && styles.disabled]} onPress={onNext} disabled={nextDisabled}>
        <Text style={styles.primaryButtonText}>{nextLabel}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { flex: 1, paddingHorizontal: spacing.xl, paddingTop: spacing.xxl, gap: spacing.xl },
  question: { fontSize: font.sizes.xxl, fontWeight: font.weights.black, color: colors.text, lineHeight: 44 },
  sub: { fontSize: font.sizes.sm, color: colors.textSecondary, marginTop: spacing.xs },
  list: { gap: spacing.sm },
  card: {
    flexDirection: 'row', alignItems: 'center', gap: spacing.md,
    backgroundColor: colors.card, borderRadius: 14, padding: spacing.md,
    borderWidth: 1.5, borderColor: colors.border,
  },
  cardActive: { borderColor: colors.primary, backgroundColor: colors.primary + '10' },
  icon: { fontSize: 28 },
  cardText: { flex: 1 },
  cardLabel: { fontSize: font.sizes.md, fontWeight: font.weights.semibold, color: colors.text },
  cardLabelActive: { color: colors.primary },
  cardSub: { fontSize: font.sizes.sm, color: colors.textSecondary, marginTop: 2 },
  check: { fontSize: 18, color: colors.primary, fontWeight: font.weights.bold },
  footer: { paddingHorizontal: spacing.xl, paddingBottom: spacing.xl },
  navRow: { flexDirection: 'row', gap: spacing.md },
  backButton: { flex: 1, borderRadius: 14, paddingVertical: spacing.lg, alignItems: 'center', borderWidth: 1.5, borderColor: colors.border },
  backButtonText: { fontSize: font.sizes.md, fontWeight: font.weights.bold, color: colors.text },
  primaryButton: { flex: 2, backgroundColor: colors.primary, borderRadius: 14, paddingVertical: spacing.lg, alignItems: 'center' },
  disabled: { opacity: 0.3 },
  primaryButtonText: { fontSize: font.sizes.md, fontWeight: font.weights.bold, color: colors.background },
});
