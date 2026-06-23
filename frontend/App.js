// App.js
import React from "react";
import { StatusBar } from "expo-status-bar";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Text, View } from "react-native";
import DoctorsScreen from "./src/screens/DoctorsScreen";
import FarmsScreen   from "./src/screens/FarmsScreen";
import VisitScreen   from "./src/screens/VisitScreen";
import { colors }    from "./src/theme";

const Tab = createBottomTabNavigator();

function TabIcon({ emoji, focused, activeColor }) {
  return (
    <View style={{
      width: 38, height: 38, borderRadius: 12,
      alignItems: "center", justifyContent: "center",
      backgroundColor: focused ? activeColor + "22" : "transparent",
    }}>
      <Text style={{ fontSize: 19, opacity: focused ? 1 : 0.45 }}>{emoji}</Text>
    </View>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <StatusBar style="light" />
      <Tab.Navigator
        screenOptions={{
          headerShown: false,
          tabBarShowLabel: true,
          tabBarActiveTintColor:   colors.forest,
          tabBarInactiveTintColor: colors.soilFaint,
          tabBarStyle: {
            borderTopWidth: 0,
            backgroundColor: colors.card,
            height: 78,
            paddingTop: 10,
            paddingBottom: 18,
            shadowColor: colors.soil,
            shadowOpacity: 0.08,
            shadowRadius: 16,
            shadowOffset: { width: 0, height: -4 },
            elevation: 12,
          },
          tabBarLabelStyle: { fontSize: 11, fontWeight: "700", marginTop: 2 },
        }}
      >
        <Tab.Screen
          name="Doctors"
          component={DoctorsScreen}
          options={{
            tabBarLabel: "Doctors",
            tabBarIcon: ({ focused }) => <TabIcon emoji="🩺" focused={focused} activeColor={colors.forest} />,
          }}
        />
        <Tab.Screen
          name="Farms"
          component={FarmsScreen}
          options={{
            tabBarLabel: "Farms",
            tabBarIcon: ({ focused }) => <TabIcon emoji="🌿" focused={focused} activeColor={colors.wheat} />,
          }}
        />
        <Tab.Screen
          name="Visit"
          component={VisitScreen}
          options={{
            tabBarLabel: "Visits",
            tabBarIcon: ({ focused }) => <TabIcon emoji="📋" focused={focused} activeColor={colors.soil} />,
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
