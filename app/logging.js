import React, { useState, useEffect } from "react";
import { View, Text, Button, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { Gyroscope, Accelerometer, Magnetometer } from "expo-sensors";

const LoggingScreen = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [dataLog, setDataLog] = useState([]);
  const router = useRouter();
  let recordingTimer;

  useEffect(() => {
    let accelerometerSubscription, gyroscopeSubscription, magnetometerSubscription;

    if (isRecording) {
      setDataLog([]); // Reset data log on start

      Accelerometer.setUpdateInterval(10);
      Gyroscope.setUpdateInterval(10);
      Magnetometer.setUpdateInterval(10);

      accelerometerSubscription = Accelerometer.addListener((data) => {
        setDataLog((prevLog) => [...prevLog, { timestamp: Date.now(), type: "Accelerometer", ...data }]);
      });

      gyroscopeSubscription = Gyroscope.addListener((data) => {
        setDataLog((prevLog) => [...prevLog, { timestamp: Date.now(), type: "Gyroscope", ...data }]);
      });

      magnetometerSubscription = Magnetometer.addListener((data) => {
        setDataLog((prevLog) => [...prevLog, { timestamp: Date.now(), type: "Magnetometer", ...data }]);
      });

      // Stop automatically after 6 minutes
      recordingTimer = setTimeout(() => stopRecording(), 360000);
    }

    return () => {
      accelerometerSubscription?.remove();
      gyroscopeSubscription?.remove();
      magnetometerSubscription?.remove();
      clearTimeout(recordingTimer);
    };
  }, [isRecording]);

  const stopRecording = () => {
    setIsRecording(false);
    router.push({ pathname: "/results", params: { data: JSON.stringify(dataLog) } });
  };

  const toggleRecording = () => {
    if (isRecording) {
      stopRecording(); // Stop and navigate when manually stopped
    } else {
      setIsRecording(true);
    }
  };

  return (
    <View style={styles.container}>
      <Button title={isRecording ? "Stop" : "Start"} onPress={toggleRecording} />
      <Text style={styles.text}>Logged Entries: {dataLog.length}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center" },
  text: { textAlign: "center", marginTop: 10 },
});

export default LoggingScreen;
