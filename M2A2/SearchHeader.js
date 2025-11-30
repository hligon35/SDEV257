import React, { useState } from "react";
import { View, TextInput, Button, Modal, Text, StyleSheet } from "react-native";

export default function SearchHeader() {
  const [text, setText] = useState("");
  const [visible, setVisible] = useState(false);

  function onSubmit() {
    setVisible(true);
  }

  return (
    <View style={styles.header}>
      <TextInput
        style={styles.input}
        placeholder="Enter search word"
        value={text}
        onChangeText={setText}
        returnKeyType="search"
        onSubmitEditing={onSubmit}
      />
      <Button title="Search" onPress={onSubmit} />

      <Modal animationType="slide" visible={visible} transparent={true}>
        <View style={styles.modalBackdrop}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>You searched for:</Text>
            <Text style={styles.modalText}>{text || "(empty)"}</Text>
            <Button title="Close" onPress={() => setVisible(false)} />
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    width: "100%",
    padding: 8,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#fff",
  },
  input: {
    flex: 1,
    borderColor: "#ccc",
    borderWidth: 1,
    padding: 8,
    marginRight: 8,
    borderRadius: 4,
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 8,
    width: "80%",
    alignItems: "center",
  },
  modalTitle: { fontWeight: "bold", marginBottom: 8 },
  modalText: { marginBottom: 12 },
});
