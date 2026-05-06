import { useState, useEffect, useRef } from 'react';
import {
  View, Text, StyleSheet, SafeAreaView, ScrollView,
  TextInput, TouchableOpacity, KeyboardAvoidingView,
  Platform, ActivityIndicator,
} from 'react-native';
import { colors, spacing, font } from '../../theme';
import { getProfile } from '../../storage/userProfile';
import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY || '',
});

function buildSystemPrompt(profile) {
  return `You are Iron Coach — a world-class personal trainer and nutritionist AI built into the Iron fitness app.

USER PROFILE:
- Name: ${profile.fullName || 'User'}
- Gender: ${profile.gender || 'Not specified'}
- Age: ${profile.age || 'Not specified'}
- Height: ${profile.heightCm ? `${profile.heightCm} cm` : 'Not specified'}
- Weight: ${profile.weightKg ? `${profile.weightKg} kg` : 'Not specified'}
- Arm length: ${profile.armLength || 'average'}
- Leg length: ${profile.legLength || 'average'}
- Fitness level: ${profile.fitnessLevel || 'Not specified'}
- Primary goal: ${profile.goal || 'Not specified'}
- Training days/week: ${profile.gymDays || 'Not specified'}
- Workout split: ${profile.workoutSplit || 'Not specified'}
- Dietary restrictions: ${profile.dietaryRestrictions?.join(', ') || 'None'}
- Nationality/background: ${profile.nationality || 'Not specified'}
- Nutrition goal: ${profile.nutritionGoal || 'Not specified'}
- Preferred unit: ${profile.unit || 'metric'}

YOUR STYLE:
- Talk like a knowledgeable coach, not a chatbot
- Be direct and specific — no fluff
- Explain the WHY behind recommendations
- Keep responses concise but complete
- Use the user's name occasionally
- Adapt to their level (beginner vs advanced)
- When suggesting workouts, include sets/reps/rest
- When discussing nutrition, use their preferred unit system`;
}

function buildDailyPlan(profile) {
  const goal = profile.goal;
  const level = profile.fitnessLevel || 'beginner';
  const split = profile.workoutSplit || 'full_body';

  const workouts = {
    muscle: {
      full_body: { name: 'Full Body Strength', exercises: ['Squat 4×6', 'Bench Press 4×6', 'Deadlift 3×5', 'OHP 3×8', 'Pull-ups 3×max'] },
      ppl: { name: 'Push Day', exercises: ['Bench Press 4×8', 'Incline DB Press 3×10', 'Lateral Raises 4×15', 'Tricep Dips 3×12', 'Cable Flyes 3×15'] },
      upper_lower: { name: 'Upper Body', exercises: ['Bench Press 4×6', 'Barbell Row 4×6', 'OHP 3×8', 'Pull-ups 3×max', 'Curls 3×12'] },
      bro: { name: 'Chest & Triceps', exercises: ['Flat Bench 4×8', 'Incline Press 3×10', 'Cable Crossover 3×15', 'Skull Crushers 3×12', 'Pushdowns 3×15'] },
    },
    lose_weight: {
      full_body: { name: 'Fat Burn Circuit', exercises: ['Goblet Squat 4×15', 'DB RDL 4×12', 'Push-ups 4×15', 'Dumbbell Row 4×12', 'Plank 3×45s'] },
    },
    strength: {
      full_body: { name: 'Strength Day', exercises: ['Squat 5×3', 'Deadlift 5×3', 'Bench Press 5×3', 'OHP 4×5', 'Weighted Pull-ups 4×5'] },
    },
  };

  const today = workouts[goal]?.[split] ||
    workouts[goal]?.full_body ||
    workouts.muscle.full_body;

  const nutrition = {
    lose_weight: { calories: Math.round((profile.weightKg || 75) * 26), protein: Math.round((profile.weightKg || 75) * 2.2) },
    muscle_gain: { calories: Math.round((profile.weightKg || 75) * 33), protein: Math.round((profile.weightKg || 75) * 2.5) },
    maintenance: { calories: Math.round((profile.weightKg || 75) * 30), protein: Math.round((profile.weightKg || 75) * 2.0) },
    performance: { calories: Math.round((profile.weightKg || 75) * 34), protein: Math.round((profile.weightKg || 75) * 2.4) },
  };

  const targets = nutrition[profile.nutritionGoal] || nutrition.maintenance;

  return { workout: today, nutrition: targets };
}

