import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Switch,
} from 'react-native';
import { useTheme } from '../../theme/ThemeContext';
import { hapticFeedback } from '../../utils/haptics';

const SettingsScreen = () => {
  const { theme, themeMode, setThemeMode, toggleTheme } = useTheme();

  const handleThemeToggle = () => {
    hapticFeedback.selection();
    toggleTheme();
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={[styles.header, { backgroundColor: theme.colors.surface }]}>
        <Text style={[styles.headerTitle, { color: theme.colors.text }]}>
          Settings
        </Text>
      </View>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        {/* Appearance Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.textSecondary }]}>
            Appearance
          </Text>

          <View style={[styles.settingRow, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
            <View style={styles.settingInfo}>
              <Text style={[styles.settingLabel, { color: theme.colors.text }]}>
                Dark Mode
              </Text>
              <Text style={[styles.settingDescription, { color: theme.colors.textSecondary }]}>
                Current: {themeMode === 'auto' ? 'Auto' : themeMode === 'dark' ? 'Dark' : 'Light'}
              </Text>
            </View>
            <Switch
              value={theme.isDark}
              onValueChange={handleThemeToggle}
              trackColor={{ false: theme.colors.border, true: theme.colors.primary }}
              thumbColor="#FFFFFF"
            />
          </View>
        </View>

        {/* About Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.textSecondary }]}>
            About
          </Text>

          <View style={[styles.settingRow, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
            <View style={styles.settingInfo}>
              <Text style={[styles.settingLabel, { color: theme.colors.text }]}>
                Version
              </Text>
              <Text style={[styles.settingDescription, { color: theme.colors.textSecondary }]}>
                1.0.0
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 20,
    paddingTop: 10,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 8,
    marginLeft: 4,
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
  },
  settingInfo: {
    flex: 1,
  },
  settingLabel: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  settingDescription: {
    fontSize: 14,
  },
});

export default SettingsScreen;
