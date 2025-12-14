import React, { useEffect, useState } from "react";
import { View, ScrollView, Text, TouchableOpacity, ActivityIndicator, Modal, Button, Image, Dimensions } from "react-native";
import SearchHeader from "./SearchHeader";
import styles from "./styles";
import AnimatedItem from "./AnimatedItem";
import LazyHeaderImage from "./LazyHeaderImage";

export default function Films({ navigation }) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalText, setModalText] = useState("");
  const [searchText, setSearchText] = useState("");
  const [filtered, setFiltered] = useState([]);

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
        setFiltered(list);
      })
      .catch(() => setData([]))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <ActivityIndicator style={{ marginTop: 40 }} />;

  // Film Screen poster image mapping
  const filmImages = {
    a_new_hope: require("./assets/films/newhope.webp"),
    newhope: require("./assets/films/newhope.webp"),
    the_empire_strikes_back: require("./assets/films/empirestrikesback.jpg"),
    empirestrikesback: require("./assets/films/empirestrikesback.jpg"),
    return_of_the_jedi: require("./assets/films/returnofthejedi.jpg"),
    returnofthejedi: require("./assets/films/returnofthejedi.jpg"),
    revenge_of_the_sith: require("./assets/films/revengeofthesith.jpg"),
    revengeofthesith: require("./assets/films/revengeofthesith.jpg"),
    the_phantom_menace: require("./assets/films/phantommenace.jpg"),
    phantommenace: require("./assets/films/phantommenace.jpg"),
    attack_of_the_clones: require("./assets/films/attackoftheclones.jpg"),
    attackoftheclones: require("./assets/films/attackoftheclones.jpg"),
  };
  function findImageForName(name) {
    if (!name) return null;
    const norm = name.toLowerCase().replace(/\s+/g, "_").replace(/[^a-z0-9_]/g, "");
    if (filmImages[norm]) return filmImages[norm];
    const noUnderscore = norm.replace(/_/g, "");
    if (filmImages[noUnderscore]) return filmImages[noUnderscore];
    return null;
  }

  const SCREEN_WIDTH = Dimensions.get("window").width;
  const H_GAP = 10;
  const SIDE_PADDING = 10;
  const CELL = Math.floor((SCREEN_WIDTH - SIDE_PADDING * 2 - H_GAP * 2) / 3);
  const IMAGE_HEIGHT = Math.round(CELL * 1.45);

  function handleSearch(text) {
    setSearchText(text);
    const t = (text || "").toLowerCase();
    if (!t) return setFiltered(data);
    setFiltered(data.filter((it) => (it.name || "").toLowerCase().includes(t)));
  }

  return (
    <>
      <ScrollView contentContainerStyle={styles.container}>
        <LazyHeaderImage style={{ height: 180 }} />
        <SearchHeader value={searchText} onChangeText={handleSearch} onSearch={handleSearch} />
        <View style={{ width: "100%", flexDirection: "row", flexWrap: "wrap", justifyContent: "flex-start", paddingHorizontal: SIDE_PADDING }}>
          {filtered.slice(0, 9).map((item, i) => {
            const src = findImageForName(item.name) || require("./assets/splash-icon.png");
            const isLastInRow = (i + 1) % 3 === 0;
            return (
              <AnimatedItem key={item.key} delay={i * 30} style={{ width: CELL, marginBottom: 12, marginRight: isLastInRow ? 0 : H_GAP }}>
                <TouchableOpacity onPress={() => navigation.navigate("Details", { title: item.name, url: item.url })}>
                  <Image source={src} style={{ width: CELL, height: IMAGE_HEIGHT, borderRadius: 8 }} />
                </TouchableOpacity>
              </AnimatedItem>
            );
          })}

          {filtered[9] && (() => {
            const it = filtered[9];
            const src = findImageForName(it.name) || require("./assets/splash-icon.png");
            return (
              <AnimatedItem key={it.key} delay={9 * 30} style={{ width: CELL, marginBottom: 12, marginRight: H_GAP, alignSelf: "flex-start" }}>
                <TouchableOpacity onPress={() => navigation.navigate("Details", { title: it.name, url: it.url })}>
                  <Image source={src} style={{ width: CELL, height: IMAGE_HEIGHT, borderRadius: 8 }} />
                </TouchableOpacity>
              </AnimatedItem>
            );
          })()}
        </View>
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
