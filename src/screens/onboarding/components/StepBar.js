import { View, StyleSheet } from 'react-native';
import { useTheme } from '../../../theme/ThemeContext';
import { spacing } from '../../../theme';

export default function StepBar({ current, total }) {
  const { colors } = useTheme();
  return (
    <View style={styles.container}>
      {Array.from({ length: total }).map((_, i) => (
        <View
          key={i}
          style={[
            styles.step,
            { backgroundColor: i < current ? colors.primary : colors.border },
          ]}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.lg,
    gap: spacing.xs,
  },
  step: {
    flex: 1,
    height: 3,
    borderRadius: 2,
  },
});
