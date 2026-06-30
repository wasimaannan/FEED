// src/screens/AnalyticsScreen.js
import React, { useEffect, useState, useCallback } from "react";
import { View, Text, ScrollView, RefreshControl, StyleSheet } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { getAllDoctors, getAllVisits, getAllFarms, calcWeek } from "../api";
import { colors, fonts } from "../theme";
import { HeaderBand } from "../components";
import { Ionicons } from "@expo/vector-icons";

export default function AnalyticsScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const [doctors,  setDoctors]  = useState([]);
  const [visits,   setVisits]   = useState([]);
  const [farms,    setFarms]    = useState([]);
  const [refresh,  setRefresh]  = useState(false);

  const today   = new Date();
  const weekNum = calcWeek(today.toISOString().split("T")[0]);

  const load = useCallback(async () => {
    try {
      const [d, v, f] = await Promise.all([getAllDoctors(), getAllVisits(), getAllFarms()]);
      setDoctors(d || []); setVisits(v || []); setFarms(f || []);
    } catch (e) {} finally { setRefresh(false); }
  }, []);

  useEffect(() => { load(); }, []);

  const thisWeekVisits = visits.filter(v => calcWeek(v.strDate) === weekNum);
  const lastWeekVisits = visits.filter(v => calcWeek(v.strDate) === weekNum - 1);

  // Zone breakdown
  const zoneStats = doctors.reduce((acc, d) => {
    if (!acc[d.strZone]) acc[d.strZone] = { doctors: 0, visits: 0 };
    acc[d.strZone].doctors++;
    return acc;
  }, {});
  visits.forEach(v => {
    const doc = doctors.find(d => d.intEnroll === v.intEnroll);
    if (doc?.strZone && zoneStats[doc.strZone]) zoneStats[doc.strZone].visits++;
  });

  // Firm type breakdown
  const firmStats = farms.reduce((acc, f) => {
    acc[f.strFirmType] = (acc[f.strFirmType] || 0) + 1;
    return acc;
  }, {});

  const summaryCards = [
    { label: "Total farms",     value: farms.length,            sub: `+${Math.max(0, farms.length - 10)} new`,  icon: <Ionicons name="leaf-outline" size={20} color="#8B3FA8" /> },
    { label: "This week visits",value: thisWeekVisits.length,   sub: `vs ${lastWeekVisits.length} last week`,   icon: <Ionicons name="clipboard-outline" size={20} color="#C2386E" /> },
    { label: "Active doctors",  value: doctors.length,          sub: "All zones",                               icon: <Ionicons name="medkit-outline" size={20} color="#FF6B6B" /> },
    { label: "Zones covered",   value: Object.keys(zoneStats).length, sub: "Active",                           icon: "📍" },
  ];

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: colors.bg }}
      contentContainerStyle={{ paddingBottom: insets.bottom + 80 }}
      showsVerticalScrollIndicator={false}
      refreshControl={<RefreshControl refreshing={refresh} onRefresh={() => { setRefresh(true); load(); }} tintColor={colors.gold} colors={[colors.gold]} />}
    >
      <HeaderBand navigation={navigation} color={colors.brand} icon={<Ionicons name="stats-chart-outline" size={22} color="#fff" />} title="Analytics" sub="Performance overview" />

      {/* Summary cards */}
      <View style={styles.cardGrid}>
        {summaryCards.map((c, i) => (
          <View key={i} style={styles.summaryCard}>
            <Text style={{ fontSize: 22, marginBottom: 8 }}>{c.icon}</Text>
            <Text style={styles.summaryValue}>{c.value}</Text>
            <Text style={styles.summaryLabel}>{c.label}</Text>
            <Text style={styles.summarySub}>{c.sub}</Text>
          </View>
        ))}
      </View>

      {/* Zone breakdown */}
      <Text style={styles.sectionTitle}>Zone breakdown</Text>
      <View style={styles.tableCard}>
        <View style={[styles.tableRow, styles.tableHeader]}>
          <Text style={[styles.tableCell, styles.tableHeadText, { flex: 2 }]}>Zone</Text>
          <Text style={[styles.tableCell, styles.tableHeadText]}>Doctors</Text>
          <Text style={[styles.tableCell, styles.tableHeadText]}>Visits</Text>
        </View>
        {Object.entries(zoneStats).length === 0 ? (
          <Text style={styles.emptyText}>No data yet</Text>
        ) : (
          Object.entries(zoneStats).map(([zone, stat], i) => (
            <View key={zone} style={[styles.tableRow, i % 2 === 1 && { backgroundColor: colors.surfaceUp }]}>
              <Text style={[styles.tableCell, styles.tableCellPrimary, { flex: 2 }]}>{zone}</Text>
              <Text style={[styles.tableCell, styles.tableCellSec]}>{stat.doctors}</Text>
              <Text style={[styles.tableCell, styles.tableCellSec]}>{stat.visits}</Text>
            </View>
          ))
        )}
      </View>

      {/* Firm type breakdown */}
      <Text style={styles.sectionTitle}>Farm types</Text>
      <View style={styles.tableCard}>
        {Object.entries(firmStats).length === 0 ? (
          <Text style={styles.emptyText}>No farm data yet</Text>
        ) : (
          Object.entries(firmStats).map(([type, count], i) => {
            const pct = Math.round((count / farms.length) * 100);
            return (
              <View key={type} style={[styles.firmRow, i < Object.entries(firmStats).length - 1 && { borderBottomWidth: 1, borderBottomColor: colors.border }]}>
                <Text style={styles.firmLabel}>{type}</Text>
                <View style={{ flex: 1, marginHorizontal: 12 }}>
                  <View style={styles.progressBg}>
                    <View style={[styles.progressFill, { width: `${pct}%` }]} />
                  </View>
                </View>
                <Text style={styles.firmCount}>{count}</Text>
              </View>
            );
          })
        )}
      </View>

      {/* Weekly trend */}
      <Text style={styles.sectionTitle}>Weekly visits (last 5 weeks)</Text>
      <View style={styles.tableCard}>
        {Array.from({ length: 5 }, (_, i) => weekNum - 4 + i).map(w => {
          const wv = visits.filter(v => calcWeek(v.strDate) === w);
          const max = Math.max(...Array.from({ length: 5 }, (_, i) => visits.filter(v => calcWeek(v.strDate) === weekNum - 4 + i).length), 1);
          const pct = Math.round((wv.length / max) * 100);
          return (
            <View key={w} style={[styles.firmRow, w < weekNum && { borderBottomWidth: 1, borderBottomColor: colors.border }]}>
              <Text style={[styles.firmLabel, w === weekNum && { color: colors.goldText }]}>Week {w}{w === weekNum ? " ●" : ""}</Text>
              <View style={{ flex: 1, marginHorizontal: 12 }}>
                <View style={styles.progressBg}>
                  <View style={[styles.progressFill, { width: `${pct}%`, backgroundColor: w === weekNum ? colors.gold : colors.brand }]} />
                </View>
              </View>
              <Text style={styles.firmCount}>{wv.length}</Text>
            </View>
          );
        })}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  cardGrid:       { flexDirection: "row", flexWrap: "wrap", paddingHorizontal: 12, paddingTop: 16, gap: 10 },
  summaryCard:    { width: "47%", backgroundColor: colors.surface, borderRadius: 16, padding: 16, borderWidth: 1, borderColor: colors.border },
  summaryValue:   { fontSize: 24, fontWeight: "800", color: colors.textPrimary, fontFamily: fonts.display },
  summaryLabel:   { fontSize: 11, color: colors.textSec, fontFamily: fonts.label, textTransform: "uppercase", letterSpacing: 0.8, marginTop: 4 },
  summarySub:     { fontSize: 11, color: colors.textTertiary, fontFamily: fonts.body, marginTop: 3 },
  sectionTitle:   { fontSize: 13, fontWeight: "700", color: colors.textSec, fontFamily: fonts.label, textTransform: "uppercase", letterSpacing: 1.2, paddingHorizontal: 20, marginTop: 22, marginBottom: 10 },
  tableCard:      { marginHorizontal: 16, backgroundColor: colors.surface, borderRadius: 16, borderWidth: 1, borderColor: colors.border, overflow: "hidden" },
  tableRow:       { flexDirection: "row", paddingVertical: 12, paddingHorizontal: 14 },
  tableHeader:    { backgroundColor: colors.surfaceHigh, borderBottomWidth: 1, borderBottomColor: colors.border },
  tableCell:      { flex: 1, fontFamily: fonts.body, fontSize: 13 },
  tableHeadText:  { color: colors.goldText, fontFamily: fonts.label, fontSize: 11, textTransform: "uppercase", letterSpacing: 0.8 },
  tableCellPrimary:{ color: colors.textPrimary },
  tableCellSec:   { color: colors.textSec },
  emptyText:      { padding: 20, color: colors.textTertiary, fontFamily: fonts.body, fontSize: 13, textAlign: "center" },
  firmRow:        { flexDirection: "row", alignItems: "center", paddingHorizontal: 14, paddingVertical: 14 },
  firmLabel:      { width: 80, fontSize: 13, color: colors.textPrimary, fontFamily: fonts.body },
  firmCount:      { width: 30, fontSize: 13, color: colors.textSec, fontFamily: fonts.mono, textAlign: "right" },
  progressBg:     { height: 6, backgroundColor: colors.surfaceHigh, borderRadius: 3 },
  progressFill:   { height: 6, backgroundColor: colors.gold, borderRadius: 3 },
});
