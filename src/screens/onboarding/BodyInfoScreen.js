import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, ScrollView } from 'react-native';
import { colors, spacing, font } from '../../theme';
import { saveProfile, getProfile } from '../../storage/userProfile';
import StepBar from './components/StepBar';

const LIMB_OPTIONS = [
  { id: 'short', label: 'Short' },
  { id: 'average', label: 'Average' },
  { id: 'long', label: 'Long' },
];

function cmToFtIn(cm) {
  const totalIn = cm / 2.54;
  return { feet: Math.floor(totalIn / 12), inches: Math.round(totalIn % 12) };
}
function ftInToCm(f, i) { return Math.round(f * 30.48 + i * 2.54); }
function kgToLbs(kg) { return Math.round(kg * 2.20462); }
function lbsToKg(lbs) { return Math.round(lbs * 0.453592); }

export default function BodyInfoScreen({ navigation }) {
  const [unit, setUnit] = useState('metric');
  const [age, setAge] = useState(25);
  const [heightCm, setHeightCm] = useState(175);
  const [weightKg, setWeightKg] = useState(75);
  const [feet, setFeet] = useState(5);
  const [inches, setInches] = useState(9);
  const [lbs, setLbs] = useState(165);
  const [armLength, setArmLength] = useState(null);
  const [legLength, setLegLength] = useState(null);
  const [showTip, setShowTip] = useState(false);

  useEffect(() => {
    getProfile().then(p => { if (p.unit) setUnit(p.unit); });
  }, []);

  function displayHeight() {
    if (unit === 'metric') return `${heightCm} cm  (${cmToFtIn(heightCm).feet}'${cmToFtIn(heightCm).inches}")`;
    return `${feet}'${inches}"  (${ftInToCm(feet, inches)} cm)`;
  }
  function displayWeight() {
    if (unit === 'metric') return `${weightKg} kg  (${kgToLbs(weightKg)} lbs)`;
    return `${lbs} lbs  (${lbsToKg(lbs)} kg)`;
  }

  async function handleNext() {
    const finalHeightCm = unit === 'metric' ? heightCm : ftInToCm(feet, inches);
    const finalWeightKg = unit === 'metric' ? weightKg : lbsToKg(lbs);
    await saveProfile({ age, heightCm: finalHeightCm, weightKg: finalWeightKg, armLength, legLength });
    navigation.navigate('Training');
  }

  return (
    <SafeAreaView style={styles.container}>
      <StepBar current={3} total={7} />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.titleRow}>
          <Text style={styles.question}>Body information</Text>
          <TouchableOpacity style={styles.infoBtn} onPress={() => setShowTip(t => !t)}>
            <Text style={styles.infoBtnText}>ⓘ</Text>
          </TouchableOpacity>
        </View>

        {showTip && (
          <View style={styles.tip}>
            <Text style={styles.tipText}>
              This data helps personalize your workouts, estimate calories, and tailor exercise recommendations to your body mechanics.
            </Text>
          </View>
        )}

        <Section label={`Age — ${age}`}>
          <Stepper value={age} min={13} max={90} onChange={setAge} />
        </Section>

        <Section label={`Height — ${displayHeight()}`}>
          {unit === 'metric' ? (
            <Stepper value={heightCm} min={120} max={230} onChange={setHeightCm} />
          ) : (
            <View style={styles.imperialRow}>
              <View style={{ flex: 1, gap: 6 }}>
                <Text style={styles.subLabel}>Feet</Text>
                <Stepper value={feet} min={3} max={8} onChange={setFeet} />
              </View>
              <View style={{ flex: 1, gap: 6 }}>
                <Text style={styles.subLabel}>Inches</Text>
                <Stepper value={inches} min={0} max={11} onChange={setInches} />
              </View>
            </View>
          )}
        </Section>

        <Section label={`Weight — ${displayWeight()}`}>
          {unit === 'metric' ? (
            <Stepper value={weightKg} min={30} max={250} onChange={setWeightKg} />
          ) : (
            <Stepper value={lbs} min={66} max={550} onChange={setLbs} />
          )}
        </Section>

        <Section label="Arm Length">
          <LimbSelector value={armLength} onChange={setArmLength} />
        </Section>

        <Section label="Leg Length">
          <LimbSelector value={legLength} onChange={setLegLength} />
        </Section>

        <TouchableOpacity style={styles.skipBtn} onPress={() => navigation.navigate('Training')}>
          <Text style={styles.skipText}>Skip for now</Text>
        </TouchableOpacity>
      </ScrollView>

      <View style={styles.footer}>
        <NavButtons
          onBack={() => navigation.goBack()}
          onNext={handleNext}
          nextDisabled={false}
        />
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

function LimbSelector({ value, onChange }) {
  return (
    <View style={styles.limbRow}>
      {LIMB_OPTIONS.map(o => (
        <TouchableOpacity
          key={o.id}
          style={[styles.limbBtn, value === o.id && styles.limbBtnActive]}
          onPress={() => onChange(o.id)}
        >
          <Text style={[styles.limbText, value === o.id && styles.limbTextActive]}>{o.label}</Text>
        </TouchableOpacity>
      ))}
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

function NavButtons({ onBack, onNext, nextDisabled }) {
  return (
    <View style={styles.navRow}>
      <TouchableOpacity style={styles.backButton} onPress={onBack}>
        <Text style={styles.backButtonText}>Back</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.primaryButton, nextDisabled && styles.disabled]}
        onPress={onNext}
        disabled={nextDisabled}
      >
        <Text style={styles.primaryButtonText}>Continue</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { paddingHorizontal: spacing.xl, paddingTop: spacing.xxl, paddingBottom: spacing.xl, gap: spacing.xl },
  titleRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  question: { fontSize: font.sizes.xxl, fontWeight: font.weights.black, color: colors.text, flex: 1 },
  infoBtn: { width: 32, height: 32, alignItems: 'center', justifyContent: 'center' },
  infoBtnText: { fontSize: 22, color: colors.textSecondary },
  tip: { backgroundColor: colors.card, borderRadius: 12, padding: spacing.md, borderLeftWidth: 3, borderLeftColor: colors.primary },
  tipText: { fontSize: font.sizes.sm, color: colors.textSecondary, lineHeight: 20 },
  section: { gap: spacing.md },
  sectionLabel: { fontSize: font.sizes.md, fontWeight: font.weights.semibold, color: colors.textSecondary },
  subLabel: { fontSize: font.sizes.xs, color: colors.textMuted, fontWeight: font.weights.medium },
  imperialRow: { flexDirection: 'row', gap: spacing.xl },
  limbRow: { flexDirection: 'row', gap: spacing.sm },
  limbBtn: { flex: 1, paddingVertical: spacing.md, borderRadius: 12, borderWidth: 1.5, borderColor: colors.border, alignItems: 'center' },
  limbBtnActive: { borderColor: colors.primary, backgroundColor: colors.primary + '15' },
  limbText: { fontSize: font.sizes.sm, fontWeight: font.weights.semibold, color: colors.textSecondary },
  limbTextActive: { color: colors.primary },
  stepper: { flexDirection: 'row', alignItems: 'center', gap: spacing.xl },
  stepBtn: { width: 48, height: 48, borderRadius: 24, backgroundColor: colors.card, alignItems: 'center', justifyContent: 'center' },
  stepBtnText: { fontSize: 24, color: colors.text, fontWeight: font.weights.bold },
  stepValue: { fontSize: font.sizes.xl, fontWeight: font.weights.bold, color: colors.text, minWidth: 60, textAlign: 'center' },
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
