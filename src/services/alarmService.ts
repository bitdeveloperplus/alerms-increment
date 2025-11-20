import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

// Global interval for repeating alarm sound
let alarmInterval: NodeJS.Timeout | null = null;

// Configure notification behavior
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export interface AlarmSchedule {
  id: string;
  time: string; // Format: "HH:MM AM/PM"
  date: Date;
  enabled: boolean;
}

/**
 * Request notification permissions from the user
 */
export async function requestAlarmPermissions(): Promise<boolean> {
  try {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== 'granted') {
      console.warn('Notification permissions not granted');
      return false;
    }

    // Configure notification channel for Android
    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('alarms', {
        name: 'Alarms',
        importance: Notifications.AndroidImportance.HIGH,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#FF231F7C',
        sound: 'default',
      });
    }

    return true;
  } catch (error) {
    console.error('Error requesting permissions:', error);
    return false;
  }
}

/**
 * Start playing continuous alarm sound
 * Uses repeating notifications to create continuous alarm effect
 */
export async function startAlarmSound(): Promise<boolean> {
  try {
    // Stop any existing alarm sound
    await stopAlarm();

    // Function to play alarm sound notification
    const playAlarmNotification = async () => {
      try {
        await Notifications.scheduleNotificationAsync({
          content: {
            title: '⏰ Wake Up!',
            body: 'Alarm is ringing!',
            sound: true, // System default alarm sound
            priority: Notifications.AndroidNotificationPriority.MAX,
            categoryId: 'alarm',
          },
          trigger: null, // Trigger immediately
        });
      } catch (error) {
        console.error('Error playing alarm notification:', error);
      }
    };

    // Play immediately
    await playAlarmNotification();

    // Create interval to repeat alarm sound every 2 seconds
    // This creates continuous alarm effect
    alarmInterval = setInterval(() => {
      playAlarmNotification();
    }, 2000);

    return true;
  } catch (error) {
    console.error('Error starting alarm sound:', error);
    return false;
  }
}

/**
 * Stop the alarm sound
 */
export async function stopAlarm(): Promise<void> {
  try {
    // Clear repeating notification interval
    if (alarmInterval) {
      clearInterval(alarmInterval);
      alarmInterval = null;
    }

    // Cancel all pending notifications
    await Notifications.cancelAllScheduledNotificationsAsync();
  } catch (error) {
    console.error('Error stopping alarm:', error);
    if (alarmInterval) {
      clearInterval(alarmInterval);
      alarmInterval = null;
    }
  }
}

/**
 * Trigger a test alarm immediately with continuous sound
 */
export async function triggerTestAlarm(): Promise<boolean> {
  try {
    const hasPermission = await requestAlarmPermissions();
    if (!hasPermission) {
      return false;
    }

    // Start continuous alarm sound
    const soundStarted = await startAlarmSound();
    
    if (!soundStarted) {
      // Fallback to notification if sound doesn't start
      await Notifications.scheduleNotificationAsync({
        content: {
          title: 'Test Alarm',
          body: 'This is a test alarm! Wake up!',
          sound: true,
          priority: Notifications.AndroidNotificationPriority.HIGH,
          categoryId: 'alarm',
        },
        trigger: null,
      });
    }

    return true;
  } catch (error) {
    console.error('Error triggering test alarm:', error);
    return false;
  }
}

/**
 * Schedule an alarm for a specific date and time
 */
export async function scheduleAlarm(
  alarmId: string,
  date: Date,
  timeString: string
): Promise<string | null> {
  try {
    const hasPermission = await requestAlarmPermissions();
    if (!hasPermission) {
      return null;
    }

    const identifier = await Notifications.scheduleNotificationAsync({
      content: {
        title: 'Wake Up!',
        body: `Time to wake up! Your alarm is ringing at ${timeString}`,
        sound: true,
        priority: Notifications.AndroidNotificationPriority.HIGH,
        categoryId: 'alarm',
        data: {
          alarmId,
          type: 'wake-up',
        },
      },
      trigger: date,
    });

    return identifier;
  } catch (error) {
    console.error('Error scheduling alarm:', error);
    return null;
  }
}

/**
 * Schedule multiple alarms for the progressive wake-up schedule
 * (Day 1: selected time, Day 2: 5 min earlier, etc.)
 */
export async function scheduleProgressiveAlarms(
  startTime: string, // Format: "HH:MM AM/PM"
  startDate: Date = new Date()
): Promise<string[]> {
  try {
    const hasPermission = await requestAlarmPermissions();
    if (!hasPermission) {
      return [];
    }

    // Cancel existing alarms first
    await cancelAllAlarms();

    // Parse start time
    const match = startTime.match(/(\d+):(\d+)\s+(AM|PM)/);
    if (!match) {
      console.error('Invalid time format:', startTime);
      return [];
    }

    let hour = parseInt(match[1]);
    const minute = parseInt(match[2]);
    const period = match[3];

    // Convert to 24-hour format
    if (period === 'PM' && hour !== 12) {
      hour += 12;
    } else if (period === 'AM' && hour === 12) {
      hour = 0;
    }

    const scheduledIds: string[] = [];

    // Schedule 30 days of alarms
    for (let day = 0; day < 30; day++) {
      const alarmDate = new Date(startDate);
      alarmDate.setDate(alarmDate.getDate() + day + 1); // Start tomorrow (day + 1)
      
      // Calculate time for this day (5 minutes earlier each day)
      const minutesToSubtract = day * 5;
      let alarmHour = hour;
      let alarmMinute = minute - minutesToSubtract;

      // Handle minute overflow
      while (alarmMinute < 0) {
        alarmMinute += 60;
        alarmHour -= 1;
      }

      // Handle hour overflow (wrap to previous day)
      while (alarmHour < 0) {
        alarmHour += 24;
        alarmDate.setDate(alarmDate.getDate() - 1);
      }

      alarmDate.setHours(alarmHour, alarmMinute, 0, 0);

      // Skip if alarm time is in the past
      if (alarmDate <= new Date()) {
        continue;
      }

      // Format time string for display
      const displayHour = alarmHour > 12 ? alarmHour - 12 : (alarmHour === 0 ? 12 : alarmHour);
      const displayPeriod = alarmHour >= 12 ? 'PM' : 'AM';
      const displayMinute = alarmMinute.toString().padStart(2, '0');
      const timeString = `${displayHour}:${displayMinute} ${displayPeriod}`;

      const identifier = await scheduleAlarm(
        `alarm-day-${day + 1}`,
        alarmDate,
        timeString
      );

      if (identifier) {
        scheduledIds.push(identifier);
      }
    }

    return scheduledIds;
  } catch (error) {
    console.error('Error scheduling progressive alarms:', error);
    return [];
  }
}

/**
 * Cancel a specific alarm by identifier
 */
export async function cancelAlarm(identifier: string): Promise<void> {
  try {
    await Notifications.cancelScheduledNotificationAsync(identifier);
  } catch (error) {
    console.error('Error canceling alarm:', error);
  }
}

/**
 * Cancel all scheduled alarms
 */
export async function cancelAllAlarms(): Promise<void> {
  try {
    await Notifications.cancelAllScheduledNotificationsAsync();
  } catch (error) {
    console.error('Error canceling all alarms:', error);
  }
}

/**
 * Get all scheduled notifications
 */
export async function getAllScheduledAlarms(): Promise<Notifications.NotificationRequest[]> {
  try {
    return await Notifications.getAllScheduledNotificationsAsync();
  } catch (error) {
    console.error('Error getting scheduled alarms:', error);
    return [];
  }
}

