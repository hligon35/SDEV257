import React, { useEffect, useState, useRef } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Animated } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

// Expo-Network status banner component
export default function NetworkStatus({ checkInterval = 5000, timeout = 3000 }) {
  const [online, setOnline] = useState(true);
  const mounted = useRef(true);
  const anim = useRef(new Animated.Value(0)).current;
  const insets = useSafeAreaInsets();
  const bannerHeight = 64; // Clear the battery banner height

  useEffect(() => {
    mounted.current = true;

    async function checkWithExpoNetwork() {
      try {
        const Network = await import("expo-network");
        if (Network && Network.getNetworkStateAsync) {
          const state = await Network.getNetworkStateAsync();
          const ok = !!state.isConnected && (state.isInternetReachable !== false);
          return ok;
        }
      } catch (e) {
        // module not present or failed — fall back
      }
      return null;
    }

    async function checkWithFetch() {
      try {
        const controller = new AbortController();
        const id = setTimeout(() => controller.abort(), timeout);
        const resp = await fetch("https://clients3.google.com/generate_204", { signal: controller.signal });
        clearTimeout(id);
        return !!(resp && (resp.status === 204 || resp.ok));
      } catch (e) {
        return false;
      }
    }

    async function checkOnce() {
      try {
        const expoResult = await checkWithExpoNetwork();
        if (expoResult === true || expoResult === false) {
          if (mounted.current) setOnline(expoResult);
          return;
        }
        // expo-network not available — fallback
        const ok = await checkWithFetch();
        if (mounted.current) setOnline(!!ok);
      } catch (e) {
        if (mounted.current) setOnline(false);
      }
    }

    checkOnce();

    const iv = setInterval(() => {
      checkOnce();
    }, checkInterval);

    return () => {
      mounted.current = false;
      clearInterval(iv);
    };
  }, [checkInterval, timeout]);

  useEffect(() => {
    Animated.timing(anim, { toValue: online ? 0 : 1, duration: 250, useNativeDriver: true }).start();
  }, [online, anim]);

  async function manualRetry() {
    try {
      const Network = await import("expo-network");
      if (Network && Network.getNetworkStateAsync) {
        const state = await Network.getNetworkStateAsync();
        const ok = !!state.isConnected && (state.isInternetReachable !== false);
        setOnline(!!ok);
        return;
      }
    } catch (e) {
      // ignore and fallback
    }

    try {
      const controller = new AbortController();
      const id = setTimeout(() => controller.abort(), timeout);
      const resp = await fetch("https://clients3.google.com/generate_204", { signal: controller.signal });
      clearTimeout(id);
      const ok = !!(resp && (resp.status === 204 || resp.ok));
      setOnline(!!ok);
    } catch (e) {
      setOnline(false);
    }
  }

  if (online) return null;

  return (
    <Animated.View
      style={[
        styles.banner,
        { top: insets.top, height: bannerHeight },
        { transform: [{ translateY: anim.interpolate({ inputRange: [0, 1], outputRange: [-bannerHeight, 0] }) }] },
      ]}
    >
      <Text style={styles.text}>
        {"No internet connection. Some features may be\nunavailable. Check your connection and try again."}
      </Text>
      <TouchableOpacity style={styles.button} onPress={manualRetry}>
        <Text style={styles.buttonText}>Retry</Text>
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  banner: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: "#b00020",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    zIndex: 9999,
  },
  text: { color: "#fff", flex: 1, marginRight: 8 },
  button: { paddingHorizontal: 12, paddingVertical: 6, backgroundColor: "#fff", borderRadius: 4 },
  buttonText: { color: "#b00020", fontWeight: "600" },
});
