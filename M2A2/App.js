import React from "react";
import { Platform, Image, TouchableOpacity, Text } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import Planets from "./Planets";
import Spaceships from "./Spaceships";
import Films from "./Films";
import Details from "./Details";
import NetworkStatus from "./NetworkStatus";

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function MainTabs() {
  const ICON_SIZE = Platform.OS === "ios" ? 40 : 36;

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: "#ff0000ff",
        tabBarStyle: {
          paddingTop: Platform.OS === "ios" ? 8 : 6,
          paddingBottom: Platform.OS === "ios" ? 20 : 8,
          height: Platform.OS === "ios" ? 88 : 72,
        },
        tabBarLabelStyle: { fontSize: 14, paddingTop: Platform.OS === "ios" ? 6 : 4, paddingBottom: Platform.OS === "ios" ? 6 : 2 },
      }}
    >
      <Tab.Screen
        name="Planets"
        component={Planets}
        options={{
          tabBarIcon: ({ color }) => (
            <Image source={require("./assets/planets-icon.png")} style={{ width: ICON_SIZE, height: ICON_SIZE, resizeMode: "contain", marginTop: 4 }} />
          ),
        }}
      />
      <Tab.Screen
        name="Spaceships"
        component={Spaceships}
        options={{
          tabBarIcon: ({ color }) => (
            <Image source={require("./assets/spaceships-icon.png")} style={{ width: ICON_SIZE, height: ICON_SIZE, resizeMode: "contain", marginTop: 4 }} />
          ),
        }}
      />
      <Tab.Screen
        name="Films"
        component={Films}
        options={{
          tabBarIcon: ({ color }) => (
            <Image source={require("./assets/films-icon.png")} style={{ width: ICON_SIZE, height: ICON_SIZE, resizeMode: "contain", marginTop: 4 }} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <NavigationContainer>
          <Stack.Navigator
            screenOptions={({ navigation }) => ({
              headerTitle: "M2A2",
              headerBackTitleVisible: false,
              headerBackTitle: "",
              headerLeft: () => (
                <TouchableOpacity onPress={() => navigation.goBack()} style={{ paddingHorizontal: 12 }}>
                  <Text style={{ fontSize: 28 }}>{Platform.OS === "ios" ? "‹" : "<"}</Text>
                </TouchableOpacity>
              ),
            })}
          >
            <Stack.Screen name="Main" component={MainTabs} options={{ headerShown: false }} />
            <Stack.Screen name="Details" component={Details} />
          </Stack.Navigator>
        </NavigationContainer>
        <NetworkStatus />
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}