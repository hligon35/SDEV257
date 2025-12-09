import React, { useState } from "react";
import { View, Image, ActivityIndicator, StyleSheet } from "react-native";

export default function LazyHeaderImage({ source = require("./assets/starwars.jpg"), style }) {
  const [loading, setLoading] = useState(true);

  return (
    <View style={[styles.container, style]}>
      <Image
        source={source}
        style={styles.image}
        resizeMode="cover"
        onLoadStart={() => setLoading(true)}
        onLoadEnd={() => setLoading(false)}
      />
      {loading && <ActivityIndicator style={styles.loader} size="small" color="#ffffff" />}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: 140,
    backgroundColor: "#000",
    overflow: "hidden",
  },
  image: {
    width: "100%",
    height: "100%",
  },
  loader: {
    position: "absolute",
    top: "50%",
    left: "50%",
    marginLeft: -10,
    marginTop: -10,
  },
});
