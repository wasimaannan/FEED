// App.js
import React from "react";
import { StatusBar } from "expo-status-bar";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Text } from "react-native";
import DoctorsScreen from "./src/screens/DoctorsScreen";
import FarmsScreen   from "./src/screens/FarmsScreen";
import VisitScreen   from "./src/screens/VisitScreen";
import { colors }    from "./src/theme";

const Tab = createBottomTabNavigator();

function Icon({ emoji, focused }) {
  return <Text style={{ fontSize: focused ? 22 : 18, opacity: focused ? 1 : 0.5 }}>{emoji}</Text>;
}

export default function App() {
  return (
    <NavigationContainer>
      <StatusBar style="dark" />
      <Tab.Navigator
        screenOptions={{
          headerStyle: { backgroundColor: colors.surface, elevation: 0, shadowOpacity: 0, borderBottomWidth: 0.5, borderBottomColor: colors.border },
          headerTitleStyle: { fontSize: 15, fontWeight: "700", color: colors.text },
          headerTitleAlign: "left",
          tabBarActiveTintColor:   colors.primary,
          tabBarInactiveTintColor: colors.text4,
          tabBarStyle: { borderTopWidth: 0.5, borderTopColor: colors.border, backgroundColor: colors.surface, height: 62, paddingBottom: 8 },
          tabBarLabelStyle: { fontSize: 11, fontWeight: "600" },
        }}
      >
        <Tab.Screen name="Doctors"      component={DoctorsScreen} options={{ title: "FEED — Doctors",       tabBarLabel: "Doctors", tabBarIcon: ({ focused }) => <Icon emoji="👨‍⚕️" focused={focused} /> }} />
        <Tab.Screen name="Farms"        component={FarmsScreen}   options={{ title: "FEED — Farms",         tabBarLabel: "Farms",   tabBarIcon: ({ focused }) => <Icon emoji="🌿"   focused={focused} /> }} />
        <Tab.Screen name="Visit"        component={VisitScreen}   options={{ title: "FEED — Visit Targets", tabBarLabel: "Visit",   tabBarIcon: ({ focused }) => <Icon emoji="📋"   focused={focused} /> }} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
