import React, { useEffect, useState } from "react";
import { View, Text, StatusBar, ActivityIndicator, ScrollView, StyleSheet, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import styles from "./styles";

function renderValue(val) {
  if (val == null) return "—";
  if (Array.isArray(val)) return val.join(", ");
  if (typeof val === "object") return JSON.stringify(val, null, 2);

  const s = String(val);
  // If date/time string parseable, change format.
  const d = new Date(s);
  if (!Number.isNaN(d.getTime())) {
    const hasTime = /T|:\d{2}/.test(s);
    const datePart = d.toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" });
    if (hasTime) {
      const timePart = d.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", second: "2-digit" });
      return `${datePart} ${timePart}`;
    }
    return datePart;
  }

  return s;
}

function titleCase(s) {
  return (s || "")
    .toString()
    .replace(/\b\w+/g, (w) => w[0].toUpperCase() + w.slice(1).toLowerCase());
}

export default function Details({ route }) {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const { title, url } = route.params || {};
  const [details, setDetails] = useState(null);
  const [loading, setLoading] = useState(!!url);

  useEffect(() => {
    if (title) navigation.setOptions({ title: titleCase(title) });
  }, [navigation, title]);

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
    <View style={[styles.container, { paddingTop: 0 }]}>
      <StatusBar barStyle="dark-content" />
      <ScrollView contentContainerStyle={localStyles.content}>
        <Text style={localStyles.title}>{title ? titleCase(title) : ""}</Text>

        {loading ? (
          <ActivityIndicator size="large" />
        ) : details ? (
          // Break details into sections
          Object.keys(details).map((key) => (
            <View key={key} style={localStyles.section}>
              <Text style={localStyles.label}>{key}</Text>
              {Array.isArray(details[key]) ? (
                details[key].length === 0 ? (
                  <Text style={localStyles.value}>—</Text>
                ) : (
                  <View>
                    {details[key].map((entry, idx) => {
                      const isUrl = typeof entry === "string" && /^https?:\/\//i.test(entry);
                      if (isUrl) {
                        return (
                          <TouchableOpacity
                            key={entry}
                            onPress={() => navigation.push("Details", { title: key, url: entry })}
                          >
                            <Text style={localStyles.link}>{entry}</Text>
                          </TouchableOpacity>
                        );
                      }
                      return (
                        <Text key={String(idx)} style={localStyles.value}>
                          {String(entry)}
                        </Text>
                      );
                    })}
                  </View>
                )
              ) : (
                <Text style={localStyles.value}>{renderValue(details[key])}</Text>
              )}
            </View>
          ))
        ) : (
          <Text style={localStyles.empty}>No additional details available.</Text>
        )}
      </ScrollView>
    </View>
  );
}

const localStyles = StyleSheet.create({
  content: { padding: 16, alignItems: "center" },
  title: { fontSize: 40, fontWeight: "700", marginBottom: 12, textAlign: "center" },
  section: { backgroundColor: "#fff", borderRadius: 8, padding: 12, elevation: 1, width: "100%", maxWidth: 700, marginBottom: 12, alignItems: "center" },
  row: { marginBottom: 10 },
  label: { fontWeight: "600", color: "#333", marginBottom: 6, textAlign: "center" },
  value: { color: "#444", fontFamily: "monospace", textAlign: "center" },
  link: { color: "#1e90ff", textDecorationLine: "underline", marginBottom: 6, textAlign: "center" },
  empty: { color: "#666" },
});