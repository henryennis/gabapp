import React, { useState, useEffect } from "react";
import { View, Text, Button, StyleSheet } from "react-native";
import { Gyroscope, Accelerometer, Magnetometer } from "expo-sensors";

const LoggingScreen = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [dataLog, setDataLog] = useState([]); // Stores all sensor data over time

  useEffect(() => {
    let accelerometerSubscription, gyroscopeSubscription, magnetometerSubscription;
    let recordingTimer;

    if (isRecording) {
      // Clear previous logs when recording starts
      setDataLog([]);

      // Set update intervals
      Accelerometer.setUpdateInterval(10);
      Gyroscope.setUpdateInterval(10);
      Magnetometer.setUpdateInterval(10);

      // Start listeners
      accelerometerSubscription = Accelerometer.addListener((data) => {
        setDataLog((prevLog) => [...prevLog, { timestamp: Date.now(), type: "Accelerometer", ...data }]);
      });

      gyroscopeSubscription = Gyroscope.addListener((data) => {
        setDataLog((prevLog) => [...prevLog, { timestamp: Date.now(), type: "Gyroscope", ...data }]);
      });

      magnetometerSubscription = Magnetometer.addListener((data) => {
        setDataLog((prevLog) => [...prevLog, { timestamp: Date.now(), type: "Magnetometer", ...data }]);
      });

      // Stop recording automatically after 6 minutes (360,000 ms)
      recordingTimer = setTimeout(() => setIsRecording(false), 360000);
    }

    return () => {
      accelerometerSubscription?.remove();
      gyroscopeSubscription?.remove();
      magnetometerSubscription?.remove();
      clearTimeout(recordingTimer);
    };
  }, [isRecording]);

  return (
    <View style={styles.container}>
      <Button title={isRecording ? "Stop" : "Start"} onPress={() => setIsRecording(!isRecording)} />
      
      <Text style={styles.text}>Logged Entries: {dataLog.length}</Text>

      {isRecording && (
        <View>
          <Text style={styles.text}>Logging data...</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    textAlign: "center",
    marginTop: 10,
  },
});

export default LoggingScreen;
