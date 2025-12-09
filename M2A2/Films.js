import React, { useEffect, useState } from "react";
import { View, ScrollView, Text, TouchableOpacity, ActivityIndicator, Modal, Button } from "react-native";
import { Swipeable } from "react-native-gesture-handler";
import SearchHeader from "./SearchHeader";
import styles from "./styles";
import AnimatedItem from "./AnimatedItem";
import LazyHeaderImage from "./LazyHeaderImage";

export default function Films({ navigation }) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalText, setModalText] = useState("");

  useEffect(() => {
    fetch("https://www.swapi.tech/api/films")
      .then((r) => r.json())
      .then((json) => {
        const items = json.results || json.result || [];
        const list = (items || []).map((it) => ({
          key: it.uid || it.url || it.title || it.name,
          name: it.title || it.name || (it.properties && it.properties.title),
          url: it.url || (it.uid ? `https://www.swapi.tech/api/films/${it.uid}` : undefined),
        }));
        setData(list);
      })
      .catch(() => setData([]))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <ActivityIndicator style={{ marginTop: 40 }} />;

  return (
    <>
      <ScrollView contentContainerStyle={styles.container}>
        <LazyHeaderImage style={{ height: 180 }} />
        <SearchHeader />
        {data.map((item, i) => (
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
            <AnimatedItem delay={i * 30}>
              <TouchableOpacity
                onPress={() => navigation.navigate("Details", { title: item.name, url: item.url })}
              >
                <Text style={styles.item}>{item.name}</Text>
              </TouchableOpacity>
            </AnimatedItem>
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
    </>
  );
}
