import React, { useEffect, useState } from "react";
import { View, ScrollView, Text, TouchableOpacity, ActivityIndicator, Modal, Button } from "react-native";
import { Swipeable } from "react-native-gesture-handler";
import SearchHeader from "./SearchHeader";
import styles from "./styles";

export default function Planets({ navigation }) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalText, setModalText] = useState("");

  useEffect(() => {
    fetch("https://www.swapi.tech/api/planets")
      .then((r) => r.json())
      .then((json) => {
        // swapi.tech sometimes returns { results } or { result }
        const items = json.results || json.result || json.results || [];
        // results items may have name and uid
        const list = (items || []).map((it) => ({
          key: it.uid || it.url || it.name,
          name: it.name || (it.properties && it.properties.name) || it.title,
          url: it.url || (it.uid ? `https://www.swapi.tech/api/planets/${it.uid}` : undefined),
        }));
        setData(list);
      })
      .catch(() => setData([]))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <ActivityIndicator style={{ marginTop: 40 }} />;

  return (
    <View style={styles.container}>
      <SearchHeader />
      <ScrollView>
        {data.map((item) => (
          <Swipeable
            key={item.key}
            renderRightActions={() => (
              <View style={{ justifyContent: "center", marginRight: 8 }}>
                <Button
                  title="Show"
                  onPress={() => {
                    setModalText(item.name);
                    setModalVisible(true);
                  }}
                />
              </View>
            )}
          >
            <TouchableOpacity
              onPress={() => navigation.navigate("Details", { title: item.name, url: item.url })}
            >
              <Text style={styles.item}>{item.name}</Text>
            </TouchableOpacity>
          </Swipeable>
        ))}
      </ScrollView>

      <Modal animationType="slide" visible={modalVisible} transparent={true}>
        <View style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.4)", justifyContent: "center", alignItems: "center" }}>
          <View style={{ backgroundColor: "white", padding: 20, borderRadius: 8, width: "80%", alignItems: "center" }}>
            <Text style={{ fontWeight: "bold", marginBottom: 8 }}>Item</Text>
            <Text style={{ marginBottom: 12 }}>{modalText}</Text>
            <Button title="Close" onPress={() => setModalVisible(false)} />
          </View>
        </View>
      </Modal>
    </View>
  );
}
