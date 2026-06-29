// App.js
import React from "react";
import { StatusBar } from "expo-status-bar";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Text } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { GestureHandlerRootView } from "react-native-gesture-handler";

import LoginScreen     from "./src/screens/LoginScreen";
import DashboardScreen from "./src/screens/DashboardScreen";
import DoctorsScreen   from "./src/screens/DoctorsScreen";
import LogVisitScreen  from "./src/screens/LogVisitScreen";
import ActivityScreen  from "./src/screens/ActivityScreen";
import ProfileScreen   from "./src/screens/ProfileScreen";

const Tab   = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function AppTabs() {
  return (
    <Tab.Navigator>
      <Tab.Screen
        name="Dashboard"
        component={DashboardScreen}
        options={{ tabBarLabel:"Home",     tabBarIcon:() => <Text style={{fontSize:20}}>🏠</Text> }}
      />
      <Tab.Screen
        name="Doctors"
        component={DoctorsScreen}
        options={{ tabBarLabel:"Doctors",  tabBarIcon:() => <Text style={{fontSize:20}}>🩺</Text> }}
      />
      <Tab.Screen
        name="LogVisit"
        component={LogVisitScreen}
        options={{ tabBarLabel:"Log",      tabBarIcon:() => <Text style={{fontSize:20}}>📋</Text> }}
      />
      <Tab.Screen
        name="Activity"
        component={ActivityScreen}
        options={{ tabBarLabel:"Activity", tabBarIcon:() => <Text style={{fontSize:20}}>📊</Text> }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{ tabBarLabel:"Profile",  tabBarIcon:() => <Text style={{fontSize:20}}>👤</Text> }}
      />
    </Tab.Navigator>
  );
}

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex:1 }}>
      <SafeAreaProvider>
        <NavigationContainer>
          <StatusBar style="dark" />
          <Stack.Navigator screenOptions={{ headerShown:false, animation:"fade", animationDuration:250, contentStyle:{ backgroundColor:"#F4F6F4" } }}>
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="App"   component={AppTabs} />
          </Stack.Navigator>
        </NavigationContainer>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}