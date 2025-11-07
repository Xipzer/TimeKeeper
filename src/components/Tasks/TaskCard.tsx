import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
  runOnJS,
} from 'react-native-reanimated';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { useTheme } from '../../theme/ThemeContext';
import { Task } from '../../types';
import { dateHelpers } from '../../utils/dateHelpers';
import { hapticFeedback } from '../../utils/haptics';

interface TaskCardProps {
  task: Task;
  onPress?: () => void;
  onComplete?: () => void;
  onDelete?: () => void;
}

export const TaskCard: React.FC<TaskCardProps> = ({
  task,
  onPress,
  onComplete,
  onDelete,
}) => {
  const { theme } = useTheme();
  const translateX = useSharedValue(0);
  const scale = useSharedValue(1);

  const SWIPE_THRESHOLD = 80;

  const panGesture = Gesture.Pan()
    .onUpdate((event) => {
      translateX.value = event.translationX;
    })
    .onEnd((event) => {
      if (event.translationX > SWIPE_THRESHOLD && onComplete) {
        // Swipe right - complete
        translateX.value = withTiming(500, { duration: 300 }, () => {
          runOnJS(hapticFeedback.success)();
          runOnJS(onComplete)();
        });
      } else if (event.translationX < -SWIPE_THRESHOLD && onDelete) {
        // Swipe left - delete
        translateX.value = withTiming(-500, { duration: 300 }, () => {
          runOnJS(hapticFeedback.warning)();
          runOnJS(onDelete)();
        });
      } else {
        // Return to original position
        translateX.value = withSpring(0);
      }
    });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { scale: scale.value },
    ],
  }));

  const backgroundStyle = useAnimatedStyle(() => {
    const backgroundColor =
      translateX.value > SWIPE_THRESHOLD
        ? theme.colors.success
        : translateX.value < -SWIPE_THRESHOLD
        ? theme.colors.error
        : 'transparent';

    return {
      backgroundColor: withTiming(backgroundColor, { duration: 200 }),
    };
  });

  const handlePressIn = () => {
    scale.value = withSpring(0.98);
    hapticFeedback.light();
  };

  const handlePressOut = () => {
    scale.value = withSpring(1);
  };

  const getDurationText = () => {
    const hours = Math.floor(task.duration / 60);
    const minutes = task.duration % 60;
    if (hours > 0 && minutes > 0) {
      return `${hours}h ${minutes}m`;
    } else if (hours > 0) {
      return `${hours}h`;
    } else {
      return `${minutes}m`;
    }
  };

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.background, backgroundStyle]} />
      <GestureDetector gesture={panGesture}>
        <Animated.View style={animatedStyle}>
          <TouchableOpacity
            onPress={onPress}
            onPressIn={handlePressIn}
            onPressOut={handlePressOut}
            activeOpacity={0.9}
            style={[
              styles.card,
              {
                backgroundColor: theme.colors.surface,
                borderLeftColor: task.color,
                ...theme.shadows.sm,
              },
            ]}
          >
            <View style={[styles.colorBar, { backgroundColor: task.color }]} />
            <View style={styles.content}>
              <Text
                style={[
                  styles.title,
                  {
                    color: theme.colors.text,
                    textDecorationLine: task.completed ? 'line-through' : 'none',
                  },
                ]}
                numberOfLines={2}
              >
                {task.title}
              </Text>
              {task.description && (
                <Text
                  style={[styles.description, { color: theme.colors.textSecondary }]}
                  numberOfLines={1}
                >
                  {task.description}
                </Text>
              )}
              <View style={styles.footer}>
                <Text style={[styles.time, { color: theme.colors.textTertiary }]}>
                  {dateHelpers.formatTime(task.startTime)} - {dateHelpers.formatTime(task.endTime)}
                </Text>
                <View style={[styles.durationBadge, { backgroundColor: `${task.color}20` }]}>
                  <Text style={[styles.duration, { color: task.color }]}>
                    {getDurationText()}
                  </Text>
                </View>
              </View>
            </View>
          </TouchableOpacity>
        </Animated.View>
      </GestureDetector>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 6,
    marginHorizontal: 16,
  },
  background: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    borderRadius: 12,
  },
  card: {
    borderRadius: 12,
    borderLeftWidth: 4,
    flexDirection: 'row',
    overflow: 'hidden',
  },
  colorBar: {
    width: 4,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  description: {
    fontSize: 14,
    marginBottom: 8,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 4,
  },
  time: {
    fontSize: 12,
  },
  durationBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  duration: {
    fontSize: 12,
    fontWeight: '600',
  },
});
