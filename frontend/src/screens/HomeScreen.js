// src/screens/HomeScreen.js
import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useRef, useState } from "react";
import { View, Text, ScrollView, Pressable, Animated, StyleSheet, ActivityIndicator } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { colors, fonts } from "../theme";
import { getAllDoctors, getAllFarms, getAllVisits, calcWeek } from "../api";

function StatCard({ icon, value, label, color, delay }) {
  const opacity = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(0.9)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(opacity, { toValue: 1, duration: 400, delay, useNativeDriver: true }),
      Animated.spring(scale, { toValue: 1, delay, useNativeDriver: true, bounciness: 6 }),
    ]).start();
  }, []);

  return (
    <Animated.View style={[st.statCard, { opacity, transform: [{ scale }] }]}>
      <View style={st.statHeader}>
        <View style={[st.statIconWrap, { backgroundColor: color + "15" }]}>
          <Text style={{ fontSize: 16 }}>{icon}</Text>
        </View>
      </View>
      <Text style={st.statVal}>{value}</Text>
      <Text style={st.statLabel}>{label}</Text>
    </Animated.View>
  );
}

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
        style={[st.homeCardShape, { backgroundColor: color }]}
      >
        <View style={st.homeCardIconWrap}>
          {icon}
        </View>
        <View style={{ flex: 1, marginLeft: 12 }}>
          <Text style={st.homeCardTitle}>{title}</Text>
          <Text style={st.homeCardSub}>{sub}</Text>
        </View>
        <View style={st.homeCardArrow}>
          <Ionicons name="arrow-forward" size={18} color="#fff" />
        </View>
      </Pressable>
    </Animated.View>
  );
}

export default function HomeScreen({ navigation }) {
  const insets       = useSafeAreaInsets();
  const headerOpacity = useRef(new Animated.Value(0)).current;
  const headerY       = useRef(new Animated.Value(-12)).current;

  const [stats, setStats] = useState({ doctors: 0, farms: 0, visits: 0, zones: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Animated.parallel([
      Animated.timing(headerOpacity, { toValue: 1, duration: 300, useNativeDriver: true }),
      Animated.spring(headerY,       { toValue: 0, useNativeDriver: true, bounciness: 6 }),
    ]).start();

    async function loadStats() {
      try {
        const [docs, farmsList, visitsList] = await Promise.all([
          getAllDoctors(),
          getAllFarms(),
          getAllVisits()
        ]);

        // Calculate active weekly visits
        const today = new Date();
        const weekNum = calcWeek(today.toISOString().split("T")[0]);
        const thisWeekVisits = (visitsList || []).filter(v => calcWeek(v.strDate || v.VisitDate) === weekNum).length;

        // Calculate unique covered zones among active doctors
        const uniqueZones = new Set((docs || []).map(d => d.strZone || d.ZoneName).filter(Boolean));

        setStats({
          doctors: (docs || []).length,
          farms: (farmsList || []).length,
          visits: thisWeekVisits,
          zones: uniqueZones.size
        });
      } catch (e) {
        console.warn("Failed to load home screen analytics:", e);
      } finally {
        setLoading(false);
      }
    }

    loadStats();
  }, []);

  return (
    <ScrollView
      style={st.screen}
      contentContainerStyle={{ paddingTop: insets.top + 18, paddingBottom: insets.bottom + 24 }}
      showsVerticalScrollIndicator={false}
    >
      <Animated.View style={[st.homeHeader, { opacity: headerOpacity, transform: [{ translateY: headerY }] }]}>
        <Text style={st.homeGreeting}>Field operations</Text>
        <Text style={st.homeTitle}>FEED Entry</Text>
      </Animated.View>

      {/* Performance & Coverage Stats */}
      <Text style={st.sectionTitle}>Performance & Coverage</Text>
      {loading ? (
        <View style={st.loadingWrap}>
          <ActivityIndicator size="small" color={colors.brand} />
        </View>
      ) : (
        <View style={st.statsGrid}>
          <StatCard
            icon={<Ionicons name="medkit" size={15} color={colors.moduleDoc} />}
            value={stats.doctors}
            label="Active Doctors"
            color={colors.moduleDoc}
            delay={50}
          />
          <StatCard
            icon={<Ionicons name="leaf" size={15} color={colors.moduleFarm} />}
            value={stats.farms}
            label="Total Farms"
            color={colors.moduleFarm}
            delay={100}
          />
          <StatCard
            icon={<Ionicons name="clipboard" size={15} color={colors.moduleVisit} />}
            value={stats.visits}
            label="Visits This Week"
            color={colors.moduleVisit}
            delay={150}
          />
          <StatCard
            icon="📍"
            value={stats.zones}
            label="Covered Zones"
            color="#5B2A86"
            delay={200}
          />
        </View>
      )}

      {/* Modules */}
      <Text style={st.sectionTitle}>Quick Access Modules</Text>
      <View style={st.homeGrid}>
        <ModuleCard
          icon={<Ionicons name="medkit-outline" size={24} color="#fff" />}
          title="Doctors"
          sub="Enroll and edit field doctor records"
          color={colors.moduleDoc}
          delay={250}
          onPress={() => navigation.navigate("Doctors")}
        />
        <ModuleCard
          icon={<Ionicons name="leaf-outline" size={24} color="#fff" />}
          title="Farms"
          sub="Track under-service farms by firm type"
          color={colors.moduleFarm}
          delay={300}
          onPress={() => navigation.navigate("Farms")}
        />
        <ModuleCard
          icon={<Ionicons name="clipboard-outline" size={24} color="#fff" />}
          title="Visit targets"
          sub="Log weekly visit entries"
          color={colors.moduleVisit}
          delay={355}
          onPress={() => navigation.navigate("Visit")}
        />
      </View>
    </ScrollView>
  );
}

