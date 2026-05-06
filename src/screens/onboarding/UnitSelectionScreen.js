import { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView } from 'react-native';
import { colors, spacing, font } from '../../theme';
import { saveProfile } from '../../storage/userProfile';
import StepBar from './components/StepBar';

const UNITS = [
  {
    id: 'metric',
    label: 'Metric',
    sub: 'Centimeters & Kilograms',
    examples: 'Height: 180 cm  ·  Weight: 75 kg',
  },
  {
    id: 'imperial',
    label: 'Imperial',
    sub: 'Feet, Inches & Pounds',
    examples: "Height: 5'11\"  ·  Weight: 165 lbs",
  },
];

export default function UnitSelectionScreen({ navigation }) {
  const [selected, setSelected] = useState(null);

  async function handleNext() {
    await saveProfile({ unit: selected });
    navigation.navigate('Profile');
  }

  return (
    <SafeAreaView style={styles.container}>
      <StepBar current={1} total={7} />
      <View style={styles.content}>
        <View>
          <Text style={styles.question}>How do you{'\n'}measure?</Text>
          <Text style={styles.sub}>This controls all inputs and displays throughout the app</Text>
        </View>

        <View style={styles.options}>
          {UNITS.map(u => {
            const active = selected === u.id;
            return (
              <TouchableOpacity
                key={u.id}
                style={[styles.card, active && styles.cardActive]}
                onPress={() => setSelected(u.id)}
              >
                <View style={styles.cardTop}>
                  <Text style={[styles.cardLabel, active && styles.cardLabelActive]}>{u.label}</Text>
                  {active && <Text style={styles.check}>✓</Text>}
                </View>
                <Text style={styles.cardSub}>{u.sub}</Text>
                <Text style={[styles.cardExamples, active && styles.cardExamplesActive]}>{u.examples}</Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.primaryButton, !selected && styles.disabled]}
          onPress={handleNext}
          disabled={!selected}
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
  options: { gap: spacing.md },
  card: {
    backgroundColor: colors.card, borderRadius: 16, padding: spacing.lg,
    borderWidth: 1.5, borderColor: colors.border, gap: 6,
  },
  cardActive: { borderColor: colors.primary, backgroundColor: colors.primary + '10' },
  cardTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  cardLabel: { fontSize: font.sizes.xl, fontWeight: font.weights.bold, color: colors.text },
  cardLabelActive: { color: colors.primary },
  check: { fontSize: 18, color: colors.primary, fontWeight: font.weights.bold },
  cardSub: { fontSize: font.sizes.sm, color: colors.textSecondary },
  cardExamples: {
    fontSize: font.sizes.sm, color: colors.textMuted,
    fontFamily: 'monospace', marginTop: 4,
  },
  cardExamplesActive: { color: colors.primary + 'AA' },
  footer: { paddingHorizontal: spacing.xl, paddingBottom: spacing.xl },
  primaryButton: { backgroundColor: colors.primary, borderRadius: 14, paddingVertical: spacing.lg, alignItems: 'center' },
  disabled: { opacity: 0.3 },
  primaryButtonText: { fontSize: font.sizes.md, fontWeight: font.weights.bold, color: colors.background },
});
