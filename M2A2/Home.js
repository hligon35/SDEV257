import React from "react";
import { ScrollView, Text } from "react-native";
import styles from "./styles";

export default function Home() {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text>Home Content</Text>
    </ScrollView>
  );
}