import React from "react";
import { View, Text, ScrollView, StyleSheet } from "react-native";
import { useLocalSearchParams } from "expo-router";

const ResultsScreen = () => {
  const { data } = useLocalSearchParams();
  const parsedData = JSON.parse(data || "[]");

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Logged Sensor Data</Text>
      {parsedData.length > 0 ? (
        parsedData.map((entry, index) => (
          <View key={index} style={styles.entry}>
            <Text>⏱ Timestamp: {entry.timestamp}</Text>
            <Text>📱 Accelerometer: {JSON.stringify(entry.accelerometer)}</Text>
            <Text>🌀 Gyroscope: {JSON.stringify(entry.gyroscope)}</Text>
            <Text>🧲 Magnetometer: {JSON.stringify(entry.magnetometer)}</Text>
          </View>
        ))
      ) : (
        <Text>No data recorded.</Text>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  header: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  entry: {
    marginBottom: 15,
    padding: 10,
    backgroundColor: "#f9f9f9",
    borderRadius: 8,
  },
});

export default ResultsScreen;