const SUGGESTIONS = [
  'What should I eat today?',
  'How do I improve my squat?',
  'Am I recovering properly?',
  'Adjust my plan for today',
];

export default function CoachScreen() {
  const [profile, setProfile] = useState({});
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [plan, setPlan] = useState(null);
  const scrollRef = useRef(null);

  useEffect(() => {
    getProfile().then(p => {
      setProfile(p);
      setPlan(buildDailyPlan(p));
      setMessages([{
        role: 'assistant',
        text: `Hey ${p.fullName?.split(' ')[0] || 'there'} 👊 Your plan is ready. Today is ${plan?.workout?.name || 'training day'}. Ask me anything — form tips, meal ideas, adjustments. I'm here.`,
      }]);
    });
  }, []);

  async function sendMessage(text) {
    const userText = text || input.trim();
    if (!userText || loading) return;
    setInput('');

    const newMessages = [...messages, { role: 'user', text: userText }];
    setMessages(newMessages);
    setLoading(true);

    try {
      const history = newMessages.map(m => ({
        role: m.role === 'assistant' ? 'assistant' : 'user',
        content: m.text,
      }));

      const response = await client.messages.create({
        model: 'claude-sonnet-4-6',
        max_tokens: 512,
        system: buildSystemPrompt(profile),
        messages: history,
      });

      const reply = response.content[0]?.text || 'Let me think on that.';
      setMessages(prev => [...prev, { role: 'assistant', text: reply }]);
    } catch (err) {
      setMessages(prev => [...prev, {
        role: 'assistant',
        text: "I'm having trouble connecting right now. Check your API key in .env and try again.",
      }]);
    } finally {
      setLoading(false);
      setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 100);
    }
  }

  const greeting = () => {
    const h = new Date().getHours();
    if (h < 12) return 'Good morning';
    if (h < 17) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>

        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>{greeting()}, {profile.fullName?.split(' ')[0] || 'Athlete'}</Text>
            <Text style={styles.subGreeting}>Your coach is ready</Text>
          </View>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>AI</Text>
          </View>
        </View>

        <ScrollView
          ref={scrollRef}
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Today's Plan */}
          {plan && (
            <View style={styles.planCard}>
              <Text style={styles.planTitle}>Today's Plan</Text>
              <View style={styles.planRow}>
                {/* Workout */}
                <View style={styles.planBlock}>
                  <Text style={styles.planBlockLabel}>💪 Workout</Text>
                  <Text style={styles.planBlockTitle}>{plan.workout.name}</Text>
                  {plan.workout.exercises.map((ex, i) => (
                    <Text key={i} style={styles.planExercise}>· {ex}</Text>
                  ))}
                </View>
                {/* Nutrition */}
                <View style={[styles.planBlock, styles.planBlockRight]}>
                  <Text style={styles.planBlockLabel}>🥗 Nutrition</Text>
                  <Text style={styles.planBlockTitle}>Targets</Text>
                  <Text style={styles.planExercise}>· {plan.nutrition.calories} kcal</Text>
                  <Text style={styles.planExercise}>· {plan.nutrition.protein}g protein</Text>
                </View>
              </View>
            </View>
          )}

          {/* Chat */}
          <View style={styles.chatSection}>
            {messages.map((m, i) => (
              <View
                key={i}
                style={[styles.bubble, m.role === 'user' ? styles.userBubble : styles.aiBubble]}
              >
                {m.role === 'assistant' && (
                  <Text style={styles.bubbleSender}>Iron Coach</Text>
                )}
                <Text style={[styles.bubbleText, m.role === 'user' && styles.userBubbleText]}>
                  {m.text}
                </Text>
              </View>
            ))}
            {loading && (
              <View style={styles.aiBubble}>
                <ActivityIndicator size="small" color={colors.primary} />
              </View>
            )}
          </View>

          {/* Quick suggestions */}
          {messages.length <= 1 && (
            <View style={styles.suggestions}>
              {SUGGESTIONS.map(s => (
                <TouchableOpacity key={s} style={styles.suggestion} onPress={() => sendMessage(s)}>
                  <Text style={styles.suggestionText}>{s}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </ScrollView>

        {/* Input */}
        <View style={styles.inputRow}>
          <TextInput
            style={styles.input}
            value={input}
            onChangeText={setInput}
            placeholder="Ask your coach..."
            placeholderTextColor={colors.textMuted}
            returnKeyType="send"
            onSubmitEditing={() => sendMessage()}
            multiline
          />
          <TouchableOpacity
            style={[styles.sendBtn, (!input.trim() || loading) && styles.sendBtnDisabled]}
            onPress={() => sendMessage()}
            disabled={!input.trim() || loading}
          >
            <Text style={styles.sendBtnText}>↑</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: spacing.xl, paddingVertical: spacing.md,
    borderBottomWidth: 1, borderBottomColor: colors.border,
  },
  greeting: { fontSize: font.sizes.lg, fontWeight: font.weights.bold, color: colors.text },
  subGreeting: { fontSize: font.sizes.sm, color: colors.textSecondary, marginTop: 2 },
  badge: {
    backgroundColor: colors.primary, borderRadius: 8,
    paddingHorizontal: spacing.sm, paddingVertical: spacing.xs,
  },
  badgeText: { fontSize: font.sizes.xs, fontWeight: font.weights.black, color: colors.background },
  scroll: { flex: 1 },
  scrollContent: { padding: spacing.xl, gap: spacing.lg, paddingBottom: spacing.xxl },
  planCard: {
    backgroundColor: colors.card, borderRadius: 16, padding: spacing.lg,
    borderWidth: 1, borderColor: colors.border,
  },
  planTitle: { fontSize: font.sizes.md, fontWeight: font.weights.black, color: colors.primary, marginBottom: spacing.md },
  planRow: { flexDirection: 'row', gap: spacing.md },
  planBlock: { flex: 1 },
  planBlockRight: { borderLeftWidth: 1, borderLeftColor: colors.border, paddingLeft: spacing.md },
  planBlockLabel: { fontSize: font.sizes.xs, color: colors.textSecondary, marginBottom: 4 },
  planBlockTitle: { fontSize: font.sizes.sm, fontWeight: font.weights.bold, color: colors.text, marginBottom: spacing.sm },
  planExercise: { fontSize: font.sizes.xs, color: colors.textSecondary, marginBottom: 3 },
  chatSection: { gap: spacing.md },
  bubble: { maxWidth: '85%', borderRadius: 16, padding: spacing.md },
  aiBubble: {
    alignSelf: 'flex-start', backgroundColor: colors.card,
    borderWidth: 1, borderColor: colors.border, gap: 4,
  },
  userBubble: { alignSelf: 'flex-end', backgroundColor: colors.primary },
  bubbleSender: { fontSize: font.sizes.xs, fontWeight: font.weights.bold, color: colors.primary },
  bubbleText: { fontSize: font.sizes.sm, color: colors.text, lineHeight: 20 },
  userBubbleText: { color: colors.background },
  suggestions: { gap: spacing.sm },
  suggestion: {
    backgroundColor: colors.card, borderRadius: 12, padding: spacing.md,
    borderWidth: 1, borderColor: colors.border,
  },
  suggestionText: { fontSize: font.sizes.sm, color: colors.textSecondary },
  inputRow: {
    flexDirection: 'row', alignItems: 'flex-end', gap: spacing.sm,
    paddingHorizontal: spacing.lg, paddingVertical: spacing.md,
    borderTopWidth: 1, borderTopColor: colors.border,
  },
  input: {
    flex: 1, backgroundColor: colors.card, borderRadius: 20,
    paddingHorizontal: spacing.md, paddingVertical: spacing.sm + 2,
    color: colors.text, fontSize: font.sizes.md, maxHeight: 100,
    borderWidth: 1, borderColor: colors.border,
  },
  sendBtn: {
    width: 42, height: 42, borderRadius: 21,
    backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center',
  },
  sendBtnDisabled: { opacity: 0.3 },
  sendBtnText: { fontSize: 20, fontWeight: font.weights.black, color: colors.background },
});
