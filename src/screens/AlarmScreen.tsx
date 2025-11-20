import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Vibration, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { stopAlarm } from '../services/alarmService';

interface Props {
  time: string;
  onDismiss: () => void;
}

export const AlarmScreen: React.FC<Props> = ({ time, onDismiss }) => {
  const [isDismissing, setIsDismissing] = useState(false);

  useEffect(() => {
    // Vibrate when alarm screen appears
    if (Platform.OS === 'android') {
      // Android: Vibrate in pattern (vibrate for 1s, pause for 0.5s)
      const vibratePattern = [0, 1000, 500];
      Vibration.vibrate(vibratePattern, true); // true = repeat
    } else {
      // iOS: Simple vibration
      Vibration.vibrate();
      const interval = setInterval(() => {
        Vibration.vibrate();
      }, 2000);
      return () => clearInterval(interval);
    }

    // Cleanup vibration on unmount
    return () => {
      Vibration.cancel();
    };
  }, []);

  const handleDismiss = async () => {
    if (isDismissing) return;
    
    setIsDismissing(true);
    Vibration.cancel();
    await stopAlarm();
    onDismiss();
  };

  return (
    <LinearGradient
      colors={['#1a237e', '#000000']}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
      style={styles.container}
    >
      <View style={styles.content}>
        <Text style={styles.wakeUpText}>Wake Up!</Text>
        <Text style={styles.timeText}>{time}</Text>
        
        <TouchableOpacity
          style={[styles.dismissButton, isDismissing && styles.dismissButtonDisabled]}
          onPress={handleDismiss}
          disabled={isDismissing}
          activeOpacity={0.8}
        >
          <Text style={styles.dismissButtonText}>
            {isDismissing ? 'Stopping...' : 'Dismiss'}
          </Text>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    alignItems: 'center',
    padding: 40,
  },
  wakeUpText: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 20,
    textAlign: 'center',
  },
  timeText: {
    fontSize: 72,
    fontWeight: '300',
    color: '#FFFFFF',
    marginBottom: 60,
    textAlign: 'center',
  },
  dismissButton: {
    backgroundColor: '#34C759',
    paddingHorizontal: 60,
    paddingVertical: 20,
    borderRadius: 30,
    minWidth: 200,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
  dismissButtonDisabled: {
    backgroundColor: '#6C757D',
    opacity: 0.6,
  },
  dismissButtonText: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: 'bold',
  },
});

