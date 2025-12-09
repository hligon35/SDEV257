import React from "react";
import { ScrollView, Text } from "react-native";
import styles from "./styles";

export default function Settings({ navigation }) {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text>Settings Content</Text>
    </ScrollView>
  );
}