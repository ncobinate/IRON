import { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView } from 'react-native';
import { colors, spacing, font } from '../../theme';
import { saveProfile } from '../../storage/userProfile';
import StepBar from './components/StepBar';

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const TIMES = [
  { id: 'morning', label: 'Morning', sub: '5am – 10am' },
  { id: 'midday', label: 'Midday', sub: '10am – 2pm' },
  { id: 'evening', label: 'Evening', sub: '4pm – 8pm' },
  { id: 'night', label: 'Night', sub: '8pm+' },
];

export default function ScheduleScreen({ navigation }) {
  const [activeDays, setActiveDays] = useState([]);
  const [preferredTime, setPreferredTime] = useState(null);

  function toggleDay(day) {
    setActiveDays(prev => prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day]);
  }

  const canContinue = activeDays.length > 0 && preferredTime;

  async function handleNext() {
    await saveProfile({ activeDays, preferredTime });
    navigation.navigate('FitnessLevel');
  }

  return (
    <SafeAreaView style={styles.container}>
      <StepBar current={4} total={6} />

      <View style={styles.content}>
        <Text style={styles.question}>When do you{'\n'}train?</Text>

        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Training days</Text>
          <View style={styles.daysRow}>
            {DAYS.map(d => {
              const active = activeDays.includes(d);
              return (
                <TouchableOpacity
                  key={d}
                  style={[styles.dayBtn, active && styles.dayBtnActive]}
                  onPress={() => toggleDay(d)}
                >
                  <Text style={[styles.dayText, active && styles.dayTextActive]}>{d}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Preferred time</Text>
          <View style={styles.timeGrid}>
            {TIMES.map(t => {
              const active = preferredTime === t.id;
              return (
                <TouchableOpacity
                  key={t.id}
                  style={[styles.timeCard, active && styles.timeCardActive]}
                  onPress={() => setPreferredTime(t.id)}
                >
                  <Text style={[styles.timeLabel, active && styles.timeLabelActive]}>{t.label}</Text>
                  <Text style={styles.timeSub}>{t.sub}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      </View>

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

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { flex: 1, paddingHorizontal: spacing.xl, paddingTop: spacing.xxl, gap: spacing.xl },
  question: { fontSize: font.sizes.xxl, fontWeight: font.weights.black, color: colors.text, lineHeight: 44 },
  section: { gap: spacing.md },
  sectionLabel: { fontSize: font.sizes.md, fontWeight: font.weights.semibold, color: colors.textSecondary },
  daysRow: { flexDirection: 'row', gap: spacing.xs },
  dayBtn: {
    flex: 1, paddingVertical: spacing.sm, borderRadius: 10,
    borderWidth: 1.5, borderColor: colors.border, alignItems: 'center',
  },
  dayBtnActive: { borderColor: colors.primary, backgroundColor: colors.primary + '15' },
  dayText: { fontSize: font.sizes.xs, fontWeight: font.weights.semibold, color: colors.textSecondary },
  dayTextActive: { color: colors.primary },
  timeGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  timeCard: {
    width: '47%', padding: spacing.md, borderRadius: 12,
    borderWidth: 1.5, borderColor: colors.border, backgroundColor: colors.card,
  },
  timeCardActive: { borderColor: colors.primary, backgroundColor: colors.primary + '10' },
  timeLabel: { fontSize: font.sizes.md, fontWeight: font.weights.semibold, color: colors.text },
  timeLabelActive: { color: colors.primary },
  timeSub: { fontSize: font.sizes.xs, color: colors.textSecondary, marginTop: 2 },
  footer: { paddingHorizontal: spacing.xl, paddingBottom: spacing.xl },
  primaryButton: { backgroundColor: colors.primary, borderRadius: 14, paddingVertical: spacing.lg, alignItems: 'center' },
  disabled: { opacity: 0.3 },
  primaryButtonText: { fontSize: font.sizes.md, fontWeight: font.weights.bold, color: colors.background },
});
