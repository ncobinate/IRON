import { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, SafeAreaView } from 'react-native';
import { colors, spacing, font } from '../../theme';
import { saveProfile } from '../../storage/userProfile';
import StepBar from './components/StepBar';

export default function NameScreen({ navigation }) {
  const [name, setName] = useState('');

  async function handleNext() {
    if (!name.trim()) return;
    await saveProfile({ name: name.trim() });
    navigation.navigate('BodyStats');
  }

  return (
    <SafeAreaView style={styles.container}>
      <StepBar current={1} total={6} />

      <View style={styles.content}>
        <Text style={styles.question}>What should we{'\n'}call you?</Text>
        <TextInput
          style={styles.input}
          value={name}
          onChangeText={setName}
          placeholder="Your name"
          placeholderTextColor={colors.textMuted}
          autoFocus
          returnKeyType="next"
          onSubmitEditing={handleNext}
        />
      </View>

      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.primaryButton, !name.trim() && styles.disabled]}
          onPress={handleNext}
          disabled={!name.trim()}
        >
          <Text style={styles.primaryButtonText}>Continue</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flex: 1,
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.xxl,
    gap: spacing.xl,
  },
  question: {
    fontSize: font.sizes.xxl,
    fontWeight: font.weights.black,
    color: colors.text,
    lineHeight: 44,
  },
  input: {
    fontSize: font.sizes.xl,
    fontWeight: font.weights.semibold,
    color: colors.primary,
    borderBottomWidth: 2,
    borderBottomColor: colors.primary,
    paddingBottom: spacing.sm,
  },
  footer: {
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.xl,
  },
  primaryButton: {
    backgroundColor: colors.primary,
    borderRadius: 14,
    paddingVertical: spacing.lg,
    alignItems: 'center',
  },
  disabled: {
    opacity: 0.3,
  },
  primaryButtonText: {
    fontSize: font.sizes.md,
    fontWeight: font.weights.bold,
    color: colors.background,
  },
});
