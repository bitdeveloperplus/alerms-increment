import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

interface Props {
  onAddItem: () => void;
  onSettings: () => void;
  onSetup: () => void;
}

export const HomeScreen: React.FC<Props> = ({ onSetup }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>hello alarms next</Text>
      <TouchableOpacity style={styles.setupButton} onPress={onSetup}>
        <Text style={styles.setupButtonText}>set up</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontSize: 18,
    color: '#000',
  },
  setupButton: {
    marginTop: 20,
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: '#007AFF',
    borderRadius: 8,
  },
  setupButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});


