import { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, ScrollView, TextInput } from 'react-native';
import { colors, spacing, font } from '../../theme';
import { saveProfile } from '../../storage/userProfile';
import StepBar from './components/StepBar';

const FOOD_CATEGORIES = [
  {
    category: 'Protein',
    items: ['Chicken', 'Beef', 'Salmon', 'Tuna', 'Eggs', 'Turkey', 'Shrimp', 'Pork', 'Tofu', 'Tempeh'],
  },
  {
    category: 'Carbs',
    items: ['Rice', 'Pasta', 'Bread', 'Oats', 'Quinoa', 'Sweet Potato', 'Potato', 'Corn', 'Tortillas'],
  },
  {
    category: 'Vegetables',
    items: ['Broccoli', 'Spinach', 'Salad', 'Tomatoes', 'Carrots', 'Cucumber', 'Bell Peppers', 'Zucchini', 'Kale'],
  },
  {
    category: 'Fruits',
    items: ['Banana', 'Apple', 'Orange', 'Berries', 'Mango', 'Grapes', 'Pineapple', 'Avocado'],
  },
  {
    category: 'Dairy',
    items: ['Milk', 'Yogurt', 'Cheese', 'Cottage Cheese', 'Greek Yogurt'],
  },
  {
    category: 'Fats & Extras',
    items: ['Nuts', 'Olive Oil', 'Peanut Butter', 'Almond Butter', 'Seeds'],
  },
];

const ALL_ITEMS = FOOD_CATEGORIES.flatMap(c => c.items);

export default function FoodPreferencesScreen({ navigation }) {
  const [selected, setSelected] = useState([]);
  const [customFood, setCustomFood] = useState('');
  const [customFoods, setCustomFoods] = useState([]);

  function toggleItem(item) {
    setSelected(prev => prev.includes(item) ? prev.filter(i => i !== item) : [...prev, item]);
  }

  function selectAll() {
    setSelected(ALL_ITEMS);
  }

  function addCustomFood() {
    const trimmed = customFood.trim();
    if (!trimmed || customFoods.includes(trimmed)) return;
    setCustomFoods(prev => [...prev, trimmed]);
    setSelected(prev => [...prev, trimmed]);
    setCustomFood('');
  }

  async function handleNext() {
    await saveProfile({ favoriteFoods: selected, customFoods });
    navigation.navigate('NutritionGoal');
  }

  return (
    <SafeAreaView style={styles.container}>
      <StepBar current={6} total={7} />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.titleRow}>
          <Text style={styles.question}>Foods you{'\n'}eat regularly</Text>
          <TouchableOpacity style={styles.selectAllBtn} onPress={selectAll}>
            <Text style={styles.selectAllText}>Select all</Text>
          </TouchableOpacity>
        </View>

        {FOOD_CATEGORIES.map(cat => (
          <View key={cat.category} style={styles.categoryBlock}>
            <Text style={styles.categoryLabel}>{cat.category}</Text>
            <View style={styles.chipGrid}>
              {cat.items.map(item => {
                const active = selected.includes(item);
                return (
                  <TouchableOpacity
                    key={item}
                    style={[styles.chip, active && styles.chipActive]}
                    onPress={() => toggleItem(item)}
                  >
                    <Text style={[styles.chipText, active && styles.chipTextActive]}>{item}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        ))}

        {/* Custom foods */}
        <View style={styles.customSection}>
          <Text style={styles.sectionLabel}>Add your own</Text>
          <View style={styles.customRow}>
            <TextInput
              style={styles.customInput}
              value={customFood}
              onChangeText={setCustomFood}
              placeholder="e.g. Jollof rice, Miso soup..."
              placeholderTextColor={colors.textMuted}
              onSubmitEditing={addCustomFood}
              returnKeyType="done"
            />
            <TouchableOpacity style={styles.addBtn} onPress={addCustomFood}>
              <Text style={styles.addBtnText}>Add</Text>
            </TouchableOpacity>
          </View>
          {customFoods.length > 0 && (
            <View style={styles.chipGrid}>
              {customFoods.map(f => (
                <View key={f} style={[styles.chip, styles.chipActive]}>
                  <Text style={[styles.chipText, styles.chipTextActive]}>{f}</Text>
                </View>
              ))}
            </View>
          )}
        </View>

        <TouchableOpacity style={styles.skipBtn} onPress={() => navigation.navigate('NutritionGoal')}>
          <Text style={styles.skipText}>Skip for now</Text>
        </TouchableOpacity>
      </ScrollView>

      <View style={styles.footer}>
        <NavButtons onBack={() => navigation.goBack()} onNext={handleNext} nextDisabled={false} />
      </View>
    </SafeAreaView>
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
  titleRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end' },
  question: { fontSize: font.sizes.xxl, fontWeight: font.weights.black, color: colors.text, lineHeight: 44, flex: 1 },
  selectAllBtn: { paddingBottom: spacing.sm },
  selectAllText: { fontSize: font.sizes.sm, color: colors.primary, fontWeight: font.weights.semibold },
  categoryBlock: { gap: spacing.sm },
  categoryLabel: { fontSize: font.sizes.sm, fontWeight: font.weights.bold, color: colors.textSecondary, textTransform: 'uppercase', letterSpacing: 1 },
  chipGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  chip: { paddingVertical: spacing.xs + 2, paddingHorizontal: spacing.md, borderRadius: 20, borderWidth: 1.5, borderColor: colors.border },
  chipActive: { borderColor: colors.primary, backgroundColor: colors.primary + '15' },
  chipText: { fontSize: font.sizes.sm, color: colors.textSecondary },
  chipTextActive: { color: colors.primary, fontWeight: font.weights.semibold },
  customSection: { gap: spacing.md },
  sectionLabel: { fontSize: font.sizes.md, fontWeight: font.weights.semibold, color: colors.textSecondary },
  customRow: { flexDirection: 'row', gap: spacing.sm },
  customInput: {
    flex: 1, backgroundColor: colors.card, borderRadius: 12, paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm, color: colors.text, fontSize: font.sizes.md,
    borderWidth: 1.5, borderColor: colors.border,
  },
  addBtn: { backgroundColor: colors.primary, borderRadius: 12, paddingHorizontal: spacing.md, justifyContent: 'center' },
  addBtnText: { fontSize: font.sizes.sm, fontWeight: font.weights.bold, color: colors.background },
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
