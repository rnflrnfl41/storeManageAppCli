import React from 'react';
import { View, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ThemedText } from '@components/ThemedText';

export default function CouponScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <ThemedText style={styles.title}>쿠폰관리</ThemedText>
        <ThemedText style={styles.subtitle}>쿠폰을 관리하는 화면입니다.</ThemedText>
      </View>
      <View style={{ height: 100 }} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
});