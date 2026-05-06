import { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, ScrollView, TextInput } from 'react-native';
import { colors, spacing, font } from '../../theme';
import { saveProfile } from '../../storage/userProfile';
import StepBar from './components/StepBar';

const RESTRICTIONS = [
  { id: 'none', label: '🍽️ None' },
  { id: 'vegetarian', label: '🥗 Vegetarian' },
  { id: 'vegan', label: '🌱 Vegan' },
  { id: 'halal', label: '☪️ Halal' },
  { id: 'kosher', label: '✡️ Kosher' },
  { id: 'lactose', label: '🥛 Lactose Free' },
  { id: 'gluten', label: '🌾 Gluten Free' },
];

const NATIONALITIES = [
  'American', 'Brazilian', 'British', 'Caribbean', 'Chinese', 'Ethiopian',
  'French', 'Greek', 'Indian', 'Italian', 'Japanese', 'Korean',
  'Lebanese', 'Mexican', 'Nigerian', 'Pakistani', 'Peruvian', 'Portuguese',
  'Spanish', 'Thai', 'Turkish', 'Vietnamese', 'West African', 'Other',
];

export default function NutritionSetupScreen({ navigation }) {
  const [restrictions, setRestrictions] = useState([]);
  const [nationality, setNationality] = useState(null);

  function toggleRestriction(id) {
    if (id === 'none') { setRestrictions(['none']); return; }
    setRestrictions(prev => {
      const without = prev.filter(r => r !== 'none');
      return without.includes(id) ? without.filter(r => r !== id) : [...without, id];
    });
  }

  async function handleNext() {
    await saveProfile({ dietaryRestrictions: restrictions, nationality });
    navigation.navigate('FoodPreferences');
  }

  return (
    <SafeAreaView style={styles.container}>
      <StepBar current={5} total={7} />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.question}>Nutrition{'\n'}setup</Text>

        <Section label="Dietary Restrictions">
          <View style={styles.chipGrid}>
            {RESTRICTIONS.map(r => {
              const active = restrictions.includes(r.id);
              return (
                <TouchableOpacity
                  key={r.id}
                  style={[styles.chip, active && styles.chipActive]}
                  onPress={() => toggleRestriction(r.id)}
                >
                  <Text style={[styles.chipText, active && styles.chipTextActive]}>{r.label}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </Section>

        <Section label="Cultural Background / Nationality">
          <Text style={styles.hint}>Used to personalize food recommendations</Text>
          <View style={styles.nationalityGrid}>
            {NATIONALITIES.map(n => {
              const active = nationality === n;
              return (
                <TouchableOpacity
                  key={n}
                  style={[styles.natBtn, active && styles.natBtnActive]}
                  onPress={() => setNationality(n)}
                >
                  <Text style={[styles.natText, active && styles.natTextActive]}>{n}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </Section>

        <TouchableOpacity style={styles.skipBtn} onPress={() => navigation.navigate('FoodPreferences')}>
          <Text style={styles.skipText}>Skip for now</Text>
        </TouchableOpacity>
      </ScrollView>

      <View style={styles.footer}>
        <NavButtons onBack={() => navigation.goBack()} onNext={handleNext} nextDisabled={false} />
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
  hint: { fontSize: font.sizes.xs, color: colors.textMuted, marginTop: -spacing.sm },
  chipGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  chip: { paddingVertical: spacing.sm, paddingHorizontal: spacing.md, borderRadius: 20, borderWidth: 1.5, borderColor: colors.border },
  chipActive: { borderColor: colors.primary, backgroundColor: colors.primary + '15' },
  chipText: { fontSize: font.sizes.sm, color: colors.textSecondary, fontWeight: font.weights.medium },
  chipTextActive: { color: colors.primary },
  nationalityGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  natBtn: { paddingVertical: spacing.xs + 2, paddingHorizontal: spacing.md, borderRadius: 20, borderWidth: 1.5, borderColor: colors.border },
  natBtnActive: { borderColor: colors.primary, backgroundColor: colors.primary + '15' },
  natText: { fontSize: font.sizes.sm, color: colors.textSecondary },
  natTextActive: { color: colors.primary, fontWeight: font.weights.semibold },
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
