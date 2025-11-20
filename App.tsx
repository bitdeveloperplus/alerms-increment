import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { HomeScreen } from './src/screens/HomeScreen';
import { SetupScreen } from './src/screens/SetupScreen';
import { AddNewItemModal } from './src/components/AddNewItemModal';

export default function App() {
  const [showModal, setShowModal] = useState(false);
  const [showSetupScreen, setShowSetupScreen] = useState(false);

  const handleOpenSettings = () => {
    console.log('Opening settings');
    // TODO: Implement settings screen
  };

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      
      {showSetupScreen ? (
        <SetupScreen onBack={() => setShowSetupScreen(false)} />
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
