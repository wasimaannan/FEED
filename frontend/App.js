// App.js
// Fixed tab bar — uses SafeAreaView-aware padding so bars never go off screen.
// Animated tab icons with spring scale on press.

import React, { useRef } from "react";
import { StatusBar } from "expo-status-bar";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Text, View, TouchableOpacity, Animated, Platform } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { SafeAreaProvider } from "react-native-safe-area-context";
import DoctorsScreen from "./src/screens/DoctorsScreen";
import FarmsScreen   from "./src/screens/FarmsScreen";
import VisitScreen   from "./src/screens/VisitScreen";
import { colors }    from "./src/theme";

const Tab = createBottomTabNavigator();

// Animated tab button — springs on press
function AnimatedTabButton({ children, onPress, onLongPress, accessibilityState }) {
  const focused = accessibilityState?.selected;
  const scale = useRef(new Animated.Value(1)).current;

  const onIn  = () => Animated.spring(scale, { toValue: 0.88, useNativeDriver: true, friction: 8, tension: 300 }).start();
  const onOut = () => Animated.spring(scale, { toValue: 1, useNativeDriver: true, friction: 4, tension: 180 }).start();

  return (
    <TouchableOpacity
      onPress={onPress}
      onLongPress={onLongPress}
      onPressIn={onIn}
      onPressOut={onOut}
      activeOpacity={1}
      style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
    >
      <Animated.View style={{ transform: [{ scale }], alignItems: "center", justifyContent: "center" }}>
        {children}
      </Animated.View>
    </TouchableOpacity>
  );
}

function TabIcon({ emoji, label, focused, accentColor }) {
  const glowAnim = useRef(new Animated.Value(focused ? 1 : 0)).current;

  React.useEffect(() => {
    Animated.timing(glowAnim, {
      toValue: focused ? 1 : 0,
      duration: 200,
      useNativeDriver: false,
    }).start();
  }, [focused]);

  const bg = glowAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["rgba(255,255,255,0)", accentColor + "22"],
  });

  return (
    <Animated.View style={{
      alignItems: "center", justifyContent: "center",
      paddingHorizontal: 20, paddingVertical: 6,
      borderRadius: 14,
      backgroundColor: bg,
    }}>
      <Text style={{ fontSize: 20, opacity: focused ? 1 : 0.4 }}>{emoji}</Text>
      <Text style={{
        fontSize: 10.5,
        fontWeight: "700",
        marginTop: 3,
        color: focused ? accentColor : colors.textTertiary,
        letterSpacing: 0.2,
      }}>
        {label}
      </Text>
    </Animated.View>
  );
}

// Inner navigator — reads safe area insets to compute correct tab height
function AppNavigator() {
  const insets = useSafeAreaInsets();
  // Tab bar height = icon area (58px) + bottom safe area (e.g. iPhone home bar)
  const tabBarHeight = 58 + insets.bottom;

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: {
          height: tabBarHeight,
          backgroundColor: colors.surface,
          borderTopWidth: 1,
          borderTopColor: colors.border,
          // Remove any shadow that might bleed off screen
          elevation: 0,
          shadowOpacity: 0,
          paddingTop: 0,
          paddingBottom: 0,
        },
        // Let each tab button manage its own press animation
        tabBarButton: (props) => <AnimatedTabButton {...props} />,
      }}
    >
      <Tab.Screen
        name="Doctors"
        component={DoctorsScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon emoji="🩺" label="Doctors" focused={focused} accentColor={colors.lime} />
          ),
        }}
      />
      <Tab.Screen
        name="Farms"
        component={FarmsScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon emoji="🌿" label="Farms" focused={focused} accentColor={colors.wheat} />
          ),
        }}
      />
      <Tab.Screen
        name="Visit"
        component={VisitScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon emoji="📋" label="Visits" focused={focused} accentColor="#7EB8FF" />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <StatusBar style="light" backgroundColor={colors.bg} />
        <AppNavigator />
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
