import React, { useEffect, useState } from "react";
import { View, FlatList, Text, TouchableOpacity, ActivityIndicator } from "react-native";
import styles from "./styles";

export default function Planets({ navigation }) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

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
