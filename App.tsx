import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, AppState } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import * as Notifications from 'expo-notifications';
import { HomeScreen } from './src/screens/HomeScreen';
import { SetupScreen } from './src/screens/SetupScreen';
import { AlarmScreen } from './src/screens/AlarmScreen';
import { AddNewItemModal } from './src/components/AddNewItemModal';
import { startAlarmSound } from './src/services/alarmService';

export default function App() {
  const [showModal, setShowModal] = useState(false);
  const [showSetupScreen, setShowSetupScreen] = useState(false);
  const [showAlarmScreen, setShowAlarmScreen] = useState(false);
  const [alarmTime, setAlarmTime] = useState<string>('');
  const notificationListener = useRef<Notifications.Subscription>();
  const responseListener = useRef<Notifications.Subscription>();

  useEffect(() => {
    // Set up notification handlers
    Notifications.setNotificationHandler({
      handleNotification: async (notification) => {
        const isAlarm = notification.request.content.data?.type === 'wake-up' || 
                        notification.request.content.categoryId === 'alarm';
        
        if (isAlarm) {
          // Extract time from notification
          const time = notification.request.content.body?.match(/(\d+:\d+\s+(AM|PM))/)?.[1] || 
                       notification.request.content.title || 
                       'Now';
          
          setAlarmTime(time);
          setShowAlarmScreen(true);
          
          // Start continuous alarm sound
          await startAlarmSound();
        }

        return {
          shouldShowAlert: true,
          shouldPlaySound: true,
          shouldSetBadge: false,
        };
      },
    });

    // Handle notification received while app is in foreground
    notificationListener.current = Notifications.addNotificationReceivedListener((notification) => {
      const isAlarm = notification.request.content.data?.type === 'wake-up' || 
                      notification.request.content.categoryId === 'alarm';
      
      if (isAlarm) {
        const time = notification.request.content.body?.match(/(\d+:\d+\s+(AM|PM))/)?.[1] || 
                     notification.request.content.title || 
                     'Now';
        
        setAlarmTime(time);
        setShowAlarmScreen(true);
        startAlarmSound();
      }
    });

    // Handle notification tapped (user taps on notification)
    responseListener.current = Notifications.addNotificationResponseReceivedListener((response) => {
      const notification = response.notification;
      const isAlarm = notification.request.content.data?.type === 'wake-up' || 
                      notification.request.content.categoryId === 'alarm';
      
      if (isAlarm) {
        const time = notification.request.content.body?.match(/(\d+:\d+\s+(AM|PM))/)?.[1] || 
                     notification.request.content.title || 
                     'Now';
        
        setAlarmTime(time);
        setShowAlarmScreen(true);
        startAlarmSound();
      }
    });

    // Handle app state changes (when app comes to foreground from notification)
    const subscription = AppState.addEventListener('change', (nextAppState) => {
      if (nextAppState === 'active') {
        // Check if we need to show alarm screen
        // This handles cases where notification triggers while app was in background
      }
    });

    return () => {
      if (notificationListener.current) {
        Notifications.removeNotificationSubscription(notificationListener.current);
      }
      if (responseListener.current) {
        Notifications.removeNotificationSubscription(responseListener.current);
      }
      subscription.remove();
    };
  }, []);

  const handleOpenSettings = () => {
    console.log('Opening settings');
    // TODO: Implement settings screen
  };

  const handleDismissAlarm = () => {
    setShowAlarmScreen(false);
    setAlarmTime('');
  };

  return (
    <View style={styles.container}>
      <StatusBar style={showAlarmScreen ? "light" : "dark"} />
      
      {showAlarmScreen ? (
        <AlarmScreen time={alarmTime} onDismiss={handleDismissAlarm} />
      ) : showSetupScreen ? (
        <SetupScreen 
          onBack={() => setShowSetupScreen(false)} 
          onTestAlarm={(time) => {
            setAlarmTime(time);
            setShowAlarmScreen(true);
          }}
        />
      ) : (
        <>
          <HomeScreen 
            onAddItem={() => setShowModal(true)}
            onSettings={handleOpenSettings}
            onSetup={() => setShowSetupScreen(true)}
          />

          <AddNewItemModal
            visible={showModal}
            onClose={() => setShowModal(false)}
            onSubmit={() => {}} 
          />
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
});
