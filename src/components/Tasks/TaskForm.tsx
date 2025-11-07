import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ScrollView,
  Platform,
} from 'react-native';
import Animated, {
  FadeIn,
  FadeOut,
  SlideInDown,
  SlideOutDown,
} from 'react-native-reanimated';
import { useTheme } from '../../theme/ThemeContext';
import { Input } from '../UI/Input';
import { Button } from '../UI/Button';
import { TaskInput, TaskColor, TASK_COLORS } from '../../types';
import { DURATION_PRESETS, dateHelpers } from '../../utils/dateHelpers';
import { hapticFeedback } from '../../utils/haptics';

interface TaskFormProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (task: TaskInput) => void;
  initialDate?: Date;
}

export const TaskForm: React.FC<TaskFormProps> = ({
  visible,
  onClose,
  onSubmit,
  initialDate,
}) => {
  const { theme } = useTheme();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [selectedDate] = useState(initialDate || new Date());
  const [selectedHour, setSelectedHour] = useState(9);
  const [selectedMinute, setSelectedMinute] = useState(0);
  const [duration, setDuration] = useState(60);
  const [selectedColor, setSelectedColor] = useState<TaskColor>(TASK_COLORS[0]);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = () => {
    // Validate
    const newErrors: Record<string, string> = {};
    if (!title.trim()) {
      newErrors.title = 'Title is required';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      hapticFeedback.error();
      return;
    }

    // Create task
    const startTime = dateHelpers.createTimeFromHour(selectedDate, selectedHour, selectedMinute);
    const taskInput: TaskInput = {
      title: title.trim(),
      description: description.trim() || undefined,
      startTime,
      duration,
      color: selectedColor,
    };

    onSubmit(taskInput);
    hapticFeedback.success();

    // Reset form
    setTitle('');
    setDescription('');
    setDuration(60);
    setSelectedColor(TASK_COLORS[0]);
    setErrors({});
    onClose();
  };

  const handleClose = () => {
    setErrors({});
    onClose();
  };

  const handleColorSelect = (color: TaskColor) => {
    setSelectedColor(color);
    hapticFeedback.selection();
  };

  const handleDurationSelect = (durationValue: number) => {
    setDuration(durationValue);
    hapticFeedback.selection();
  };

  if (!visible) return null;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={handleClose}
    >
      <Animated.View
        entering={FadeIn}
        exiting={FadeOut}
        style={[styles.overlay, { backgroundColor: theme.colors.overlay }]}
      >
        <TouchableOpacity
          style={styles.overlayTouchable}
          activeOpacity={1}
          onPress={handleClose}
        />
      </Animated.View>

      <Animated.View
        entering={SlideInDown.springify().damping(20)}
        exiting={SlideOutDown.springify().damping(20)}
        style={[
          styles.container,
          {
            backgroundColor: theme.colors.surface,
          },
        ]}
      >
        {/* Handle bar */}
        <View style={styles.handleBar}>
          <View
            style={[
              styles.handle,
              { backgroundColor: theme.colors.border },
            ]}
          />
        </View>

        {/* Header */}
        <View style={styles.header}>
          <Text style={[styles.headerTitle, { color: theme.colors.text }]}>
            Create Task
          </Text>
          <TouchableOpacity onPress={handleClose} hitSlop={theme.hitSlop}>
            <Text style={[styles.closeButton, { color: theme.colors.textSecondary }]}>
              ✕
            </Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
          {/* Title Input */}
          <Input
            label="Title"
            placeholder="What do you need to do?"
            value={title}
            onChangeText={setTitle}
            error={errors.title}
            autoFocus
          />

          {/* Time Picker */}
          <View style={styles.section}>
            <Text style={[styles.sectionLabel, { color: theme.colors.text }]}>
              Time
            </Text>
            <View style={styles.timePickerContainer}>
              <View style={styles.timePicker}>
                <TouchableOpacity
                  style={[
                    styles.timeButton,
                    { backgroundColor: theme.colors.backgroundSecondary },
                  ]}
                  onPress={() => {
                    setSelectedHour((selectedHour + 1) % 24);
                    hapticFeedback.selection();
                  }}
                >
                  <Text style={[styles.timeText, { color: theme.colors.text }]}>
                    {selectedHour.toString().padStart(2, '0')}
                  </Text>
                </TouchableOpacity>
                <Text style={[styles.timeSeparator, { color: theme.colors.text }]}>:</Text>
                <TouchableOpacity
                  style={[
                    styles.timeButton,
                    { backgroundColor: theme.colors.backgroundSecondary },
                  ]}
                  onPress={() => {
                    setSelectedMinute((selectedMinute + 15) % 60);
                    hapticFeedback.selection();
                  }}
                >
                  <Text style={[styles.timeText, { color: theme.colors.text }]}>
                    {selectedMinute.toString().padStart(2, '0')}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>

          {/* Duration Selector */}
          <View style={styles.section}>
            <Text style={[styles.sectionLabel, { color: theme.colors.text }]}>
              Duration
            </Text>
            <View style={styles.chipsContainer}>
              {DURATION_PRESETS.map((preset) => (
                <TouchableOpacity
                  key={preset.value}
                  style={[
                    styles.chip,
                    {
                      backgroundColor:
                        duration === preset.value
                          ? theme.colors.primary
                          : theme.colors.backgroundSecondary,
                      borderColor:
                        duration === preset.value
                          ? theme.colors.primary
                          : theme.colors.border,
                    },
                  ]}
                  onPress={() => handleDurationSelect(preset.value)}
                >
                  <Text
                    style={[
                      styles.chipText,
                      {
                        color:
                          duration === preset.value
                            ? '#FFFFFF'
                            : theme.colors.text,
                      },
                    ]}
                  >
                    {preset.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Color Picker */}
          <View style={styles.section}>
            <Text style={[styles.sectionLabel, { color: theme.colors.text }]}>
              Color
            </Text>
            <View style={styles.colorsContainer}>
              {TASK_COLORS.map((color) => (
                <TouchableOpacity
                  key={color}
                  style={[
                    styles.colorButton,
                    { backgroundColor: color },
                    selectedColor === color && styles.colorButtonSelected,
                  ]}
                  onPress={() => handleColorSelect(color)}
                />
              ))}
            </View>
          </View>

          {/* Description Input */}
          <Input
            label="Notes (Optional)"
            placeholder="Add any additional details..."
            value={description}
            onChangeText={setDescription}
            multiline
            numberOfLines={3}
            style={styles.textArea}
          />

          {/* Buttons */}
          <View style={styles.buttonContainer}>
            <Button
              title="Cancel"
              variant="ghost"
              onPress={handleClose}
              style={styles.cancelButton}
            />
            <Button
              title="Create Task"
              onPress={handleSubmit}
              style={styles.submitButton}
            />
          </View>
        </ScrollView>
      </Animated.View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 1000,
  },
  overlayTouchable: {
    flex: 1,
  },
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '90%',
    zIndex: 1001,
    ...Platform.select({
      web: {
        boxShadow: '0 -4px 16px rgba(0, 0, 0, 0.1)',
      },
      default: {
        shadowColor: '#000',
        shadowOffset: {
          width: 0,
          height: -4,
        },
        shadowOpacity: 0.1,
        shadowRadius: 16,
        elevation: 16,
      },
    }),
  },
  handleBar: {
    alignItems: 'center',
    paddingTop: 12,
    paddingBottom: 8,
  },
  handle: {
    width: 40,
    height: 4,
    borderRadius: 2,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingVertical: 16,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
  },
  closeButton: {
    fontSize: 28,
    fontWeight: '300',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingBottom: 32,
  },
  section: {
    marginBottom: 24,
  },
  sectionLabel: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 12,
  },
  timePickerContainer: {
    alignItems: 'center',
  },
  timePicker: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  timeButton: {
    width: 80,
    height: 60,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  timeText: {
    fontSize: 28,
    fontWeight: '600',
  },
  timeSeparator: {
    fontSize: 28,
    fontWeight: '600',
  },
  chipsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
  },
  chipText: {
    fontSize: 14,
    fontWeight: '500',
  },
  colorsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  colorButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 3,
    borderColor: 'transparent',
  },
  colorButtonSelected: {
    borderColor: 'rgba(255, 255, 255, 0.8)',
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
  },
  cancelButton: {
    flex: 1,
  },
  submitButton: {
    flex: 2,
  },
});
