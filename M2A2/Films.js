import React, { useEffect, useState } from "react";
import { View, FlatList, Text, TouchableOpacity, ActivityIndicator } from "react-native";
import styles from "./styles";

export default function Films({ navigation }) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

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
    <View style={styles.container}>
      <FlatList
        data={data}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => navigation.navigate("Details", { title: item.name, url: item.url })}
          >
            <Text style={styles.item}>{item.name}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}
