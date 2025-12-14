import React, { useEffect, useState } from "react";
import { View, ScrollView, Text, TouchableOpacity, ActivityIndicator, Modal, Button, Image, Dimensions } from "react-native";
import SearchHeader from "./SearchHeader";
import styles from "./styles";
import AnimatedItem from "./AnimatedItem";
import LazyHeaderImage from "./LazyHeaderImage";

export default function Planets({ navigation }) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalText, setModalText] = useState("");
  const [searchText, setSearchText] = useState("");
  const [filtered, setFiltered] = useState([]);

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
        setFiltered(list);
      })
      .catch(() => setData([]))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <ActivityIndicator style={{ marginTop: 40 }} />;

  // Static mapping of planet images
  const planetImages = {
    tatooine: require("./assets/planets/tatooine.png"),
    alderaan: require("./assets/planets/alderaan.png"),
    yaviniv: require("./assets/planets/yavinIV.png"),
    hoth: require("./assets/planets/hoth.png"),
    dagobah: require("./assets/planets/dagobah.png"),
    bespin: require("./assets/planets/bespin.png"),
    endor: require("./assets/planets/endor.png"),
    naboo: require("./assets/planets/naboo.png"),
    coruscant: require("./assets/planets/coruscant.png"),
    kamino: require("./assets/planets/kamino.png"),
  };

  // Locate images for planet names
  function findImageForName(name) {
    if (!name) return null;
    const norm = name.toLowerCase().replace(/\s+/g, "_").replace(/[^a-z0-9_]/g, "");
    if (planetImages[norm]) return planetImages[norm];
    const noUnderscore = norm.replace(/_/g, "");
    if (planetImages[noUnderscore]) return planetImages[noUnderscore];
    return null;
  }
// Layout grid
  const SCREEN_WIDTH = Dimensions.get("window").width;
  const H_GAP = 10;
  const SIDE_PADDING = 10;
  const CELL = Math.floor((SCREEN_WIDTH - SIDE_PADDING * 2 - H_GAP * 2) / 3);

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

        <View style={{ width: "100%", flexDirection: "row", flexWrap: "wrap", justifyContent: "flex-start", paddingHorizontal: SIDE_PADDING }}>
          {filtered.slice(0, 9).map((item, i) => {
            //Fallback to defaultimage if not found
            const src = findImageForName(item.name) || require("./assets/splash-icon.png");
            const isLastInRow = (i + 1) % 3 === 0;
            return (
              <AnimatedItem
                key={item.key}
                delay={i * 30}
                style={{ width: CELL, marginBottom: 12, marginRight: isLastInRow ? 0 : H_GAP }}
              >
                <TouchableOpacity onPress={() => navigation.navigate("Details", { title: item.name, url: item.url })}>
                  <Image source={src} style={{ width: CELL, height: CELL, borderRadius: 8 }} />
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
                    <Image source={src} style={{ width: CELL, height: CELL, borderRadius: 8 }} />
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
