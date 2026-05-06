import { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, ScrollView } from 'react-native';
import { colors, spacing, font } from '../../theme';
import { saveProfile } from '../../storage/userProfile';
import StepBar from './components/StepBar';

const GENDERS = ['Male', 'Female', 'Other'];

export default function BodyStatsScreen({ navigation }) {
  const [gender, setGender] = useState(null);
  const [age, setAge] = useState(25);
  const [heightCm, setHeightCm] = useState(175);
  const [weightKg, setWeightKg] = useState(75);

  const canContinue = gender !== null;

  async function handleNext() {
    await saveProfile({ gender, age, heightCm, weightKg });
    navigation.navigate('Goals');
  }

  return (
    <SafeAreaView style={styles.container}>
      <StepBar current={2} total={5} />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.question}>About your body</Text>

        <Section label="Gender">
          <View style={styles.row}>
            {GENDERS.map(g => (
              <TouchableOpacity
                key={g}
                style={[styles.chip, gender === g && styles.chipActive]}
                onPress={() => setGender(g)}
              >
                <Text style={[styles.chipText, gender === g && styles.chipTextActive]}>{g}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </Section>

        <Section label={`Age — ${age}`}>
          <Stepper value={age} min={13} max={90} onChange={setAge} />
        </Section>

        <Section label={`Height — ${heightCm} cm`}>
          <Stepper value={heightCm} min={120} max={230} step={1} onChange={setHeightCm} />
        </Section>

        <Section label={`Weight — ${weightKg} kg`}>
          <Stepper value={weightKg} min={30} max={250} step={1} onChange={setWeightKg} />
        </Section>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.primaryButton, !canContinue && styles.disabled]}
          onPress={handleNext}
          disabled={!canContinue}
        >
          <Text style={styles.primaryButtonText}>Continue</Text>
        </TouchableOpacity>
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

function Stepper({ value, min, max, step = 1, onChange }) {
  return (
    <View style={styles.stepper}>
      <TouchableOpacity
        style={styles.stepBtn}
        onPress={() => onChange(Math.max(min, value - step))}
      >
        <Text style={styles.stepBtnText}>−</Text>
      </TouchableOpacity>
      <Text style={styles.stepValue}>{value}</Text>
      <TouchableOpacity
        style={styles.stepBtn}
        onPress={() => onChange(Math.min(max, value + step))}
      >
        <Text style={styles.stepBtnText}>+</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { paddingHorizontal: spacing.xl, paddingTop: spacing.xxl, paddingBottom: spacing.xl, gap: spacing.xl },
  question: { fontSize: font.sizes.xxl, fontWeight: font.weights.black, color: colors.text },
  section: { gap: spacing.md },
  sectionLabel: { fontSize: font.sizes.md, fontWeight: font.weights.semibold, color: colors.textSecondary },
  row: { flexDirection: 'row', gap: spacing.sm },
  chip: {
    flex: 1, paddingVertical: spacing.md, borderRadius: 12,
    borderWidth: 1.5, borderColor: colors.border, alignItems: 'center',
  },
  chipActive: { borderColor: colors.primary, backgroundColor: colors.primary + '15' },
  chipText: { fontSize: font.sizes.md, color: colors.textSecondary, fontWeight: font.weights.medium },
  chipTextActive: { color: colors.primary },
  stepper: { flexDirection: 'row', alignItems: 'center', gap: spacing.xl },
  stepBtn: {
    width: 48, height: 48, borderRadius: 24,
    backgroundColor: colors.card, alignItems: 'center', justifyContent: 'center',
  },
  stepBtnText: { fontSize: 24, color: colors.text, fontWeight: font.weights.bold },
  stepValue: { fontSize: font.sizes.xl, fontWeight: font.weights.bold, color: colors.text, minWidth: 60, textAlign: 'center' },
  footer: { paddingHorizontal: spacing.xl, paddingBottom: spacing.xl },
  primaryButton: { backgroundColor: colors.primary, borderRadius: 14, paddingVertical: spacing.lg, alignItems: 'center' },
  disabled: { opacity: 0.3 },
  primaryButtonText: { fontSize: font.sizes.md, fontWeight: font.weights.bold, color: colors.background },
});
