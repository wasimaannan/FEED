import React from "react";
import { StatusBar } from "expo-status-bar";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Text } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import DashboardScreen from "./src/screens/DashboardScreen";
import DoctorsScreen   from "./src/screens/DoctorsScreen";
import LogVisitScreen  from "./src/screens/LogVisitScreen";
import ActivityScreen  from "./src/screens/ActivityScreen";
import ProfileScreen   from "./src/screens/ProfileScreen";

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <StatusBar style="dark" />
        <Tab.Navigator>
          <Tab.Screen
            name="Dashboard"
            component={DashboardScreen}
            options={{ tabBarLabel: "Home", tabBarIcon: () => <Text style={{ fontSize: 20 }}>🏠</Text> }}
          />
          <Tab.Screen
            name="Doctors"
            component={DoctorsScreen}
            options={{ tabBarLabel: "Doctors", tabBarIcon: () => <Text style={{ fontSize: 20 }}>🩺</Text> }}
          />
          <Tab.Screen
            name="LogVisit"
            component={LogVisitScreen}
            options={{ tabBarLabel: "Log", tabBarIcon: () => <Text style={{ fontSize: 20 }}>📋</Text> }}
          />
          <Tab.Screen
            name="Activity"
            component={ActivityScreen}
            options={{ tabBarLabel: "Activity", tabBarIcon: () => <Text style={{ fontSize: 20 }}>📊</Text> }}
          />
          <Tab.Screen
            name="Profile"
            component={ProfileScreen}
            options={{ tabBarLabel: "Profile", tabBarIcon: () => <Text style={{ fontSize: 20 }}>👤</Text> }}
          />
        </Tab.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}