const st = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.bg },
  homeHeader: { paddingHorizontal: 20, marginBottom: 16 },
  homeGreeting: { fontFamily: fonts.label, fontSize: 11, color: colors.textSec, textTransform: "uppercase", letterSpacing: 1.4, fontWeight: "700" },
  homeTitle: { fontFamily: fonts.display, fontSize: 32, fontWeight: "800", color: colors.textPrimary, marginTop: 4 },
  
  sectionTitle: { fontFamily: fonts.label, fontSize: 10.5, fontWeight: "700", color: colors.textSec, textTransform: "uppercase", letterSpacing: 1.2, paddingHorizontal: 20, marginTop: 14, marginBottom: 10 },
  
  loadingWrap: { height: 100, justifyContent: "center", alignItems: "center" },
  statsGrid: { flexDirection: "row", flexWrap: "wrap", paddingHorizontal: 16, gap: 10, marginBottom: 14 },
  statCard: { flex: 1, minWidth: "45%", backgroundColor: colors.surface, borderRadius: 16, padding: 14, borderWidth: 1, borderColor: colors.border, elevation: 1 },
  statHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 6 },
  statIconWrap: { width: 30, height: 30, borderRadius: 8, alignItems: "center", justifyContent: "center" },
  statVal: { fontFamily: fonts.display, fontSize: 20, fontWeight: "800", color: colors.textPrimary },
  statLabel: { fontFamily: fonts.body, fontSize: 10.5, color: colors.textSec, marginTop: 2 },

  homeGrid: { paddingHorizontal: 16, gap: 10 },
  homeCardShape: { borderRadius: 16, padding: 16, flexDirection: "row", alignItems: "center", marginBottom: 6, elevation: 2, shadowColor: "#1F1320", shadowOpacity: 0.05, shadowRadius: 8, shadowOffset: { width: 0, height: 2 } },
  homeCardIconWrap: { width: 44, height: 44, borderRadius: 12, backgroundColor: "rgba(255,255,255,0.2)", alignItems: "center", justifyContent: "center" },
  homeCardTitle: { fontFamily: fonts.label, fontSize: 16, fontWeight: "700", color: "#FFFFFF" },
  homeCardSub: { fontFamily: fonts.body, fontSize: 12, color: "rgba(255,255,255,0.85)", marginTop: 2 },
  homeCardArrow: { width: 28, height: 28, borderRadius: 14, backgroundColor: "rgba(255,255,255,0.15)", alignItems: "center", justifyContent: "center" }
});
