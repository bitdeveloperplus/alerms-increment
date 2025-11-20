import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface Props {
  onAddItem: () => void;
  onSettings: () => void;
}

export const HomeScreen: React.FC<Props> = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>hello wishlist</Text>
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
});


