import React, { useState } from "react";
import { View, Text, TextInput, Button, StyleSheet, ScrollView } from "react-native";

export default function HomeScreen() {
  const [consentText, setConsentText] = useState("");
  const [consentResult, setConsentResult] = useState("");
  const [dataType, setDataType] = useState("");
  const [purpose, setPurpose] = useState("");
  const [accessResult, setAccessResult] = useState("");

  const BACKEND_URL = "http://192.168.1.17:3000";

  const submitConsent = async () => {
    try {
      const res = await fetch(`${BACKEND_URL}/consent`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: consentText })
      });
      const data = await res.json();
      setConsentResult(data.readableConsent || data.error);
    } catch (err) {
      setConsentResult("Error submitting consent");
    }
  };

  const testAccess = async () => {
    try {
      const res = await fetch(
        `${BACKEND_URL}/data/${dataType}?purpose=${purpose}`
      );
      const data = await res.json();
      setAccessResult(data.message || "Error");
    } catch {
      setAccessResult("Error testing access");
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Consent Management Mobile App</Text>

      {/* Submit Consent */}
      <View style={styles.card}>
        <Text style={styles.header}>Submit Legal Consent</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter legal consent text"
          multiline
          value={consentText}
          onChangeText={setConsentText}
        />
        <Button title="Submit Consent" onPress={submitConsent} />
        {consentResult ? (
          <Text style={styles.success}>{consentResult}</Text>
        ) : null}
      </View>

      {/* Test Access */}
      <View style={styles.card}>
        <Text style={styles.header}>Test Data Access</Text>
        <TextInput
          style={styles.input}
          placeholder="Data type (email, phone)"
          value={dataType}
          onChangeText={setDataType}
        />
        <TextInput
          style={styles.input}
          placeholder="Purpose (marketing, analytics)"
          value={purpose}
          onChangeText={setPurpose}
        />
        <Button title="Test Access" onPress={testAccess} />
        {accessResult ? (
          <Text style={accessResult.includes("granted") ? styles.success : styles.error}>
            {accessResult}
          </Text>
        ) : null}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingTop: 40
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20
  },
  card: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 8,
    marginBottom: 20,
    elevation: 2
  },
  header: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 10
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    borderRadius: 5,
    marginBottom: 10
  },
  success: {
    marginTop: 10,
    color: "green",
    fontWeight: "bold"
  },
  error: {
    marginTop: 10,
    color: "red",
    fontWeight: "bold"
  }
});
