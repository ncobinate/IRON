import { View, Text, StyleSheet, SafeAreaView } from 'react-native';
import { colors, font, spacing } from '../theme';

export default function MainScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.text}>Welcome to Iron 🔥</Text>
      <Text style={styles.sub}>Coach screen coming next</Text>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, alignItems: 'center', justifyContent: 'center' },
  text: { fontSize: font.sizes.xl, fontWeight: font.weights.black, color: colors.primary },
  sub: { fontSize: font.sizes.md, color: colors.textSecondary, marginTop: spacing.sm },
});
