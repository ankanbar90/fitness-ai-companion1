import axios from "axios";
import { useRef, useState } from "react";
import {
  Dimensions,
  FlatList,
  KeyboardAvoidingView,
  LayoutAnimation,
  Platform,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  UIManager,
  View,
} from "react-native";

// ENABLE ANIMATIONS FOR ANDROID
if (
  Platform.OS === "android" &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

// 🎨 PROFESSIONAL THEME
const COLORS = {
  primary: "#009688", // Teal
  primaryDark: "#00796B",
  bg: "#F4F7F6",
  white: "#FFFFFF",
  text: "#263238",
  subText: "#546E7A",
  userBubble: "#E0F2F1",
  aiBubble: "#FFFFFF",
  error: "#FF5252",
  accent: "#FFC107", // Amber
  success: "#4CAF50",
  cardBg: "#FFFFFF",
};

// 🔴 REPLACE WITH YOUR LOCAL IP ADDRESS
const API_URL = "http://192.168.1.12:5000/api/chat";

const { width } = Dimensions.get("window");

export default function Index() {
  const [messages, setMessages] = useState([
    {
      id: "welcome",
      role: "ai",
      content:
        "👋 Hi! I'm FitBot. I see your stats for today. How can I help you reach your goals?",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const flatListRef = useRef(null);

  // --- CONTEXT STATE ---
  const [personality, setPersonality] = useState("A");
  const [usageDays, setUsageDays] = useState(1);
  const [lifestyle, setLifestyle] = useState({ steps: 4200, sleepHours: 6.5 });
  const [showControls, setShowControls] = useState(false); // Default hidden for cleaner first look

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMsg = { id: Date.now().toString(), role: "user", content: input };

    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      setTimeout(
        () => flatListRef.current?.scrollToEnd({ animated: true }),
        100
      );

      const response = await axios.post(API_URL, {
        message: input,
        userContext: { personality, usageDays, lifestyle },
      });

      const aiMsg = {
        id: (Date.now() + 1).toString(),
        role: "ai",
        content: response.data.reply,
      };

      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
      setMessages((prev) => [...prev, aiMsg]);
    } catch (error) {
      const errorMsg = {
        id: Date.now().toString(),
        role: "system",
        content: "⚠️ Connection Error. Ensure Server is Running.",
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setLoading(false);
      setTimeout(
        () => flatListRef.current?.scrollToEnd({ animated: true }),
        100
      );
    }
  };

  // --- COMPONENT: TRACK RECORD CARD ---
  const renderStatsCard = () => {
    const stepProgress = Math.min(lifestyle.steps / 10000, 1); // 10k goal
    const sleepQuality = lifestyle.sleepHours >= 7 ? "Good" : "Low";

    return (
      <View style={styles.statsCard}>
        <View style={styles.statsHeader}>
          <Text style={styles.statsTitle}>YOUR TRACK RECORD</Text>
          <View style={styles.streakBadge}>
            <Text style={styles.streakText}>🔥 {usageDays} Day Streak</Text>
          </View>
        </View>

        <View style={styles.statsRow}>
          {/* STEPS COLUMN */}
          <View style={styles.statCol}>
            <Text style={styles.statLabel}>👣 Steps</Text>
            <Text style={styles.statValue}>{lifestyle.steps} / 10k</Text>
            <View style={styles.progressBarBg}>
              <View
                style={[
                  styles.progressBarFill,
                  { width: `${stepProgress * 100}%` },
                ]}
              />
            </View>
          </View>

          {/* SLEEP COLUMN */}
          <View style={styles.statCol}>
            <Text style={styles.statLabel}>💤 Sleep</Text>
            <Text style={styles.statValue}>{lifestyle.sleepHours} hrs</Text>
            <Text
              style={[
                styles.statStatus,
                {
                  color:
                    sleepQuality === "Good" ? COLORS.success : COLORS.error,
                },
              ]}
            >
              {sleepQuality === "Good" ? "Restored" : "Needs Rest"}
            </Text>
          </View>
        </View>
      </View>
    );
  };

  const renderHeader = () => (
    <View style={styles.headerContainer}>
      <StatusBar
        barStyle="light-content"
        backgroundColor={COLORS.primaryDark}
      />
      <View style={styles.navBar}>
        <Text style={styles.navTitle}>FitBot AI</Text>
        <TouchableOpacity
          onPress={() => setShowControls(!showControls)}
          style={styles.settingsBtn}
        >
          <Text style={styles.settingsText}>
            {showControls ? "Hide Controls" : "Show Controls"}
          </Text>
        </TouchableOpacity>
      </View>

      {/* DYNAMIC CONTROL PANEL */}
      {showControls && (
        <View style={styles.controlPanel}>
          <Text style={styles.controlLabel}>🧠 AI PERSONALITY</Text>
          <View style={styles.pillRow}>
            {["A", "B", "C"].map((p) => (
              <TouchableOpacity
                key={p}
                onPress={() => setPersonality(p)}
                style={[styles.pill, personality === p && styles.activePill]}
              >
                <Text
                  style={[
                    styles.pillText,
                    personality === p && styles.activePillText,
                  ]}
                >
                  {p === "A"
                    ? "🤗 Seeker"
                    : p === "B"
                    ? "🎨 Creative"
                    : "🔥 Finisher"}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text style={styles.controlLabel}>📅 SIMULATE DAYS</Text>
          <View style={styles.pillRow}>
            <TouchableOpacity
              onPress={() => setUsageDays(1)}
              style={[styles.pill, usageDays < 4 && styles.activePill]}
            >
              <Text
                style={[
                  styles.pillText,
                  usageDays < 4 && styles.activePillText,
                ]}
              >
                Day 1 (New)
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setUsageDays(10)}
              style={[styles.pill, usageDays > 9 && styles.activePill]}
            >
              <Text
                style={[
                  styles.pillText,
                  usageDays > 9 && styles.activePillText,
                ]}
              >
                Day 10 (Pro)
              </Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.controlLabel}>⌚ SIMULATE DATA</Text>
          <View style={styles.dataRow}>
            <TouchableOpacity
              onPress={() => setLifestyle({ steps: 8500, sleepHours: 7.5 })}
              style={[styles.pill, lifestyle.steps > 5000 && styles.activePill]}
            >
              <Text
                style={[
                  styles.pillText,
                  lifestyle.steps > 5000 && styles.activePillText,
                ]}
              >
                ✅ Healthy Day
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setLifestyle({ steps: 500, sleepHours: 4.5 })}
              style={[styles.pill, lifestyle.steps < 5000 && styles.activePill]}
            >
              <Text
                style={[
                  styles.pillText,
                  lifestyle.steps < 5000 && styles.activePillText,
                ]}
              >
                ❌ Lazy Day
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );

  const renderMessage = ({ item }) => {
    if (item.role === "system") {
      return (
        <View style={styles.systemMsg}>
          <Text style={styles.systemText}>{item.content}</Text>
        </View>
      );
    }
    const isUser = item.role === "user";
    return (
      <View
        style={[
          styles.bubbleWrapper,
          isUser ? styles.rightAlign : styles.leftAlign,
        ]}
      >
        <View
          style={[styles.bubble, isUser ? styles.userBubble : styles.aiBubble]}
        >
          <Text
            style={[styles.msgText, isUser ? styles.userText : styles.aiText]}
          >
            {item.content}
          </Text>
        </View>
        <Text style={styles.timestamp}>
          {isUser ? "You" : `FitBot • ${personality} Mode`}
        </Text>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {renderHeader()}

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={styles.keyboardContainer}
      >
        <FlatList
          ref={flatListRef}
          data={messages}
          renderItem={renderMessage}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.chatList}
          // THIS IS THE KEY CHANGE: Add Stats Card as Header
          ListHeaderComponent={renderStatsCard}
          ListFooterComponent={
            loading ? (
              <Text style={styles.loadingText}>FitBot is thinking...</Text>
            ) : null
          }
        />

        <View style={styles.inputWrapper}>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.textInput}
              value={input}
              onChangeText={setInput}
              placeholder="Ask about workouts..."
              placeholderTextColor="#90A4AE"
            />
            <TouchableOpacity
              onPress={sendMessage}
              style={styles.sendBtn}
              disabled={loading}
            >
              <Text style={styles.sendBtnText}>➤</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

// 💅 STYLESHEET
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg },
  keyboardContainer: { flex: 1, flexDirection: "column" },

  // Header
  headerContainer: {
    backgroundColor: COLORS.primary,
    paddingBottom: 15,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    zIndex: 10,
  },
  navBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    marginTop: StatusBar.currentHeight || 0,
  },
  navTitle: { color: COLORS.white, fontSize: 22, fontWeight: "800" },
  settingsBtn: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: "rgba(255,255,255,0.15)",
    borderRadius: 12,
  },
  settingsText: { color: COLORS.white, fontSize: 12, fontWeight: "600" },

  // Control Panel
  controlPanel: {
    backgroundColor: "rgba(0,0,0,0.2)",
    marginHorizontal: 15,
    padding: 15,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
  },
  controlLabel: {
    color: "rgba(255,255,255,0.9)",
    fontSize: 11,
    fontWeight: "bold",
    marginBottom: 8,
    letterSpacing: 1,
    marginTop: 5,
  },
  pillRow: { flexDirection: "row", marginBottom: 10 },
  dataRow: { flexDirection: "row", justifyContent: "space-between" },
  pill: {
    backgroundColor: "rgba(255,255,255,0.15)",
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 20,
    marginRight: 8,
    flex: 1,
    alignItems: "center",
  },
  activePill: { backgroundColor: COLORS.white, elevation: 2 },
  pillText: { color: COLORS.white, fontSize: 12, fontWeight: "600" },
  activePillText: { color: COLORS.primary, fontWeight: "bold" },

  // --- NEW STATS CARD STYLE ---
  statsCard: {
    backgroundColor: COLORS.white,
    marginHorizontal: 0,
    marginBottom: 10,
    padding: 20,
    borderRadius: 16,
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
  },
  statsHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },
  statsTitle: {
    fontSize: 12,
    fontWeight: "bold",
    color: COLORS.subText,
    letterSpacing: 1,
  },
  streakBadge: {
    backgroundColor: "#FFF3E0",
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 12,
  },
  streakText: { fontSize: 12, fontWeight: "bold", color: "#F57C00" },
  statsRow: { flexDirection: "row", justifyContent: "space-between" },
  statCol: { width: "48%" },
  statLabel: { fontSize: 14, color: COLORS.text, fontWeight: "600" },
  statValue: { fontSize: 18, fontWeight: "bold", color: COLORS.primary },
  statStatus: { fontSize: 12, fontWeight: "bold", marginTop: 2 },
  progressBarBg: {
    height: 6,
    backgroundColor: "#E0E0E0",
    borderRadius: 3,
    marginTop: 6,
  },
  progressBarFill: {
    height: 6,
    backgroundColor: COLORS.primary,
    borderRadius: 3,
  },

  // Chat Area
  chatList: { padding: 20, paddingBottom: 20, flexGrow: 1 },
  bubbleWrapper: { marginBottom: 15, maxWidth: "85%" },
  leftAlign: { alignSelf: "flex-start" },
  rightAlign: { alignSelf: "flex-end" },
  bubble: { borderRadius: 18, padding: 14, elevation: 1 },
  userBubble: {
    backgroundColor: COLORS.userBubble,
    borderBottomRightRadius: 2,
  },
  aiBubble: { backgroundColor: COLORS.aiBubble, borderTopLeftRadius: 2 },
  msgText: { fontSize: 15, lineHeight: 22, color: COLORS.text },
  timestamp: {
    fontSize: 10,
    color: "#90A4AE",
    marginTop: 4,
    alignSelf: "flex-end",
  },
  systemMsg: {
    alignSelf: "center",
    marginVertical: 10,
    backgroundColor: "#FFEBEE",
    padding: 8,
    borderRadius: 8,
  },
  systemText: { color: COLORS.error, fontSize: 12 },
  loadingText: {
    marginLeft: 20,
    color: COLORS.subText,
    fontStyle: "italic",
    marginBottom: 20,
  },

  // Input
  inputWrapper: { backgroundColor: COLORS.white, width: "100%" },
  inputContainer: {
    flexDirection: "row",
    padding: 10,
    borderTopWidth: 1,
    borderColor: "#ECEFF1",
    alignItems: "center",
  },
  textInput: {
    flex: 1,
    backgroundColor: COLORS.bg,
    borderRadius: 25,
    paddingHorizontal: 20,
    paddingVertical: 12,
    fontSize: 16,
    maxHeight: 100,
    color: COLORS.text,
  },
  sendBtn: {
    marginLeft: 10,
    backgroundColor: COLORS.primary,
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    elevation: 4,
    shadowColor: COLORS.primary,
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 2 },
  },
  sendBtnText: { color: COLORS.white, fontSize: 20, marginTop: -2 },
});
