import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { HomeScreen } from './src/screens/HomeScreen';
import { AddNewItemModal } from './src/components/AddNewItemModal';

export default function App() {
  const [showModal, setShowModal] = useState(false);

  const handleOpenSettings = () => {
    console.log('Opening settings');
    // TODO: Implement settings screen
  };

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      
      <HomeScreen 
        onAddItem={() => setShowModal(true)}
        onSettings={handleOpenSettings}
      />

      <AddNewItemModal
        visible={showModal}
        onClose={() => setShowModal(false)}
        onSubmit={() => {}} 
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
});
