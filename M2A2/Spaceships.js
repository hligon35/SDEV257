import React, { useEffect, useState, useRef } from "react";
import { View, ScrollView, Text, TouchableOpacity, ActivityIndicator, Modal, Button, Image } from "react-native";
import { Swipeable } from "react-native-gesture-handler";
import SearchHeader from "./SearchHeader";
import styles from "./styles";
import AnimatedItem from "./AnimatedItem";
import LazyHeaderImage from "./LazyHeaderImage";

const spaceshipImages = {
  "CR90 corvette": require("./assets/spaceships/cr90corvette.png"),
  "Death Star": require("./assets/spaceships/deathstar.png"),
  Executor: require("./assets/spaceships/executor.png"),
  "Millennium Falcon": require("./assets/spaceships/millenniumfalcon.png"),
  "Rebel transport": require("./assets/spaceships/rebeltransport.png"),
  "Sentinel-class landing craft": require("./assets/spaceships/sentinelclasslandingcraft.png"),
  "Star Destroyer": require("./assets/spaceships/stardestroyer.png"),
  "TIE Advanced x1": require("./assets/spaceships/tieadvancedx1.png"),
  "X-wing": require("./assets/spaceships/x-wing.png"),
  "Y-wing": require("./assets/spaceships/y-wing.png"),
};

export default function Spaceships({ navigation }) {
  const swipeRefs = useRef({});
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalText, setModalText] = useState("");
  const [searchText, setSearchText] = useState("");
  const [filtered, setFiltered] = useState([]);

  useEffect(() => {
    fetch("https://www.swapi.tech/api/starships")
      .then((r) => r.json())
      .then((json) => {
        const items = json.results || json.result || [];
        const list = (items || []).map((it) => ({
          key: it.uid || it.url || it.name,
          name: it.name || (it.properties && it.properties.name) || it.title,
          url: it.url || (it.uid ? `https://www.swapi.tech/api/starships/${it.uid}` : undefined),
        }));
        setData(list);
        setFiltered(list);
      })
      .catch(() => setData([]))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <ActivityIndicator style={{ marginTop: 40 }} />;

  return (
    <>
      <ScrollView contentContainerStyle={styles.container}>
        <LazyHeaderImage style={{ height: 180 }} />
        <SearchHeader value={searchText} onChangeText={(t) => {
          setSearchText(t);
          const tt = (t || "").toLowerCase();
          if (!tt) setFiltered(data);
          else setFiltered(data.filter((it) => (it.name || "").toLowerCase().includes(tt)));
        }} onSearch={(t) => {}} />
        {filtered.map((item, i) => (
          <Swipeable
            key={item.key}
            ref={(r) => (swipeRefs.current[item.key] = r)}
            onSwipeableOpen={() => {
              swipeRefs.current[item.key]?.close();
              navigation.navigate("Details", { title: item.name, url: item.url });
            }}
            renderRightActions={() => (
              <View style={{ justifyContent: "center", marginRight: 8 }}>
                <Button
                  title="Details"
                  onPress={() => {
                    swipeRefs.current[item.key]?.close();
                    navigation.navigate("Details", { title: item.name, url: item.url });
                  }}
                />
              </View>
            )}
          >
            <AnimatedItem delay={i * 30}>
              <TouchableOpacity
                style={styles.tile}
                onPress={() => {
                  swipeRefs.current[item.key]?.close();
                  navigation.navigate("Details", { title: item.name, url: item.url });
                }}
              >
                <Image
                  source={spaceshipImages[item.name] || spaceshipImages["Star Destroyer"]}
                  style={styles.thumb}
                  resizeMode="contain"
                />
                <Text style={styles.itemText}>{item.name}</Text>
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
