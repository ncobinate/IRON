import { useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity,
  SafeAreaView, ScrollView, TextInput,
} from 'react-native';
import { colors, spacing, font } from '../../theme';
import { saveProfile } from '../../storage/userProfile';
import StepBar from './components/StepBar';

const GENDERS = ['Male', 'Female', 'Other'];
const BODY_TYPES = [
  { id: 'short', label: 'Short limbs', sub: 'Arms & legs shorter relative to torso' },
  { id: 'average', label: 'Average proportions', sub: 'Balanced limb-to-torso ratio' },
  { id: 'long', label: 'Long limbs', sub: 'Arms & legs longer relative to torso' },
];

function cmToFtIn(cm) {
  const totalInches = cm / 2.54;
  const feet = Math.floor(totalInches / 12);
  const inches = Math.round(totalInches % 12);
  return { feet, inches };
}

function ftInToCm(feet, inches) {
  return Math.round((feet * 30.48) + (inches * 2.54));
}

function kgToLbs(kg) {
  return Math.round(kg * 2.20462);
}

function lbsToKg(lbs) {
  return Math.round(lbs * 0.453592);
}

export default function BodyStatsScreen({ navigation }) {
  const [gender, setGender] = useState(null);
  const [age, setAge] = useState(25);
  const [bodyType, setBodyType] = useState(null);
  const [unit, setUnit] = useState('metric'); // 'metric' | 'imperial'

  // Always store metric internally
  const [heightCm, setHeightCm] = useState(175);
  const [weightKg, setWeightKg] = useState(75);

  // Imperial display state
  const [feet, setFeet] = useState(5);
  const [inches, setInches] = useState(9);
  const [lbs, setLbs] = useState(165);

  function switchUnit(newUnit) {
    if (newUnit === unit) return;
    if (newUnit === 'imperial') {
      const fi = cmToFtIn(heightCm);
      setFeet(fi.feet);
      setInches(fi.inches);
      setLbs(kgToLbs(weightKg));
    } else {
      setHeightCm(ftInToCm(feet, inches));
      setWeightKg(lbsToKg(lbs));
    }
    setUnit(newUnit);
  }

  function getDisplayHeight() {
    if (unit === 'metric') return `${heightCm} cm  (${cmToFtIn(heightCm).feet}'${cmToFtIn(heightCm).inches}")`;
    return `${feet}'${inches}"  (${ftInToCm(feet, inches)} cm)`;
  }

  function getDisplayWeight() {
    if (unit === 'metric') return `${weightKg} kg  (${kgToLbs(weightKg)} lbs)`;
    return `${lbs} lbs  (${lbsToKg(lbs)} kg)`;
  }

  const canContinue = gender !== null && bodyType !== null;

  async function handleNext() {
    const finalHeightCm = unit === 'metric' ? heightCm : ftInToCm(feet, inches);
    const finalWeightKg = unit === 'metric' ? weightKg : lbsToKg(lbs);
    await saveProfile({ gender, age, heightCm: finalHeightCm, weightKg: finalWeightKg, bodyType });
    navigation.navigate('Goals');
  }

  return (
    <SafeAreaView style={styles.container}>
      <StepBar current={2} total={6} />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.question}>About your body</Text>

        {/* Gender */}
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

        {/* Age */}
        <Section label={`Age — ${age}`}>
          <Stepper value={age} min={13} max={90} onChange={setAge} />
        </Section>

        {/* Body Type */}
        <Section label="Body Proportions">
          <View style={styles.typeList}>
            {BODY_TYPES.map(bt => {
              const active = bodyType === bt.id;
              return (
                <TouchableOpacity
                  key={bt.id}
                  style={[styles.typeCard, active && styles.typeCardActive]}
                  onPress={() => setBodyType(bt.id)}
                >
                  <View style={styles.typeCardInner}>
                    <Text style={[styles.typeLabel, active && styles.typeLabelActive]}>{bt.label}</Text>
                    <Text style={styles.typeSub}>{bt.sub}</Text>
                  </View>
                  {active && <Text style={styles.check}>✓</Text>}
                </TouchableOpacity>
              );
            })}
          </View>
        </Section>

        {/* Unit toggle */}
        <Section label="Units">
          <View style={styles.unitToggle}>
            {['metric', 'imperial'].map(u => (
              <TouchableOpacity
                key={u}
                style={[styles.unitBtn, unit === u && styles.unitBtnActive]}
                onPress={() => switchUnit(u)}
              >
                <Text style={[styles.unitBtnText, unit === u && styles.unitBtnTextActive]}>
                  {u === 'metric' ? 'Metric (kg, cm)' : 'Imperial (lbs, ft)'}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </Section>

        {/* Height */}
        <Section label={`Height — ${getDisplayHeight()}`}>
          {unit === 'metric' ? (
            <Stepper value={heightCm} min={120} max={230} onChange={setHeightCm} />
          ) : (
            <View style={styles.row}>
              <View style={styles.imperialField}>
                <Text style={styles.imperialLabel}>Feet</Text>
                <Stepper value={feet} min={3} max={8} onChange={setFeet} />
              </View>
              <View style={styles.imperialField}>
                <Text style={styles.imperialLabel}>Inches</Text>
                <Stepper value={inches} min={0} max={11} onChange={setInches} />
              </View>
            </View>
          )}
        </Section>

        {/* Weight */}
        <Section label={`Weight — ${getDisplayWeight()}`}>
          {unit === 'metric' ? (
            <Stepper value={weightKg} min={30} max={250} onChange={setWeightKg} />
          ) : (
            <Stepper value={lbs} min={66} max={550} step={1} onChange={setLbs} />
          )}
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
      <TouchableOpacity style={styles.stepBtn} onPress={() => onChange(Math.max(min, value - step))}>
        <Text style={styles.stepBtnText}>−</Text>
      </TouchableOpacity>
      <Text style={styles.stepValue}>{value}</Text>
      <TouchableOpacity style={styles.stepBtn} onPress={() => onChange(Math.min(max, value + step))}>
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
  typeList: { gap: spacing.sm },
  typeCard: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: colors.card, borderRadius: 12, padding: spacing.md,
    borderWidth: 1.5, borderColor: colors.border,
  },
  typeCardActive: { borderColor: colors.primary, backgroundColor: colors.primary + '10' },
  typeCardInner: { flex: 1 },
  typeLabel: { fontSize: font.sizes.md, fontWeight: font.weights.semibold, color: colors.text },
  typeLabelActive: { color: colors.primary },
  typeSub: { fontSize: font.sizes.xs, color: colors.textSecondary, marginTop: 2 },
  check: { fontSize: 16, color: colors.primary, fontWeight: font.weights.bold },
  unitToggle: { flexDirection: 'row', backgroundColor: colors.card, borderRadius: 12, padding: 4, gap: 4 },
  unitBtn: { flex: 1, paddingVertical: spacing.sm, borderRadius: 10, alignItems: 'center' },
  unitBtnActive: { backgroundColor: colors.primary },
  unitBtnText: { fontSize: font.sizes.sm, fontWeight: font.weights.semibold, color: colors.textSecondary },
  unitBtnTextActive: { color: colors.background },
  stepper: { flexDirection: 'row', alignItems: 'center', gap: spacing.xl },
  stepBtn: {
    width: 48, height: 48, borderRadius: 24,
    backgroundColor: colors.card, alignItems: 'center', justifyContent: 'center',
  },
  stepBtnText: { fontSize: 24, color: colors.text, fontWeight: font.weights.bold },
  stepValue: { fontSize: font.sizes.xl, fontWeight: font.weights.bold, color: colors.text, minWidth: 60, textAlign: 'center' },
  imperialField: { flex: 1, gap: spacing.sm },
  imperialLabel: { fontSize: font.sizes.xs, color: colors.textSecondary, fontWeight: font.weights.medium },
  footer: { paddingHorizontal: spacing.xl, paddingBottom: spacing.xl },
  primaryButton: { backgroundColor: colors.primary, borderRadius: 14, paddingVertical: spacing.lg, alignItems: 'center' },
  disabled: { opacity: 0.3 },
  primaryButtonText: { fontSize: font.sizes.md, fontWeight: font.weights.bold, color: colors.background },
});
