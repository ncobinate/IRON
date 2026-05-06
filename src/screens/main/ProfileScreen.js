import { View, Text, StyleSheet, SafeAreaView } from 'react-native';
import { colors, font, spacing } from '../../theme';

export default function ProfileScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Profile</Text>
      <Text style={styles.sub}>Profile screen coming soon</Text>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, alignItems: 'center', justifyContent: 'center' },
  title: { fontSize: font.sizes.xl, fontWeight: font.weights.black, color: colors.text },
  sub: { fontSize: font.sizes.sm, color: colors.textSecondary, marginTop: spacing.sm },
});
