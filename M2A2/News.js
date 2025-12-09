import React from "react";
import { ScrollView, Text } from "react-native";
import styles from "./styles";

export default function News({ navigation }) {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text>News Content</Text>
    </ScrollView>
  );
}