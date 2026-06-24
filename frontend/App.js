// App.js
import React from "react";
import { StatusBar } from "expo-status-bar";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { DarkTheme } from "@react-navigation/native";

import HomeScreen    from "./src/screens/HomeScreen";
import DoctorsScreen from "./src/screens/DoctorsScreen";
import FarmsScreen   from "./src/screens/FarmsScreen";
import VisitScreen   from "./src/screens/VisitScreen";

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1, backgroundColor: "#120608" }}>
      <SafeAreaProvider style={{ flex: 1, backgroundColor: "#120608" }}>
        <NavigationContainer theme={{ ...DarkTheme, colors: { ...DarkTheme.colors, background: "#120608", card: "#120608" } }}>
          <StatusBar style="light" />
          <Stack.Navigator
            initialRouteName="Home"
            screenOptions={{
              headerShown: false,
              animation: "slide_from_right",
              animationDuration: 280,
              contentStyle: { backgroundColor: "#120608" },
            }}
          >
            <Stack.Screen name="Home"    component={HomeScreen} />
            <Stack.Screen name="Doctors" component={DoctorsScreen} />
            <Stack.Screen name="Farms"   component={FarmsScreen} />
            <Stack.Screen name="Visit"   component={VisitScreen} />
          </Stack.Navigator>
        </NavigationContainer>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
