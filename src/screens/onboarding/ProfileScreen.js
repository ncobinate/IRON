import { useState } from 'react';
import {
  View, Text, StyleSheet, TextInput, TouchableOpacity,
  SafeAreaView, Image, KeyboardAvoidingView, Platform, ScrollView,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { colors, spacing, font } from '../../theme';
import { saveProfile } from '../../storage/userProfile';
import StepBar from './components/StepBar';

const GENDERS = ['Male', 'Female', 'Other'];

export default function ProfileScreen({ navigation }) {
  const [photo, setPhoto] = useState(null);
  const [fullName, setFullName] = useState('');
  const [username, setUsername] = useState('');
  const [gender, setGender] = useState(null);

  const canContinue = fullName.trim() && username.trim() && gender;

  async function pickImage() {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') return;
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });
    if (!result.canceled) setPhoto(result.assets[0].uri);
  }

  async function handleNext() {
    await saveProfile({
      photoUri: photo,
      fullName: fullName.trim(),
      username: username.trim().toLowerCase(),
      gender,
    });
    navigation.navigate('BodyInfo');
  }

  return (
    <SafeAreaView style={styles.container}>
      <StepBar current={2} total={7} />
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          <Text style={styles.question}>Your profile</Text>

          {/* Avatar */}
          <TouchableOpacity style={styles.avatarContainer} onPress={pickImage}>
            {photo ? (
              <Image source={{ uri: photo }} style={styles.avatar} />
            ) : (
              <View style={styles.avatarPlaceholder}>
                <Text style={styles.avatarIcon}>📷</Text>
                <Text style={styles.avatarHint}>Add photo</Text>
              </View>
            )}
            <View style={styles.avatarBadge}>
              <Text style={styles.avatarBadgeText}>+</Text>
            </View>
          </TouchableOpacity>

          <View style={styles.field}>
            <Text style={styles.label}>Full Name</Text>
            <TextInput
              style={styles.input}
              value={fullName}
              onChangeText={setFullName}
              placeholder="Your full name"
              placeholderTextColor={colors.textMuted}
              autoCapitalize="words"
            />
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>Username</Text>
            <View style={styles.usernameRow}>
              <Text style={styles.atSign}>@</Text>
              <TextInput
                style={[styles.input, { flex: 1 }]}
                value={username}
                onChangeText={t => setUsername(t.replace(/[^a-z0-9_.]/gi, '').toLowerCase())}
                placeholder="yourhandle"
                placeholderTextColor={colors.textMuted}
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>Gender</Text>
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
          </View>

          <TouchableOpacity style={styles.skipBtn} onPress={() => navigation.navigate('BodyInfo')}>
            <Text style={styles.skipText}>Skip for now</Text>
          </TouchableOpacity>
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
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { paddingHorizontal: spacing.xl, paddingTop: spacing.xxl, paddingBottom: spacing.lg, alignItems: 'center', gap: spacing.xl },
  question: { fontSize: font.sizes.xxl, fontWeight: font.weights.black, color: colors.text, alignSelf: 'flex-start' },
  avatarContainer: { position: 'relative', marginVertical: spacing.sm },
  avatar: { width: 110, height: 110, borderRadius: 55, borderWidth: 3, borderColor: colors.primary },
  avatarPlaceholder: {
    width: 110, height: 110, borderRadius: 55, backgroundColor: colors.card,
    borderWidth: 2, borderColor: colors.border, borderStyle: 'dashed',
    alignItems: 'center', justifyContent: 'center', gap: 4,
  },
  avatarIcon: { fontSize: 28 },
  avatarHint: { fontSize: font.sizes.xs, color: colors.textSecondary },
  avatarBadge: {
    position: 'absolute', bottom: 4, right: 4, width: 28, height: 28,
    borderRadius: 14, backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center',
  },
  avatarBadgeText: { fontSize: 18, fontWeight: font.weights.bold, color: colors.background, lineHeight: 22 },
  field: { width: '100%', gap: spacing.sm },
  label: { fontSize: font.sizes.sm, fontWeight: font.weights.semibold, color: colors.textSecondary },
  input: { fontSize: font.sizes.lg, fontWeight: font.weights.semibold, color: colors.text, borderBottomWidth: 2, borderBottomColor: colors.border, paddingBottom: spacing.sm },
  usernameRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs },
  atSign: { fontSize: font.sizes.lg, fontWeight: font.weights.bold, color: colors.primary, paddingBottom: spacing.sm },
  row: { flexDirection: 'row', gap: spacing.sm },
  chip: { flex: 1, paddingVertical: spacing.md, borderRadius: 12, borderWidth: 1.5, borderColor: colors.border, alignItems: 'center' },
  chipActive: { borderColor: colors.primary, backgroundColor: colors.primary + '15' },
  chipText: { fontSize: font.sizes.md, color: colors.textSecondary, fontWeight: font.weights.medium },
  chipTextActive: { color: colors.primary },
  skipBtn: { alignSelf: 'center', paddingVertical: spacing.sm },
  skipText: { fontSize: font.sizes.sm, color: colors.textMuted, textDecorationLine: 'underline' },
  footer: { paddingHorizontal: spacing.xl, paddingBottom: spacing.xl },
  primaryButton: { backgroundColor: colors.primary, borderRadius: 14, paddingVertical: spacing.lg, alignItems: 'center' },
  disabled: { opacity: 0.3 },
  primaryButtonText: { fontSize: font.sizes.md, fontWeight: font.weights.bold, color: colors.background },
});
