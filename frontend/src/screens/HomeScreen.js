// src/screens/HomeScreen.js
import React, { useEffect, useRef } from "react";
import { View, Text, ScrollView, Pressable, Animated } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { S, colors, motion } from "../theme";

function ModuleCard({ icon, title, sub, color, onPress, delay }) {
  const opacity    = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(24)).current;
  const scale      = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(opacity,    { toValue: 1, duration: 400, delay, useNativeDriver: true }),
      Animated.spring(translateY, { toValue: 0, delay, useNativeDriver: true, bounciness: 6 }),
    ]).start();
  }, []);

  const handlePressIn  = () => Animated.spring(scale, { toValue: 0.96, useNativeDriver: true, speed: 40 }).start();
  const handlePressOut = () => Animated.spring(scale, { toValue: 1,    useNativeDriver: true, speed: 20 }).start();

  return (
    <Animated.View style={{ opacity, transform: [{ translateY }, { scale }] }}>
      <Pressable
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        style={[S.homeCardShape, { backgroundColor: color }]}
      >
        <View style={S.homeCardIconWrap}>
          <Text style={S.homeCardIcon}>{icon}</Text>
        </View>
        <View>
          <Text style={S.homeCardTitle}>{title}</Text>
          <Text style={S.homeCardSub}>{sub}</Text>
        </View>
        <View style={S.homeCardArrow}>
          <Text style={{ color: "#fff", fontSize: 16, fontWeight: "700" }}>→</Text>
        </View>
      </Pressable>
    </Animated.View>
  );
}

export default function HomeScreen({ navigation }) {
  const insets       = useSafeAreaInsets();
  const headerOpacity = useRef(new Animated.Value(0)).current;
  const headerY       = useRef(new Animated.Value(-12)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(headerOpacity, { toValue: 1, duration: 300, useNativeDriver: true }),
      Animated.spring(headerY,       { toValue: 0, useNativeDriver: true, bounciness: 6 }),
    ]).start();
  }, []);

  return (
    <ScrollView
      style={S.screen}
      contentContainerStyle={{ paddingTop: insets.top + 18, paddingBottom: insets.bottom + 24 }}
      showsVerticalScrollIndicator={false}
    >
      <Animated.View style={[S.homeHeader, { opacity: headerOpacity, transform: [{ translateY: headerY }] }]}>
        <Text style={S.homeGreeting}>Field operations</Text>
        <Text style={S.homeTitle}>FEED Entry</Text>
      </Animated.View>

      <View style={S.homeGrid}>
        <ModuleCard
          icon="🩺"
          title="Doctors"
          sub="Enroll and edit field doctor records"
          color={colors.moduleDoctor}
          delay={60}
          onPress={() => navigation.navigate("Doctors")}
        />
        <ModuleCard
          icon="🌿"
          title="Farms"
          sub="Track under-service farms by firm type"
          color={colors.moduleFarm}
          delay={140}
          onPress={() => navigation.navigate("Farms")}
        />
        <ModuleCard
          icon="📋"
          title="Visit targets"
          sub="Log weekly visit entries"
          color={colors.moduleVisit}
          delay={220}
          onPress={() => navigation.navigate("Visit")}
        />
      </View>
    </ScrollView>
  );
}
