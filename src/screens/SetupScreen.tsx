import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import WheelPicker from 'react-native-wheely';

interface Props {
  onBack: () => void;
}

// Generate time options from 4:00 AM to 9:00 AM in 5-minute increments
const generateTimeOptions = (): string[] => {
  const times: string[] = [];
  let hour = 4;
  let minute = 0;
  
  while (hour < 9 || (hour === 9 && minute === 0)) {
    const minuteStr = minute.toString().padStart(2, '0');
    const period = hour < 12 ? 'AM' : 'PM';
    times.push(`${hour}:${minuteStr} ${period}`);
    
    minute += 5;
    if (minute >= 60) {
      minute = 0;
      hour += 1;
    }
  }
  
  return times;
};

// Calculate time after 30 days with progressive 5-minute earlier wake-up
// Day 1: selected time, Day 2: 5 min earlier, Day 3: 10 min earlier, etc.
const calculateFutureTime = (selectedTime: string): string => {
  // Parse the selected time string (e.g., "5:00 AM")
  const match = selectedTime.match(/(\d+):(\d+)\s+(AM|PM)/);
  if (!match) return selectedTime;

  let hour = parseInt(match[1]);
  const minute = parseInt(match[2]);
  const period = match[3];

  // Convert to 24-hour format first
  if (period === 'PM' && hour !== 12) {
    hour += 12;
  } else if (period === 'AM' && hour === 12) {
    hour = 0;
  }

  // Convert to total minutes from midnight
  let totalMinutes = hour * 60 + minute;

  // After 30 days, we go back 29 steps (29 days after the first day)
  // Each step is 5 minutes earlier
  const minutesToSubtract = 29 * 5; // 145 minutes
  totalMinutes -= minutesToSubtract;

  // Handle negative values (wrap around to previous day)
  while (totalMinutes < 0) {
    totalMinutes += 24 * 60; // Add 24 hours
  }

  // Convert back to hours and minutes
  let futureHour = Math.floor(totalMinutes / 60);
  const futureMinute = totalMinutes % 60;

  // Handle hour overflow (24-hour to 12-hour conversion)
  futureHour = futureHour % 24;

  // Convert to 12-hour format
  let displayHour = futureHour;
  const displayPeriod = futureHour >= 12 ? 'PM' : 'AM';
  
  if (futureHour === 0) {
    displayHour = 12;
  } else if (futureHour > 12) {
    displayHour = futureHour - 12;
  }

  const displayMinute = futureMinute.toString().padStart(2, '0');

  return `${displayHour}:${displayMinute} ${displayPeriod}`;
};

export const SetupScreen: React.FC<Props> = ({ onBack }) => {
  const timeOptions = useMemo(() => generateTimeOptions(), []);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const selectedTime = timeOptions[selectedIndex];
  const futureTime = useMemo(() => calculateFutureTime(selectedTime), [selectedTime]);

  return (
    <LinearGradient
      colors={['#1a237e', '#000000']}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
      style={styles.container}
    >
      <View style={styles.headerContainer}>
        <Text style={styles.headerTitle}>Set a time</Text>
        <Text style={styles.headerSubtitle}>
          After 30 days you would wake up at {futureTime}
        </Text>
      </View>

      <Text style={styles.text}>setitup</Text>
      
      <View style={styles.pickerContainer}>
        <WheelPicker
          selectedIndex={selectedIndex}
          options={timeOptions}
          onChange={(index) => setSelectedIndex(index)}
          itemHeight={50}
          visibleRest={2}
          containerStyle={styles.wheelContainer}
          itemTextStyle={styles.itemText}
          selectedIndicatorStyle={styles.selectedIndicator}
        />
      </View>

      <TouchableOpacity style={styles.backButton} onPress={onBack}>
        <Text style={styles.backButtonText}>Back</Text>
      </TouchableOpacity>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  headerContainer: {
    alignItems: 'center',
    marginBottom: 30,
    paddingTop: 40,
  },
  headerTitle: {
    fontSize: 24,
    color: '#FFFFFF',
    fontWeight: '600',
    marginBottom: 10,
    textAlign: 'center',
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#FFFFFF',
    opacity: 0.9,
    textAlign: 'center',
    paddingHorizontal: 20,
    lineHeight: 22,
  },
  text: {
    fontSize: 18,
    color: '#FFFFFF',
    marginBottom: 30,
  },
  pickerContainer: {
    width: '100%',
    maxWidth: 300,
    backgroundColor: 'transparent',
    marginBottom: 20,
    height: 250,
    alignItems: 'center',
    justifyContent: 'center',
  },
  wheelContainer: {
    width: '100%',
    height: 250,
    backgroundColor: 'transparent',
  },
  itemText: {
    fontSize: 20,
    color: '#FFFFFF',
    textAlign: 'center',
  },
  selectedIndicator: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.4)',
  },
  backButton: {
    marginTop: 20,
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: '#007AFF',
    borderRadius: 8,
  },
  backButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});

