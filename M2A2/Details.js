import React, { useEffect, useState } from "react";
import { View, Text, StatusBar, ActivityIndicator, ScrollView } from "react-native";
import styles from "./styles";

export default function Details({ route }) {
  const { title, url } = route.params || {};
  const [details, setDetails] = useState(null);
  const [loading, setLoading] = useState(!!url);

  useEffect(() => {
    if (!url) return;
    fetch(url)
      .then((r) => r.json())
      .then((json) => {
        // swapi.tech returns result.properties for a resource
        setDetails(json.result ? json.result.properties : json.properties || json);
      })
      .catch(() => setDetails(null))
      .finally(() => setLoading(false));
  }, [url]);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <Text style={{ fontWeight: "bold", fontSize: 18, marginBottom: 8 }}>{title}</Text>
      {loading ? (
        <ActivityIndicator />
      ) : (
        <ScrollView>
          <Text>{details ? JSON.stringify(details, null, 2) : "No additional details."}</Text>
        </ScrollView>
      )}
    </View>
  );
}