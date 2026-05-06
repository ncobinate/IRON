import { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView } from 'react-native';
import { colors, spacing, font } from '../../theme';
import { saveProfile } from '../../storage/userProfile';
import StepBar from './components/StepBar';

const GOALS = [
  { id: 'lose_fat', icon: '🔥', label: 'Lose Fat', sub: 'Cut body fat, look leaner' },
  { id: 'build_muscle', icon: '💪', label: 'Build Muscle', sub: 'Get stronger and bigger' },
  { id: 'improve_fitness', icon: '🏃', label: 'Improve Fitness', sub: 'Endurance and cardio' },
  { id: 'stay_healthy', icon: '❤️', label: 'Stay Healthy', sub: 'Feel good long-term' },
  { id: 'athletic', icon: '⚡', label: 'Athletic Performance', sub: 'Sport-specific training' },
];

export default function GoalsScreen({ navigation }) {
  const [selected, setSelected] = useState([]);

  function toggle(id) {
    setSelected(prev =>
      prev.includes(id) ? prev.filter(g => g !== id) : [...prev, id]
    );
  }

  async function handleNext() {
    await saveProfile({ goals: selected });
    navigation.navigate('Schedule');
  }

  return (
    <SafeAreaView style={styles.container}>
      <StepBar current={3} total={5} />

      <View style={styles.content}>
        <View>
          <Text style={styles.question}>What are you{'\n'}training for?</Text>
          <Text style={styles.sub}>Pick all that apply</Text>
        </View>

        <View style={styles.list}>
          {GOALS.map(g => {
            const active = selected.includes(g.id);
            return (
              <TouchableOpacity
                key={g.id}
                style={[styles.card, active && styles.cardActive]}
                onPress={() => toggle(g.id)}
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
        <TouchableOpacity
          style={[styles.primaryButton, selected.length === 0 && styles.disabled]}
          onPress={handleNext}
          disabled={selected.length === 0}
        >
          <Text style={styles.primaryButtonText}>Continue</Text>
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
  primaryButton: { backgroundColor: colors.primary, borderRadius: 14, paddingVertical: spacing.lg, alignItems: 'center' },
  disabled: { opacity: 0.3 },
  primaryButtonText: { fontSize: font.sizes.md, fontWeight: font.weights.bold, color: colors.background },
});
